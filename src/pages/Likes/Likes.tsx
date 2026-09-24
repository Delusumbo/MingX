import { useEffect, useState } from "react";

import Header from "../../components/Header";
import PersonCard from "../../components/PersonCard";

import type { Person } from "../../types";

import { getLikedUsers } from "../../services/likedService";

type Tab = "likedYou" | "likedByYou";

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

function mapPeople(users: any[]): Person[] {
	return users.map((user: any) => {
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
			state: user.state,
			intent: user.goal,
		};
	});
}

export default function Likes() {
	const [activeTab, setActiveTab] = useState<Tab>("likedYou");

	const [likedByYou, setLikedByYou] = useState<Person[]>([]);
	const [likedYou, setLikedYou] = useState<Person[]>([]);
	const [likedByYouIds, setLikedByYouIds] = useState<number[]>([]);

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const loadData = async () => {
			try {
				setLoading(true);
				setError("");

				const data = await getLikedUsers();

				const whoYouLiked = data.whoyouliked ?? [];
				const whoLikedYou = data.wholikedyou ?? [];

				setLikedByYou(mapPeople(whoYouLiked));
				setLikedYou(mapPeople(whoLikedYou));
				setLikedByYouIds(whoYouLiked.map((user: any) => user.id));
			} catch (error) {
				console.error("Likes error:", error);

				setError(error instanceof Error ? error.message : "Unable to load likes.");
			} finally {
				setLoading(false);
			}
		};

		loadData();
	}, []);

	const handleLikedByYouChange = (userId: number, isLiked: boolean) => {
		setLikedByYouIds((current) => {
			if (isLiked) {
				return current.includes(userId) ? current : [...current, userId];
			}

			return current.filter((id) => id !== userId);
		});

		if (!isLiked) {
			setLikedByYou((current) => current.filter((person) => person.id !== userId));
		}
	};

	const handleLikedYouChange = (userId: number, isLiked: boolean) => {
		setLikedByYouIds((current) => {
			if (isLiked) {
				return current.includes(userId) ? current : [...current, userId];
			}

			return current.filter((id) => id !== userId);
		});
	};

	const tabs: { key: Tab; label: string; count: number }[] = [
		{ key: "likedYou", label: "Who Liked You", count: likedYou.length },
		{ key: "likedByYou", label: "Your Likes", count: likedByYou.length },
	];

	return (
		<>
			<Header />

			<section className="min-h-[calc(100vh-76px)] bg-[#f7f7f7] px-5 pb-24 pt-10 md:px-8 lg:px-10 lg:pt-12">
				<div className="mb-10">
					<h1 className="text-3xl font-bold text-[#67307d]">Likes</h1>
				</div>

				{/* Tabs */}
				<div className="mb-10 flex gap-2 border-b border-gray-200">
					{tabs.map((tab) => (
						<button
							key={tab.key}
							type="button"
							onClick={() => setActiveTab(tab.key)}
							className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition ${
								activeTab === tab.key ? "text-[#ca2e6b]" : "text-gray-500 hover:text-gray-700"
							}`}>
							{tab.label}

							<span
								className={`rounded-full px-2 py-0.5 text-xs ${
									activeTab === tab.key
										? "bg-[#f9e8ef] text-[#ca2e6b]"
										: "bg-gray-100 text-gray-500"
								}`}>
								{tab.count}
							</span>

							{activeTab === tab.key && (
								<span className="absolute inset-x-0 -bottom-px h-0.5 bg-[#ca2e6b]" />
							)}
						</button>
					))}
				</div>

				{loading && <div className="py-20 text-center text-gray-500">Loading your likes...</div>}

				{!loading && error && (
					<div className="rounded-xl bg-red-50 px-5 py-4 text-center text-sm text-red-600">
						{error}
					</div>
				)}

				{!loading && !error && activeTab === "likedYou" && (
					<>
						{likedYou.length === 0 ? (
							<div className="py-20 text-center text-gray-500">No likes yet.</div>
						) : (
							<div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
								{likedYou.map((person) => (
									<PersonCard
										key={person.id}
										person={person}
										showActions={false}
										isLiked={likedByYouIds.includes(person.id)}
										onLiked={handleLikedYouChange}
									/>
								))}
							</div>
						)}
					</>
				)}

				{!loading && !error && activeTab === "likedByYou" && (
					<>
						{likedByYou.length === 0 ? (
							<div className="py-20 text-center text-gray-500">
								You haven't liked anyone yet. Head to Discover to find people.
							</div>
						) : (
							<div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
								{likedByYou.map((person) => (
									<PersonCard
										key={person.id}
										person={person}
										showActions={false}
										isLiked={true}
										onLiked={handleLikedByYouChange}
									/>
								))}
							</div>
						)}
					</>
				)}
			</section>
		</>
	);
}
