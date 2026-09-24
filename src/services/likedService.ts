const API_URL = "https://app.mingxdating.com/backend_staging/api/";

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
		throw new Error(data.message || "Failed to load liked users");
	}

	return data;
}
