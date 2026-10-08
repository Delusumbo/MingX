export const API_MESSAGE_FALLBACK = "The request could not be completed. Please try again.";

export class ApiRequestError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "ApiRequestError";
	}
}

export function parseApiResponseBody(responseText: string): unknown {
	if (!responseText) return null;
	try {
		return JSON.parse(responseText);
	} catch {
		return responseText;
	}
}

function firstErrorMessage(value: unknown): string | null {
	if (typeof value === "string" && value.trim()) return value.trim();
	if (Array.isArray(value)) {
		for (const item of value) {
			const message = firstErrorMessage(item);
			if (message) return message;
		}
	}
	if (typeof value === "object" && value !== null) {
		for (const item of Object.values(value)) {
			const message = firstErrorMessage(item);
			if (message) return message;
		}
	}
	return null;
}

export function getApiMessage(value: unknown, fallback = API_MESSAGE_FALLBACK): string {
	if (value instanceof ApiRequestError) return value.message;
	if (value instanceof Error) return fallback;
	if (typeof value === "string" && value.trim()) return value.trim();
	if (typeof value !== "object" || value === null) return fallback;

	const record = value as Record<string, unknown>;
	const message = firstErrorMessage(record.message) ?? firstErrorMessage(record.error);
	if (message) return message;
	if (record.errors !== undefined) {
		const validationMessage = firstErrorMessage(record.errors);
		if (validationMessage) return validationMessage;
	}
	if (record.data !== undefined) return getApiMessage(record.data, fallback);

	return fallback;
}
