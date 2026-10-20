import AgoraRTC, {
  type IAgoraRTCClient,
  type ICameraVideoTrack,
  type IMicrophoneAudioTrack,
} from "agora-rtc-sdk-ng";
import { getCallCredentials } from "../services/callService";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";

AgoraRTC.setLogLevel(import.meta.env.DEV ? 1 : 3);

type CallStatus = "connecting" | "waiting" | "connected" | "ended";

type VideoCallProps = {
  myId: number;
  channelName: string;
  isCaller: boolean;
  receiver: {
    id: number;
    name: string;
    profilepicture: string | null;
  };
  onClose: () => void;
  onCallEnd: (durationSeconds: number | null) => void | Promise<void>;
  onError: (message: string) => void;
};

export default function VideoCall({
  myId,
  channelName,
  isCaller,
  receiver,
  onClose,
  onCallEnd,
  onError,
}: VideoCallProps) {
  const [status, setStatus] = useState<CallStatus>("connecting");
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [remoteVideoOn, setRemoteVideoOn] = useState(false);

  const localRef = useRef<HTMLDivElement>(null);
  const remoteRef = useRef<HTMLDivElement>(null);
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const micRef = useRef<IMicrophoneAudioTrack | null>(null);
  const cameraRef = useRef<ICameraVideoTrack | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const endedRef = useRef(false);
  const callbacksRef = useRef({ onClose, onCallEnd, onError });

  useEffect(() => {
    callbacksRef.current = { onClose, onCallEnd, onError };
  }, [onClose, onCallEnd, onError]);

  useEffect(() => {
    let cancelled = false;
    // let disposed = false;

    const client = AgoraRTC.createClient({
      mode: "rtc",
      codec: "vp8",
    });

    clientRef.current = client;

    const startTimer = () => {
      startTimeRef.current ??= Date.now();
      setStatus("connected");
    };

    client.on("user-joined", startTimer);

    client.on("user-published", async (user, mediaType) => {
      try {
        await client.subscribe(user, mediaType);
        if (cancelled) return;

        if (mediaType === "video") {
          if (remoteRef.current && user.videoTrack) {
            user.videoTrack.play(remoteRef.current, { fit: "cover" });
            setRemoteVideoOn(true);
          }
        }

        if (mediaType === "audio") {
          user.audioTrack?.play();
        }

        startTimer();
      } catch (error) {
        console.error("Remote subscription failed:", error);
        callbacksRef.current.onError(
          "Unable to connect to the other caller's media.",
        );
      }
    });

    client.on("user-unpublished", (_user, mediaType) => {
      if (mediaType === "video") setRemoteVideoOn(false);
    });

    client.on("user-left", () => {
      setRemoteVideoOn(false);
      setStatus("ended");
    });

    async function startCall() {
      try {
        const credentials = await getCallCredentials(myId, channelName);
        if (cancelled) return;

        await client.join(
          credentials.appId,
          credentials.channelName,
          credentials.token,
          credentials.uid,
        );
        if (cancelled) return;

        const [mic, camera] = await AgoraRTC.createMicrophoneAndCameraTracks();

        if (cancelled) {
          mic.close();
          camera.close();
          return;
        }

        micRef.current = mic;
        cameraRef.current = camera;

        if (localRef.current) {
          camera.play(localRef.current, { fit: "cover", mirror: true });
        }

        await client.publish([mic, camera]);
        if (cancelled) return;

        // Subscribe to existing remote users already present in channel
        for (const user of client.remoteUsers) {
          if (user.hasVideo) {
            await client.subscribe(user, "video");
            if (cancelled) return;
            if (remoteRef.current && user.videoTrack) {
              user.videoTrack.play(remoteRef.current, { fit: "cover" });
              setRemoteVideoOn(true);
            }
          }
          if (user.hasAudio) {
            await client.subscribe(user, "audio");
            if (cancelled) return;
            user.audioTrack?.play();
          }
        }

        if (client.remoteUsers.length > 0) {
          startTimer();
        } else {
          setStatus("waiting");
        }
      } catch (error) {
        if (cancelled) return;

        console.error("Agora call failed:", error);

        const message =
          error instanceof Error &&
          /NotAllowedError|Permission denied|PERMISSION_DENIED/i.test(
            error.message,
          )
            ? "Please allow camera and microphone access."
            : "Unable to start the video call. Check your Agora credentials and connection.";

        callbacksRef.current.onError(message);
        callbacksRef.current.onClose();
      }
    }

    void startCall();

    return () => {
      cancelled = true;

      client.removeAllListeners();

      micRef.current?.close();
      cameraRef.current?.stop();
      cameraRef.current?.close();

      micRef.current = null;
      cameraRef.current = null;

      if (clientRef.current === client) {
        clientRef.current = null;
      }

      void client.leave().catch((error) => {
        console.error("Unable to leave Agora channel:", error);
      });
    };
  }, [myId, channelName]);

  async function toggleMic() {
    try {
      const next = !micOn;
      await micRef.current?.setMuted(!next);
      setMicOn(next);
    } catch {
      callbacksRef.current.onError("Unable to change microphone settings.");
    }
  }

  async function toggleCamera() {
    try {
      const next = !cameraOn;
      await cameraRef.current?.setEnabled(next);
      setCameraOn(next);
    } catch {
      callbacksRef.current.onError("Unable to change camera settings.");
    }
  }

  async function endCall() {
    if (endedRef.current) return;
    endedRef.current = true;

    const startedAt = startTimeRef.current;
    const duration =
      startedAt === null ? null : Math.floor((Date.now() - startedAt) / 1000);

    try {
      await callbacksRef.current.onCallEnd(duration);
    } catch (error) {
      console.error("Unable to record call end:", error);
    } finally {
      callbacksRef.current.onClose();
    }
  }

  const statusText: Record<CallStatus, string> = {
    connecting: "Connecting...",
    waiting: isCaller
      ? `Calling ${receiver.name}...`
      : "Waiting for the caller...",
    connected: "",
    ended: `${receiver.name} left the call`,
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-3 sm:p-5">
      <div className="relative h-full max-h-[700px] w-full max-w-[1000px] overflow-hidden rounded-3xl bg-gray-900">
        <div
          ref={remoteRef}
          className={`absolute inset-0 h-full w-full ${remoteVideoOn ? "" : "invisible"}`}
        />

        {!remoteVideoOn && (
          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
            <div className="text-center text-white">
              <img
                src={receiver.profilepicture ?? ""}
                alt={receiver.name}
                className="mx-auto mb-4 h-24 w-24 rounded-full object-cover shadow-lg border-2 border-white/20"
              />
              <h2 className="text-xl font-semibold">{receiver.name}</h2>
              <p className="mt-1 text-sm text-white/60">
                {statusText[status] || "Camera is off"}
              </p>
            </div>
          </div>
        )}

        <div className="absolute right-4 top-4 z-20 h-40 w-28 overflow-hidden rounded-2xl border-2 border-white/20 bg-black shadow-xl sm:right-5 sm:top-5 sm:h-48 sm:w-36">
          <div
            ref={localRef}
            className={`h-full w-full ${cameraOn ? "" : "invisible"}`}
          />
          {!cameraOn && (
            <div className="absolute inset-0 grid place-items-center text-white">
              <Icon icon="boxicons:video-off" width="28" />
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => void endCall()}
          aria-label="Close call"
          className="absolute left-4 top-4 z-20 grid h-10 w-10 place-items-center rounded-full bg-black/40 text-white transition hover:bg-black/60"
        >
          <Icon icon="boxicons:x" width="22" />
        </button>

        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 sm:bottom-8 sm:gap-4">
          <button
            type="button"
            onClick={() => void toggleMic()}
            aria-label={micOn ? "Mute microphone" : "Unmute microphone"}
            className={`grid h-12 w-12 place-items-center rounded-full ${
              micOn ? "bg-white/20 text-white" : "bg-white text-gray-900"
            }`}
          >
            <Icon
              icon={micOn ? "boxicons:microphone" : "boxicons:microphone-off"}
              width="22"
            />
          </button>

          <button
            type="button"
            onClick={() => void toggleCamera()}
            aria-label={cameraOn ? "Turn camera off" : "Turn camera on"}
            className={`grid h-12 w-12 place-items-center rounded-full ${
              cameraOn ? "bg-white/20 text-white" : "bg-white text-gray-900"
            }`}
          >
            <Icon
              icon={cameraOn ? "boxicons:video" : "boxicons:video-off"}
              width="22"
            />
          </button>

          <button
            type="button"
            onClick={() => void endCall()}
            aria-label="End call"
            className="grid h-14 w-14 place-items-center rounded-full bg-red-500 text-white hover:bg-red-600"
          >
            <Icon icon="boxicons:phone-off" width="24" />
          </button>
        </div>
      </div>
    </div>
  );
}
