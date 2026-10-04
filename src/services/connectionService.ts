const API_URL = "https://app.mingxdating.com/backend_staging/api/";

export type ApiConnection = {
	id: number;
	name: string;
	dob: string | null;
	phone: string | null;
	gender: string | null;
	lookingfor: string | null;
	goal: string | null;
	yourinterest: string | null;
	height: string | null;
	weight: string | null;
	belief: string | null;
	sexual_orientation: string | null;
	zodiac_sign: string | null;
	education_level: string | null;
	doyoudrink: string | null;
	doyouSmoke: string | null;
	profilepicture: string | null;
	images: string | null;
	maritalstatus: string | null;
	doyouhavekids: string | null;
	bio: string | null;
	email: string | null;
	state: string | null;
	country: string | null;
	usertype: string | null;
	status: string | null;
	is_verified: boolean | null;
	is_premium: boolean | null;

	has_conversation: boolean;
	conversation_id: number | null;
};

function authHeaders(): HeadersInit {
	const token = localStorage.getItem("token");

	return {
		Accept: "application/json",
		...(token
			? {
					Authorization: `Bearer ${token}`,
				}
			: {}),
	};
}

export async function getAllYourMatches(): Promise<ApiConnection[]> {
	const response = await fetch(`${API_URL}allyourmatch`, {
		method: "GET",
		headers: authHeaders(),
	});

	const responseText = await response.text();

	let data: unknown = null;

	if (responseText) {
		try {
			data = JSON.parse(responseText);
		} catch {
			throw new Error("The connections API returned an invalid response.");
		}
	}

	if (!response.ok) {
		const message =
			typeof data === "object" && data !== null && "message" in data
				? String(data.message)
				: "Failed to load connections.";

		throw new Error(message);
	}

	if (Array.isArray(data)) {
		return data as ApiConnection[];
	}

	if (
		typeof data === "object" &&
		data !== null &&
		"data" in data &&
		Array.isArray((data as { data: unknown }).data)
	) {
		return (data as { data: ApiConnection[] }).data;
	}

	return [];
}
