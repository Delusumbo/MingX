const API_URL = "https://app.mingxdating.com/backend_staging/api/";

async function apiRequest(endpoint: string, userId: number, field: string) {
	const token = localStorage.getItem("token");

	const response = await fetch(`${API_URL}${endpoint}`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			...(token
				? {
						Authorization: `Bearer ${token}`,
					}
				: {}),
		},
		body: JSON.stringify({
			[field]: String(userId),
		}),
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(typeof data === "string" ? data : data.message || "Request failed");
	}

	return data;
}

export async function likeUser(userId: number) {
	return apiRequest("likesomeone", userId, "whowasliked");
}

export async function unlikeUser(userId: number) {
	return apiRequest("unlikesomeone", userId, "whotounlike");
}