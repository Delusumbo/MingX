import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { MessageCircle, Plus } from "lucide-react";
import { Header } from "../../components/Layout";
import PersonProfileLink from "../../components/PersonProfileLink";
import { useToast } from "../../components/ToastProvider";
import { Icon } from "@iconify/react";

import {
  getConversations,
  getMessages,
  sendMessage,
  getCurrentUserId,
  type ApiConversation,
  type ApiMessage,
  type ApiUser,
} from "../../services/messageService";
import {
  authenticateFirebaseCall,
  // CALL_INVITE_PREFIX,
  callChannelName,
  callDeclineMessage,
  endIncomingCallNotification,
  // callInviteMessage,
  callSetupMessage,
  isCallControlMessage,
  writeIncomingCallNotification,
} from "../../services/callService";
import { getApiMessage } from "../../utils/apiMessages";

// Agora SDK is large; only load it when a call actually starts
const VideoCall = lazy(() => import("../../components/VideoCall"));

// Derive "the other person" from a conversation given my own id
function getOtherUser(
  conversation: ApiConversation,
  myId: number | null,
): ApiUser {
  if (Number(conversation.sender_id) === myId) return conversation.receiver;
  return conversation.sender;
}

function findConversationForUser(
  conversations: ApiConversation[],
  userId: number | null,
  otherUserId: number,
): ApiConversation | undefined {
  if (userId === null) return undefined;

  return conversations.find((conversation) => {
    const senderId = Number(conversation.sender_id);
    const receiverId = Number(conversation.receiver_id);
    return (
      (senderId === userId && receiverId === otherUserId) ||
      (senderId === otherUserId && receiverId === userId)
    );
  });
}

type PendingReceiver = {
  id: number;
  name: string;
  profilepicture: string | null;
};
type ChatFilter = "all" | "unread";

const VIDEO_CALL_LOG_PREFIX = "video call - ";
const MESSAGE_POLL_INTERVAL_MS = 5_000;

function isFirebaseAnonymousAuthDisabled(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "auth/admin-restricted-operation"
  );
}

function videoCallLogDetail(messageText: string): string | null {
  if (!messageText.startsWith(VIDEO_CALL_LOG_PREFIX)) return null;

  const detail = messageText.slice(VIDEO_CALL_LOG_PREFIX.length);
  if (detail === "no answer" || /^\d{2}:\d{2}(?::\d{2})?$/.test(detail))
    return detail;
  return null;
}

function formatCallDuration(durationSeconds: number): string {
  const hours = Math.floor(durationSeconds / 3600);
  const minutes = Math.floor((durationSeconds % 3600) / 60);
  const seconds = durationSeconds % 60;
  const twoDigits = (value: number) => String(value).padStart(2, "0");

  return hours > 0
    ? `${hours}:${twoDigits(minutes)}:${twoDigits(seconds)}`
    : `${twoDigits(minutes)}:${twoDigits(seconds)}`;
}

