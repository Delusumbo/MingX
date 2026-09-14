import { useMemo, useState } from "react";
import { Header, FilterButton } from "../../components/Layout";
import PersonCard from "../../components/PersonCard";
import sophie from "../../assets/images/sophie.png";
import margret from "../../assets/images/margret.png";
import cynthia from "../../assets/images/cynthia.png";
import monica from "../../assets/images/monica.png";
import kate from "../../assets/images/kate.png";
import astra from "../../assets/images/astra.png";

import type { Person } from "../../types";

const people: Person[] = [
	{
		id: 1,
		name: "Sophie Miller",
		age: 28,
		image: sophie,
		location: "California, USA",
		intent: "Long-term relationship",
	},
	{
		id: 2,
		name: "Margret Hills",
		age: 30,
		image: margret,
		location: "California, USA",
		intent: "Long-term relationship",
	},
	{
		id: 3,
		name: "Cynthia Fish",
		age: 32,
		image: cynthia,
		location: "California, USA",
		intent: "Long-term relationship",
	},
	{
		id: 4,
		name: "Monica Cyprus",
		age: 28,
		image: monica,
		location: "California, USA",
		intent: "Long-term relationship",
	},
	{
		id: 5,
		name: "Kate Moss",
		age: 30,
		image: kate,
		location: "California, USA",
		intent: "Long-term relationship",
	},
	{
		id: 6,
		name: "Astra Gaze",
		age: 32,
		image: astra,
		location: "California, USA",
		intent: "Long-term relationship",
	},
];

export default function Discover() {
	const [search, setSearch] = useState("");

	const filteredPeople = useMemo(() => {
		return people.filter((person) => person.name.toLowerCase().includes(search.toLowerCase()));
	}, [search]);

	return (
		<>
			<Header onSearch={setSearch} />

			<section className="px-5 pb-24 pt-10 md:px-8 lg:px-10 lg:pt-12">
				<div className="mb-12 flex items-end justify-between">
					<div>
						<h1 className="text-3xl font-bold text-[#67307d]">Discover People</h1>

						<p className="mt-2 font-medium text-gray-700">65 people near by</p>
					</div>

					<FilterButton />
				</div>

				<div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
					{filteredPeople.map((person) => (
						<PersonCard key={person.id} person={person} showActions={false} />
					))}
				</div>
			</section>
		</>
	);
}
