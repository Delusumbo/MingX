# React + TypeScript + Vite

## Video calling

When a user initiates a video call, the web app sends an authenticated POST
with no body to `firebase/token`, using the API Bearer token returned by OTP
verification. The response must contain the authenticated user's numeric `id`
and `name` (directly or under `data`/`user`); the app verifies the ID matches
the signed-in user and uses the identity for the call notification. Set
`VITE_AGORA_APP_ID` to the matching Agora App ID. Agora joining remains
tokenless; never put the Agora App Certificate in the web app.

Incoming mobile-call alerts are written directly to Firebase Realtime Database
at `call_notifications/{receiverId}`, matching the mobile test page. Configure
the Firebase web app values in `.env.local`, including the Realtime Database
URL, and enable the **Anonymous** provider in Firebase Console under
**Authentication > Sign-in method**. The client signs in anonymously because
the database rules require an authenticated Firebase user. The signed-in
caller's browser writes `type`, `call_id`, `caller_id`,
`caller_name`, `channel_name`, `status: "ringing"`, and a server timestamp.
When the call ends or is rejected, it updates the matching record to
`status: "ended"`. The database rules must authorize these writes; never make
the database publicly writable in production. The Firebase Cloud Function in
`functions/index.js` watches this path and sends an FCM notification to the
receiver's existing `users/{receiverId}/fcm_token`. The mobile app should register its own token in
that field; the web caller must not generate or overwrite the recipient's
token. Deploy the function with Firebase CLI after selecting the correct
Firebase project (`firebase use --add`, then `firebase deploy --only
functions:sendIncomingCallPush`). The function's service account sends through
Firebase Admin, so no FCM server key belongs in the web app. The receiver's
mobile app must handle the `incoming_call` data payload and open its accept/
reject call UI.

After OTP verification, the web app can request notification permission and
generate a browser FCM token. When a token is available, it sends
`{ "fcm_token": "..." }` to the authenticated `firebase/fcm-token` endpoint
using the API token returned by OTP verification. The FCM token is no longer
included in the signup request. Set `VITE_FIREBASE_VAPID_KEY` to the public Web
Push certificate key from Firebase Cloud Messaging, along with the Firebase web
config values. The backend should persist the token at
`users/{userId}/fcm_token` (with `userId` matching the app's numeric user ID)
so the call-notification function can look up `users/{receiverId}/fcm_token`.
The browser cannot securely write this user record directly: the FCM token is
for push delivery, not a Firebase Auth identity. The signup backend is not
included in this repository.

Call invitations are sent as hidden control messages through the existing chat
API, which creates the conversation if needed. The signed-in web app checks
recent conversations every five seconds and shows an Accept/Reject dialog
regardless of which protected page is open. This is best-effort polling, not a
push notification, and does not ring a receiver while the app is closed.

Mobile clients must use the same signaling and Agora parameters to interoperate:

- The web client sends a hidden invite through the existing message API in this
  exact format:
  `[[mingx:video-call:v2:<conversationId>:<callId>:video_call_<conversationId>_<callId>]]`.
- `callId` is generated once per call as the call-start timestamp in
  milliseconds. Mobile should parse the conversation ID, call ID, and full
  channel name from the invite and use that same channel after the user accepts.
- Use the current participant's numeric user ID as the Agora UID.
- Both clients must use the same Agora App ID and compatible token-auth settings.
- For a match with no existing conversation, the web client first sends a
  hidden setup marker to create one, then sends the complete v2 invite. Ignore
  setup markers; only show an incoming-call prompt for the complete v2 invite.
- Reject messages use
  `[[mingx:video-call:v2:declined:<callId>]]`.

The invitation and decline markers are stored as regular chat messages. Other
clients should filter these control messages from the visible chat history.
The Firebase web config is intended for clients; never put Firebase
service-account credentials or FCM server keys in the web app.

This tokenless setup is suitable only for testing. Production calls should use
an authenticated backend token endpoint and enable Agora token authentication.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