export default function Matches() {
  const myId = getCurrentUserId();
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const [conversations, setConversations] = useState<ApiConversation[]>([]);
  const [pendingReceiver, setPendingReceiver] =
    useState<PendingReceiver | null>(null);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [conversationsError, setConversationsError] = useState("");

  const [selectedConversationId, setSelectedConversationId] = useState<
    number | null
  >(null);
  const [threadMessages, setThreadMessages] = useState<ApiMessage[]>([]);
  const [loadingThread, setLoadingThread] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [threadMessages]);

  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);

  const [chatFilter, setChatFilter] = useState<ChatFilter>("all");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [videoCallOpen, setVideoCallOpen] = useState(false);
  const [videoCallConversationId, setVideoCallConversationId] = useState<
    number | null
  >(null);
  const [videoCallCallId, setVideoCallCallId] = useState<string | null>(null);
  const [videoCallChannelName, setVideoCallChannelName] = useState<
    string | null
  >(null);
  const [videoCallIsCaller, setVideoCallIsCaller] = useState(false);
  const [callRequestSending, setCallRequestSending] = useState(false);
  const [voiceUrl, setVoiceUrl] = useState<string | null>(null);
  const [voiceBlob, setVoiceBlob] = useState<Blob | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const recordedCallIdsRef = useRef(new Set<string>());
  const acceptedCallIdRef = useRef<string | null>(null);
  const recordVideoCallEndRef = useRef<
    (durationSeconds: number | null) => Promise<void>
  >(async () => {});

  async function blobToWav(
    blob: Blob,
    targetSampleRate = 16000,
  ): Promise<Blob> {
    const arrayBuffer = await blob.arrayBuffer();
    const audioContext = new AudioContext();
    const decoded = await audioContext.decodeAudioData(arrayBuffer);

    // Downmix to mono + resample to targetSampleRate using an OfflineAudioContext
    const offlineContext = new OfflineAudioContext(
      1,
      Math.ceil(decoded.duration * targetSampleRate),
      targetSampleRate,
    );

    const source = offlineContext.createBufferSource();
    source.buffer = decoded;
    source.connect(offlineContext.destination);
    source.start();

    const audioBuffer = await offlineContext.startRendering();
    await audioContext.close();

    const numSamples = audioBuffer.length;
    const sampleRate = audioBuffer.sampleRate;
    const dataSize = numSamples * 2; // mono, 16-bit
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);

    const writeString = (offset: number, str: string) => {
      for (let i = 0; i < str.length; i++)
        view.setUint8(offset + i, str.charCodeAt(i));
    };

    writeString(0, "RIFF");
    view.setUint32(4, 36 + dataSize, true);
    writeString(8, "WAVE");
    writeString(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true); // mono
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, "data");
    view.setUint32(40, dataSize, true);

    const channelData = audioBuffer.getChannelData(0);
    let offset = 44;

    for (let i = 0; i < numSamples; i++) {
      const sample = Math.max(-1, Math.min(1, channelData[i]));
      const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(offset, intSample, true);
      offset += 2;
    }

    return new Blob([buffer], { type: "audio/wav" });
  }

  // Load conversations on mount
  useEffect(() => {
    const load = async () => {
      try {
        setLoadingConversations(true);
        setConversationsError("");

        const data = await getConversations();
        setConversations(data);
      } catch (error) {
        console.error("Conversations error:", error);
        setConversationsError(getApiMessage(error));
        showToast(getApiMessage(error), "error");
      } finally {
        setLoadingConversations(false);
      }
    };

    load();
  }, [showToast]);

  useEffect(() => {
    const personState = location.state?.person as
      | { id?: number | string; name?: string; image?: string }
      | undefined;
    const receiverIdParam = personState?.id ?? searchParams.get("receiver_id");
    if (
      receiverIdParam === null ||
      receiverIdParam === undefined ||
      loadingConversations
    )
      return;

    const receiverId = Number(receiverIdParam);
    if (!Number.isInteger(receiverId)) return;
    const existing = findConversationForUser(conversations, myId, receiverId);

    if (existing) {
      setSelectedConversationId(existing.id);
      setPendingReceiver(null);
    } else {
      setSelectedConversationId(null);
      setPendingReceiver({
        id: receiverId,
        name: personState?.name ?? "New match",
        profilepicture: personState?.image ?? null,
      });
    }
  }, [searchParams, conversations, loadingConversations, myId, location.state]);

  const selectedConversation =
    conversations.find((c) => c.id === selectedConversationId) ?? null;
  const selectedOtherUser = selectedConversation
    ? getOtherUser(selectedConversation, myId)
    : pendingReceiver;

  useEffect(() => {
    const acceptedCall = (
      location.state as
        | {
            acceptVideoCall?: {
              conversationId?: number;
              callId?: string;
              channelName?: string;
            };
          }
        | null
        | undefined
    )?.acceptVideoCall;

    if (
      !acceptedCall ||
      typeof acceptedCall.conversationId !== "number" ||
      !Number.isInteger(acceptedCall.conversationId) ||
      typeof acceptedCall.callId !== "string" ||
      typeof acceptedCall.channelName !== "string" ||
      acceptedCallIdRef.current === acceptedCall.callId
    ) {
      return;
    }

    acceptedCallIdRef.current = acceptedCall.callId;
    setSelectedConversationId(acceptedCall.conversationId);
    setPendingReceiver(null);
    setVideoCallConversationId(acceptedCall.conversationId);
    setVideoCallCallId(acceptedCall.callId);
    setVideoCallChannelName(acceptedCall.channelName);
    setVideoCallIsCaller(false);
    setVideoCallOpen(true);
  }, [location.state]);

  // ...

  const startVideoCall = async () => {
    if (!selectedOtherUser || callRequestSending || myId === null) return;

    try {
      setCallRequestSending(true);

      const storedUser = localStorage.getItem("user");
      let callerName = "MingX User";
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed?.name) callerName = parsed.name;
        } catch {
          // ignore
        }
      }

      let callerId = myId;
      try {
        const callerIdentity = await authenticateFirebaseCall();
        if (callerIdentity?.id) {
          callerId = callerIdentity.id;
        }
        if (callerIdentity?.name) {
          callerName = callerIdentity.name;
        }
      } catch (authError) {
        console.warn("Optional Firebase token auth skipped:", authError);
      }

      const callId = Date.now().toString();

      let conversationId = selectedConversationId;
      if (conversationId === null) {
        try {
          await sendMessage({
            receiverId: selectedOtherUser.id,
            messageText: callSetupMessage(callId),
          });
          for (
            let attempt = 0;
            attempt < 3 && conversationId === null;
            attempt++
          ) {
            const data = await getConversations();
            setConversations(data);
            conversationId =
              findConversationForUser(data, myId, selectedOtherUser.id)?.id ??
              null;
            if (conversationId === null && attempt < 2) {
              await new Promise((resolve) => setTimeout(resolve, 300));
            }
          }
        } catch (convErr) {
          console.warn("Initial conversation setup attempt notice:", convErr);
        }
      }

      const channelName =
        conversationId !== null
          ? callChannelName(conversationId, callId)
          : `video_call_${Math.min(myId, selectedOtherUser.id)}_${Math.max(myId, selectedOtherUser.id)}_${callId}`;

      // 1. Send call invite chat message (best-effort)
      // try {
      //   await sendMessage({
      //     receiverId: selectedOtherUser.id,
      //     messageText:
      //       conversationId !== null
      //         ? callInviteMessage(conversationId, callId)
      //         : `${CALL_INVITE_PREFIX}0:${callId}:${channelName}]]`,
      //   });
      // } catch (sendErr) {
      //   console.warn("Call invitation message send notice:", sendErr);
      // }

      // 2. Write incoming call notification to Firebase (best-effort)
      try {
        await writeIncomingCallNotification({
          receiverId: selectedOtherUser.id,
          callerId,
          callerName,
          callId,
          channelName,
        });
      } catch (notiErr) {
        console.warn("Firebase incoming call notification notice:", notiErr);
      }

      setVideoCallConversationId(conversationId ?? 0);
      setVideoCallCallId(callId);
      setVideoCallChannelName(channelName);
      setVideoCallIsCaller(true);
      if (conversationId !== null) {
        setSelectedConversationId(conversationId);
      }
      setPendingReceiver(null);
      setVideoCallOpen(true);
    } catch (error) {
      console.error("Call invitation error:", error);
      const message = isFirebaseAnonymousAuthDisabled(error)
        ? "Enable Anonymous sign-in in Firebase Console > Authentication > Sign-in method to make calls."
        : getApiMessage(error, "Unable to send the call invitation.");
      showToast(message, "error");
    } finally {
      setCallRequestSending(false);
    }
  };

  const recordVideoCallEnd = async (durationSeconds: number | null) => {
    if (videoCallCallId === null) {
      console.error("Unable to send video call status: call ID is missing.");
      showToast("Unable to send the video call status.", "error");
      return;
    }

    if (!videoCallIsCaller) {
      if (!selectedOtherUser || myId === null) return;
      if (durationSeconds === null) {
        try {
          await sendMessage({
            receiverId: selectedOtherUser.id,
            messageText: callDeclineMessage(videoCallCallId),
          });
        } catch (error) {
          console.error("Video call decline message error:", error);
          showToast(
            getApiMessage(error, "Unable to send the call rejection."),
            "error",
          );
        }
      }

      try {
        await endIncomingCallNotification(myId, videoCallCallId);
      } catch (error) {
        console.error("Video call end notification error:", error);
        showToast(
          getApiMessage(error, "Unable to update the call status."),
          "error",
        );
      }
      return;
    }

    if (!selectedOtherUser || videoCallConversationId === null) {
      console.error(
        "Unable to save video call history: conversation or recipient is missing.",
      );
      showToast("Unable to save the video call history.", "error");
      return;
    }

    if (recordedCallIdsRef.current.has(videoCallCallId)) return;
    recordedCallIdsRef.current.add(videoCallCallId);

    const detail =
      durationSeconds === null
        ? "no answer"
        : formatCallDuration(durationSeconds);

    try {
      await endIncomingCallNotification(selectedOtherUser.id, videoCallCallId);
    } catch (error) {
      console.error("Firebase call status update error:", error);
      showToast(
        getApiMessage(
          error,
          "Call ended, but Firebase status could not be updated.",
        ),
        "error",
      );
    }

    try {
      await sendMessage({
        receiverId: selectedOtherUser.id,
        messageText: `${VIDEO_CALL_LOG_PREFIX}${detail}`,
      });
    } catch (error) {
      recordedCallIdsRef.current.delete(videoCallCallId);
      console.error("Video call history error:", error);
      showToast(
        getApiMessage(error, "Unable to save the video call history."),
        "error",
      );
      return;
    }

    if (selectedConversationId === videoCallConversationId) {
      try {
        setThreadMessages(await getMessages(videoCallConversationId));
      } catch (error) {
        console.error("Video call history refresh error:", error);
        showToast(
          getApiMessage(error, "Unable to refresh the conversation."),
          "error",
        );
      }
    }
  };
  useEffect(() => {
    recordVideoCallEndRef.current = recordVideoCallEnd;
  });

  // Watch for a rejection while the caller's call screen is open.
  useEffect(() => {
    if (
      myId === null ||
      !videoCallOpen ||
      !videoCallIsCaller ||
      videoCallConversationId === null ||
      videoCallCallId === null
    ) {
      return;
    }

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    const pollForCalls = async () => {
      try {
        const messages = await getMessages(videoCallConversationId);
        if (cancelled) return;

        const declined = messages.some(
          (message) =>
            message.sender_id !== myId &&
            message.message_text === callDeclineMessage(videoCallCallId),
        );
        if (declined) {
          await recordVideoCallEndRef.current(null);
          setVideoCallOpen(false);
          setVideoCallConversationId(null);
          setVideoCallCallId(null);
          setVideoCallChannelName(null);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Video call rejection polling error:", error);
        }
      } finally {
        if (!cancelled) {
          timeoutId = setTimeout(pollForCalls, MESSAGE_POLL_INTERVAL_MS);
        }
      }
    };

    void pollForCalls();

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [
    myId,
    videoCallOpen,
    videoCallIsCaller,
    videoCallConversationId,
    videoCallCallId,
  ]);

  const handleSendMessage = async (options?: { file?: File | null }) => {
    if (!selectedOtherUser) return;

    const text = messageText.trim();
    const file = options?.file ?? null;

    if (!text && !file) return;

    try {
      setSending(true);

      const response = await sendMessage({
        receiverId: selectedOtherUser.id,
        messageText: text,
        file,
      });
      showToast(getApiMessage(response, "Message sent."));

      setMessageText("");

      if (selectedConversationId !== null) {
        const refreshed = await getMessages(selectedConversationId);
        setThreadMessages(refreshed);
      } else {
        // first message to a new match — a conversation now exists server-side, so refetch the list
        const data = await getConversations();
        setConversations(data);

        const created = findConversationForUser(
          data,
          myId,
          selectedOtherUser.id,
        );
        if (created) {
          setSelectedConversationId(created.id);
          setPendingReceiver(null);
          setThreadMessages(await getMessages(created.id));
        }
      }
    } catch (error) {
      console.error("Send error:", error);
      showToast(getApiMessage(error), "error");
    } finally {
      setSending(false);
    }
  };

  // Keep the selected thread current while it is open.
  useEffect(() => {
    if (selectedConversationId === null) return;

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;
    let firstRequest = true;

    const load = async () => {
      if (firstRequest) setLoadingThread(true);

      try {
        const data = await getMessages(selectedConversationId);
        if (cancelled) return;

        setThreadMessages(data);
      } catch (error) {
        if (!cancelled) {
          console.error("Messages polling error:", error);
          if (firstRequest) showToast(getApiMessage(error), "error");
        }
      } finally {
        if (!cancelled && firstRequest) setLoadingThread(false);
        firstRequest = false;
        if (!cancelled) {
          timeoutId = setTimeout(load, MESSAGE_POLL_INTERVAL_MS);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [selectedConversationId, showToast]);

  const filteredConversations = conversations.filter((conversation) => {
    if (chatFilter === "unread") {
      return conversation.unread_messages_count > 0;
    }

    return true;
  });

  const unreadCount = conversations.filter(
    (c) => c.unread_messages_count > 0,
  ).length;

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const recorder = new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });

        const url = URL.createObjectURL(audioBlob);

        setVoiceBlob(audioBlob);
        setVoiceUrl(url);

        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();

      setIsRecording(true);
    } catch (error) {
      console.error("Microphone error:", error);
      alert("Please allow microphone access to record a voice note.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }

    setIsRecording(false);
  };

  return (
    <>
      <Header searchPlaceholder="Search by name or message" />

      <section className="px-5 pb-24 pt-10 md:px-8 lg:px-10">
        <h1 className="text-3xl font-bold text-[#67307d]">Matches</h1>

        {/* Matches strip */}
        <div className="mt-6 flex gap-6 overflow-x-auto pb-3">
          {conversations.map((conversation) => {
            const otherUser = getOtherUser(conversation, myId);

            return (
              <div key={conversation.id} className="min-w-19 text-center">
                <button
                  type="button"
                  onClick={() => setSelectedConversationId(conversation.id)}
                  aria-label={`Open conversation with ${otherUser.name}`}
                >
                  <img
                    src={otherUser.profilepicture ?? ""}
                    alt=""
                    className="mx-auto h-19 w-19 rounded-full border-2 border-[#ca2e6b] object-cover p-1"
                  />
                </button>
                <span className="mt-2 block text-sm">{otherUser.name}</span>
              </div>
            );
          })}
        </div>

        <h2 className="mb-4 mt-8 text-lg font-semibold text-[#67307d]">
          Messages
        </h2>

        <div className="grid gap-5 lg:grid-cols-[380px_1fr]">
          {/* Chat list */}
          <div className="rounded-[22px] bg-white lg:p-4">
            <div className="mb-5 flex items-center gap-3">
              {/* All */}
              <button
                type="button"
                onClick={() => setChatFilter("all")}
                className={`rounded-full border px-5 py-2 text-sm transition ${
                  chatFilter === "all"
                    ? "border-[#ca2e6b] bg-[#ca2e6b] text-white"
                    : "border-[#ca2e6b] text-[#ca2e6b] hover:bg-[#fff5f8]"
                }`}
              >
                All
              </button>

              {/* Unread */}
              <button
                type="button"
                onClick={() => setChatFilter("unread")}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  chatFilter === "unread"
                    ? "border-[#ca2e6b] bg-[#ca2e6b] text-white"
                    : "border-[#ca2e6b] text-[#ca2e6b] hover:bg-[#fff5f8]"
                }`}
              >
                Unread
                <b
                  className={`ml-2 rounded-full px-2 ${
                    chatFilter === "unread"
                      ? "bg-white text-[#ca2e6b]"
                      : "bg-[#f5e6ed]"
                  }`}
                >
                  {unreadCount}
                </b>
              </button>

              {/* New chat */}
              <button
                type="button"
                className="ml-auto grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#ca2e6b]"
              >
                <Plus size={18} />
              </button>
            </div>

            {loadingConversations && (
              <div className="py-10 text-center text-sm text-gray-500">
                Loading chats...
              </div>
            )}

            {!loadingConversations && conversationsError && (
              <div className="py-10 text-center text-sm text-red-500">
                {conversationsError}
              </div>
            )}

            {!loadingConversations &&
              !conversationsError &&
              filteredConversations.length === 0 && (
                <div className="py-10 text-center text-sm text-gray-500">
                  No conversations yet.
                </div>
              )}

            {!loadingConversations &&
              !conversationsError &&
              filteredConversations.map((conversation) => {
                const otherUser = getOtherUser(conversation, myId);

                return (
                  <div
                    key={conversation.id}
                    className={`flex w-full items-center gap-3 border-b border-gray-100 py-3 text-left last:border-0 ${
                      selectedConversationId === conversation.id
                        ? "bg-[#fff5f8]"
                        : ""
                    }`}
                  >
                    {/* Profile */}
                    <button
                      type="button"
                      onClick={() => setSelectedConversationId(conversation.id)}
                      aria-label={`Open conversation with ${otherUser.name}`}
                      className="relative shrink-0"
                    >
                      <img
                        src={otherUser.profilepicture ?? ""}
                        alt=""
                        className="h-9 w-9 rounded-full border border-[#ca2e6b] object-cover"
                      />
                    </button>

                    {/* Name + message */}
                    <span className="flex-1">
                      <b className="block text-sm">{otherUser.name}</b>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedConversationId(conversation.id)
                        }
                        className={`text-left text-xs ${
                          conversation.unread_messages_count > 0
                            ? "font-medium text-gray-700"
                            : "text-gray-500"
                        }`}
                      >
                        Tap to view messages
                      </button>
                    </span>

                    {/* Unread */}
                    {conversation.unread_messages_count > 0 && (
                      <b className="rounded-full bg-[#ca2e6b] px-1.5 py-1 text-xs text-white">
                        {conversation.unread_messages_count}
                      </b>
                    )}
                  </div>
                );
              })}
          </div>

          {/* Conversation */}
          <div className="min-h-125 overflow-hidden rounded-[22px] bg-white">
            {selectedOtherUser ? (
              <div className="flex h-125 flex-col">
                {/* Chat Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="text-gray-800 lg:hidden"
                      onClick={() => setSelectedConversationId(null)}
                    >
                      <Icon
                        icon="boxicons:chevron-left"
                        width="24"
                        height="24"
                      />
                    </button>

                    <div className="relative">
                      <img
                        src={selectedOtherUser.profilepicture ?? ""}
                        alt={selectedOtherUser.name}
                        className="h-10 w-10 rounded-full border-2 border-[#ca2e6b] object-cover p-px"
                      />
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {selectedOtherUser.name}
                      </h3>

                      <PersonProfileLink
                        personId={selectedOtherUser.id}
                        personName={selectedOtherUser.name}
                        className="text-xs text-gray-400 hover:text-[#ca2e6b] hover:underline"
                      >
                        Tap to view profile
                      </PersonProfileLink>
                    </div>
                  </div>

                  {/* Chat actions */}
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={startVideoCall}
                      disabled={myId === null || callRequestSending}
                      aria-busy={callRequestSending}
                      aria-label={`Video call ${selectedOtherUser.name}`}
                      className="grid h-9 w-14 place-items-center rounded-xl border border-[#ca2e6b] text-[#ca2e6b] transition hover:bg-[#f9e8ef] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Icon icon="boxicons:video" width="21" height="21" />
                    </button>

                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setMenuOpen((prev) => !prev)}
                        className="grid h-9 w-9 place-items-center rounded-full bg-linear-to-r from-[#ca2e6b] to-[#67307d] text-white"
                      >
                        <Icon
                          icon="solar:menu-dots-bold"
                          width="20"
                          height="20"
                        />
                      </button>

                      <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0] ?? null;

                          setMenuOpen(false);

                          if (file) {
                            await handleSendMessage({ file });
                          }

                          e.target.value = ""; // allow re-selecting the same file later
                        }}
                      />

                      {menuOpen && (
                        <div className="absolute right-0 top-11 z-50 w-42.5 overflow-hidden rounded-xl border border-gray-100 bg-white p-1 shadow-lg">
                          <button
                            type="button"
                            onClick={() => imageInputRef.current?.click()}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-gray-700 transition hover:bg-[#f9e8ef] hover:text-[#ca2e6b]"
                          >
                            <Icon
                              icon="boxicons:image"
                              width="19"
                              height="19"
                            />

                            <span>Image</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setMenuOpen(false);

                              if (isRecording) {
                                stopRecording();
                              } else {
                                startRecording();
                              }
                            }}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-gray-700 transition hover:bg-[#f9e8ef] hover:text-[#ca2e6b]"
                          >
                            <Icon
                              icon={
                                isRecording
                                  ? "boxicons:stop-circle"
                                  : "boxicons:microphone"
                              }
                              width="19"
                              height="19"
                            />

                            <span>
                              {isRecording ? "Stop Recording" : "Voice Note"}
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Messages */}
                {/* Messages */}
                <div className="flex flex-1 flex-col overflow-y-auto px-5 py-6">
                  {loadingThread ? (
                    <div className="text-center text-sm text-gray-500">
                      Loading messages...
                    </div>
                  ) : (
                    <div className="space-y-7">
                      {(selectedConversationId === null ? [] : threadMessages)
                        .filter(
                          (message) =>
                            !isCallControlMessage(message.message_text),
                        )
                        .map((message) => {
                          const isMe = message.sender_id === myId;
                          const callLogDetail = videoCallLogDetail(
                            message.message_text,
                          );
                          const isAudio = message.file?.match(
                            /\.(webm|mp3|wav|m4a|ogg)$/i,
                          );
                          const isImage = message.file?.match(
                            /\.(png|jpe?g|gif|webp)$/i,
                          );
                          const isVideo =
                            message.file?.match(/\.(mp4|mov|webm)$/i) &&
                            !isAudio;

                          return (
                            <div
                              key={message.id}
                              className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                            >
                              <div
                                className={`max-w-[75%] overflow-hidden rounded-[18px] text-sm ${
                                  callLogDetail
                                    ? "min-w-56 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-black/5"
                                    : `${message.file ? "" : "px-4 py-3"} ${
                                        isMe
                                          ? "rounded-tr-none bg-[#d9d9d9] text-gray-900"
                                          : "rounded-tl-none bg-[#f8dfe8] text-gray-900"
                                      }`
                                }`}
                              >
                                {callLogDetail ? (
                                  <div className="flex items-center gap-3">
                                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#f9e8ef] text-[#ca2e6b]">
                                      <Icon
                                        icon="boxicons:video"
                                        width="20"
                                        height="20"
                                      />
                                    </div>
                                    <div>
                                      <p className="font-semibold text-gray-900">
                                        Video call
                                      </p>
                                      <p className="mt-0.5 text-xs text-gray-500">
                                        {callLogDetail === "no answer"
                                          ? "No answer"
                                          : `Duration · ${callLogDetail}`}
                                      </p>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    {isImage && (
                                      <img
                                        src={message.file!}
                                        alt="Attachment"
                                        className="max-h-64 w-full object-cover"
                                      />
                                    )}

                                    {isVideo && (
                                      <video
                                        src={message.file!}
                                        controls
                                        className="max-h-64 w-full"
                                      />
                                    )}

                                    {isAudio && (
                                      <audio
                                        src={message.file!}
                                        controls
                                        className="m-2 h-9"
                                      />
                                    )}

                                    {!message.file && message.message_text}

                                    {message.file && message.message_text && (
                                      <p className="px-4 py-2">
                                        {message.message_text}
                                      </p>
                                    )}
                                  </>
                                )}
                              </div>

                              <span className="mt-2 text-[11px] text-gray-400">
                                {new Date(message.created_at).toLocaleString()}
                              </span>
                            </div>
                          );
                        })}

                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>
                {isRecording && (
                  <div className="border-t border-gray-100 px-4 py-3">
                    <div className="flex items-center gap-3 rounded-xl bg-red-50 p-3">
                      <span className="relative flex h-3 w-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                        <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
                      </span>

                      <span className="flex-1 text-sm font-medium text-red-600">
                        Recording voice note...
                      </span>

                      <button
                        type="button"
                        onClick={stopRecording}
                        className="flex items-center gap-1.5 rounded-full bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600"
                      >
                        <Icon
                          icon="boxicons:stop-circle"
                          width="16"
                          height="16"
                        />
                        Stop
                      </button>
                    </div>
                  </div>
                )}

                {voiceUrl && (
                  <div className="border-t border-gray-100 px-4 py-3">
                    <div className="flex items-center gap-3 rounded-xl bg-[#f9e8ef] p-3">
                      <Icon
                        icon="boxicons:microphone"
                        width="20"
                        height="20"
                        className="text-[#ca2e6b]"
                      />

                      <audio controls src={voiceUrl} className="h-9 flex-1" />

                      <button
                        type="button"
                        disabled={sending}
                        onClick={async () => {
                          if (!voiceBlob) return;

                          try {
                            const wavBlob = await blobToWav(voiceBlob);
                            const file = new File(
                              [wavBlob],
                              `voice-note-${Date.now()}.wav`,
                              {
                                type: "audio/wav",
                              },
                            );

                            await handleSendMessage({ file });
                          } catch (error) {
                            console.error("Voice conversion error:", error);
                            showToast(getApiMessage(error), "error");
                          } finally {
                            URL.revokeObjectURL(voiceUrl);
                            setVoiceUrl(null);
                            setVoiceBlob(null);
                          }
                        }}
                        className="text-[#ca2e6b] disabled:opacity-60"
                      >
                        <Icon icon="boxicons:send" width="20" height="20" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          URL.revokeObjectURL(voiceUrl);
                          setVoiceUrl(null);
                          setVoiceBlob(null);
                        }}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Icon icon="boxicons:x" width="20" height="20" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Message Input */}
                <div className="border-t border-gray-100 p-4">
                  <div className="flex items-center gap-3 rounded-full bg-[#f9e8ef] px-4 py-2">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !sending) {
                          handleSendMessage();
                        }
                      }}
                      placeholder="Write a message..."
                      className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
                    />

                    <button
                      type="button"
                      onClick={() => handleSendMessage()}
                      disabled={sending || !messageText.trim()}
                      className="grid h-9 w-9 place-items-center rounded-full bg-linear-to-r from-[#ca2e6b] to-[#67307d] text-white disabled:opacity-60"
                    >
                      <Icon icon="boxicons:send" width="18" height="18" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Empty state */
              <div className="grid min-h-125 place-items-center text-center">
                <div>
                  <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl bg-[#f9e8ef] text-[#ca2e6b]">
                    <MessageCircle />
                  </div>

                  <h3 className="font-semibold">
                    Select a conversation to start messaging
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Choose a match on your list and enjoy the app...
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {videoCallOpen &&
        videoCallChannelName &&
        selectedOtherUser &&
        myId !== null && (
          <Suspense fallback={<div>Loading video call...</div>}>
            <VideoCall
              myId={myId}
              channelName={videoCallChannelName}
              isCaller={videoCallIsCaller}
              receiver={selectedOtherUser}
              onClose={() => {
                setVideoCallOpen(false);
                setVideoCallConversationId(null);
                setVideoCallCallId(null);
                setVideoCallChannelName(null);
              }}
              onCallEnd={recordVideoCallEnd}
              onError={(message) => showToast(message, "error")}
            />
          </Suspense>
        )}
    </>
  );
}
