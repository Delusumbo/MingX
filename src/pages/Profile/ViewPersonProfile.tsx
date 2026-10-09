import { useEffect, useState } from "react";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";

import { Header } from "../../components/Layout";
import { getPeople, type ApiPerson } from "../../services/discoverService";
import { getPersonProfileSlug } from "../../components/PersonProfileLink";
import { getApiMessage } from "../../utils/apiMessages";

function parseList(value: string | null | undefined): string[] {
	if (!value) return [];
	try {
		const parsed: unknown = JSON.parse(value);
		if (Array.isArray(parsed)) {
			return parsed.filter((item): item is string => typeof item === "string");
		}
	} catch {
		// Interests may also be stored as comma-separated text.
	}
	return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function getAge(dob: string): number | null {
	const birthDate = new Date(dob);
	if (Number.isNaN(birthDate.getTime())) return null;

	const today = new Date();
	let age = today.getFullYear() - birthDate.getFullYear();
	if (
		today.getMonth() < birthDate.getMonth() ||
		(today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
	) {
		age--;
	}
	return age;
}

function getPreviousPageName(pathname: string): string {
	const pageNames: Record<string, string> = {
		"/discover": "Discover",
		"/share": "Share",
		"/communities": "Communities",
		"/message": "Messages",
		"/matches": "Matches",
		"/connections": "Connections",
		"/like": "Likes",
		"/swipe": "Swipe",
		"/profile": "Profile",
	};

	if (pageNames[pathname]) return pageNames[pathname];

	const pageSegment = pathname.split("/").filter(Boolean).at(-1);
	return pageSegment
		? pageSegment
				.split("-")
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(" ")
		: "Previous page";
}

export default function ViewPersonProfile() {
	const { personSlug } = useParams();
	const location = useLocation();
	const navigationState = location.state as
		| { profile?: ApiPerson; personId?: unknown; returnTo?: unknown }
		| null;
	const passedProfile = navigationState?.profile;
	const returnTo =
		typeof navigationState?.returnTo === "string" &&
		navigationState.returnTo.startsWith("/") &&
		!navigationState.returnTo.startsWith("/people/")
			? navigationState.returnTo
			: "/discover";
	const previousPageName = getPreviousPageName(returnTo.split(/[?#]/, 1)[0]);
	const parsedPersonId =
		typeof navigationState?.personId === "number" ||
		(typeof navigationState?.personId === "string" &&
			navigationState.personId.trim() !== "")
			? Number(navigationState.personId)
			: null;
	const [profile, setProfile] = useState<ApiPerson | null>(
		passedProfile &&
			(parsedPersonId === null || passedProfile.id === parsedPersonId)
			? passedProfile
			: null,
	);
	const [loading, setLoading] = useState(!profile);
	const [error, setError] = useState("");

	useEffect(() => {
		if (profile) return;

		let active = true;
		const loadProfile = async () => {
			try {
				setLoading(true);
				setError("");
				const people = await getPeople();
				const matchingProfile = people.find(
					(person): person is ApiPerson =>
						!("isblur" in person) &&
						(parsedPersonId !== null
							? person.id === parsedPersonId
							: getPersonProfileSlug(person.name) === personSlug),
				);

				if (!matchingProfile) {
					throw new Error("This profile could not be found.");
				}
				if (active) setProfile(matchingProfile);
			} catch (loadError) {
				if (active) setError(getApiMessage(loadError));
			} finally {
				if (active) setLoading(false);
			}
		};

		void loadProfile();
		return () => {
			active = false;
		};
	}, [parsedPersonId, personSlug, profile]);

	const images = parseList(profile?.images);
	const image = profile?.profilepicture || images[0];
	const extraImages = [...new Set(images)].filter((profileImage) => profileImage !== image);
	const interests = parseList(profile?.yourinterest);
	const age = profile ? getAge(profile.dob) : null;

	return (
		<>
			<Header />
			<main className="mx-auto max-w-5xl px-5 pb-24 pt-8 md:px-8">
				<Link
					to={returnTo}
					className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#67307d]">
					<ArrowLeft size={17} />
					Back to {previousPageName}
				</Link>

				{loading && <p className="py-16 text-center text-gray-500">Loading profile...</p>}
				{!loading && error && (
					<p role="alert" className="rounded-xl bg-red-50 px-5 py-4 text-center text-red-600">
						{error}
					</p>
				)}

				{!loading && !error && profile && (
					<>
						<section className="overflow-hidden rounded-3xl bg-white shadow-sm">
							<div className="grid md:grid-cols-[minmax(0,1fr)_1.1fr]">
								<div className="min-h-80 bg-gray-100">
									{image ? (
										<img
											src={image}
											alt={profile.name}
											className="h-full min-h-80 w-full object-cover"
										/>
									) : (
										<div className="grid h-full min-h-80 place-items-center text-gray-400">
											No profile photo
										</div>
									)}
								</div>
								<div className="flex flex-col justify-center p-7 md:p-10">
									<p className="text-sm font-semibold uppercase tracking-wide text-[#ca2e6b]">
										{profile.goal || profile.lookingfor || "MingX member"}
									</p>
									<h1 className="mt-2 text-3xl font-bold text-[#67307d]">
										{profile.name}
										{age !== null && <span className="ml-2 font-medium text-gray-500">{age}</span>}
									</h1>
									<p className="mt-3 text-gray-500">
										{[profile.state, profile.country].filter(Boolean).join(", ") ||
											"Location not provided"}
									</p>
									<p className="mt-6 whitespace-pre-wrap leading-7 text-gray-600">
										{profile.bio || "No introduction provided."}
									</p>
									<Link
										to="/message"
										state={{
											person: {
												id: profile.id,
												name: profile.name,
												image,
											},
										}}
										className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-linear-to-r from-[#ca2e6b] to-[#67307d] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90">
										<MessageCircle size={17} />
										Message {profile.name}
									</Link>
								</div>
							</div>
						</section>

						{extraImages.length > 0 && (
							<section className="mt-8">
								<h2 className="mb-4 text-xl font-semibold text-[#67307d]">
									{profile.name}&apos;s photos
								</h2>
								<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
									{extraImages.map((profileImage, index) => (
										<img
											key={profileImage}
											src={profileImage}
											alt={`${profile.name}, photo ${index + 2}`}
											loading="lazy"
											className="aspect-square w-full rounded-2xl bg-gray-100 object-cover shadow-sm"
										/>
									))}
								</div>
							</section>
						)}

						<section className="mt-8">
							<h2 className="mb-4 text-xl font-semibold text-[#67307d]">About {profile.name}</h2>
							<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
								{[
									["Gender", profile.gender],
									["Looking for", profile.lookingfor],
									["Interests", interests.join(", ")],
									["Height", profile.height],
									["Belief", profile.belief],
									["Sexual orientation", profile.sexual_orientation],
									["Zodiac sign", profile.zodiac_sign],
									["Education", profile.education_level],
									["Marital status", profile.maritalstatus],
								].map(([label, value]) => (
									<div key={label} className="rounded-2xl bg-white p-5 shadow-sm">
										<p className="text-sm text-gray-400">{label}</p>
										<p className="mt-1 font-medium text-gray-800">{value || "Not provided"}</p>
									</div>
								))}
							</div>
						</section>
					</>
				)}
			</main>
		</>
	);
}
