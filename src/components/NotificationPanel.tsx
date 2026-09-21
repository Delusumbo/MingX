import { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";
import { getNotifications } from "../services/notificationService";

type Notification = {
	id: number;
	title: string;
	message: string;
	time: string;
	date: string;
	image: string;
	read: boolean;
};

type NotificationPanelProps = {
	isOpen: boolean;
	onClose: () => void;
};



export default function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		if (!isOpen) return;

		const loadNotifications = async () => {
			try {
				setLoading(true);
				setError("");

				const data = await getNotifications();

				const formattedNotifications: Notification[] = data.map((notification) => ({
					id: notification.id,
					title: notification.title,
					message: notification.notification,
					time: notification.time,
					date: notification.date,
					image: notification.image,
					read: false,
				}));

				setNotifications(formattedNotifications);
			} catch (error) {
				console.error("Notification error:", error);

				setError(error instanceof Error ? error.message : "Unable to load notifications.");
			} finally {
				setLoading(false);
			}
		};

		loadNotifications();
	}, [isOpen]);

	if (!isOpen) return null;


	return (
		<div className="fixed inset-0 z-100">
			{/* Overlay */}
			<div className="absolute inset-0 bg-black/40" onClick={onClose} />

			{/* Notification panel */}
			<div
				className="
					absolute right-0 top-0
					flex h-dvh w-full flex-col
					bg-white
					sm:max-w-md
					lg:h-auto lg:max-h-[calc(100vh-80px)]
					lg:w-100
					lg:rounded-2xl
					lg:shadow-2xl
					lg:right-5
					lg:top-18.75
				">
				{/* Header */}
				<div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-5 py-4">
					<div className="flex items-center gap-3">
						<div className="grid h-10 w-10 place-items-center rounded-full bg-[#f8edf3] text-[#ca2e6b]">
							<Bell size={19} />
						</div>

						<div>
							<h2 className="text-lg font-semibold text-gray-800">Notifications</h2>							
						</div>
					</div>

					<button
						type="button"
						onClick={onClose}
						className="grid h-9 w-9 place-items-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
						aria-label="Close notifications">
						<X size={19} />
					</button>
				</div>

				

				{/* Notifications - scrollable */}
				<div className="min-h-0 flex-1 overflow-y-auto">
					{loading ? (
						<div className="flex min-h-75 items-center justify-center px-6">
							<p className="text-sm text-gray-400">Loading notifications...</p>
						</div>
					) : error ? (
						<div className="flex min-h-75 items-center justify-center px-6 text-center">
							<p className="text-sm text-red-500">{error}</p>
						</div>
					) : notifications.length === 0 ? (
						<div className="flex min-h-75 flex-col items-center justify-center px-6 text-center">
							<div className="mb-4 grid h-16 w-16 place-items-center rounded-full bg-[#f8edf3] text-[#ca2e6b]">
								<Bell size={28} />
							</div>

							<h3 className="font-semibold text-gray-700">No notifications</h3>

							<p className="mt-1 text-sm text-gray-400">
								We'll let you know when something happens.
							</p>
						</div>
					) : (
						<div>
							{notifications.map((notification) => (
								<button
									key={notification.id}
									type="button"
									className={`flex w-full gap-3 border-b border-gray-100 px-5 py-4 text-left transition hover:bg-[#faf7f8] ${
										!notification.read ? "bg-[#fff8fb]" : "bg-white"
									}`}
									onClick={() => {
										setNotifications((prev) =>
											prev.map((item) =>
												item.id === notification.id
													? {
															...item,
															read: true,
														}
													: item,
											),
										);
									}}>
									{/* Icon / image */}
									<div className="relative shrink-0">
										{notification.image ? (
											<img
												src={notification.image}
												alt=""
												className="h-11 w-11 rounded-full object-cover"
											/>
										) : (
											<div className="grid h-11 w-11 place-items-center rounded-full bg-linear-to-br from-[#ca2e6b] to-[#67307d] text-white">
												<Bell size={18} />
											</div>
										)}

										{!notification.read && (
											<span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-[#ca2e6b]" />
										)}
									</div>

									{/* Content */}
									<div className="min-w-0 flex-1">
										<div className="flex items-start justify-between gap-2">
											<h3
												className={`text-sm ${
													!notification.read
														? "font-semibold text-gray-800"
														: "font-medium text-gray-700"
												}`}>
												{notification.title}
											</h3>

											<span className="shrink-0 text-[11px] text-gray-400">
												{notification.time}
											</span>
										</div>

										<p className="mt-1 text-sm leading-5 text-gray-500">{notification.message}</p>

										<p className="mt-1 text-[11px] text-gray-400">{notification.date}</p>
									</div>
								</button>
							))}
						</div>
					)}
				</div>

				{/* Footer */}
				<div className="shrink-0 border-t border-gray-100 bg-white px-5 py-4">
					<button
						type="button"
						onClick={onClose}
						className="w-full rounded-xl bg-linear-to-r from-[#ca2e6b] to-[#67307d] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90">
						Close
					</button>
				</div>
			</div>
		</div>
	);
}