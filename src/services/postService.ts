import { ApiRequestError, getApiMessage } from "../utils/apiMessages";
import { API_URL } from "./apiConfig";

function authHeaders(): HeadersInit {
	const token = localStorage.getItem("token");

	return {
		Accept: "application/json",
		...(token ? { Authorization: `Bearer ${token}` } : {}),
	};
}

async function request(endpoint: string, init: RequestInit = {}): Promise<unknown> {
	const response = await fetch(`${API_URL}${endpoint}`, {
		...init,
		headers: {
			...authHeaders(),
			...(init.headers ?? {}),
		},
	});

	const responseText = await response.text();

	let data: unknown = null;

	if (responseText) {
		try {
			data = JSON.parse(responseText);
		} catch {
			if (response.ok) {
				throw new ApiRequestError(getApiMessage(null));
			}

			data = { message: responseText };
		}
	}

	if (!response.ok) {
		throw new ApiRequestError(getApiMessage(data));
	}

	return data;
}

// GET ALL POSTS
export function getPosts(): Promise<unknown> {
	return request("posts");
}

// GET SINGLE POST
export function getPost(postId: string | number): Promise<unknown> {
	return request(`posts/${encodeURIComponent(String(postId))}`);
}

// CREATE POST
export function addPost(thought: string, content: string, file: File): Promise<unknown> {
	const formData = new FormData();

	formData.append("thought", thought);
	formData.append("content", content);
	formData.append("file", file);
	console.log("FormData", thought); // Debugging line to check FormData contents

	return request("posts", {
		method: "POST",
		body: formData,
	});
}

// DELETE POST
export function deletePost(postId: string | number): Promise<unknown> {
	return request(`posts/${encodeURIComponent(String(postId))}`, {
		method: "DELETE",
	});
}

// GET COMMENTS
export function getComments(postId: string | number): Promise<unknown> {
	return request(`posts/${encodeURIComponent(String(postId))}/comments`);
}

// ADD COMMENT
export function addComment(
	postId: string | number,
	content: string,
	parentId?: string | number,
): Promise<unknown> {
	const formData = new FormData();

	formData.append("content", content);

	if (parentId !== undefined) {
		formData.append("parent_id", String(parentId));
	}

	return request(`posts/${encodeURIComponent(String(postId))}/comments`, {
		method: "POST",
		body: formData,
	});
}

// LIKE POST
export function likePost(postId: string | number): Promise<unknown> {
	return request(`posts/${encodeURIComponent(String(postId))}/like`, {
		method: "POST",
	});
}

// UNLIKE POST
export function unlikePost(postId: string | number): Promise<unknown> {
	return request(`posts/${encodeURIComponent(String(postId))}/like`, {
		method: "DELETE",
	});
}
