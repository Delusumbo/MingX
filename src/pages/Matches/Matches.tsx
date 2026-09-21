import { useRef, useState } from "react";
import { MessageCircle, Plus } from "lucide-react";
import { Header } from "../../components/Layout";
import cynthia from "../../assets/images/cynthia.png";
import margret from "../../assets/images/margret.png";
import sophie from "../../assets/images/sophie.png";
import astra from "../../assets/images/astra.png";
import monica from "../../assets/images/monica.png";
import kate from "../../assets/images/kate.png";
import joseph from "../../assets/images/joseph.png";
import { Icon } from "@iconify/react";

type Match = {
	name: string;
	image: string;
};

const matches: Match[] = [
	{ name: "Cynthia", image: cynthia },
	{ name: "Margret", image: margret },
	{ name: "Sophie", image: sophie },
	{ name: "Astra", image: astra },
	{ name: "Monica", image: monica },
	{ name: "Katrina", image: joseph },
	{ name: "Monique", image: margret },
	{ name: "Kate", image: kate },
	{ name: "Sonia", image: sophie },
	{ name: "April", image: astra },
	{ name: "Kholie", image: monica },
];

type Chat = Match & {
	unread: number;
	active: boolean;
};

const chats: Chat[] = [
	{
		name: "Cynthia Fish",
		image: cynthia,
		unread: 2,
		active: true,
	},
	{
		name: "Margret Hills",
		image: margret,
		unread: 0,
		active: true,
	},
	{
		name: "Monica Cyprus",
		image: monica,
		unread: 5,
		active: true,
	},
	{
		name: "Sophie Miller",
		image: sophie,
		unread: 0,
		active: false,
	},
	{
		name: "Astra Gaze",
		image: astra,
		unread: 0,
		active: false,
	},
];
type Message = {
	id: number;
	text: string;
	sender: "me" | "them";
	time: string;
};

const messages: Message[] = [
	{
		id: 1,
		text: "Hello sir",
		sender: "me",
		time: "Aug 31, 2:00pm",
	},
	{
		id: 2,
		text: "You can login now sir",
		sender: "me",
		time: "Aug 31, 2:00pm",
	},
	{
		id: 3,
		text: "Will do that now",
		sender: "them",
		time: "Aug 31, 2:00pm",
	},
];
type ChatFilter = "all" | "unread" | "active";

