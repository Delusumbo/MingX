const API_URL = "https://app.mingxdating.com/backend_staging/api/";

export async function createSubscription(cardNonce: string): Promise<unknown> {
	const token = localStorage.getItem("token");
	const response = await fetch(`${API_URL}subscription/create`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			...(token ? { Authorization: `Bearer ${token}` } : {}),
		},
		body: JSON.stringify({ card_nonce: cardNonce }),
	});

	const responseText = await response.text();
	let data: unknown = null;

	if (responseText) {
		try {
			data = JSON.parse(responseText);
		} catch {
			if (response.ok) {
				throw new Error("The subscription API returned an invalid response.");
			}

			data = { message: responseText };
		}
	}

	if (!response.ok) {
		const message =
			typeof data === "object" && data !== null && "message" in data
				? String(data.message)
				: `The subscription request failed (${response.status}).`;

		throw new Error(message);
	}

	return data;
}
