// src/services/webPushService.ts

import { getApps, initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  isSupported,
} from "firebase/messaging";
import { getDatabase, ref, set } from "firebase/database";
import { ensureFirebaseAuth } from "./callService";



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

export async function generateWebFcmToken(): Promise<string | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }

  if (!(await isSupported())) {
    return null;
  }

  const vapidKey =
    import.meta.env.VITE_FIREBASE_VAPID_KEY ||
    "BFwXGk5kkz7DPdWiEvmjyIGYtHhtESZyMTDEqb5JJ7sEvr19MOdZXWvAGs15G8rz6QLqTaKUMjxMPntBxzo-41k";

  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    return null;
  }

  const registration = await navigator.serviceWorker.register(
    "/firebase-messaging-sw.js",
  );

  const messaging = getMessaging(app);

  const token = await getToken(messaging, {
    vapidKey,
    serviceWorkerRegistration: registration,
  });

  return token || null;
}

export async function saveUserFcmToken(
  userId: number | string,
  fcmToken: string,
): Promise<void> {
  try {
    await ensureFirebaseAuth();
    const db = getDatabase(app);
    await set(ref(db, `users/${userId}/fcm_token`), fcmToken);
  } catch (error) {
    console.warn("Could not write FCM token to Firebase RTDB:", error);
  }
}


export async function updateWebFcmToken(
  fcmToken: string,
  authToken: string,
): Promise<unknown> {
  const response = await fetch(
    "https://app.mingxdating.com/backend/public/api/firebase/fcm-token",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        fcm_token: fcmToken,
      }),
    },
  );

  const responseText = await response.text();

  let data: unknown;
  try {
    data = responseText ? JSON.parse(responseText) : null;
  } catch {
    data = responseText;
  }

  if (!response.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof data.message === "string"
        ? data.message
        : `Unable to register FCM token (HTTP ${response.status}).`;

    throw new Error(message);
  }

  return data;
}

export async function registerFcmTokenForUser(
  userId: number | string,
  authToken?: string,
): Promise<string | null> {
  try {
    const fcmToken = await generateWebFcmToken();
    if (fcmToken) {
      await saveUserFcmToken(userId, fcmToken);
      if (authToken) {
        await updateWebFcmToken(fcmToken, authToken).catch((err) =>
          console.warn("API FCM token update notice:", err)
        );
      }
      return fcmToken;
    }
  } catch (error) {
    console.warn("Could not register FCM token for user:", error);
  }
  return null;
}