export default function Matches() {
	const [selected, setSelected] = useState<string | null>(null);
	const [chatFilter, setChatFilter] = useState<"all" | "unread" | "active">("all");
	const [menuOpen, setMenuOpen] = useState(false);
	const [isRecording, setIsRecording] = useState(false);
	const [voiceUrl, setVoiceUrl] = useState<string | null>(null);
	const [videoCallOpen, setVideoCallOpen] = useState(false);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const audioChunksRef = useRef<Blob[]>([]);
	const imageInputRef = useRef<HTMLInputElement>(null);
	const videoRef = useRef<HTMLVideoElement>(null);
	const videoStreamRef = useRef<MediaStream | null>(null);
	const filteredChats = chats.filter((chat) => {
		if (chatFilter === "unread") {
			return chat.unread > 0;
		}

		if (chatFilter === "active") {
			return chat.active;
		}

		return true;
	});

	const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: true,
			});

			const recorder = new MediaRecorder(stream);

			mediaRecorderRef.current = recorder;
			audioChunksRef.current = [];

			recorder.ondataavailable = (event) => {
				if (event.data.size > 0) {
					audioChunksRef.current.push(event.data);
				}
			};

			recorder.onstop = () => {
				const audioBlob = new Blob(audioChunksRef.current, {
					type: "audio/webm",
				});

				const url = URL.createObjectURL(audioBlob);
				setVoiceUrl(url);

				stream.getTracks().forEach((track) => track.stop());
			};

			recorder.start();

			setIsRecording(true);
		} catch (error) {
			console.error("Microphone error:", error);
			alert("Please allow microphone access to record a voice note.");
		}
	};

	const stopRecording = () => {
		if (mediaRecorderRef.current) {
			mediaRecorderRef.current.stop();
		}

		setIsRecording(false);
	};

	const startVideoCall = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: true,
				audio: true,
			});

			videoStreamRef.current = stream;
			setVideoCallOpen(true);

			// Wait for the video element to render
			setTimeout(() => {
				if (videoRef.current) {
					videoRef.current.srcObject = stream;
				}
			}, 100);
		} catch (error) {
			console.error("Camera error:", error);
			alert("Please allow camera and microphone access.");
		}
	};

	const endVideoCall = () => {
		if (videoStreamRef.current) {
			videoStreamRef.current.getTracks().forEach((track) => {
				track.stop();
			});

			videoStreamRef.current = null;
		}

		if (videoRef.current) {
			videoRef.current.srcObject = null;
		}

		setVideoCallOpen(false);
	};

	return (
		<>
			<Header searchPlaceholder="Search by name or message" />

			<section className="px-5 pb-24 pt-10 md:px-8 lg:px-10">
				<h1 className="text-3xl font-bold text-[#67307d]">Matches</h1>

				{/* Matches */}

				<div className="mt-6 flex gap-6 overflow-x-auto pb-3">
					{matches.map((match) => (
						<button
							key={match.name}
							onClick={() => setSelected(match.name)}
							className="min-w-19 text-center">
							<img
								src={match.image}
								className="mx-auto h-19 w-19 rounded-full border-2 border-[#ca2e6b] object-cover p-1"
							/>

							<span className="mt-2 block text-sm">{match.name}</span>
						</button>
					))}
				</div>

				<h2 className="mb-4 mt-8 text-lg font-semibold text-[#67307d]">Messages</h2>

				<div className="grid gap-5 lg:grid-cols-[380px_1fr]">
					{/* Chat list */}

					<div className="rounded-[22px] bg-white lg:p-4">
						<div className="mb-5 flex items-center gap-3">
							{/* All */}
							<button
								type="button"
								onClick={() => setChatFilter("all")}
								className={`rounded-full border px-5 py-2 text-sm transition ${
									chatFilter === "all"
										? "border-[#ca2e6b] bg-[#ca2e6b] text-white"
										: "border-[#ca2e6b] text-[#ca2e6b] hover:bg-[#fff5f8]"
								}`}>
								All
							</button>

							{/* Unread */}
							<button
								type="button"
								onClick={() => setChatFilter("unread")}
								className={`rounded-full border px-4 py-2 text-sm transition ${
									chatFilter === "unread"
										? "border-[#ca2e6b] bg-[#ca2e6b] text-white"
										: "border-[#ca2e6b] text-[#ca2e6b] hover:bg-[#fff5f8]"
								}`}>
								Unread
								<b
									className={`ml-2 rounded-full px-2 ${
										chatFilter === "unread" ? "bg-white text-[#ca2e6b]" : "bg-[#f5e6ed]"
									}`}>
									2
								</b>
							</button>

							{/* Active */}
							<button
								type="button"
								onClick={() => setChatFilter("active")}
								className={`rounded-full border px-4 py-2 text-sm transition ${
									chatFilter === "active"
										? "border-[#ca2e6b] bg-[#ca2e6b] text-white"
										: "border-[#ca2e6b] text-[#ca2e6b] hover:bg-[#fff5f8]"
								}`}>
								Active
								<b
									className={`ml-2 rounded-full px-2 ${
										chatFilter === "active" ? "bg-white text-[#ca2e6b]" : "bg-[#f5e6ed]"
									}`}>
									3
								</b>
							</button>

							{/* New chat */}
							<button
								type="button"
								className="ml-auto grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#ca2e6b]">
								<Plus size={18} />
							</button>
						</div>

						{filteredChats.map((chat) => (
							<button
								key={chat.name}
								onClick={() => setSelected(chat.name)}
								className={`flex w-full items-center gap-3 border-b border-gray-100 py-3 text-left last:border-0 ${
									selected === chat.name ? "bg-[#fff5f8]" : ""
								}`}>
								{/* Profile */}
								<div className="relative shrink-0">
									<img
										src={chat.image}
										alt={chat.name}
										className="h-9 w-9 rounded-full border border-[#ca2e6b] object-cover"
									/>

									{chat.active && (
										<span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500" />
									)}
								</div>

								{/* Name + message */}
								<span className="flex-1">
									<b className="block text-sm">{chat.name}</b>

									<small
										className={chat.unread > 0 ? "font-medium text-gray-700" : "text-gray-500"}>
										Hi
									</small>
								</span>

								{/* Time + unread */}
								<span className="text-xs text-[#ca2e6b]">
									Friday <br />
									{chat.unread > 0 && (
										<b className="float-right mt-1 rounded-full bg-[#ca2e6b] px-1.5 py-1 text-white">
											{chat.unread}
										</b>
									)}
								</span>
							</button>
						))}
					</div>

					{/* Conversation */}

					<div className="min-h-125 overflow-hidden rounded-[22px] bg-white">
						{selected ? (
							(() => {
								const selectedChat = chats.find((chat) => chat.name === selected);

								if (!selectedChat) return null;

								return (
									<div className="flex h-125 flex-col">
										{/* Chat Header */}
										<div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
											<div className="flex items-center gap-3">
												{/* Back button - useful on mobile */}
												<button
													type="button"
													className="text-gray-800 lg:hidden"
													onClick={() => setSelected(null)}>
													<Icon icon="boxicons:chevron-left" width="24" height="24" />
												</button>

												{/* Profile */}
												<div className="relative">
													<img
														src={selectedChat.image}
														alt={selectedChat.name}
														className="h-10 w-10 rounded-full border-2 border-[#ca2e6b] object-cover p-px"
													/>

													<span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500" />
												</div>

												<div>
													<h3 className="text-sm font-medium text-gray-900">{selectedChat.name}</h3>

													<p className="text-xs text-gray-400">Tap to view profile</p>
												</div>
											</div>

											{/* Chat actions */}
											<div className="flex items-center gap-4">
												<button
													type="button"
													onClick={startVideoCall}
													className="grid h-9 w-14 place-items-center rounded-xl border border-[#ca2e6b] text-[#ca2e6b] transition hover:bg-[#f9e8ef]">
													<Icon icon="boxicons:video" width="21" height="21" />
												</button>

												<div className="relative">
													<button
														type="button"
														onClick={() => setMenuOpen((prev) => !prev)}
														className="grid h-9 w-9 place-items-center rounded-full bg-linear-to-r from-[#ca2e6b] to-[#67307d] text-white">
														<Icon icon="solar:menu-dots-bold" width="20" height="20" />
													</button>

													<input
														ref={imageInputRef}
														type="file"
														accept="image/*"
														className="hidden"
														onChange={(e) => {
															const file = e.target.files?.[0];

															if (file) {
																console.log("Selected image:", file);
															}

															setMenuOpen(false);
														}}
													/>

													{menuOpen && (
														<div className="absolute right-0 top-11 z-50 w-42.5 overflow-hidden rounded-xl border border-gray-100 bg-white p-1 shadow-lg">
															<button
																type="button"
																onClick={() => imageInputRef.current?.click()}
																className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-gray-700 transition hover:bg-[#f9e8ef] hover:text-[#ca2e6b]">
																<Icon icon="boxicons:image" width="19" height="19" />

																<span>Image</span>
															</button>

															<button
																type="button"
																onClick={() => {
																	setMenuOpen(false);

																	if (isRecording) {
																		stopRecording();
																	} else {
																		startRecording();
																	}
																}}
																className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-gray-700 transition hover:bg-[#f9e8ef] hover:text-[#ca2e6b]">
																<Icon
																	icon={
																		isRecording ? "boxicons:stop-circle" : "boxicons:microphone"
																	}
																	width="19"
																	height="19"
																/>

																<span>{isRecording ? "Stop Recording" : "Voice Note"}</span>
															</button>
														</div>
													)}
												</div>
											</div>
										</div>

										{/* Messages */}
										<div className="flex flex-1 flex-col justify-end overflow-y-auto px-5 py-6">
											<div className="space-y-7">
												{messages.map((message) => (
													<div
														key={message.id}
														className={`flex flex-col ${
															message.sender === "me" ? "items-end" : "items-start"
														}`}>
														<div
															className={`max-w-[75%] rounded-[18px] px-4 py-3 text-sm ${
																message.sender === "me"
																	? "rounded-tr-none bg-[#d9d9d9] text-gray-900"
																	: "rounded-tl-none bg-[#f8dfe8] text-gray-900"
															}`}>
															{message.text}
														</div>

														<span className="mt-2 text-[11px] text-gray-400">{message.time}</span>
													</div>
												))}
											</div>
										</div>

										{voiceUrl && (
											<div className="border-t border-gray-100 px-4 py-3">
												<div className="flex items-center gap-3 rounded-xl bg-[#f9e8ef] p-3">
													<Icon
														icon="boxicons:microphone"
														width="20"
														height="20"
														className="text-[#ca2e6b]"
													/>

													<audio controls src={voiceUrl} className="h-9 flex-1" />

													<button
														type="button"
														onClick={() => {
															URL.revokeObjectURL(voiceUrl);
															setVoiceUrl(null);
														}}
														className="text-gray-400 hover:text-red-500">
														<Icon icon="boxicons:x" width="20" height="20" />
													</button>
												</div>
											</div>
										)}

										{/* Message Input */}
										<div className="border-t border-gray-100 p-4">
											<div className="flex items-center gap-3 rounded-full bg-[#f9e8ef] px-4 py-2">
												<input
													type="text"
													placeholder="Write a message..."
													className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
												/>

												<button
													type="button"
													className="grid h-9 w-9 place-items-center rounded-full bg-linear-to-r from-[#ca2e6b] to-[#67307d] text-white">
													<Icon icon="boxicons:send" width="18" height="18" />
												</button>
											</div>
										</div>
									</div>
								);
							})()
						) : (
							/* Empty state */
							<div className="grid min-h-125 place-items-center text-center">
								<div>
									<div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl bg-[#f9e8ef] text-[#ca2e6b]">
										<MessageCircle />
									</div>

									<h3 className="font-semibold">Select a conversation to start messaging</h3>

									<p className="mt-1 text-sm text-gray-500">
										Choose a match on your list and enjoy the app...
									</p>
								</div>
							</div>
						)}
					</div>
				</div>
			</section>
			{videoCallOpen && selected && (
				<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-5">
					<div className="relative h-full max-h-[700px] w-full max-w-[1000px] overflow-hidden rounded-3xl bg-gray-900">
						{/* Remote user placeholder */}
						<div className="flex h-full items-center justify-center">
							<div className="text-center text-white">
								<div className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full">
									{(() => {
										const person = chats.find((chat) => chat.name === selected);

										return person ? (
											<img
												src={person.image}
												alt={person.name}
												className="h-full w-full object-cover"
											/>
										) : null;
									})()}
								</div>

								<h2 className="text-xl font-semibold">{selected}</h2>

								<p className="mt-1 text-sm text-white/60">Video call</p>
							</div>
						</div>

						{/* Your camera */}
						<div className="absolute right-5 top-5 h-[180px] w-[130px] overflow-hidden rounded-2xl border-2 border-white/20 bg-black shadow-xl">
							<video
								ref={videoRef}
								autoPlay
								muted
								playsInline
								className="h-full w-full object-cover"
							/>
						</div>

						{/* Call controls */}
						<div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-4">
							{/* Microphone */}
							<button
								type="button"
								className="grid h-12 w-12 place-items-center rounded-full bg-white/20 text-white backdrop-blur transition hover:bg-white/30">
								<Icon icon="boxicons:microphone" width="22" height="22" />
							</button>

							{/* Camera */}
							<button
								type="button"
								className="grid h-12 w-12 place-items-center rounded-full bg-white/20 text-white backdrop-blur transition hover:bg-white/30">
								<Icon icon="boxicons:video" width="22" height="22" />
							</button>

							{/* End call */}
							<button
								type="button"
								onClick={endVideoCall}
								className="grid h-14 w-14 place-items-center rounded-full bg-red-500 text-white transition hover:bg-red-600">
								<Icon icon="boxicons:phone-off" width="24" height="24" />
							</button>
						</div>

						{/* Close */}
						<button
							type="button"
							onClick={endVideoCall}
							className="absolute left-5 top-5 grid h-10 w-10 place-items-center rounded-full bg-black/40 text-white">
							<Icon icon="boxicons:x" width="22" height="22" />
						</button>
					</div>
				</div>
			)}
		</>
	);
}
