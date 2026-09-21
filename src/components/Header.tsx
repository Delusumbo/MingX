import { useState } from "react";
import { Icon } from "@iconify/react";
import NotificationPanel from "./NotificationPanel";

type HeaderProps = {
	onSearch?: (value: string) => void;
	searchPlaceholder?: string;
};

export default function Header({ onSearch, searchPlaceholder = "Search" }: HeaderProps) {
	const [search, setSearch] = useState("");
	const [notificationsOpen, setNotificationsOpen] = useState(false);

	const handleSearch = (value: string) => {
		setSearch(value);
		onSearch?.(value);
	};

	return (
		<>
			<header className="flex h-19 items-center justify-between px-5 md:px-8 lg:px-10">
				{/* Search */}
				<div className="relative w-full max-w-128.75">
					<Icon
						icon="boxicons:search"
						width="20"
						height="20"
						className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-700"
					/>

					<input
						type="text"
						value={search}
						onChange={(e) => handleSearch(e.target.value)}
						placeholder={searchPlaceholder}
						className="h-12 w-full rounded-2xl border-none bg-white pl-12 pr-5 text-sm text-gray-700 outline-none placeholder:text-gray-500 focus:ring-2 focus:ring-[#ca2e6b]/10"
					/>
				</div>

				{/* Notification */}
				<button
					type="button"
					onClick={() => setNotificationsOpen(true)}
					className="relative ml-5 grid h-9.5 w-9.5 shrink-0 place-items-center rounded-full bg-linear-to-r from-[#ca2e6b] to-[#67307d] text-white transition hover:opacity-90">
					<Icon icon="solar:bell-linear" width="20" height="20" />

					{/* Notification count */}
					<span className="absolute -right-1 -top-1 flex h-3.75 min-w-3.75 items-center justify-center rounded-full bg-white px-1 text-[9px] font-bold text-[#67307d]">
						1
					</span>
				</button>
			</header>

			{/* Notification Panel */}
			<NotificationPanel isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
		</>
	);
}
