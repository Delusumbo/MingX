const API_URL = "https://app.mingxdating.com/backend_staging/api/";

function authHeaders(extra: Record<string, string> = {}) {
	const token = localStorage.getItem("token");

	return {
		Accept: "application/json",
		...extra,
		...(token ? { Authorization: `Bearer ${token}` } : {}),
	};
}

// TODO: confirm real source of current user id (JWT claim / stored value / etc.)
export function getCurrentUserId(): number | null {
	const storedUser = localStorage.getItem("user");

	if (!storedUser) return null;

	try {
		const user = JSON.parse(storedUser);
		return user?.id ?? null;
	} catch {
		return null;
	}
}

export type ApiUser = {
	id: number;
	name: string;
	profilepicture: string | null;
	images: string;
	state: string | null;
	country: string | null;
};

export type ApiConversation = {
	id: number;
	sender_id: number;
	receiver_id: number;
	last_chat_read_time: string | null;
	created_at: string;
	updated_at: string;
	unread_messages_count: number;
	last_message_from_recipient: unknown;
	sender: ApiUser;
	receiver: ApiUser;
};

export type ApiMessage = {
	id: number;
	conversation_id: number;
	sender_id: number;
	message_text: string;
	file: string | null;
	status: "read" | "unread";
	created_at: string;
	updated_at: string;
};

export async function getConversations(): Promise<ApiConversation[]> {
	const response = await fetch(`${API_URL}conversations`, {
		method: "GET",
		headers: authHeaders(),
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data?.message || "Unable to load conversations.");
	}

	return data?.data ?? data;
}

export async function getMessages(conversationId: number): Promise<ApiMessage[]> {
	const response = await fetch(`${API_URL}conversations/${conversationId}/messages`, {
		method: "GET",
		headers: authHeaders(),
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data?.message || "Unable to load messages.");
	}

	return data?.data ?? data;
}

type SendMessageInput = {
	receiverId: number;
	messageText: string;
	file?: File | null;
};

export async function sendMessage({ receiverId, messageText, file }: SendMessageInput) {
	const formData = new FormData();

	formData.append("receiver_id", String(receiverId));
	formData.append("message_text", messageText);

	if (file) {
		formData.append("file", file);
	}

	const response = await fetch(`${API_URL}messages`, {
		method: "POST",
		headers: authHeaders(), // no Content-Type — browser sets multipart boundary
		body: formData,
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data?.message || "Unable to send message.");
	}

	return data;
}