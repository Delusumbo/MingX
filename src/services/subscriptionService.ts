import { ApiRequestError, getApiMessage } from "../utils/apiMessages";

const API_URL = import.meta.env.DEV
	? "/api/"
	: "https://app.mingxdating.com/backend/public/api/";

export async function createSubscription(cardNonce: string): Promise<unknown> {
	const token = localStorage.getItem("token");
	const response = await fetch(`${API_URL}subscription/create`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			...(token ? { Authorization: `Bearer ${token}` } : {}),
		},
		body: JSON.stringify({ card_nonce: cardNonce, platform: "android" }),
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
