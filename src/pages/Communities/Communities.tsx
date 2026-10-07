import { useEffect, useMemo, useState } from "react";
import { ChevronRight, Search, UsersRound, Plus, X, MessagesSquare } from "lucide-react";

import { Header } from "../../components/Layout";
import {
	createCommunity,
	getCommunities,	
	joinCommunity,
	leaveCommunity,
	checkCommunityMembership,
	getCommunityMessages,
	sendCommunityMessage,
} from "../../services/communityService";

type ApiCommunity = {
	id: number;
	name: string;
	description: string | null;
	region: string;
	image: string | null;
	created_by: number;
	is_active: boolean;
	members_count: number;
};

type Community = {
	id: number;
	name: string;
	description: string;
	region: string;
	image: string | null;
	members: number;
	created_by: number;
};

type CommunityMessage = {
	id: number | string;
	message_text?: string;
	message?: string;
	file?: string | null;
	attachment?: string | null;
	created_at?: string;
	sender_name?: unknown;
	user?: {
		id?: number;
		name?: string;
		firstname?: string;
		lastname?: string;
	};
	[key: string]: unknown;
};

function mapCommunity(data: ApiCommunity): Community {
	return {
		id: data.id,
		name: data.name,
		description: data.description ?? "",
		region: data.region,
		image: data.image,
		members: data.members_count,
		created_by: data.created_by,
	};
}

