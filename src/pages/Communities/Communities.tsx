import { ChevronRight, UsersRound } from "lucide-react";

import { Header } from "../../components/Layout";

type Community = {
	name: string;
	description: string;
	members: string;
};

const communities: Community[] = [
	{
		name: "Atlanta",
		description: "Long term relationship",
		members: "25 members",
	},
	{
		name: "Africans in Brazil",
		description: "Bien-vindo ao Brazil connect",
		members: "17 members",
	},
	{
		name: "African in Healthcare",
		description: "Open canvas on self care, mental stability and emotional support.",
		members: "12 members",
	},
	{
		name: "African in Atlanta",
		description: "This is a group for africans in atlanta.",
		members: "17 members",
	},
];


export default function Communities() {
	return (
		<>
			<Header />

			<section className="px-5 pb-24 pt-10 md:px-8 lg:px-10">
				<h1 className="text-3xl font-bold text-[#67307d]">Communities</h1>

				<p className="mt-2 font-medium text-gray-700">Connect with your diaspora communities</p>

				<div className="mt-12 grid gap-8 md:grid-cols-2">
					{communities.map((community) => (
						<button
							key={community.name}
							className="flex min-h-48.7 items-center gap-5 rounded-[42px] bg-white px-8 py-7 text-left shadow-[0_12px_24px_rgba(20,10,20,.08)]">
							<div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-linear-to-b from-[#ca2e6b] to-[#713183] text-white">
								<UsersRound size={40} />
							</div>

							<div className="min-w-0 flex-1">
								<h2 className="text-xl font-semibold">{community.name}</h2>

								<p className="mt-1 text-sm text-gray-500">{community.description}</p>

								<div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
									<span>
										<UsersRound size={15} className="mr-2 inline" />
										{community.members}
									</span>

									<span className="rounded-full border border-[#ca2e6b] px-7 py-1 text-[#ca2e6b]">
										Diaspora
									</span>
								</div>
							</div>

							<ChevronRight />
						</button>
					))}
				</div>
			</section>
		</>
	);
}
