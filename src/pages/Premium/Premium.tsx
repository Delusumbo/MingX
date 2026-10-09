import { useState } from "react";
import { Check, Crown, Sparkles, X, CalendarDays } from "lucide-react";
import SquarePayment from "../../components/SquarePayment";
import { createSubscription } from "../../services/subscriptionService";

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
		.map((source) => source.subscription_expires_at)
		.find((candidate): candidate is string => typeof candidate === "string" && candidate.length > 0);
	const premiumValue = sources.map((source) => source.is_premium).find((candidate) => candidate !== undefined);

	return {
		isPremium: premiumValue === true || premiumValue === 1 || premiumValue === "1",
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
export default function Premium() {
	const [showPayment, setShowPayment] = useState(false);
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
		setSubscription({ isPremium: true, expiresAt: expiry });
		return response;
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
				{subscription.isPremium ? (
					<div className="mx-auto mb-8 max-w-2xl overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-gray-100">
						<div className="bg-linear-to-r from-[#ca2e6b] to-[#67307d] px-6 py-8 text-center text-white sm:py-10">
							<div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
								<Crown size={28} />
							</div>
							<p className="text-sm font-semibold uppercase tracking-wider">Membership active</p>
							<h2 className="mt-2 text-3xl font-bold">You&apos;re Premium</h2>
							<p className="mt-2 text-sm text-white/80">
								Enjoy all your MingX Premium features.
							</p>
						</div>
						<div className="flex flex-col items-center gap-3 px-6 py-7 text-center sm:flex-row sm:justify-center sm:gap-4">
							<CalendarDays className="text-[#ca2e6b]" size={22} />
							<div>
								<p className="text-sm text-gray-500">Subscription expires</p>
								<p className="mt-1 font-semibold text-gray-900">
									{subscription.expiresAt
										? formatExpiryDate(subscription.expiresAt)
										: "Expiry date unavailable"}
								</p>
							</div>
						</div>
					</div>
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
				{/* Comparison */}
				<div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100">
					{/* Table header */}
					<div className="grid grid-cols-[1fr_70px_90px] items-center border-b border-gray-100 px-5 py-4 sm:grid-cols-[1fr_100px_120px] sm:px-8">
						<div className="text-sm font-semibold text-gray-900"> What's included </div>
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
				{/* Bottom note */}
				<p className="mt-6 text-center text-xs text-gray-400">
					You can cancel your subscription at any time.
				</p>
			</div>
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
