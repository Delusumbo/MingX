export const API_URL =
	typeof window !== "undefined" && window.location.hostname === "localhost"
		? "https://app.mingxdating.com/backend_staging/api/"
		: "https://app.mingxdating.com/backend/public/api/";
