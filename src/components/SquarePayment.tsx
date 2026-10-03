import { useEffect, useState } from "react";

declare global {
	interface Window {
		Square: any;
	}
}

type SquarePaymentProps = {
	amount?: number;
	onTokenReceived?: (token: string) => void | Promise<unknown>;
};

export default function SquarePayment({ amount = 60, onTokenReceived }: SquarePaymentProps) {
	const [card, setCard] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [processing, setProcessing] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);

	const appId = "sandbox-sq0idb-GFfOcndZWTu3-xV6cVopUQ";
	const locationId = "L130YCW3KZGY7";

	useEffect(() => {
		let mounted = true;

		const initializeCard = async () => {
			try {
				setLoading(true);
				setError("");

				if (!window.Square) {
					throw new Error("Square payment SDK has not loaded.");
				}

				const payments = window.Square.payments(appId, locationId);

				const cardInstance = await payments.card();

				if (!mounted) return;

				await cardInstance.attach("#card-container");

				setCard(cardInstance);
				setLoading(false);
			} catch (err) {
				console.error("Square initialization error:", err);

				setError(err instanceof Error ? err.message : "Unable to load payment form.");

				setLoading(false);
			}
		};

		initializeCard();

		return () => {
			mounted = false;
		};
	}, [appId, locationId]);

	const handlePayment = async () => {
		if (!card) return;

		try {
			setProcessing(true);
			setError("");

			const result = await card.tokenize();

			if (result.status === "OK") {
				const token = result.token;

				if (onTokenReceived) {
					await onTokenReceived(token);
				}

				setSuccess(true);
			} else {
				const message =
					result.errors?.map((item: { message: string }) => item.message).join("\n") ||
					"Unable to process card.";

				setError(message);
			}
		} catch (err) {
			console.error("Payment error:", err);

			setError(err instanceof Error ? err.message : "Payment failed.");
		} finally {
			setProcessing(false);
		}
	};

	if (success) {
		return (
			<div className="py-10 text-center">
				<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-2xl text-green-600">
					✓
				</div>

				<h3 className="mt-5 text-xl font-bold text-gray-900">Subscription active!</h3>

				<p className="mt-2 text-sm text-gray-500">
					Your payment was successful and your subscription is active.
				</p>
			</div>
		);
	}

	return (
		<div>
			<div id="card-container" className="min-h-35" />

			{loading && <p className="mt-3 text-center text-sm text-gray-500">Loading payment form...</p>}

			{error && (
				<div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-center text-sm text-red-600 whitespace-pre-line">
					{error}
				</div>
			)}

			<button
				type="button"
				onClick={handlePayment}
				disabled={loading || processing}
				className="mt-5 h-12.5 w-full rounded-full bg-[#CC3263] text-[17px] font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
				{processing ? "Processing..." : `Pay $${amount}/month`}
			</button>
		</div>
	);
}
