import { ApiRequestError, getApiMessage } from "../utils/apiMessages";

const API_URL = import.meta.env.DEV
	? "/api/"
	: "https://app.mingxdating.com/backend/public/api/";

export type ApiPerson = {
	id: number;
	name: string;
	dob: string;
	phone: string;
	gender: string;
	lookingfor: string;
	goal: string;
	yourinterest: string;
	height: string;
	weight: string;
	belief: string;
	sexual_orientation: string;
	zodiac_sign: string;
	education_level: string;
	doyoudrink: string;
	doyouSmoke?: string;
	doyouhavekids: string;
	profilepicture: string | null;
	images: string;
	maritalstatus: string;
	bio: string;
	email: string;
	state: string | null;
	country: string | null;
	usertype: string;
	is_premium: boolean | null;
	status: string;
	latitude?: number | string | null;
	longitude?: number | string | null;
};

export type DiscoverResponse = ApiPerson | { isblur: boolean };

export async function getPeople(): Promise<DiscoverResponse[]> {
	const token = localStorage.getItem("token");

	const response = await fetch(`${API_URL}getRandomUsers`, {
		method: "GET",
		headers: {
			Accept: "application/json",
			...(token
				? {
						Authorization: `Bearer ${token}`,
					}
				: {}),
		},
	});

	const data = await response.json();
	

	if (!response.ok) {
		throw new ApiRequestError(getApiMessage(data));
	}

	return data;
}
