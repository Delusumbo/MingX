
import { ApiRequestError, getApiMessage } from "../utils/apiMessages";

const API_URL = import.meta.env.DEV
	? "/api/"
	: "https://app.mingxdating.com/backend/public/api/";

export type ApiNotification = {
	id: number;
	user_id: number;
	title: string;
	notification: string;
	time: string;
	date: string;
	image: string;
	created_at: string;
	updated_at: string;
	datetime: string | null;
};

export async function getNotifications(): Promise<ApiNotification[]> {
	const token = localStorage.getItem("token");

	const response = await fetch(`${API_URL}viewnotification`, {
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
