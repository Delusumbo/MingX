import { useCallback, useEffect, useRef, useState } from "react";
import { FaceLandmarker, FilesetResolver, type FaceLandmarkerResult } from "@mediapipe/tasks-vision";

const WASM_URL = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.1.0/wasm";
const MODEL_URL =
	"https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

const TIME_LIMIT_MS = 30000;
const HOLD_FRAMES = 6;
const CENTER_HOLD_FRAMES = 12;
const MIN_FACE_WIDTH = 0.22;

type Challenge = "blink" | "turnLeft" | "turnRight" | "smile";
type Step = Challenge | "center";
type Phase = "idle" | "loading" | "running" | "passed" | "failed";

const STEP_LABELS: Record<Step, string> = {
	blink: "Blink your eyes",
	turnLeft: "Slowly turn your head left",
	turnRight: "Slowly turn your head right",
	smile: "Give us a smile",
	center: "Look straight at the camera",
};

function pickSteps(): Step[] {
	const pool: Challenge[] = ["blink", "turnLeft", "turnRight", "smile"];
	for (let i = pool.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[pool[i], pool[j]] = [pool[j], pool[i]];
	}
	return [...pool.slice(0, 3), "center"];
}

function blendshape(result: FaceLandmarkerResult, name: string): number {
	return result.faceBlendshapes[0]?.categories.find((c) => c.categoryName === name)?.score ?? 0;
}

type FaceReading = { faceWidth: number; yaw: number; eyesClosed: number; smile: number };

function readFace(result: FaceLandmarkerResult): FaceReading {
	const landmarks = result.faceLandmarks[0];
	const cheekA = landmarks[234];
	const cheekB = landmarks[454];
	const nose = landmarks[1];
	const faceWidth = Math.abs(cheekB.x - cheekA.x);
	// Positive yaw = nose toward image right in the raw (unmirrored) frame, which is the
	// subject's left and the left side of the mirrored preview.
	const yaw = (nose.x - (cheekA.x + cheekB.x) / 2) / (faceWidth || 1);
	const eyesClosed = Math.min(blendshape(result, "eyeBlinkLeft"), blendshape(result, "eyeBlinkRight"));
	const smile = (blendshape(result, "mouthSmileLeft") + blendshape(result, "mouthSmileRight")) / 2;
	return { faceWidth, yaw, eyesClosed, smile };
}

type LivenessCheckProps = {
	onVerified: (selfie: File) => void;
	onReset?: () => void;
};

