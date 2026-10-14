import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, Check, CircleCheck, Crown, Sparkles, X } from "lucide-react";
import SquarePayment from "../../components/SquarePayment";
import { cancelSubscription as cancelSubscriptionRequest, createSubscription } from "../../services/subscriptionService";
import { getApiMessage } from "../../utils/apiMessages";
import { isPremiumUser } from "../../utils/subscription";

type SubscriptionDetails = {
	isPremium: boolean;
	expiresAt: string | null;
};

function asRecord(value: unknown): Record<string, unknown> | null {
	return typeof value === "object" && value !== null && !Array.isArray(value)
		? (value as Record<string, unknown>)
		: null;
}

function readSubscriptionDetails(value: unknown): SubscriptionDetails {
	const record = asRecord(value);
	const nestedData = asRecord(record?.data);
	const subscription = asRecord(record?.subscription) ?? asRecord(nestedData?.subscription);
	const user = asRecord(record?.user) ?? asRecord(nestedData?.user);
	const sources = [record, nestedData, subscription, user].filter(
		(source): source is Record<string, unknown> => source !== null,
	);
	const expiry = sources
		.map((source) => source.subscription_expires_at ?? source.subscriptionExpiresAt)
		.find((candidate): candidate is string => typeof candidate === "string" && candidate.length > 0);

	return {
		isPremium: isPremiumUser(value),
		expiresAt: expiry ?? null,
	};
}

function getStoredSubscriptionDetails(): SubscriptionDetails {
	try {
		return readSubscriptionDetails(JSON.parse(localStorage.getItem("user") || "{}"));
	} catch {
		return { isPremium: false, expiresAt: null };
	}
}

