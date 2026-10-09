import { ApiRequestError, getApiMessage } from "../utils/apiMessages";
import { API_URL } from "./apiConfig";

export async function getLikedUsers() {
	const token = localStorage.getItem("token");

	const response = await fetch(`${API_URL}getLikes`, {
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
