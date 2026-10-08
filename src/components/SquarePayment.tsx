import { useEffect, useState } from "react";
import { getApiMessage } from "../utils/apiMessages";

declare global {
	interface Window {
		Square: any;
	}
}

type SquarePaymentProps = {
	amount?: number;
	onTokenReceived?: (token: string) => void | Promise<unknown>;
};

export default function SquarePayment({ amount = 10, onTokenReceived }: SquarePaymentProps) {
	const [card, setCard] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [processing, setProcessing] = useState(false);
	const [error, setError] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

	const appId = "sandbox-sq0idb-GFfOcndZWTu3-xV6cVopUQ";
	const locationId = "L130YCW3KZGY7";

	useEffect(() => {
		let mounted = true;
		let cardInstance: any = null;

		const initializeCard = async () => {
			try {
				setLoading(true);
				setError("");

				if (!window.Square) {
					throw new Error("Square payment SDK has not loaded.");
				}

				const payments = window.Square.payments(appId, locationId);

				cardInstance = await payments.card();

				if (!mounted) {
					await cardInstance.destroy();
					return;
				}

				await cardInstance.attach("#card-container");

				setCard(cardInstance);
				setLoading(false);
			} catch (err) {
				console.error("Square initialization error:", err);

				setError(getApiMessage(err));

				setLoading(false);
			}
		};

		initializeCard();

		return () => {
			mounted = false;

			if (cardInstance) {
				cardInstance.destroy().catch(() => {});
			}
		};
	}, []);

	const handlePayment = async () => {
		if (!card) return;

		try {
			setProcessing(true);
			setError("");

			/*
			 * These details allow Square to determine whether
			 * Strong Customer Authentication is required.
			 */
			const verificationDetails = {
				amount: amount.toFixed(2),

				billingContact: {
					givenName: "MingX",
					familyName: "User",
					email: JSON.parse(localStorage.getItem("user") || "{}")?.email || "",
					countryCode: "US",
				},

				currencyCode: "USD",

				intent: "CHARGE",

				customerInitiated: true,

				sellerKeyedIn: false,
			};

			const result = await card.tokenize(verificationDetails);

			if (result.status === "OK") {
				const token = result.token;

				console.log("Square payment token received:", token);

				const response = onTokenReceived ? await onTokenReceived(token) : null;
				setSuccessMessage(getApiMessage(response, "Request completed."));
			} else {
				const message =
					result.errors?.map((item: { message: string }) => item.message).join("\n") ||
					"The request could not be completed. Please try again.";

				setError(message);
			}
		} catch (err) {
			console.error("Payment error:", err);

			setError(getApiMessage(err));
		} finally {
			setProcessing(false);
		}
	};

	if (successMessage) {
		return (
			<div className="py-10 text-center">
				<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-2xl text-green-600">
					✓
				</div>

				<p role="status" className="mt-5 text-sm text-gray-700">{successMessage}</p>
			</div>
		);
	}

	return (
		<div>
			<div id="card-container" className="min-h-35" />

			{loading && <p className="mt-3 text-center text-sm text-gray-500">Loading payment form...</p>}

			{error && (
				<div className="mt-4 whitespace-pre-line rounded-xl bg-red-50 px-4 py-3 text-center text-sm text-red-600">
					{error}
				</div>
			)}

			<button
				type="button"
				onClick={handlePayment}
				disabled={loading || processing || !card}
				className="mt-5 h-12.5 w-full rounded-full bg-[#CC3263] text-[17px] font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
				{processing ? "Verifying payment..." : `Pay $${amount}/month`}
			</button>
		</div>
	);
}
