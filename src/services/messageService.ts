const API_URL = "https://app.mingxdating.com/backend_staging/api/";


export async function sendMessage(
	receiverId: number,
	messageText: string,
	file?: File | null,
) {
	const token = localStorage.getItem("token");

	const formData = new FormData();

	formData.append("receiver_id", String(receiverId));
	formData.append("message_text", messageText);

	if (file) {
		formData.append("file", file);
	}

	const response = await fetch(`${API_URL}message`, {
		method: "POST",
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

	let data: any;

	try {
		data = await response.json();
	} catch {
		throw new Error("Invalid response from server");
	}

	if (!response.ok) {
		throw new Error(data?.message || "Failed to send message");
	}

	return data;
}