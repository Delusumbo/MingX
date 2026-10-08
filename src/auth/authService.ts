import {
	ApiRequestError,
	getApiMessage,
	parseApiResponseBody,
} from "../utils/apiMessages";

const API_URL = import.meta.env.DEV
	? "/api/"
	: "https://app.mingxdating.com/backend/public/api/";
const DELETE_REQUEST_URL = import.meta.env.DEV
	? "/mingxlive-api/delete/request"
	: "https://mingxlive.com/backend/public/api/delete/request";

export async function requestAccountDeletion(email: string): Promise<unknown> {
	const response = await fetch(DELETE_REQUEST_URL, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: new URLSearchParams({ email }),
	});

	const responseText = await response.text();
	const responseData = parseApiResponseBody(responseText);

	if (!response.ok) {
		throw new ApiRequestError(getApiMessage(responseData));
	}

	return responseData;
}

export async function registerUser(formData: FormData) {
	const response = await fetch(`${API_URL}signup`, {
		method: "POST",
		headers: {
			Accept: "application/json",
		},
		body: formData,
	});

	const data = await response.json();

	if (!response.ok) {
		throw new ApiRequestError(getApiMessage(data));
	}

	return data;
}

export async function loginUser(email: string) {
	const response = await fetch(`${API_URL}signup`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			email,
		}),
	});

	const data = await response.json();

	if (!response.ok) {
		throw new ApiRequestError(getApiMessage(data));
	}

	

	return data;
}

export const verifyOtp = async (email: string, otp: string) => {
	const response = await fetch(`${API_URL}verify-otp`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			email,
			otp,
		}),
	});

	const data = await response.json();

	if (!response.ok) {
		throw new ApiRequestError(getApiMessage(data));
    }
    
    if (data.token) {
			localStorage.setItem("token", data.token);
		}

		if (data.user) {
			localStorage.setItem("user", JSON.stringify(data.user));
		}

	return data;
};

export async function deleteAccount(): Promise<unknown> {
	const token = getToken();
	if (!token) {
		throw new ApiRequestError(getApiMessage(null));
	}

	const response = await fetch(`${API_URL}delete-account`, {
		method: "DELETE",
		headers: {
			Accept: "application/json",
			Authorization: `Bearer ${token}`,
		},
	});

	const responseText = await response.text();
	const responseData = parseApiResponseBody(responseText);

	if (!response.ok) {
		throw new ApiRequestError(getApiMessage(responseData));
	}

	return responseData;
}

export function logout() {
	localStorage.removeItem("token");
	localStorage.removeItem("user");
}

export function getToken() {
	return localStorage.getItem("token");
}

export function isAuthenticated() {
	return !!getToken();
}
