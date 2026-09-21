const API_URL = "https://app.mingxdating.com/backend_staging/api/";

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
		throw new Error(data.message || "Registration failed");
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
		throw new Error(data.message || "Login failed");
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
		throw new Error(data.message || "Invalid verification code.");
    }
    
    if (data.token) {
			localStorage.setItem("token", data.token);
		}

		if (data.user) {
			localStorage.setItem("user", JSON.stringify(data.user));
		}

	return data;
};

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
