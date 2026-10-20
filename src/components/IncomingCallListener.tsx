// src/components/IncomingCallListener.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CALL_INVITE_MAX_AGE_MS,
  callDeclineMessage,
  listenForIncomingCall,
  updateIncomingCallStatus,
  type IncomingCallNotification,
} from "../services/callService";
import { sendMessage } from "../services/messageService";

interface IncomingCallListenerProps {
  myId: number;
  onAccept: (call: IncomingCallNotification) => void;
  onDecline: (call: IncomingCallNotification) => void;
}

export default function IncomingCallListener({
  myId,
  onAccept,
  onDecline,
}: IncomingCallListenerProps) {
  const navigate = useNavigate();
  const [call, setCall] =
    useState<IncomingCallNotification | null>(null);

  useEffect(() => {
    let cancelled = false;
    let unsubscribe: (() => void) | undefined;

    listenForIncomingCall(
      myId,
      (incoming) => {
        if (cancelled) return;

        // Ignore stale ringing records.
        if (
          incoming &&
          Date.now() - incoming.timestamp > CALL_INVITE_MAX_AGE_MS
        ) {
          setCall(null);
          return;
        }

        setCall(incoming);
      },
      (error) => {
        const code = (error as { code?: string })?.code;
        if (code === "auth/admin-restricted-operation") {
          console.warn(
            "Enable Anonymous sign-in in Firebase Console > Authentication > Sign-in method for real-time call alerts.",
          );
        } else {
          console.warn("Incoming call listener notice:", error);
        }
      },
    )
      .then((unsub) => {
        if (cancelled) {
          unsub();
        } else {
          unsubscribe = unsub;
        }
      })
      .catch((error) => {
        const code = (error as { code?: string })?.code;
        if (code === "auth/admin-restricted-operation") {
          console.warn(
            "Enable Anonymous sign-in in Firebase Console > Authentication > Sign-in method for real-time call alerts.",
          );
        } else {
          console.warn("Unable to subscribe to incoming calls:", error);
        }
      });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [myId]);

  if (!call) return null;

  const accept = async () => {
    if (!call.channel_name) {
      console.error("Incoming call is missing channel name.");
      setCall(null);
      return;
    }

    const match =
      /^video_call_(\d+)_(.+)$/.exec(call.channel_name) ||
      /^channel_(\d+)_(.+)$/.exec(call.channel_name);

    const conversationId = match ? Number(match[1]) || 0 : 0;

    try {
      await updateIncomingCallStatus(
        myId,
        call.call_id,
        "accepted",
      );

      // Use the layout callback when supplied.
      if (onAccept) {
        onAccept(call);
      } else {
        navigate("/matches", {
          state: {
            acceptVideoCall: {
              conversationId,
              callId: call.call_id,
              channelName: call.channel_name,
            },
          },
        });
      }

      setCall(null);
    } catch (error) {
      console.error("Unable to accept incoming call:", error);
    }
  };

  const decline = async () => {
    try {
      await updateIncomingCallStatus(
        myId,
        call.call_id,
        "declined",
      );

      await sendMessage({
        receiverId: call.caller_id,
        messageText: callDeclineMessage(call.call_id),
      });

      onDecline(call);
      setCall(null);
    } catch (error) {
      console.error("Unable to decline incoming call:", error);
    }
  };

  return (
    <div
      role="alertdialog"
      aria-label="Incoming video call"
      className="fixed inset-x-4 top-4 z-[100] rounded-2xl bg-white p-4 shadow-xl"
    >
      <p className="font-semibold">
        {call.caller_name} is calling…
      </p>

      <div className="mt-3 flex gap-3">
        <button
          type="button"
          onClick={decline}
          className="rounded-full bg-red-500 px-4 py-2 text-white"
        >
          Decline
        </button>

        <button
          type="button"
          onClick={accept}
          className="rounded-full bg-green-600 px-4 py-2 text-white"
        >
          Accept
        </button>
      </div>
    </div>
  );
}