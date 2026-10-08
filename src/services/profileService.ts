import { ApiRequestError, getApiMessage } from "../utils/apiMessages";

const API_URL = import.meta.env.DEV
	? "/api/"
	: "https://app.mingxdating.com/backend/public/api/";

export async function updateProfile(formData: FormData) {
	const token = localStorage.getItem("token");

	const response = await fetch(`${API_URL}updateprofile`, {
		method: "POST", // change to PUT/PATCH if your API requires it
		headers: {
			Accept: "application/json",
			...(token
				? {
						Authorization: `Bearer ${token}`,
					}
				: {}),
		},
		body: formData,
	});

	const data = await response.json();

	if (!response.ok) {
		throw new ApiRequestError(getApiMessage(data));
	}

	return data;
}
