function asRecord(value: unknown): Record<string, unknown> | null {
	return typeof value === "object" && value !== null && !Array.isArray(value)
		? (value as Record<string, unknown>)
		: null;
}

function isEnabled(value: unknown): boolean {
	return (
		value === true ||
		value === 1 ||
		(typeof value === "string" && ["1", "true", "yes", "active"].includes(value.trim().toLowerCase()))
	);
}

export function isPremiumUser(value: unknown): boolean {
	const record = asRecord(value);
	if (!record) return false;

	const directPremium = record.is_premium ?? record.isPremium;
	if (directPremium !== undefined && directPremium !== null) return isEnabled(directPremium);

	return [record.data, record.user, record.subscription].some((nested) => isPremiumUser(nested));
}

export function isCurrentUserPremium(): boolean {
	try {
		return isPremiumUser(JSON.parse(localStorage.getItem("user") || "null"));
	} catch {
		return false;
	}
}
