import { useEffect, useRef, useState } from "react";
import AgoraRTC, {
	type IAgoraRTCClient,
	type ICameraVideoTrack,
	type IMicrophoneAudioTrack,
} from "agora-rtc-sdk-ng";
import { Icon } from "@iconify/react";
import { getCallCredentials } from "../services/callService";
import { getApiMessage } from "../utils/apiMessages";

AgoraRTC.setLogLevel(import.meta.env.DEV ? 1 : 3);

type CallStatus = "connecting" | "waiting" | "connected" | "ended";

type VideoCallProps = {
	myId: number;
	receiver: { id: number; name: string; profilepicture: string | null };
	onClose: () => void;
	onError: (message: string) => void;
};

export default function VideoCall({ myId, receiver, onClose, onError }: VideoCallProps) {
	const [status, setStatus] = useState<CallStatus>("connecting");
	const [micOn, setMicOn] = useState(true);
	const [cameraOn, setCameraOn] = useState(true);
	const [remoteVideoOn, setRemoteVideoOn] = useState(false);

	const localVideoRef = useRef<HTMLDivElement>(null);
	const remoteVideoRef = useRef<HTMLDivElement>(null);
	const micTrackRef = useRef<IMicrophoneAudioTrack | null>(null);
	const cameraTrackRef = useRef<ICameraVideoTrack | null>(null);

	// Keep the latest callbacks without re-running the join effect
	const onErrorRef = useRef(onError);
	const onCloseRef = useRef(onClose);
	useEffect(() => {
		onErrorRef.current = onError;
		onCloseRef.current = onClose;
	});

	useEffect(() => {
		let cancelled = false;
		const client: IAgoraRTCClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

		client.on("user-published", async (user, mediaType) => {
			await client.subscribe(user, mediaType);

			if (mediaType === "video" && remoteVideoRef.current) {
				user.videoTrack?.play(remoteVideoRef.current);
				setRemoteVideoOn(true);
			}

			if (mediaType === "audio") {
				user.audioTrack?.play();
			}
		});

		client.on("user-joined", () => setStatus("connected"));

		client.on("user-unpublished", (_user, mediaType) => {
			if (mediaType === "video") setRemoteVideoOn(false);
		});

		client.on("user-left", () => {
			setRemoteVideoOn(false);
			setStatus("ended");
		});

		const start = async () => {
			try {
				const { appId, channel, token, uid } = await getCallCredentials(myId, receiver.id);
				if (cancelled) return;

				await client.join(appId, channel, token, uid);
				if (cancelled) return;

				const [micTrack, cameraTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();

				if (cancelled) {
					micTrack.close();
					cameraTrack.close();
					return;
				}

				micTrackRef.current = micTrack;
				cameraTrackRef.current = cameraTrack;

				if (localVideoRef.current) cameraTrack.play(localVideoRef.current);
				await client.publish([micTrack, cameraTrack]);

				// The other person may already be in the channel
				setStatus(client.remoteUsers.length > 0 ? "connected" : "waiting");
			} catch (error) {
				if (cancelled) return;

				console.error("Video call error:", error);
				const permissionDenied =
					error instanceof Error && /PERMISSION_DENIED|NotAllowedError/i.test(error.message);

				onErrorRef.current(
					permissionDenied
						? "Please allow camera and microphone access."
						: getApiMessage(error, "Unable to start the video call."),
				);
				onCloseRef.current();
			}
		};

		start();

		return () => {
			cancelled = true;
			micTrackRef.current?.close();
			cameraTrackRef.current?.close();
			micTrackRef.current = null;
			cameraTrackRef.current = null;
			client.removeAllListeners();
			client.leave().catch(() => {});
		};
	}, [myId, receiver.id]);

	const toggleMic = async () => {
		const enabled = !micOn;
		await micTrackRef.current?.setMuted(!enabled);
		setMicOn(enabled);
	};

	const toggleCamera = async () => {
		const enabled = !cameraOn;
		// setEnabled releases the camera (light goes off) rather than sending black frames
		await cameraTrackRef.current?.setEnabled(enabled);
		setCameraOn(enabled);
	};

	const statusText: Record<CallStatus, string> = {
		connecting: "Connecting...",
		waiting: `Calling ${receiver.name}...`,
		connected: "",
		ended: `${receiver.name} left the call`,
	};

	return (
		<div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 p-5">
			<div className="relative h-full max-h-175 w-full max-w-250 overflow-hidden rounded-3xl bg-gray-900">
				{/* Remote video */}
				<div
					ref={remoteVideoRef}
					className={`absolute inset-0 ${remoteVideoOn ? "" : "invisible"}`}
				/>

				{!remoteVideoOn && (
					<div className="flex h-full items-center justify-center">
						<div className="text-center text-white">
							<div className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full">
								<img
									src={receiver.profilepicture ?? ""}
									alt={receiver.name}
									className="h-full w-full object-cover"
								/>
							</div>

							<h2 className="text-xl font-semibold">{receiver.name}</h2>

							<p className="mt-1 text-sm text-white/60">
								{statusText[status] || "Camera is off"}
							</p>
						</div>
					</div>
				)}

				{/* Local preview */}
				<div className="absolute right-5 top-5 h-45 w-32.5 overflow-hidden rounded-2xl border-2 border-white/20 bg-black shadow-xl">
					<div ref={localVideoRef} className={`h-full w-full ${cameraOn ? "" : "invisible"}`} />
					{!cameraOn && (
						<div className="absolute inset-0 grid place-items-center text-white/60">
							<Icon icon="boxicons:video-off" width="28" height="28" />
						</div>
					)}
				</div>

				<div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-4">
					<button
						type="button"
						onClick={toggleMic}
						aria-label={micOn ? "Mute microphone" : "Unmute microphone"}
						aria-pressed={!micOn}
						className={`grid h-12 w-12 place-items-center rounded-full backdrop-blur transition ${
							micOn ? "bg-white/20 text-white hover:bg-white/30" : "bg-white/90 text-gray-900 hover:bg-white"
						}`}>
						<Icon
							icon={micOn ? "boxicons:microphone" : "boxicons:microphone-off"}
							width="22"
							height="22"
						/>
					</button>

					<button
						type="button"
						onClick={toggleCamera}
						aria-label={cameraOn ? "Turn camera off" : "Turn camera on"}
						aria-pressed={!cameraOn}
						className={`grid h-12 w-12 place-items-center rounded-full backdrop-blur transition ${
							cameraOn ? "bg-white/20 text-white hover:bg-white/30" : "bg-white/90 text-gray-900 hover:bg-white"
						}`}>
						<Icon icon={cameraOn ? "boxicons:video" : "boxicons:video-off"} width="22" height="22" />
					</button>

					<button
						type="button"
						onClick={onClose}
						aria-label="End call"
						className="grid h-14 w-14 place-items-center rounded-full bg-red-500 text-white transition hover:bg-red-600">
						<Icon icon="boxicons:phone-off" width="24" height="24" />
					</button>
				</div>

				<button
					type="button"
					onClick={onClose}
					aria-label="Close call"
					className="absolute left-5 top-5 grid h-10 w-10 place-items-center rounded-full bg-black/40 text-white">
					<Icon icon="boxicons:x" width="22" height="22" />
				</button>
			</div>
		</div>
	);
}
