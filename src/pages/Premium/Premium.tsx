import { Check, Crown, Sparkles } from "lucide-react";
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
	return (
		<div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
			{" "}
			<div className="mx-auto w-full max-w-5xl">
				{" "}
				{/* Header */}{" "}
				<div className="mb-10 text-center">
					{" "}
					<div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-[#ca2e6b] to-[#67307d] shadow-lg">
						{" "}
						<Crown className="text-white" size={28} />{" "}
					</div>{" "}
					<h1 className="bg-linear-to-r from-[#ca2e6b] to-[#67307d] bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
						{" "}
						Upgrade to Premium{" "}
					</h1>{" "}
					<p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-gray-500 sm:text-base">
						{" "}
						Unlock more features and take complete control of your MingX experience.{" "}
					</p>{" "}
				</div>{" "}
				{/* Pricing card */}{" "}
				<div className="mx-auto mb-8 max-w-md overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-gray-100">
					{" "}
					<div className="bg-linear-to-r from-[#ca2e6b] to-[#67307d] px-6 py-7 text-center text-white">
						{" "}
						<div className="mb-2 flex items-center justify-center gap-2">
							{" "}
							<Sparkles size={18} />{" "}
							<span className="text-sm font-semibold uppercase tracking-wider"> Premium </span>{" "}
						</div>{" "}
						<div className="mt-2 flex items-end justify-center gap-1">
							{" "}
							<span className="text-4xl font-bold">$60</span>{" "}
							<span className="mb-1 text-sm text-white/80"> /month </span>{" "}
						</div>{" "}
						<p className="mt-2 text-sm text-white/80"> Get access to all premium features. </p>{" "}
					</div>{" "}
					<div className="p-6">
						{" "}
						<button
							type="button"
							className="w-full rounded-full bg-linear-to-r from-[#ca2e6b] to-[#67307d] py-3.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90 hover:shadow-lg">
							{" "}
							Upgrade to Premium{" "}
						</button>{" "}
					</div>{" "}
				</div>{" "}
				{/* Comparison */}{" "}
				<div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100">
					{" "}
					{/* Table header */}{" "}
					<div className="grid grid-cols-[1fr_70px_90px] items-center border-b border-gray-100 px-5 py-4 sm:grid-cols-[1fr_100px_120px] sm:px-8">
						{" "}
						<div className="text-sm font-semibold text-gray-900"> What's included </div>{" "}
						<div className="text-center text-xs font-semibold uppercase tracking-wide text-gray-400">
							{" "}
							Free{" "}
						</div>{" "}
						<div className="text-center text-xs font-semibold uppercase tracking-wide text-[#67307d]">
							{" "}
							Premium{" "}
						</div>{" "}
					</div>{" "}
					{/* Feature rows */}{" "}
					<div>
						{" "}
						{features.map((feature, index) => (
							<div
								key={feature}
								className={`grid grid-cols-[1fr_70px_90px] items-center px-5 py-4 sm:grid-cols-[1fr_100px_120px] sm:px-8 ${index !== features.length - 1 ? "border-b border-gray-50" : ""}`}>
								{" "}
								<span className="pr-3 text-sm text-gray-700"> {feature} </span>{" "}
								<span className="text-center text-gray-300"> — </span>{" "}
								<span className="flex justify-center">
									{" "}
									<span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f7eef9]">
										{" "}
										<Check size={16} strokeWidth={2.5} className="text-[#67307d]" />{" "}
									</span>{" "}
								</span>{" "}
							</div>
						))}{" "}
					</div>{" "}
				</div>{" "}
				{/* Bottom note */}{" "}
				<p className="mt-6 text-center text-xs text-gray-400">
					{" "}
					You can cancel your subscription at any time.{" "}
				</p>{" "}
			</div>{" "}
		</div>
	);
}