export default function LivenessCheck({ onVerified, onReset }: LivenessCheckProps) {
	const videoRef = useRef<HTMLVideoElement>(null);
	const streamRef = useRef<MediaStream | null>(null);
	const landmarkerRef = useRef<FaceLandmarker | null>(null);
	const frameRef = useRef<number | null>(null);

	const [phase, setPhase] = useState<Phase>("idle");
	const [steps, setSteps] = useState<Step[]>([]);
	const [stepIndex, setStepIndex] = useState(0);
	const [hint, setHint] = useState("");
	const [error, setError] = useState("");
	const [preview, setPreview] = useState<string | null>(null);

	const stopCamera = useCallback(() => {
		if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
		frameRef.current = null;
		streamRef.current?.getTracks().forEach((track) => track.stop());
		streamRef.current = null;
		if (videoRef.current) videoRef.current.srcObject = null;
	}, []);

	useEffect(() => {
		return () => {
			stopCamera();
			landmarkerRef.current?.close();
			landmarkerRef.current = null;
		};
	}, [stopCamera]);

	useEffect(() => {
		return () => {
			if (preview) URL.revokeObjectURL(preview);
		};
	}, [preview]);

	const captureSelfie = useCallback(async (): Promise<File | null> => {
		const video = videoRef.current;
		if (!video) return null;
		const canvas = document.createElement("canvas");
		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;
		canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
		const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.92));
		return blob ? new File([blob], `selfie-${Date.now()}.jpg`, { type: "image/jpeg" }) : null;
	}, []);

	const getLandmarker = async () => {
		if (landmarkerRef.current) return landmarkerRef.current;
		const fileset = await FilesetResolver.forVisionTasks(WASM_URL);
		const options = (delegate: "GPU" | "CPU") => ({
			baseOptions: { modelAssetPath: MODEL_URL, delegate },
			runningMode: "VIDEO" as const,
			numFaces: 2,
			outputFaceBlendshapes: true,
		});
		try {
			landmarkerRef.current = await FaceLandmarker.createFromOptions(fileset, options("GPU"));
		} catch {
			landmarkerRef.current = await FaceLandmarker.createFromOptions(fileset, options("CPU"));
		}
		return landmarkerRef.current;
	};

	const runChecks = (landmarker: FaceLandmarker, plan: Step[]) => {
		const video = videoRef.current;
		if (!video) return;

		const startedAt = performance.now();
		let current = 0;
		let held = 0;
		let blinkClosed = false;
		let lastVideoTime = -1;

		const tick = async () => {
			if (performance.now() - startedAt > TIME_LIMIT_MS) {
				stopCamera();
				setPhase("failed");
				setHint("Time ran out. Make sure your face is well lit and try again.");
				return;
			}

			if (video.readyState < 2 || video.currentTime === lastVideoTime) {
				frameRef.current = requestAnimationFrame(() => void tick());
				return;
			}
			lastVideoTime = video.currentTime;

			const result = landmarker.detectForVideo(video, performance.now());
			const faces = result.faceLandmarks.length;
			const step = plan[current];
			let satisfied = false;

			if (faces === 0) {
				setHint("We can't see your face. Center it in the oval.");
				held = 0;
			} else if (faces > 1) {
				setHint("Only one person should be in the frame.");
				held = 0;
			} else {
				const face = readFace(result);
				if (face.faceWidth < MIN_FACE_WIDTH) {
					setHint("Move a little closer to the camera.");
					held = 0;
				} else {
					setHint("");
					switch (step) {
						case "blink":
							if (face.eyesClosed > 0.45) blinkClosed = true;
							else if (blinkClosed && face.eyesClosed < 0.2) satisfied = true;
							break;
						case "turnLeft":
							satisfied = face.yaw > 0.12;
							break;
						case "turnRight":
							satisfied = face.yaw < -0.12;
							break;
						case "smile":
							satisfied = face.smile > 0.55;
							break;
						case "center":
							satisfied = Math.abs(face.yaw) < 0.05 && face.eyesClosed < 0.3;
							break;
					}
				}
			}

			if (satisfied) held += 1;
			else if (step !== "blink") held = 0;

			const needed = step === "blink" ? 1 : step === "center" ? CENTER_HOLD_FRAMES : HOLD_FRAMES;
			if (held >= needed) {
				if (step === "center") {
					const selfie = await captureSelfie();
					stopCamera();
					if (!selfie) {
						setPhase("failed");
						setHint("Couldn't capture a photo. Please try again.");
						return;
					}
					setPreview(URL.createObjectURL(selfie));
					setPhase("passed");
					onVerified(selfie);
					return;
				}
				current += 1;
				held = 0;
				blinkClosed = false;
				setStepIndex(current);
			}

			frameRef.current = requestAnimationFrame(() => void tick());
		};

		frameRef.current = requestAnimationFrame(() => void tick());
	};

	const start = async () => {
		setError("");
		setHint("");
		setPreview(null);
		onReset?.();
		setPhase("loading");

		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
				audio: false,
			});
			streamRef.current = stream;
			const video = videoRef.current;
			if (!video) throw new Error("Camera preview is unavailable.");
			video.srcObject = stream;
			await video.play();

			const landmarker = await getLandmarker();
			const plan = pickSteps();
			setSteps(plan);
			setStepIndex(0);
			setPhase("running");
			runChecks(landmarker, plan);
		} catch (startError) {
			stopCamera();
			setPhase("idle");
			const name = startError instanceof DOMException ? startError.name : "";
			setError(
				name === "NotAllowedError"
					? "Camera access was blocked. Allow camera access in your browser settings and try again."
					: name === "NotFoundError"
						? "No camera was found on this device."
						: "We couldn't start the camera check. Please try again.",
			);
		}
	};

	const showVideo = phase === "loading" || phase === "running";

	return (
		<div className="space-y-4">
			<div className="relative mx-auto aspect-[3/4] w-full max-w-xs overflow-hidden rounded-2xl bg-gray-900">
				<video
					ref={videoRef}
					playsInline
					muted
					className={`h-full w-full -scale-x-100 object-cover ${showVideo ? "" : "hidden"}`}
				/>
				{preview && phase === "passed" && (
					<img src={preview} alt="Captured selfie" className="h-full w-full -scale-x-100 object-cover" />
				)}
				{showVideo && (
					<div className="pointer-events-none absolute inset-0 flex items-center justify-center">
						<div
							className={`h-[70%] w-[70%] rounded-[50%] border-4 ${
								phase === "running" && !hint ? "border-[#C43266]" : "border-white/60"
							}`}
						/>
					</div>
				)}
				{!showVideo && phase !== "passed" && (
					<div className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-white/80">
						{phase === "failed" ? "Check not completed" : "Your camera preview will appear here"}
					</div>
				)}
				{phase === "loading" && (
					<div className="absolute inset-0 flex items-center justify-center bg-black/40 text-sm font-medium text-white">
						Preparing camera...
					</div>
				)}
			</div>

			{phase === "running" && steps.length > 0 && (
				<div className="text-center">
					<p className="text-xs font-medium uppercase tracking-wide text-gray-500">
						Step {stepIndex + 1} of {steps.length}
					</p>
					<p className="mt-1 text-lg font-semibold text-[#67307d]">{STEP_LABELS[steps[stepIndex]]}</p>
					<div className="mt-3 flex justify-center gap-2">
						{steps.map((step, index) => (
							<span
								key={step}
								className={`h-2 w-8 rounded-full ${index < stepIndex ? "bg-[#C43266]" : index === stepIndex ? "bg-[#67307d]" : "bg-gray-200"}`}
							/>
						))}
					</div>
				</div>
			)}

			{hint && <p className="text-center text-sm text-amber-700">{hint}</p>}
			{error && <p className="text-center text-sm text-red-600">{error}</p>}
			{phase === "passed" && (
				<p className="text-center text-sm font-medium text-green-700">Liveness check passed. You can submit your selfie.</p>
			)}

			{(phase === "idle" || phase === "failed" || phase === "passed") && (
				<div className="flex justify-center">
					<button
						type="button"
						onClick={() => void start()}
						className="rounded-xl border border-[#67307d] px-5 py-3 font-medium text-[#67307d] transition hover:bg-[#f8edf3]">
						{phase === "idle" ? "Start camera check" : phase === "failed" ? "Try again" : "Retake"}
					</button>
				</div>
			)}
		</div>
	);
}
