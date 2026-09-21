import { useEffect, useMemo, useState } from "react";

import { Header, FilterButton } from "../../components/Layout";
import PersonCard from "../../components/PersonCard";
import FilterPanel from "../../components/FilterPanel";

import type { Person } from "../../types";
import { getPeople } from "../../services/discoverService";

function calculateAge(dob: string) {
	const birthDate = new Date(dob);
	const today = new Date();

	let age = today.getFullYear() - birthDate.getFullYear();

	const monthDifference = today.getMonth() - birthDate.getMonth();

	if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
		age--;
	}

	return age;
}

export default function Discover() {
	const [people, setPeople] = useState<Person[]>([]);
	const [search, setSearch] = useState("");
	const [filtersOpen, setFiltersOpen] = useState(false);

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const loadPeople = async () => {
			try {
				setLoading(true);
				setError("");

				const response = await getPeople();

				const users: Person[] = response
					.filter((item): item is Exclude<typeof item, { isblur: boolean }> => !("isblur" in item))
					.map((user) => {
						let images: string[] = [];

						try {
							images = JSON.parse(user.images || "[]");
						} catch {
							images = [];
						}

						return {
							id: user.id,
							name: user.name,
							age: calculateAge(user.dob),
							image: user.profilepicture || images[0] || "",
							location: [user.state, user.country].filter(Boolean).join(", "),
							intent: user.goal,
						};
					});

				setPeople(users);
			} catch (error) {
				console.error("Discover error:", error);

				setError(error instanceof Error ? error.message : "Unable to load people.");
			} finally {
				setLoading(false);
			}
		};

		loadPeople();
	}, []);

	const handleFilters = (filters: Record<string, unknown>) => {
		console.log("Applied filters:", filters);
	};

	const filteredPeople = useMemo(() => {
		const query = search.trim().toLowerCase();

		if (!query) {
			return people;
		}

		return people.filter((person) => person.name.toLowerCase().includes(query));
	}, [people, search]);

	return (
		<>
			<Header onSearch={setSearch} />

			<section className="px-5 pb-24 pt-10 md:px-8 lg:px-10 lg:pt-12">
				<div className="mb-12 flex items-end justify-between">
					<div>
						<h1 className="text-3xl font-bold text-[#67307d]">Discover People</h1>

						<p className="mt-2 font-medium text-gray-700">{filteredPeople.length} people nearby</p>
					</div>

					<FilterButton onClick={() => setFiltersOpen(true)} />
				</div>

				{loading && <div className="py-20 text-center text-gray-500">Loading people...</div>}

				{!loading && error && (
					<div className="rounded-xl bg-red-50 px-5 py-4 text-center text-sm text-red-600">
						{error}
					</div>
				)}

				{!loading && !error && filteredPeople.length === 0 && (
					<div className="py-20 text-center text-gray-500">No people found.</div>
				)}

				{!loading && !error && filteredPeople.length > 0 && (
					<div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
						{filteredPeople.map((person) => (
							<PersonCard key={person.id} person={person} showActions={false} />
						))}
					</div>
				)}

				<FilterPanel
					isOpen={filtersOpen}
					onClose={() => setFiltersOpen(false)}
					onApply={handleFilters}
				/>
			</section>
		</>
	);
}
