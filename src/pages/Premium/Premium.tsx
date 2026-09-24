import { Check } from "lucide-react";

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
		<div className="grid min-h-screen place-items-center p-8">
			<div className="w-full max-w-md rounded-3xl bg-white p-8 text-center">
				<h1 className="bg-linear-to-r from-[#ca2e6b] to-[#67307d] bg-clip-text text-3xl font-bold text-transparent">
					Upgrade to Premium
				</h1>

				<p className="mx-auto mt-3 max-w-xs text-gray-600">
					Unlock all of our features to be complete control of your experience
				</p>

				{/* Table header */}
				<div className="mt-8 flex items-center border-b border-gray-100 pb-3">
					<span className="flex-1 text-left text-sm font-semibold text-gray-900">
						What's Included
					</span>

					<span className="w-16 text-sm font-semibold text-gray-900">Free</span>

					<span className="w-20 text-sm font-semibold text-gray-900">Premium</span>
				</div>

				{/* Feature rows */}
				<div>
					{features.map((feature) => (
						<div
							key={feature}
							className="flex items-center border-b border-gray-50 py-3 last:border-0">
							<span className="flex-1 text-left text-sm text-gray-700">{feature}</span>

							<span className="w-16 text-gray-300">—</span>

							<span className="w-20">
								<Check size={18} className="mx-auto text-[#67307d]" />
							</span>
						</div>
					))}
				</div>

				<button className="mt-8 w-full rounded-full bg-linear-to-r from-[#ca2e6b] to-[#67307d] py-3.5 font-semibold text-white transition hover:opacity-90">
					Upgrade from $60
				</button>
			</div>
		</div>
	);
}
