// src/services/callService.ts
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { getApps, initializeApp } from "firebase/app";
import {
  ApiRequestError,
} from "../utils/apiMessages";
import {
  get,
  getDatabase,
  onValue,
  ref,
  serverTimestamp,
  set,
  update,
  type Unsubscribe,
} from "firebase/database";
import { getStoredUser, getToken   } from "../auth/authService";
import { getCurrentUserId } from "./messageService";

const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    "AIzaSyB_P9ZxKStvDmG0pcWN8jN4AKEqmxdAGMI",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mingxchat.firebaseapp.com",
  databaseURL:
    import.meta.env.VITE_FIREBASE_DATABASE_URL ||
    "https://mingxchat-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mingxchat",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "mingxchat.firebasestorage.app",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "656991145702",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    "1:656991145702:web:862e5e1a48496a7eceb527",
};

const app =
  getApps().find((item) => item.name === "mingx-call-alerts") ??
  initializeApp(firebaseConfig, "mingx-call-alerts");

const database = getDatabase(app);
let authPromise: Promise<void> | null = null;

export function ensureFirebaseAuth(): Promise<void> {
  const myId = getCurrentUserId();
  if (!myId) return Promise.reject(new Error("Not signed in."));

  const auth = getAuth(app);
  if (auth.currentUser?.uid === String(myId)) return Promise.resolve();

  // Reuse one in-flight request so parallel callers don't each fetch a token.
  authPromise ??= (async () => {
    const authToken = getToken ();
if (!authToken) throw new Error("Missing auth token.");

    const res = await fetch(
      "https://app.mingxdating.com/backend/public/api/firebase/token",
      {
        method: "POST", // or GET, whichever the endpoint expects
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      },
    );
    if (!res.ok) throw new Error(`Firebase token request failed (${res.status})`);

    const { firebase_token } = await res.json();
    if (!firebase_token) throw new Error("Backend returned no Firebase token.");

    await signInWithCustomToken(auth, firebase_token);
  })().finally(() => {
    authPromise = null;
  });

  return authPromise;
}

export const CALL_INVITE_MAX_AGE_MS = 60_000;
export const CALL_INVITE_PREFIX = "[[mingx:video-call:v2:";
export const CALL_SETUP_PREFIX = "[[mingx:video-call:setup:v1:";

export type IncomingCallNotification = {
  type: "incoming_call";
  call_id: string;
  caller_id: number;
  caller_name: string;
  receiver_id?: number;
  channel_name: string;
  status: "ringing" | "accepted" | "declined" | "ended";
  timestamp: number;
};

export type CallCredentials = {
  appId: string;
  channelName: string;
  token: string | null;
  uid: number;
};

export type FirebaseCallIdentity = {
  id: number;
  name: string;
};

export async function authenticateFirebaseCall(): Promise<FirebaseCallIdentity> {
  await ensureFirebaseAuth();
  const myId = getCurrentUserId();
  const stored = getStoredUser();

  if (!myId) {
    throw new ApiRequestError("Please sign in again before starting a video call.");
  }

  return {
    id: myId,
    name: stored.name || "MingX user",
  };
}

export function callInviteMessage(conversationId: number, callId: string): string {
  return `${CALL_INVITE_PREFIX}${conversationId}:${callId}:${callChannelName(conversationId, callId)}]]`;
}

export function callSetupMessage(callId: string): string {
  return `${CALL_SETUP_PREFIX}${callId}]]`;
}

export function callDeclineMessage(callId: string): string {
  return `${CALL_INVITE_PREFIX}declined:${callId}]]`;
}

export function isCallControlMessage(message: string): boolean {
  return (
    message.startsWith(CALL_INVITE_PREFIX) ||
    (message.startsWith(CALL_SETUP_PREFIX) && message.endsWith("]]"))
  );
}

/**
 * Write call notification record directly to call_notifications/{receiverId}
 * This triggers Firebase (both Cloud Function FCM push and RTDB listeners)
 */
export async function writeIncomingCallNotification(input: {
  receiverId: number | string;
  callerId: number;
  callerName?: string;
  callId: string;
  channelName: string;
}): Promise<void> {
 
  const storedUser = getStoredUser();

  const notification = {
    type: "incoming_call",
    call_id: input.callId,
    caller_id: input.callerId,
    caller_name: input.callerName ?? storedUser.name ?? "MingX user",
    receiver_id: Number(input.receiverId),
    channel_name: input.channelName,
    status: "ringing",
    timestamp: serverTimestamp(),
  };

  try {
    await ensureFirebaseAuth();
    await set(
      ref(database, `call_notifications/${input.receiverId}`),
      notification,
    );
  } catch (error) {
    console.warn("Could not write call notification to Firebase:", error);
  }
}

/**
 * Subscribe directly to call_notifications/{userId} to receive incoming calls in real-time
 */
export async function listenForIncomingCall(
  userId: number | string,
  onIncomingCall: (call: IncomingCallNotification | null) => void,
  onError?: (error: Error) => void,
): Promise<Unsubscribe> {
  try {
    await ensureFirebaseAuth();
    return onValue(
      ref(database, `call_notifications/${userId}`),
      (snapshot) => {
        const value = snapshot.val();

        if (
          !value ||
          value.type !== "incoming_call" ||
          !value.call_id ||
          !value.channel_name ||
          value.status !== "ringing"
        ) {
          onIncomingCall(null);
          return;
        }

        onIncomingCall(value as IncomingCallNotification);
      },
      (error) => onError?.(error),
    );
  } catch (error) {
    onError?.(error as Error);
    return () => {};
  }
}

export async function endIncomingCallNotification(
  receiverId: number | string,
  callId: string,
): Promise<void> {
  try {
    await ensureFirebaseAuth();
    const notificationRef = ref(
      database,
      `call_notifications/${receiverId}`,
    );

    const snapshot = await get(notificationRef);
    const current = snapshot.val();

    if (current?.call_id !== callId) return;

    await update(notificationRef, {
      status: "ended",
      ended_at: serverTimestamp(),
    });
  } catch (error) {
    console.warn("Could not update end call status in Firebase:", error);
  }
}

export async function updateIncomingCallStatus(
  userId: number | string,
  callId: string,
  status: "accepted" | "declined",
): Promise<void> {
  try {
    await ensureFirebaseAuth();
    const notificationRef = ref(database, `call_notifications/${userId}`);
    const snapshot = await get(notificationRef);
    const current = snapshot.val();
    if (current?.call_id !== callId) return;

    await update(notificationRef, {
      status,
      [`${status}_at`]: serverTimestamp(),
    });
  } catch (error) {
    console.warn("Could not update incoming call status in Firebase:", error);
  }
}

export function callChannelName(
  conversationId: number,
  callId: string,
): string {
  return `video_call_${conversationId}_${callId}`;
}

export async function getCallCredentials(
  myId: number,
  channelName: string,
): Promise<CallCredentials> {
  const appId = import.meta.env.VITE_AGORA_APP_ID;

  if (!appId) {
    throw new Error("VITE_AGORA_APP_ID is not configured.");
  }

  return {
    appId,
    channelName,
    token: null,
    uid: myId,
  };
}