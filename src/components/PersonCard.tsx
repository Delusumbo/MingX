import { useState, useEffect } from "react";
import { Heart, MapPin, MessageCircle, UserRound } from "lucide-react";
import { Link } from "react-router-dom";

import PersonProfileLink from "./PersonProfileLink";
import { likeUser, unlikeUser } from "../services/likeService";
import type { ApiPerson } from "../services/discoverService";
import { getApiMessage } from "../utils/apiMessages";

import type { Person } from "../types";

type PersonCardProps = {
	person: Person;
	showActions?: boolean;
	isLiked?: boolean;
	onLiked?: (userId: number, isLiked: boolean) => void;
	onFeedback?: (message: string, isError: boolean) => void;
	profile?: ApiPerson;
	presenceStatus?: "online" | "offline" | null;
};

export default function PersonCard({
	person,
	showActions = true,
	isLiked = false,
	onLiked,
	onFeedback,
	profile,
	presenceStatus,
}: PersonCardProps) {
	const [liking, setLiking] = useState(false);
	const [liked, setLiked] = useState(isLiked);
	const [feedback, setFeedback] = useState<{ message: string; error: boolean } | null>(null);

	useEffect(() => {
		setLiked(isLiked);
	}, [isLiked]);

	

	const handleLike = async () => {
		if (liking) return;

		try {
			setLiking(true);

			const response = liked ? await unlikeUser(person.id) : await likeUser(person.id);
			if (liked) {
				setLiked(false);
			} else {
				setLiked(true);
			}

			const feedbackMessage = getApiMessage(response, liked ? "Like removed." : "Liked.");
			if (onFeedback) {
				onFeedback(feedbackMessage, false);
			} else {
				setFeedback({ message: feedbackMessage, error: false });
			}
			onLiked?.(person.id, !liked);
		} catch (error) {
			console.error("Like/unlike error:", error);
			const feedbackMessage = getApiMessage(error);
			if (onFeedback) {
				onFeedback(feedbackMessage, true);
			} else {
				setFeedback({ message: feedbackMessage, error: true });
			}
		} finally {
			setLiking(false);
		}
	};

	return (
		<article className="group overflow-hidden rounded-[26px] bg-white shadow-[0_8px_25px_rgba(20,10,20,.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(20,10,20,.12)]">
			{/* Image */}
			<div className="relative h-82.5 overflow-hidden">
				<PersonProfileLink
					personId={person.id}
					personName={person.name}
					state={profile ? { profile } : undefined}
					className="absolute inset-0"
					aria-label={`View ${person.name}'s profile`}>
					<img
						src={person.image}
						alt={person.name}
						className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
					/>
				</PersonProfileLink>

				<div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black/70 to-transparent" />

				{presenceStatus && (
					<span className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium capitalize backdrop-blur">
						<span
							className={`h-2 w-2 rounded-full ${
								presenceStatus === "online" ? "bg-green-500" : "bg-gray-400"
							}`}
						/>
						{presenceStatus}
					</span>
				)}

				{/* Name */}
				<div className="absolute bottom-5 left-5 right-5 text-white">
					<div className="flex items-center gap-2">
						<h2 className="text-xl font-bold">
							<PersonProfileLink
								personId={person.id}
								personName={person.name}
								state={profile ? { profile } : undefined}
								className="transition hover:underline">
								{person.name}
							</PersonProfileLink>
						</h2>

						<span className="text-sm">{person.age}</span>
					</div>

					<div className="mt-1 flex items-center gap-1 text-sm text-white/90">
						<MapPin size={14} />

						<span>{person.location}</span>
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="p-5">
				{feedback && (
					<p
						role={feedback.error ? "alert" : "status"}
						className={`mb-4 text-sm ${feedback.error ? "text-red-600" : "text-green-700"}`}>
						{feedback.message}
					</p>
				)}
				{/* Intent */}
				<div className="mb-5 flex items-center justify-between gap-4">
					<div className="flex items-center gap-3">
						<p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
							Looking for
						</p>

						<span className="rounded-full bg-[#f9e8ef] px-4 py-1.5 text-xs font-medium text-[#ca2e6b]">
							{person.intent}
						</span>
					</div>

					{person.location && <span className="text-xs text-gray-400">{person.location}</span>}
				</div>

				{/* Actions */}
				{showActions && (
					<div className="flex items-center justify-between gap-3">						

						{/* Message */}
						<Link
							to="/message"
							state={{ person: { id: person.id, name: person.name, image: person.image } }}
							className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[#ca2e6b] py-3 text-sm font-medium text-[#ca2e6b] transition hover:bg-[#ca2e6b] hover:text-white">
							<MessageCircle size={17} />
							Message
						</Link>

						{/* Like */}
						<button
							type="button"
							onClick={handleLike}
							disabled={liking}
							aria-label={liked ? `Unlike ${person.name}` : `Like ${person.name}`}
							className="grid h-11 w-11 place-items-center rounded-full border border-gray-200 text-[#ca2e6b] disabled:opacity-60">
							<Heart size={19} fill={liked ? "currentColor" : "none"} />
						</button>
					</div>
				)}

				{/* Connection state */}
				{!showActions && (
					<div className="flex items-center gap-3">
						{profile && (
							<PersonProfileLink
								personId={person.id}
								personName={person.name}
								state={{ profile }}
								className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[#67307d] py-3 text-sm font-medium text-[#67307d] transition hover:bg-[#67307d] hover:text-white">
								<UserRound size={17} />
								View profile
							</PersonProfileLink>
						)}
						<Link
							to="/message"
							state={{ person: { id: person.id, name: person.name, image: person.image } }}
							className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[#ca2e6b] py-3 text-sm font-medium text-[#ca2e6b] transition hover:bg-[#ca2e6b] hover:text-white">
							<MessageCircle size={17} />
							Message
						</Link>

						<button
							type="button"
							onClick={handleLike}
							disabled={liking}
							className="grid h-11 w-11 place-items-center rounded-full border border-gray-200 text-[#ca2e6b] disabled:opacity-60">
							<Heart size={19} fill={liked ? "currentColor" : "none"} />
						</button>
					</div>
				)}
			</div>
		</article>
	);
}
