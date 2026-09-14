import { useState } from "react";
import { Header, FilterButton } from "../../components/Layout";
import PersonCard from "../../components/PersonCard";
import james from "../../assets/images/james.png";
import monica from "../../assets/images/monica.png";
import kelvin from "../../assets/images/kelvin.png";
import peter from "../../assets/images/peter.png";
import margret from "../../assets/images/margret.png";
import cynthia from "../../assets/images/cynthia.png";
import type { Person } from "../../types";

const people: Person[] = [
	{
		id: 1,
		name: "James Kruger",
		age: 28,
		image: james,
		location: "West Carolina",
		intent: "Friendship",
	},
	{
		id: 2,
		name: "Monica Cyprus",
		age: 28,
		image: monica,
		location: "South American",
		intent: "Casual Fun",
		match: true,
	},
	{
		id: 3,
		name: "Kelvin Holad",
		age: 29,
		image: kelvin,
		location: "North American",
		intent: "Casual Fun",
		likedYou: true,
	},
	{
		id: 4,
		name: "Peter Kuer",
		age: 28,
		image: peter,
		location: "Mexico",
		intent: "Friendship",
	},
	{
		id: 5,
		name: "Margret Hills",
		age: 31,
		image: margret,
		location: "Canada",
		intent: "Casual Fun",
		match: true,
	},
	{
		id: 6,
		name: "Cynthia Fish",
		age: 29,
		image: cynthia,
		location: "West Virginia",
		intent: "Casual Fun",
		match: true,
	},
];

export default function Connections() {
	const [tab, setTab] = useState("All");

	const tabs = ["All", "You like", "Like you", "Match"];

	return (
		<>
			<Header />

			<section className="px-5 pb-24 pt-10 md:px-8 lg:px-10">
				<div className="flex flex-wrap items-end justify-between gap-5">
					<div>
						<h1 className="text-3xl font-bold text-[#67307d]">Connections</h1>

						<p className="mt-2 font-medium text-gray-700">People who are interested in you</p>
					</div>

					<div className="flex items-center gap-5">
						<div className="flex overflow-hidden rounded-full bg-white">
							{tabs.map((item) => (
								<button
									key={item}
									onClick={() => setTab(item)}
									className={`px-6 py-3 text-sm ${
										tab === item
											? "rounded-full bg-linear-to-r from-[#ca2e6b] to-[#67307d] text-white"
											: ""
									}`}>
									{item}
								</button>
							))}
						</div>

						<FilterButton />
					</div>
				</div>

				<div className="mt-16 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
					{people.map((person) => (
						<PersonCard key={person.id} person={person} />
					))}
				</div>
			</section>
		</>
	);
}
