import { Heart, MapPin, MessageCircle, X } from "lucide-react";
import { Link } from "react-router-dom";

import type { Person } from "../types";

type PersonCardProps = {
	person: Person;
	showActions?: boolean;
};

export default function PersonCard({ person, showActions = true }: PersonCardProps) {
	const handleLike = () => {
		console.log(`Liked ${person.name}`);
	};

	const handleDislike = () => {
		console.log(`Passed ${person.name}`);
	};

	

	return (
		<article className="group overflow-hidden rounded-[26px] bg-white shadow-[0_8px_25px_rgba(20,10,20,.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(20,10,20,.12)]">
			{/* Image */}

			<div className="relative h-82.5 overflow-hidden">
				<img
					src={person.image}
					alt={person.name}
					className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
				/>

				{/* Gradient */}

				<div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black/70 to-transparent" />

				{/* Online */}

				<span className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium backdrop-blur">
					<span className="h-2 w-2 rounded-full bg-green-500" />
					Online
				</span>

				{/* Name over image */}

				<div className="absolute bottom-5 left-5 right-5 text-white">
					<div className="flex items-center gap-2">
						<h2 className="text-xl font-bold">{person.name}</h2>

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
				{/* Intent */}

				<div className="mb-5 flex items-center justify-center">
					<div className="flex justify-center items-center gap-10">
						<p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
							Looking for
						</p>

						<span className="inline-block rounded-full bg-[#f9e8ef] px-4 py-1.5 text-xs font-medium text-[#ca2e6b]">
							{person.intent}
						</span>
					</div>

					{person.state && <span className="text-xs text-gray-400">{person.state}</span>}
				</div>

				{/* Actions */}

				{showActions && (
					<div className="flex items-center justify-between gap-3">
						{/* Pass */}

						<button
							onClick={handleDislike}
							aria-label={`Pass on ${person.name}`}
							className="grid h-11 w-11 place-items-center rounded-full border border-gray-200 text-gray-500 transition hover:border-red-300 hover:bg-red-50 hover:text-red-500">
							<X size={20} />
						</button>

						{/* Message */}

						<Link
							to={`/message?receiver_id=${person.id}`}
							className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[#ca2e6b] py-3 text-sm font-medium text-[#ca2e6b] transition hover:bg-[#ca2e6b] hover:text-white">
							<MessageCircle size={17} />
							Message
						</Link>

						{/* Like */}

						<button
							onClick={handleLike}
							aria-label={`Like ${person.name}`}
							className="grid h-11 w-11 place-items-center rounded-full bg-linear-to-r from-[#ca2e6b] to-[#67307d] text-white shadow-md transition hover:scale-105">
							<Heart size={19} fill="currentColor" />
						</button>
					</div>
				)}

				{/* Connection state */}

				{!showActions && (
					<div className="flex items-center gap-3">
						<Link
							to={`/message?receiver_id=${person.id}`}
							className="flex flex-1 items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#ca2e6b] to-[#67307d] py-3 text-sm font-medium text-white">
							<MessageCircle size={17} />
							Message
						</Link>

						<button
							onClick={handleLike}
							className="grid h-11 w-11 place-items-center rounded-full border border-gray-200 text-[#ca2e6b]">
							<Heart size={19} fill={person.match ? "currentColor" : "none"} />
						</button>
					</div>
				)}
			</div>
		</article>
	);
}