export default function Communities() {
	const [communities, setCommunities] = useState<Community[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [currentUserId, setCurrentUserId] = useState<number | null>(null);

	const [search, setSearch] = useState("");

	const [showCreate, setShowCreate] = useState(false);

	const [creating, setCreating] = useState(false);

	// Selected community
	const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
	

	// Membership
	const [isMember, setIsMember] = useState(false);
	const [checkingMembership, setCheckingMembership] = useState(false);

	// Community messages
	const [messages, setMessages] = useState<CommunityMessage[]>([]);
	const [loadingMessages, setLoadingMessages] = useState(false);

	// Sending messages
	const [messageText, setMessageText] = useState("");
	const [messageFile, setMessageFile] = useState<File | null>(null);
	const [sendingMessage, setSendingMessage] = useState(false);

	// Leaving community
	const [leavingId, setLeavingId] = useState<number | null>(null);

	

	const [formData, setFormData] = useState({
		name: "",
		description: "",
		region: "",
	});

	const [image, setImage] = useState<File | null>(null);

	const [joiningId, setJoiningId] = useState<number | null>(null);

	useEffect(() => {
		try {
			const storedUser = localStorage.getItem("user");

			if (storedUser) {
				const user = JSON.parse(storedUser);

				if (user?.id) {
					setCurrentUserId(Number(user.id));
				}
			}
		} catch (error) {
			console.error("Failed to load communities:", error);

			const message = error instanceof Error ? error.message : "Unable to load communities.";

			setError(message);
			showToast("error", message);
		}
	}, []);

	const [toast, setToast] = useState<{
		type: "success" | "error";
		message: string;
	} | null>(null);

	const showToast = (type: "success" | "error", message: string) => {
		setToast({
			type,
			message,
		});

		setTimeout(() => {
			setToast(null);
		}, 4000);
	};

	// --------------------------------------------------
	// LOAD COMMUNITIES
	// --------------------------------------------------

	const loadCommunities = async () => {
		try {
			setLoading(true);
			setError("");

			const data = await getCommunities();

			if (!Array.isArray(data)) {
				throw new Error("Invalid communities response.");
			}

			const mapped = data.map((community) => mapCommunity(community as ApiCommunity));

			setCommunities(mapped);
		} catch (error) {
			console.error("Failed to load communities:", error);

			const message = error instanceof Error ? error.message : "Unable to load communities.";

			setError(message);
			showToast("error", message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadCommunities();
	}, []);

	// --------------------------------------------------
	// SEARCH
	// --------------------------------------------------

	// --------------------------------------------------
	// SEARCH
	// --------------------------------------------------

	const filteredCommunities = useMemo(() => {
		const searchTerm = search.trim().toLowerCase();

		if (!searchTerm) {
			return communities;
		}

		return communities.filter((community) => {
			const name = String(community.name ?? "").toLowerCase();
			const description = String(community.description ?? "").toLowerCase();
			const region = String(community.region ?? "").toLowerCase();

			return (
				name.includes(searchTerm) || description.includes(searchTerm) || region.includes(searchTerm)
			);
		});
	}, [communities, search]);

	// --------------------------------------------------
	// CREATE COMMUNITY
	// --------------------------------------------------

	const handleCreateCommunity = async () => {
		if (!formData.name.trim()) {
			return;
		}

		if (!formData.region.trim()) {
			return;
		}

		try {
			setCreating(true);
			setError("");

			await createCommunity({
				name: formData.name.trim(),
				description: formData.description.trim(),
				region: formData.region.trim(),
				image,
			});
			showToast("success", "Community created successfully.");

			setFormData({
				name: "",
				description: "",
				region: "",
			});

			setImage(null);
			setShowCreate(false);

			await loadCommunities();
		} catch (error) {
			console.error("Failed to load communities:", error);

			const message = error instanceof Error ? error.message : "Unable to load communities.";

			setError(message);
			showToast("error", message);
		} finally {
			setCreating(false);
		}
	};

	// --------------------------------------------------
	// JOIN COMMUNITY
	// --------------------------------------------------

	const handleJoinCommunity = async (community: Community) => {
		try {
			setJoiningId(community.id);

			const membership = await checkCommunityMembership(community.id);

			if (
				typeof membership === "object" &&
				membership !== null &&
				"is_member" in membership &&
				Boolean((membership as { is_member: unknown }).is_member)
			) {
				showToast("error", "You are already a member of this community.");

				setIsMember(true);
				return;
			}

			await joinCommunity(community.id);

			showToast("success", `You joined ${community.name} successfully.`);

			setIsMember(true);

			await loadCommunities();
		} catch (error) {
			const message = error instanceof Error ? error.message : "Unable to join community.";

			showToast("error", message);
		} finally {
			setJoiningId(null);
		}
	};

	const handleViewCommunity = async (community: Community) => {
		setSelectedCommunity(community);
		setMessages([]);
		setIsMember(false);

		try {
			setCheckingMembership(true);

			const membership = await checkCommunityMembership(community.id);

			if (typeof membership === "object" && membership !== null && "is_member" in membership) {
				setIsMember(Boolean((membership as { is_member: unknown }).is_member));
			}

			await loadMessages(community.id);
		} catch (error) {
			const message = error instanceof Error ? error.message : "Unable to load community details.";

			showToast("error", message);
		} finally {
			setCheckingMembership(false);
		}
	};
	
	const handleLeaveCommunity = async (community: Community) => {
		const confirmed = window.confirm(`Are you sure you want to leave ${community.name}?`);

		if (!confirmed) return;

		try {
			setLeavingId(community.id);

			await leaveCommunity(community.id);

			setIsMember(false);

			showToast("success", `You have left ${community.name} successfully.`);

			await loadCommunities();
		} catch (error) {
			const message = error instanceof Error ? error.message : "Unable to leave community.";

			showToast("error", message);
		} finally {
			setLeavingId(null);
		}
	};

	const loadMessages = async (communityId: number) => {
		try {
			setLoadingMessages(true);

			const data = await getCommunityMessages(communityId);
			console.log("Community messages response:", data);

			let messageList: unknown[] = [];

			if (Array.isArray(data)) {
				messageList = data;
			} else if (
				typeof data === "object" &&
				data !== null &&
				"data" in data &&
				Array.isArray((data as { data: unknown }).data)
			) {
				messageList = (data as { data: unknown[] }).data;
			} else if (
				typeof data === "object" &&
				data !== null &&
				"messages" in data &&
				Array.isArray((data as { messages: unknown }).messages)
			) {
				messageList = (data as { messages: unknown[] }).messages;
			}

			setMessages(messageList as CommunityMessage[]);
		} catch (error) {
			const message = error instanceof Error ? error.message : "Unable to load messages.";

			showToast("error", message);
		} finally {
			setLoadingMessages(false);
		}
	};

	const handleSendMessage = async () => {
		if (!selectedCommunity) return;

		if (!messageText.trim() && !messageFile) {
			showToast("error", "Please enter a message or attach a file.");
			return;
		}

		try {
			setSendingMessage(true);

			await sendCommunityMessage(selectedCommunity.id, messageText.trim(), messageFile);

			setMessageText("");
			setMessageFile(null);

			showToast("success", "Message sent successfully.");

			await loadMessages(selectedCommunity.id);
		} catch (error) {
			const message = error instanceof Error ? error.message : "Unable to send message.";

			showToast("error", message);
		} finally {
			setSendingMessage(false);
		}
	};

	return (
		<>
			<Header />
			{toast && (
				<div className="fixed right-5 top-5 z-100 w-[calc(100%-40px)] max-w-sm">
					<div
						className={`flex items-start gap-3 rounded-2xl border bg-white p-4 shadow-2xl ${
							toast.type === "success" ? "border-green-200" : "border-red-200"
						}`}>
						<div
							className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold ${
								toast.type === "success" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
							}`}>
							{toast.type === "success" ? "✓" : "!"}
						</div>

						<div className="min-w-0 flex-1">
							<p
								className={`text-sm font-semibold ${
									toast.type === "success" ? "text-green-700" : "text-red-700"
								}`}>
								{toast.type === "success" ? "Success" : "Error"}
							</p>

							<p className="mt-1 wrap-break-words text-sm text-gray-600">{toast.message}</p>
						</div>

						<button
							type="button"
							onClick={() => setToast(null)}
							className="text-gray-400 transition hover:text-gray-700">
							<X size={18} />
						</button>
					</div>
				</div>
			)}

			<section className="px-5 pb-24 pt-10 md:px-8 lg:px-10">
				<div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
					<div>
						<h1 className="text-3xl font-bold text-[#67307d]">Communities</h1>

						<p className="mt-2 font-medium text-gray-700">Connect with your diaspora communities</p>
					</div>

					<button
						type="button"
						onClick={() => setShowCreate(true)}
						className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#ca2e6b] to-[#67307d] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90">
						<Plus size={18} />
						Create Community
					</button>
				</div>

				{/* SEARCH */}

				<div className="mt-8 flex flex-col gap-3 sm:flex-row">
					<div className="relative max-w-xl flex-1">
						<Search size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

						<input
							type="text"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search communities..."
							className="h-12 w-full rounded-xl border-none bg-white pl-11 pr-4 text-sm outline-none shadow-sm focus:ring-2 focus:ring-[#ca2e6b]/20"
						/>
					</div>
				</div>

				{/* ERROR */}

				{error && (
					<div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
				)}

				{/* LOADING */}

				{loading ? (
					<div className="mt-12 rounded-[30px] bg-white px-6 py-16 text-center shadow-sm">
						<p className="text-sm font-medium text-gray-500">Loading communities...</p>
					</div>
				) : filteredCommunities.length === 0 ? (
					<div className="mt-12 rounded-[30px] bg-white px-6 py-16 text-center shadow-sm">
						<div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#f9e8ef] text-[#ca2e6b]">
							<UsersRound size={30} />
						</div>

						<h2 className="mt-5 text-lg font-bold text-gray-800">No communities found</h2>

						<p className="mt-2 text-sm text-gray-500">
							Try a different search or create a new community.
						</p>
					</div>
				) : (
					<div className="mt-12 grid gap-8 md:grid-cols-2">
						{filteredCommunities.map((community) => (
							<article
								key={community.id}
								onClick={() => handleViewCommunity(community)}
								className="flex min-h-48.7 items-center gap-5 rounded-[42px] bg-white px-8 py-7 shadow-[0_12px_24px_rgba(20,10,20,.08)] transition hover:-translate-y-1 hover:shadow-[0_16px_30px_rgba(20,10,20,.12)]">
								{/* COMMUNITY IMAGE */}

								<div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl">
									{community.image ? (
										<img
											src={community.image}
											alt={community.name}
											className="h-full w-full object-cover"
										/>
									) : (
										<div className="grid h-full w-full place-items-center bg-linear-to-b from-[#ca2e6b] to-[#713183] text-white">
											<UsersRound size={40} />
										</div>
									)}
								</div>

								{/* CONTENT */}

								<div className="min-w-0 flex-1">
									<h2 className="text-xl font-semibold text-gray-900">{community.name}</h2>

									<p className="mt-1 line-clamp-2 text-sm text-gray-500">
										{community.description || "No description provided."}
									</p>

									<div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-500">
										<span>
											<UsersRound size={15} className="mr-2 inline" />
											{community.members} {community.members === 1 ? "member" : "members"}
										</span>

										<span className="rounded-full border border-[#ca2e6b] px-4 py-1 text-xs text-[#ca2e6b]">
											{community.region}
										</span>
									</div>

									{currentUserId === community.created_by ? (
										<button
											type="button"
											disabled
											className="mt-5 rounded-xl border border-[#67307d] bg-[#f7f1f9] px-5 py-2.5 text-sm font-semibold text-[#67307d]">
											{" "}
											Creator{" "}
										</button>
									) : (
										<button
											type="button"
											onClick={() => handleJoinCommunity(community)}
											disabled={joiningId === community.id}
											className="mt-5 rounded-xl bg-[#67307d] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#ca2e6b] disabled:cursor-not-allowed disabled:opacity-50">
											{" "}
											{joiningId === community.id ? "Joining..." : "Join Community"}{" "}
										</button>
									)}
								</div>

								<ChevronRight className="shrink-0 text-gray-400" size={22} />
							</article>
						))}
					</div>
				)}
			</section>

			{/* CREATE COMMUNITY MODAL */}

			{showCreate && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5">
					<div className="w-full max-w-lg rounded-[28px] bg-white p-6 shadow-2xl md:p-8">
						<div className="flex items-center justify-between">
							<div>
								<h2 className="text-2xl font-bold text-[#67307d]">Create Community</h2>

								<p className="mt-1 text-sm text-gray-500">Create a space for people to connect.</p>
							</div>

							<button
								type="button"
								onClick={() => setShowCreate(false)}
								className="grid h-9 w-9 place-items-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200">
								<X size={18} />
							</button>
						</div>

						<div className="mt-7 space-y-4">
							<input
								type="text"
								value={formData.name}
								onChange={(event) =>
									setFormData({
										...formData,
										name: event.target.value,
									})
								}
								placeholder="Community name"
								className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-[#67307d]"
							/>

							<textarea
								value={formData.description}
								onChange={(event) =>
									setFormData({
										...formData,
										description: event.target.value,
									})
								}
								placeholder="Community description"
								className="h-28 w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#67307d]"
							/>

							<input
								type="text"
								value={formData.region}
								onChange={(event) =>
									setFormData({
										...formData,
										region: event.target.value,
									})
								}
								placeholder="Region e.g. Lagos"
								className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-[#67307d]"
							/>

							<div>
								<label className="mb-2 block text-sm font-medium text-gray-700">
									Community image
								</label>

								<input
									type="file"
									accept="image/jpeg,image/png,image/jpg,image/gif"
									onChange={(event) => setImage(event.target.files?.[0] ?? null)}
									className="block w-full text-sm text-gray-500"
								/>
							</div>
						</div>

						<div className="mt-7 flex gap-3">
							<button
								type="button"
								onClick={() => setShowCreate(false)}
								className="flex-1 rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600">
								Cancel
							</button>

							<button
								type="button"
								onClick={handleCreateCommunity}
								disabled={creating || !formData.name.trim() || !formData.region.trim()}
								className="flex-1 rounded-xl bg-linear-to-r from-[#ca2e6b] to-[#67307d] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">
								{creating ? "Creating..." : "Create Community"}
							</button>
						</div>
					</div>
				</div>
			)}

			{/* COMMUNITY DETAILS AND CHAT MODAL */}

			{selectedCommunity && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-3 py-5">
					<div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl">
						{/* HEADER */}

						<div className="flex items-center justify-between border-b border-gray-100 p-5 md:p-7">
							<div className="flex min-w-0 items-center gap-4">
								<div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl">
									{selectedCommunity.image ? (
										<img
											src={selectedCommunity.image}
											alt={selectedCommunity.name}
											className="h-full w-full object-cover"
										/>
									) : (
										<div className="grid h-full w-full place-items-center bg-[#67307d] text-white">
											<UsersRound size={28} />
										</div>
									)}
								</div>

								<div className="min-w-0">
									<h2 className="truncate text-xl font-bold text-[#67307d]">
										{selectedCommunity.name}
									</h2>

									<p className="text-sm text-gray-500">
										{selectedCommunity.region}
										{" · "}
										{selectedCommunity.members} members
									</p>
								</div>
							</div>

							<button
								type="button"
								onClick={() => {
									setSelectedCommunity(null);									
									setMessages([]);
								}}
								className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200">
								<X size={20} />
							</button>
						</div>

						{/* COMMUNITY DESCRIPTION */}

						<div className="border-b border-gray-100 px-5 py-4 md:px-7">
							<p className="text-sm leading-6 text-gray-600">
								{selectedCommunity.description || "No description provided."}
							</p>

							{checkingMembership ? (
								<p className="mt-3 text-sm text-gray-400">Checking membership...</p>
							) : currentUserId === selectedCommunity.created_by ? (
								<span className="mt-3 inline-block rounded-full bg-purple-50 px-4 py-2 text-xs font-semibold text-[#67307d]">
									Community Creator
								</span>
							) : isMember ? (
								<button
									type="button"
									onClick={() => handleLeaveCommunity(selectedCommunity)}
									disabled={leavingId === selectedCommunity.id}
									className="mt-3 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50">
									{leavingId === selectedCommunity.id ? "Leaving..." : "Leave Community"}
								</button>
							) : (
								<button
									type="button"
									onClick={() => handleJoinCommunity(selectedCommunity)}
									disabled={joiningId === selectedCommunity.id}
									className="mt-3 rounded-xl bg-[#67307d] px-4 py-2 text-sm font-semibold text-white hover:bg-[#ca2e6b] disabled:opacity-50">
									{joiningId === selectedCommunity.id ? "Joining..." : "Join Community"}
								</button>
							)}
						</div>

						{/* MESSAGES */}

						<div className="flex-1 space-y-4 overflow-y-auto bg-gray-50 p-5 md:p-7">
							<h3 className="font-semibold text-gray-800">Community Discussion</h3>

							{loadingMessages ? (
								<div className="py-12 text-center text-sm text-gray-500">Loading messages...</div>
							) : messages.length === 0 ? (
								<div className="rounded-2xl bg-white p-8 text-center">
									<MessagesSquare size={35} className="mx-auto text-gray-300" />

									<p className="mt-3 text-sm text-gray-500">No messages yet.</p>

									<p className="mt-1 text-xs text-gray-400">
										Start a conversation with the community.
									</p>
								</div>
							) : (
								messages.map((message, index) => {
									const senderName =
										(typeof message.sender_name === "string" && message.sender_name.trim()) ||
										[message.user?.firstname, message.user?.lastname].filter(Boolean).join(" ") ||
										message.user?.name ||
										"Community member";

									const messageBody = message.message_text || message.message || "";

									const attachment = message.file || message.attachment;

									return (
										<div key={message.id ?? index} className="rounded-2xl bg-white p-4 shadow-sm">
											<div className="flex items-center justify-between gap-3">
												<p className="text-sm font-semibold text-[#67307d]">{senderName}</p>

												{message.created_at && (
													<time className="shrink-0 text-xs text-gray-400">
														{new Date(message.created_at).toLocaleString()}
													</time>
												)}
											</div>

											{messageBody && (
												<p className="mt-2 whitespace-pre-wrap wrap-break-words text-sm leading-6 text-gray-700">
													{messageBody}
												</p>
											)}

											{attachment && (
												<a
													href={attachment}
													target="_blank"
													rel="noopener noreferrer"
													className="mt-3 inline-block text-sm font-medium text-[#ca2e6b] underline">
													View attachment
												</a>
											)}
										</div>
									);
								})
							)}
						</div>

						{/* MESSAGE COMPOSER */}

						<div className="border-t border-gray-100 bg-white p-5 md:p-7">
							{!isMember && currentUserId !== selectedCommunity.created_by ? (
								<p className="text-center text-sm text-gray-500">
									Join this community to participate in discussions.
								</p>
							) : (
								<>
									{messageFile && (
										<div className="mb-3 flex items-center justify-between rounded-xl bg-purple-50 px-4 py-3">
											<span className="truncate text-sm text-[#67307d]">{messageFile.name}</span>

											<button
												type="button"
												onClick={() => setMessageFile(null)}
												className="ml-3 text-red-500">
												<X size={18} />
											</button>
										</div>
									)}

									<textarea
										value={messageText}
										onChange={(event) => setMessageText(event.target.value)}
										placeholder="Write a message..."
										rows={3}
										className="w-full resize-none rounded-xl border border-gray-200 p-4 text-sm outline-none focus:border-[#67307d]"
									/>

									<div className="mt-3 flex items-center justify-between gap-3">
										<label className="cursor-pointer rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">
											Attach file
											<input
												type="file"
												className="hidden"
												onChange={(event) => setMessageFile(event.target.files?.[0] ?? null)}
											/>
										</label>

										<button
											type="button"
											onClick={handleSendMessage}
											disabled={sendingMessage || (!messageText.trim() && !messageFile)}
											className="rounded-xl bg-linear-to-r from-[#ca2e6b] to-[#67307d] px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">
											{sendingMessage ? "Sending..." : "Send Message"}
										</button>
									</div>
								</>
							)}
						</div>
					</div>
				</div>
			)}
		</>
	);
}
