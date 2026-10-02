const API_URL = "https://app.mingxdating.com/backend_staging/api";

function authHeaders(): HeadersInit {
	const token = localStorage.getItem("token");

	return {
		Accept: "application/json",
		...(token ? { Authorization: `Bearer ${token}` } : {}),
	};
}

async function request(endpoint: string, init: RequestInit = {}): Promise<unknown> {
	const response = await fetch(`${API_URL}/${endpoint}`, {
		...init,
		headers: {
			...authHeaders(),
			...(init.headers ?? {}),
		},
	});

	const responseText = await response.text();

	let data: unknown = null;

	if (responseText) {
		try {
			data = JSON.parse(responseText);
		} catch {
			data = responseText;
		}
	}

	if (!response.ok) {
		const message =
			typeof data === "object" && data !== null && "message" in data
				? String(data.message)
				: `Community request failed (${response.status}).`;

		throw new Error(message);
	}

	return data;
}

// 1. GET ALL COMMUNITIES
export function getCommunities(region?: string): Promise<unknown> {
	const params = new URLSearchParams();

	if (region?.trim()) {
		params.append("region", region.trim());
	}

	const query = params.toString();

	return request(`communities${query ? `?${query}` : ""}`);
}

// 2. GET SINGLE COMMUNITY
export function getCommunity(communityId: number | string): Promise<unknown> {
	return request(`communities/${encodeURIComponent(String(communityId))}`);
}

// 3. SEARCH COMMUNITIES
export function searchCommunities(q?: string, region?: string): Promise<unknown> {
	const params = new URLSearchParams();

	if (q?.trim()) {
		params.append("q", q.trim());
	}

	if (region?.trim()) {
		params.append("region", region.trim());
	}

	const query = params.toString();

	return request(`communities/search${query ? `?${query}` : ""}`);
}

// 4. CREATE COMMUNITY
export function createCommunity(data: {
	name: string;
	description?: string;
	region: string;
	image?: File | null;
}): Promise<unknown> {
	const formData = new FormData();

	formData.append("name", data.name);
	formData.append("description", data.description ?? "");
	formData.append("region", data.region);

	if (data.image) {
		formData.append("image", data.image);
	}

	return request("communities/create", {
		method: "POST",
		body: formData,
	});
}

// 5. CHECK MEMBERSHIP
export function checkCommunityMembership(communityId: number | string): Promise<unknown> {
	return request(`communities/${encodeURIComponent(String(communityId))}/membership`);
}

// 6. JOIN COMMUNITY
export function joinCommunity(communityId: number | string): Promise<unknown> {
	return request(`communities/${encodeURIComponent(String(communityId))}/join`, { method: "POST" });
}

// 7. LEAVE COMMUNITY
export function leaveCommunity(communityId: number | string): Promise<unknown> {
	return request(`communities/${encodeURIComponent(String(communityId))}/leave`, {
		method: "POST",
	});
}

// 8. GET COMMUNITY MESSAGES
export function getCommunityMessages(communityId: number | string): Promise<unknown> {
	return request(`communities/${encodeURIComponent(String(communityId))}/messages`);
}

// 9. SEND COMMUNITY MESSAGE
export function sendCommunityMessage(
	communityId: number | string,
	messageText: string,
	file?: File | null,
): Promise<unknown> {
	const formData = new FormData();

	formData.append("message_text", messageText);

	if (file) {
		formData.append("file", file);
	}

	return request(`communities/${encodeURIComponent(String(communityId))}/messages`, {
		method: "POST",
		body: formData,
	});
}
