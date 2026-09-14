import { useState } from "react";
import { MessageCircle, Plus } from "lucide-react";
import { Header } from "../../components/Layout";
import cynthia from "../../assets/images/cynthia.png";
import margret from "../../assets/images/margret.png";
import sophie from "../../assets/images/sophie.png";
import astra from "../../assets/images/astra.png";
import monica from "../../assets/images/monica.png";
import kate from "../../assets/images/kate.png";
import joseph from "../../assets/images/joseph.png";

type Match = {
	name: string;
	image: string;
};

const matches: Match[] = [
	{ name: "Cynthia", image: cynthia },
	{ name: "Margret", image: margret },
	{ name: "Sophie", image: sophie },
	{ name: "Astra", image: astra },
	{ name: "Monica", image: monica },
	{ name: "Katrina", image: joseph },
	{ name: "Monique", image: margret },
	{ name: "Kate", image: kate },
	{ name: "Sonia", image: sophie },
	{ name: "April", image: astra },
	{ name: "Kholie", image: monica },
];

const chats: Match[] = [
	{ name: "Cynthia Fish", image: cynthia },
	{ name: "Margret Hills", image: margret },
	{ name: "Monica Cyprus", image: monica },
	{ name: "Sophie Miller", image: sophie },
	{ name: "Astra Gaze", image: astra },
];

export default function Matches() {
	const [selected, setSelected] = useState<string | null>(null);

	return (
		<>
			<Header searchPlaceholder="Search by name or message" />

			<section className="px-5 pb-24 pt-10 md:px-8 lg:px-10">
				<h1 className="text-3xl font-bold text-[#67307d]">Matches</h1>

				{/* Matches */}

				<div className="mt-6 flex gap-6 overflow-x-auto pb-3">
					{matches.map((match) => (
						<button
							key={match.name}
							onClick={() => setSelected(match.name)}
							className="min-w-19 text-center">
							<img
								src={match.image}
								className="mx-auto h-19 w-19 rounded-full border-2 border-[#ca2e6b] object-cover p-1"
							/>

							<span className="mt-2 block text-sm">{match.name}</span>
						</button>
					))}
				</div>

				<h2 className="mb-4 mt-8 text-lg font-semibold text-[#67307d]">Messages</h2>

				<div className="grid gap-5 lg:grid-cols-[380px_1fr]">
					{/* Chat list */}

					<div className="rounded-[22px] bg-white p-4">
						<div className="mb-5 flex items-center gap-3">
							<button className="rounded-full border border-[#ca2e6b] px-5 py-2 text-sm text-[#ca2e6b]">
								All
							</button>

							<button className="rounded-full border border-[#ca2e6b] px-4 py-2 text-sm text-[#ca2e6b]">
								Unread
								<b className="ml-2 rounded-full bg-[#f5e6ed] px-2">2</b>
							</button>

							<button className="rounded-full border border-[#ca2e6b] px-4 py-2 text-sm text-[#ca2e6b]">
								Active
								<b className="ml-2 rounded-full bg-[#f5e6ed] px-2">3</b>
							</button>

							<button className="ml-auto grid h-9 w-9 place-items-center rounded-full border border-[#ca2e6b]">
								<Plus size={18} />
							</button>
						</div>

						{chats.map((chat) => (
							<button
								key={chat.name}
								onClick={() => setSelected(chat.name)}
								className="flex w-full items-center gap-3 border-b border-gray-100 py-3 text-left last:border-0">
								<img
									src={chat.image}
									className="h-9 w-9 rounded-full border border-[#ca2e6b] object-cover"
								/>

								<span className="flex-1">
									<b className="block text-sm">{chat.name}</b>

									<small className="text-gray-500">Hi</small>
								</span>

								<span className="text-xs text-[#ca2e6b]">
									Friday
									<br />
									<b className="float-right mt-1 rounded-full bg-[#ca2e6b] px-1.5 py-1 text-white">
										15
									</b>
								</span>
							</button>
						))}
					</div>

					{/* Conversation */}

					<div className="grid min-h-105 place-items-center rounded-[22px] bg-white text-center">
						<div>
							<div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl bg-[#f9e8ef] text-[#ca2e6b]">
								<MessageCircle />
							</div>

							<h3 className="font-semibold">
								{selected ? `Chat with ${selected}` : "Select a conversation to start messaging"}
							</h3>

							<p className="mt-1 text-sm">
								{selected
									? "Your conversation will appear here."
									: "Choose a match on your list and enjoy the app..."}
							</p>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
