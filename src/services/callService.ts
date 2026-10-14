import { ApiRequestError } from "../utils/apiMessages";

export type CallCredentials = {
	appId: string;
	channel: string;
	token: string | null;
	uid: number;
};

const AGORA_APP_ID = import.meta.env.VITE_AGORA_APP_ID;

// Both participants must land on the same channel regardless of who calls whom
function channelFor(userA: number, userB: number) {
	return `mingx_call_${Math.min(userA, userB)}_${Math.max(userA, userB)}`;
}

export async function getCallCredentials(
	myId: number,
	receiverId: number,
): Promise<CallCredentials> {
	if (!AGORA_APP_ID) {
		throw new ApiRequestError(
			"Video calling is not configured. Set VITE_AGORA_APP_ID to your Agora App ID.",
		);
	}

	return {
		appId: AGORA_APP_ID,
		channel: channelFor(myId, receiverId),
		token: null,
		uid: myId,
	};
}