function formatExpiryDate(value: string): string {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	return new Intl.DateTimeFormat(undefined, {
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(date);
}

const features = [
	"See who liked you already",
	"Unlimited likes",
	"Unlimited Rewinds",
	"Free Super Likes",
	"Incognito mode",
	"Travel Mode",
	"5 Swipes per day",
	"Unlimited Extends",
	"Unlimited Rematch",
	"Advanced Filter",
	"More likes in for you",
	"1 Spotlight a week",
];

function consumeActivationSuccess(): boolean {
	const wasActivated = sessionStorage.getItem("premiumActivationSuccess") === "true";
	if (wasActivated) sessionStorage.removeItem("premiumActivationSuccess");
	return wasActivated;
}

export default function Premium() {
	const [showPayment, setShowPayment] = useState(false);
	const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
	const [cancelling, setCancelling] = useState(false);
	const [cancelError, setCancelError] = useState("");
	const [cancelNotice, setCancelNotice] = useState("");
	const [showActivationSuccess, setShowActivationSuccess] = useState(consumeActivationSuccess);
	const [subscription, setSubscription] = useState(getStoredSubscriptionDetails);

	const handleSubscription = async (cardNonce: string) => {
		const response = await createSubscription(cardNonce);
		const responseDetails = readSubscriptionDetails(response);
		const storedUser = asRecord(JSON.parse(localStorage.getItem("user") || "{}")) ?? {};
		const expiry =
			responseDetails.expiresAt ??
			(typeof storedUser.subscription_expires_at === "string"
				? storedUser.subscription_expires_at
				: null);

		localStorage.setItem(
			"user",
			JSON.stringify({
				...storedUser,
				is_premium: true,
				...(expiry ? { subscription_expires_at: expiry } : {}),
			}),
		);
		sessionStorage.setItem("premiumActivationSuccess", "true");
		window.location.reload();
		return response;
	};

	const handleCancelSubscription = async () => {
		try {
			setCancelling(true);
			setCancelError("");
			await cancelSubscriptionRequest();

			const storedUser = asRecord(JSON.parse(localStorage.getItem("user") || "{}")) ?? {};
			localStorage.setItem(
				"user",
				JSON.stringify({ ...storedUser, is_premium: false, subscription_expires_at: null }),
			);
			setSubscription({ isPremium: false, expiresAt: null });
			setShowCancelConfirmation(false);
			setCancelNotice("Your Premium subscription has been cancelled.");
		} catch (error) {
			console.error("Subscription cancellation error:", error);
			setCancelError(getApiMessage(error));
		} finally {
			setCancelling(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
			<div className="mx-auto w-full max-w-5xl">
				{/* Header */}
				<div className="mb-10 text-center">
					<div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-[#ca2e6b] to-[#67307d] shadow-lg">
						<Crown className="text-white" size={28} />
					</div>
					<h1 className="bg-linear-to-r from-[#ca2e6b] to-[#67307d] bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
						{subscription.isPremium ? "Your Premium Membership" : "Upgrade to Premium"}
					</h1>
					<p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-gray-500 sm:text-base">
						{subscription.isPremium
							? "Your membership details and included features."
							: "Unlock more features and take complete control of your MingX experience."}
					</p>
				</div>
				{cancelNotice && (
					<div
						role="status"
						className="mx-auto mb-6 max-w-2xl rounded-2xl bg-green-50 px-5 py-4 text-sm font-medium text-green-800">
						{cancelNotice}
					</div>
				)}
				{subscription.isPremium ? (
					<>
						{showActivationSuccess && (
							<div
								role="status"
								className="mx-auto mb-6 max-w-2xl rounded-3xl bg-linear-to-r from-[#ca2e6b] to-[#67307d] p-6 text-white shadow-lg sm:flex sm:items-center sm:justify-between sm:gap-6">
								<div className="flex items-start gap-4">
									<span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/15">
										<CircleCheck size={26} />
									</span>
									<div>
										<h2 className="text-lg font-bold">Welcome to MingX Premium!</h2>
										<p className="mt-1 text-sm text-white/85">
											Your subscription is active and your Premium benefits are ready.
										</p>
									</div>
								</div>
								<div className="mt-5 flex shrink-0 items-center gap-4 sm:mt-0">
									<Link
										to="/discover"
										className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#67307d] transition hover:bg-white/90">
										Explore MingX <ArrowRight size={16} />
									</Link>
									<button
										type="button"
										onClick={() => setShowActivationSuccess(false)}
										aria-label="Dismiss welcome message"
										className="text-white/80 transition hover:text-white">
										<X size={20} />
									</button>
								</div>
							</div>
						)}
						<div className="mx-auto mb-8 max-w-3xl overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-gray-100">
							<div className="bg-linear-to-br from-[#ca2e6b] via-[#a12c75] to-[#67307d] px-6 py-9 text-center text-white sm:py-12">
								<div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-3xl bg-white/15 ring-1 ring-white/20">
									<Crown size={32} />
								</div>
								<p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
									<CircleCheck size={14} /> Active membership
								</p>
								<h2 className="mt-4 text-3xl font-bold sm:text-4xl">Premium is yours.</h2>
								<p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/85">
									Enjoy the full MingX experience, with all Premium benefits enabled on your account.
								</p>
								<Link
									to="/discover"
									className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#67307d] shadow transition hover:bg-white/90">
									Explore MingX <ArrowRight size={16} />
								</Link>
							</div>
							<div className="grid gap-6 px-6 py-7 sm:grid-cols-[1fr_auto] sm:items-center sm:px-8">
								<div className="flex items-center gap-4">
									<span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#f7eef9] text-[#ca2e6b]">
										<CalendarDays size={22} />
									</span>
									<div>
										<p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
											Next billing date
										</p>
										<p className="mt-1 font-semibold text-gray-900">
											{subscription.expiresAt
												? formatExpiryDate(subscription.expiresAt)
												: "Date unavailable"}
										</p>
									</div>
								</div>
								<button
									type="button"
									onClick={() => {
										setCancelError("");
										setShowCancelConfirmation(true);
									}}
									className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-700 transition hover:border-red-300 hover:bg-red-50">
									<X size={17} /> Cancel subscription
								</button>
							</div>
							<div className="border-t border-gray-100 px-6 py-6 sm:px-8">
								<h3 className="text-sm font-semibold text-gray-900">Included with Premium</h3>
								<div className="mt-4 grid gap-3 sm:grid-cols-2">
									{features.map((feature) => (
										<div key={feature} className="flex items-center gap-3 text-sm text-gray-700">
											<span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#f7eef9] text-[#67307d]">
												<Check size={14} strokeWidth={2.5} />
											</span>
											{feature}
										</div>
									))}
								</div>
							</div>
						</div>
					</>
				) : (
					/* Pricing card */
					<div className="mx-auto mb-8 max-w-md overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-gray-100">
						<div className="bg-linear-to-r from-[#ca2e6b] to-[#67307d] px-6 py-7 text-center text-white">
							<div className="mb-2 flex items-center justify-center gap-2">
								<Sparkles size={18} />
								<span className="text-sm font-semibold uppercase tracking-wider"> Premium </span>
							</div>
							<div className="mt-2 flex items-end justify-center gap-1">
								<span className="text-4xl font-bold">$10</span>
								<span className="mb-1 text-sm text-white/80"> /month </span>
							</div>
							<p className="mt-2 text-sm text-white/80"> Get access to all premium features. </p>
						</div>
						<div className="p-6">
							<button
								type="button"
								onClick={() => setShowPayment(true)}
								className="w-full rounded-full bg-linear-to-r from-[#ca2e6b] to-[#67307d] py-3.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90 hover:shadow-lg">
								Upgrade to Premium
							</button>
						</div>
					</div>
				)}
				{!subscription.isPremium && (
					<div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100">
						{/* Table header */}
						<div className="grid grid-cols-[1fr_70px_90px] items-center border-b border-gray-100 px-5 py-4 sm:grid-cols-[1fr_100px_120px] sm:px-8">
							<div className="text-sm font-semibold text-gray-900"> What&apos;s included </div>
							<div className="text-center text-xs font-semibold uppercase tracking-wide text-gray-400">
								Free
							</div>
							<div className="text-center text-xs font-semibold uppercase tracking-wide text-[#67307d]">
								Premium
							</div>
						</div>
						{/* Feature rows */}
						<div>
							{features.map((feature, index) => (
								<div
									key={feature}
									className={`grid grid-cols-[1fr_70px_90px] items-center px-5 py-4 sm:grid-cols-[1fr_100px_120px] sm:px-8 ${index !== features.length - 1 ? "border-b border-gray-50" : ""}`}>
									<span className="pr-3 text-sm text-gray-700"> {feature} </span>
									<span className="text-center text-gray-300"> — </span>
									<span className="flex justify-center">
										<span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f7eef9]">
											<Check size={16} strokeWidth={2.5} className="text-[#67307d]" />
										</span>
									</span>
								</div>
							))}
						</div>
					</div>
				)}
				{/* Bottom note */}
				{!subscription.isPremium && (
					<p className="mt-6 text-center text-xs text-gray-400">
						You can cancel your subscription at any time.
					</p>
				)}
			</div>
			{showCancelConfirmation && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
					onMouseDown={(event) => {
						if (event.target === event.currentTarget && !cancelling) {
							setShowCancelConfirmation(false);
						}
					}}>
					<div
						role="dialog"
						aria-modal="true"
						aria-labelledby="cancel-subscription-title"
						className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
						<button
							type="button"
							onClick={() => setShowCancelConfirmation(false)}
							disabled={cancelling}
							aria-label="Close cancellation dialog"
							className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200 disabled:opacity-50">
							<X size={18} />
						</button>
						<div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-red-50 text-red-500">
							<X size={26} />
						</div>
						<h2 id="cancel-subscription-title" className="text-center text-2xl font-bold text-gray-900">
							Cancel Premium?
						</h2>
						<p className="mt-3 text-center text-sm leading-6 text-gray-600">
							Cancelling now will end your Premium membership and its benefits immediately.
							You can subscribe again at any time.
						</p>
						{cancelError && (
							<p
								role="alert"
								className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-center text-sm text-red-700">
								{cancelError}
							</p>
						)}
						<div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row">
							<button
								type="button"
								onClick={() => setShowCancelConfirmation(false)}
								disabled={cancelling}
								className="flex-1 rounded-full border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50">
								Keep Premium
							</button>
							<button
								type="button"
								onClick={handleCancelSubscription}
								disabled={cancelling}
								className="flex-1 rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60">
								{cancelling ? "Cancelling..." : "Confirm cancellation"}
							</button>
						</div>
					</div>
				</div>
			)}
			{showPayment && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
					<div className="relative w-full max-w-112.5 rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
						{/* Close */}
						<button
							type="button"
							onClick={() => setShowPayment(false)}
							className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200">
							<X size={18} />
						</button>

						{/* Header */}
						<div className="mb-7 text-center">
							<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-[#ca2e6b] to-[#67307d]">
								<Crown size={23} className="text-white" />
							</div>

							<h2 className="text-2xl font-bold text-gray-800">Premium Subscription</h2>

							<p className="mt-2 text-sm text-gray-500">
								Secure payment for your MingX monthly subscription
							</p>
						</div>

						{/* Square */}
						<SquarePayment amount={10} onTokenReceived={handleSubscription} />
					</div>
				</div>
			)}
		</div>
	);
}
