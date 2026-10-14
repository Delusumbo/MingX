import { ApiRequestError, getApiMessage } from "../utils/apiMessages";
import { API_URL } from "./apiConfig";

export type CallCredentials = {
	appId: string;
	channel: string;
	token: string | null;
	uid: number;
};

type CallTokenResponse = {
	app_id: string;
	channel: string;
	token: string;
	uid: number;
};

// Dev-only: an Agora project in "testing mode" (App ID, no certificate) lets two
// browsers call each other without the backend token endpoint.
const DEV_AGORA_APP_ID = import.meta.env.VITE_AGORA_APP_ID as string | undefined;

// Both participants must land on the same channel regardless of who calls whom
function channelFor(userA: number, userB: number) {
	return `mingx_call_${Math.min(userA, userB)}_${Math.max(userA, userB)}`;
}

export async function getCallCredentials(
	myId: number,
	receiverId: number,
): Promise<CallCredentials> {
	if (DEV_AGORA_APP_ID) {
		return { appId: DEV_AGORA_APP_ID, channel: channelFor(myId, receiverId), token: null, uid: myId };
	}

	const token = localStorage.getItem("token");

	const response = await fetch(`${API_URL}calls/token`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			...(token ? { Authorization: `Bearer ${token}` } : {}),
		},
		body: JSON.stringify({ receiver_id: receiverId }),
	});

	const data = await response.json().catch(() => null);

	if (!response.ok) {
		throw new ApiRequestError(getApiMessage(data, "Unable to start the video call."));
	}

	const payload: CallTokenResponse = data?.data ?? data;

	return {
		appId: payload.app_id,
		channel: payload.channel,
		token: payload.token,
		uid: payload.uid,
	};
}
