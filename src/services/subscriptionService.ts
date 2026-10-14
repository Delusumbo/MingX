import { ApiRequestError, getApiMessage } from "../utils/apiMessages";
import { API_URL } from "./apiConfig";

async function requestSubscription(path: string, body: Record<string, unknown>): Promise<unknown> {
	const token = localStorage.getItem("token");
	const response = await fetch(`${API_URL}${path}`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			...(token ? { Authorization: `Bearer ${token}` } : {}),
		},
		body: JSON.stringify(body),
	});

	const responseText = await response.text();
	let data: unknown = null;

	if (responseText) {
		try {
			data = JSON.parse(responseText);
		} catch {
			if (response.ok) {
				throw new ApiRequestError(getApiMessage(null));
			}

			data = { message: responseText };
		}
	}

	if (!response.ok) {
		throw new ApiRequestError(getApiMessage(data));
	}

	return data;
}

export function createSubscription(cardNonce: string): Promise<unknown> {
	return requestSubscription("subscription/create", {
		card_nonce: cardNonce,
		platform: "android",
	});
}

export function cancelSubscription(): Promise<unknown> {
	return requestSubscription("subscriptions/cancel", {
		platform: "web",
		immediately: true,
	});
}
