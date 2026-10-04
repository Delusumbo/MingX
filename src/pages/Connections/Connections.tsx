import { useEffect, useMemo, useState } from "react";
import { Header } from "../../components/Layout";
import PersonCard from "../../components/PersonCard";
import type { Person } from "../../types";
import { getAllYourMatches, type ApiConnection } from "../../services/connectionService";

function calculateAge(dob: string | null) {
	if (!dob) return 0;

	const birthDate = new Date(dob);
	const today = new Date();

	let age = today.getFullYear() - birthDate.getFullYear();

	const monthDifference = today.getMonth() - birthDate.getMonth();

	if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
		age--;
	}

	return age;
}

function getProfileImage(user: ApiConnection) {
	if (user.profilepicture) {
		return user.profilepicture;
	}

	if (user.images) {
		try {
			const images = JSON.parse(user.images);

			if (Array.isArray(images) && images.length > 0) {
				return images[0];
			}
		} catch {
			// Invalid images JSON
		}
	}

	return "";
}

function mapConnectionToPerson(user: ApiConnection): Person {
	return {
		id: user.id,
		name: user.name,
		age: calculateAge(user.dob),
		image: getProfileImage(user),
		location: [user.state, user.country].filter(Boolean).join(", "),
		intent: user.goal || "",
	};
}

export default function Connections() {	

	const [connections, setConnections] = useState<ApiConnection[]>([]);

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	

	useEffect(() => {
		const loadConnections = async () => {
			try {
				setLoading(true);
				setError("");

				const data = await getAllYourMatches();

				setConnections(data);
			} catch (err) {
				console.error("Connections error:", err);

				setError(err instanceof Error ? err.message : "Unable to load connections.");
			} finally {
				setLoading(false);
			}
		};

		loadConnections();
	}, []);

	const filteredPeople = useMemo(() => {
		/*
		 * /allyourmatch currently gives us the connection list.
		 *
		 * It does NOT give us enough information to distinguish:
		 * - You like
		 * - Like you
		 * - Match
		 *
		 * so for now all four tabs use the returned connections.
		 *
		 * Once the API provides those relationship fields,
		 * we can filter them here.
		 */

		return connections.map(mapConnectionToPerson);
	}, [connections]);
	

	return (
		<>
			<Header />

			<section className="px-5 pb-24 pt-10 md:px-8 lg:px-10">
				{/* Header */}
				<div className="flex flex-wrap items-end justify-between gap-5">
					<div>
						<h1 className="text-3xl font-bold text-[#67307d]">Connections</h1>

						<p className="mt-2 font-medium text-gray-700">People who are interested in you</p>
					</div>
					
				</div>

				{/* Loading */}
				{loading && (
					<div className="mt-16 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
						{[1, 2, 3].map((item) => (
							<div key={item} className="h-107.5 animate-pulse rounded-[26px] bg-white" />
						))}
					</div>
				)}

				{/* Error */}
				{!loading && error && (
					<div className="mt-16 rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-600">{error}</div>
				)}

				{/* Empty */}
				{!loading && !error && filteredPeople.length === 0 && (
					<div className="mt-16 rounded-2xl bg-white px-5 py-12 text-center">
						<h2 className="text-lg font-semibold text-gray-800">No connections yet</h2>

						<p className="mt-2 text-sm text-gray-500">Your connections will appear here.</p>
					</div>
				)}

				{/* People */}
				{!loading && !error && filteredPeople.length > 0 && (
					<div className="mt-16 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
						{filteredPeople.map((person) => (
							<PersonCard key={person.id} person={person} />
						))}
					</div>
				)}
				
			</section>
		</>
	);
}
