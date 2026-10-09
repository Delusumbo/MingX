import {
	ApiRequestError,
	getApiMessage,
	parseApiResponseBody,
} from "../utils/apiMessages";
import { getToken } from "../auth/authService";
import { API_URL } from "./apiConfig";

const API_BASE_URL = `${API_URL}verification/`;

type VerificationAction = "start" | "complete" | "status";

async function verificationRequest(
	action: VerificationAction,
	options: { method: "GET" | "POST"; body?: FormData },
): Promise<unknown> {
	const token = getToken();
	if (!token) {
		throw new ApiRequestError("Please log in to verify your account.");
	}

	const response = await fetch(`${API_BASE_URL}${action}`, {
		method: options.method,
		headers: {
			Accept: "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: options.body,
	});

	const responseText = await response.text();
	const responseData = parseApiResponseBody(responseText);

	if (!response.ok) {
		throw new ApiRequestError(getApiMessage(responseData));
	}

	return responseData;
}

function findSessionReference(value: unknown): string | null {
	if (!value || typeof value !== "object") return null;

	if (Array.isArray(value)) {
		for (const item of value) {
			const reference = findSessionReference(item);
			if (reference) return reference;
		}
		return null;
	}

	const record = value as Record<string, unknown>;
	const reference = record.session_reference ?? record.sessionReference;
	if (typeof reference === "string" && reference.trim()) return reference.trim();

	for (const nested of Object.values(record)) {
		const nestedReference = findSessionReference(nested);
		if (nestedReference) return nestedReference;
	}
	return null;
}

export async function startFaceVerification(): Promise<{ sessionReference: string; response: unknown }> {
	const response = await verificationRequest("start", { method: "POST" });
	const sessionReference = findSessionReference(response);

	if (!sessionReference) {
		throw new ApiRequestError(
			getApiMessage(response, "The server did not return a verification session reference."),
		);
	}

	return { sessionReference, response };
}

export function getFaceVerificationStatus(): Promise<unknown> {
	return verificationRequest("status", { method: "GET" });
}

export function completeFaceVerification(
	sessionReference: string,
	selfie: File,
): Promise<unknown> {
	const body = new FormData();
	body.append("session_reference", sessionReference);
	body.append("selfie", selfie);

	return verificationRequest("complete", { method: "POST", body });
}
