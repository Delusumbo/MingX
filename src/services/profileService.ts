const API_URL = "https://app.mingxdating.com/backend_staging/api/";

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
		throw new Error(data.message || "Failed to update profile");
	}

	return data;
}
