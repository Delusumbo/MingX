importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyB_P9ZxKStvDmG0pcWN8jN4AKEqmxdAGMI",
  authDomain: "mingxchat.firebaseapp.com",
  projectId: "mingxchat",
  storageBucket: "mingxchat.firebasestorage.app",
  messagingSenderId: "656991145702",
  appId: "1:656991145702:web:862e5e1a48496a7eceb527",
});

const messaging = firebase.messaging();

// Handle background data payloads
messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Background message received: ", payload);

  const callerName = payload.data?.callerName || "Someone";
  const channelName = payload.data?.channelName || payload.data?.roomId || "";
  const callerId = payload.data?.callerId || "";
  const callerAvatar = payload.data?.callerAvatar || "";

  const notificationTitle = "Incoming Video Call";
  const notificationOptions = {
    body: `${callerName} is calling you...`,
    icon: "/favicon.ico",
    tag: `call-${channelName || callerId || Date.now()}`,
    renotify: true,
    requireInteraction: true,
    data: {
      channelName,
      callerId,
      callerName,
      callerAvatar,
    },
    actions: [
      { action: "answer", title: "✅ Answer" },
      { action: "decline", title: "❌ Decline" }
    ]
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification button clicks (Answer / Decline)
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const callData = event.notification.data || {};

  if (event.action === "decline") {
    console.log("Call declined:", callData);
    return;
  }

  const targetUrl = "/matches";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin)) {
          client.postMessage({
            type: "NAVIGATE_TO_ROOM",
            channelName: callData.channelName,
            callerId: callData.callerId,
            callerName: callData.callerName,
            callerAvatar: callData.callerAvatar,
          });
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});