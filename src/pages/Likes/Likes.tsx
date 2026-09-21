import { Icon } from "@iconify/react";
import Header from "../../components/Header";

import astra from "../../assets/images/astra.png";
import cynthia from "../../assets/images/cynthia.png";
import sophie from "../../assets/images/sophie.png";

const likedPeople = [
	{ id: 1, image: astra },
	{ id: 2, image: cynthia },
	{ id: 3, image: sophie },
];

export default function Likes() {
	return (
		<>
			<Header />

			<section className="min-h-[calc(100vh-76px)] bg-[#f7f7f7]">
				<div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-5 pb-10">
					<div className="flex w-full max-w-100 flex-col items-center text-center">
						{/* Crown */}
						<Icon
							icon="fluent-emoji-high-contrast:crown"
							width="76"
							height="76"
							className="mb-4 text-[#ca2e6b]"
						/>

						<h1 className="text-[28px] font-bold text-[#67307d]">See who like you</h1>

						<p className="mt-2 max-w-90 text-sm font-medium leading-5 text-gray-700">
							Upgrade to Plus or Premium to view the full list of
							<br />
							people who liked your profile.
						</p>

						{/* People preview */}
						<div className="relative mt-8 flex h-18.75 items-center justify-center">
							{likedPeople.map((person, index) => (
								<div
									key={person.id}
									className={`h-17.7 w-17.5 overflow-hidden rounded-full border-2 border-[#ca2e6b]/20 ${
										index !== 0 ? "-ml-3" : ""
									}`}>
									<img
										src={person.image}
										alt=""
										className="h-full w-full object-cover opacity-30 blur-[1px]"
									/>
								</div>
							))}

							<div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-lg border border-[#67307d] bg-white px-3 py-1.5 text-sm text-gray-600 shadow-sm">
								<Icon icon="boxicons:lock-alt" width="15" height="15" />
								<span>3 Likes</span>
							</div>
						</div>

						<button
							type="button"
							className="mt-7 h-10 w-full max-w-90 rounded-lg bg-linear-to-r from-[#67307d] to-[#ca2e6b] text-sm font-medium text-white">
							Upgrade Now
						</button>
					</div>
				</div>
			</section>
		</>
	);
}
