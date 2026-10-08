import { useEffect, useMemo, useState } from "react";

import { Header, FilterButton } from "../../components/Layout";
import PersonCard from "../../components/PersonCard";
import FilterPanel, { type DiscoverFilters } from "../../components/FilterPanel";

import type { Person } from "../../types";

import { getPeople, type ApiPerson } from "../../services/discoverService";
import { getLikedUsers } from "../../services/likedService";
import { getApiMessage } from "../../utils/apiMessages";

type Coordinates = { latitude: number; longitude: number };
type DiscoverPerson = Person & {
	gender: string;
	goal: string;
	lookingFor: string;
	belief: string;
	education: string;
	maritalStatus: string;
	interests: string[];
	coordinates: Coordinates | null;
};

function calculateAge(dob: string): number {
	const birthDate = new Date(dob);
	if (Number.isNaN(birthDate.getTime())) return 0;
	const today = new Date();

	let age = today.getFullYear() - birthDate.getFullYear();

	const monthDifference = today.getMonth() - birthDate.getMonth();

	if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
		age--;
	}

	return age;
}

function getCoordinates(value: unknown): Coordinates | null {
	if (typeof value !== "object" || value === null) return null;
	const record = value as Record<string, unknown>;
	const latitude = Number(record.latitude ?? record.lat);
	const longitude = Number(record.longitude ?? record.lng ?? record.lon);

	return Number.isFinite(latitude) &&
		Number.isFinite(longitude) &&
		latitude >= -90 &&
		latitude <= 90 &&
		longitude >= -180 &&
		longitude <= 180
		? { latitude, longitude }
		: null;
}

function parseStringList(value: string | null | undefined): string[] {
	if (!value) return [];
	try {
		const parsed: unknown = JSON.parse(value);
		if (Array.isArray(parsed)) return parsed.filter((item): item is string => typeof item === "string");
	} catch {
		// List values may also be stored as comma-separated strings.
	}
	return value.split(",").map((interest) => interest.trim()).filter(Boolean);
}

function matches(value: string, filter: string): boolean {
	const normalizedValue = value.toLowerCase().replace(/[^a-z0-9]/g, "");
	const normalizedFilter = filter.toLowerCase().replace(/[^a-z0-9]/g, "");
	return (
		normalizedValue.length > 0 &&
		normalizedFilter.length > 0 &&
		(normalizedValue === normalizedFilter ||
			normalizedValue.includes(normalizedFilter) ||
			normalizedFilter.includes(normalizedValue))
	);
}

function distanceInKilometers(from: Coordinates, to: Coordinates): number {
	const radians = (degrees: number) => (degrees * Math.PI) / 180;
	const latitudeDifference = radians(to.latitude - from.latitude);
	const longitudeDifference = radians(to.longitude - from.longitude);
	const arc =
		Math.sin(latitudeDifference / 2) ** 2 +
		Math.cos(radians(from.latitude)) *
			Math.cos(radians(to.latitude)) *
			Math.sin(longitudeDifference / 2) ** 2;
	return 6371 * 2 * Math.atan2(Math.sqrt(arc), Math.sqrt(1 - arc));
}

function getCurrentUserCoordinates(): Coordinates | null {
	try {
		const storedUser = localStorage.getItem("user");
		return storedUser ? getCoordinates(JSON.parse(storedUser)) : null;
	} catch {
		return null;
	}
}

export default function Discover() {
	const [people, setPeople] = useState<DiscoverPerson[]>([]);
	const [likedIds, setLikedIds] = useState<number[]>([]);

	const [search, setSearch] = useState("");
	const [filtersOpen, setFiltersOpen] = useState(false);
	const [activeFilters, setActiveFilters] = useState<DiscoverFilters | null>(null);
	const currentUserCoordinates = useMemo(() => getCurrentUserCoordinates(), []);

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const loadData = async () => {
			try {
				setLoading(true);
				setError("");

				const [peopleData, likedData] = await Promise.all([getPeople(), getLikedUsers()]);

				

				const likedUsers = likedData.whoyouliked ?? [];

				const ids = likedUsers.map((user: { id: number }) => user.id);

				setLikedIds(ids);

				/*
				 * Discover API can contain:
				 *
				 * { isblur: false }
				 *
				 * so remove those objects.
				 */

				const users = peopleData.filter((item): item is ApiPerson => !("isblur" in item));

				const mappedPeople: DiscoverPerson[] = users.map((user) => {
					const images = parseStringList(user.images);

					return {
						id: user.id,
						name: user.name,
						age: calculateAge(user.dob),
						image: user.profilepicture || images[0] || "",
						location: [user.state, user.country].filter(Boolean).join(", "),
						intent: user.goal || user.lookingfor,
						gender: user.gender || "",
						goal: user.goal || "",
						lookingFor: user.lookingfor || "",
						belief: user.belief || "",
						education: user.education_level || "",
						maritalStatus: user.maritalstatus || "",
						interests: parseStringList(user.yourinterest),
						coordinates: getCoordinates(user),
					};
				});

				setPeople(mappedPeople);
			} catch (error) {
				console.error("Discover error:", error);

				setError(getApiMessage(error));
			} finally {
				setLoading(false);
			}
		};

		loadData();
	}, []);

	const handleLiked = (userId: number, isLiked: boolean) => {
		setLikedIds((current) => {
			if (isLiked) {
				return current.includes(userId) ? current : [...current, userId];
			}

			return current.filter((id) => id !== userId);
		});
	};

	const handleFilters = (filters: DiscoverFilters) => setActiveFilters(filters);

	const filteredPeople = useMemo(() => {
		const query = search.trim().toLowerCase();

		return people.filter((person) => {
			if (
				query &&
				!person.name.toLowerCase().includes(query) &&
				!person.location.toLowerCase().includes(query)
			) {
				return false;
			}
			if (!activeFilters) return true;
			if (activeFilters.gender && !matches(person.gender, activeFilters.gender)) return false;
			if (
				activeFilters.goal &&
				!matches(person.goal, activeFilters.goal) &&
				!matches(person.lookingFor, activeFilters.goal)
			) {
				return false;
			}
			if (activeFilters.belief && !matches(person.belief, activeFilters.belief)) return false;
			if (activeFilters.education && !matches(person.education, activeFilters.education)) return false;
			if (
				activeFilters.maritalStatus &&
				!matches(person.maritalStatus, activeFilters.maritalStatus)
			) {
				return false;
			}
			if (person.age < activeFilters.ageFrom || person.age > activeFilters.ageTo) return false;
			if (
				activeFilters.interests.length > 0 &&
				!activeFilters.interests.some((interest) =>
					person.interests.some((personInterest) => matches(personInterest, interest)),
				)
			) {
				return false;
			}
			if (activeFilters.distance < 100 && currentUserCoordinates) {
				if (
					!person.coordinates ||
					distanceInKilometers(currentUserCoordinates, person.coordinates) >
						activeFilters.distance
				) {
					return false;
				}
			}
			return true;
		});
	}, [activeFilters, currentUserCoordinates, people, search]);

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
							<PersonCard
								key={person.id}
								person={person}
								showActions={false}
								isLiked={likedIds.includes(person.id)}
								onLiked={handleLiked}
							/>
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
