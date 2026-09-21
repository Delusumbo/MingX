import {
	Bell,		
	Heart,
	Home,
	Menu,
	MessageCircle,
	Search,
	Sparkles,
	User,
	Users,	
} from "lucide-react";
import { Icon } from "@iconify/react";
import NotificationPanel from "./NotificationPanel";
import Logo from "../assets/images/Mingx.png";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";

import { useState } from "react";

type HeaderProps = {
	onSearch?: (value: string) => void;
	searchPlaceholder?: string;
};

const storedUser = localStorage.getItem("user");

const user = storedUser ? JSON.parse(storedUser) : null;

const navigation = [
	{
		name: "Discover",
		path: "/discover",
		icon: "solar:home-2-bold",
	},
	// {
	// 	name: "Swipe",
	// 	path: "/swipe",
	// 	icon: "emojione-monotone:two-hearts",
	// },
	{
		name: "Share your thought",
		path: "/share",
		icon: "emojione-monotone:thought-balloon",
	},
	{
		name: "Connnection",
		path: "/connections",
		icon: "boxicons:plug-connect",
	},
	{
		name: "Liked you",
		path: "/like",
		icon: "solar:heart-bold",
	},
	{
		name: "Communities",
		path: "/communities",
		icon: "solar:users-group-rounded-bold",
	},
	{
		name: "Messages",
		path: "/message",
		icon: "solar:chat-round-bold",
	},
];

function NavigationItem({ name, path, icon }: { name: string; path: string; icon: string }) {
	return (
		<NavLink
			to={path}
			className={({ isActive }) =>
				`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
					isActive
						? "bg-linear-to-r from-[#ca2e6b] to-[#67307d] text-white shadow-md"
						: "text-gray-600 hover:bg-[#f8edf3] hover:text-[#67307d]"
				}`
			}>
			<Icon icon={icon} width={20} height={20} />

			<span>{name}</span>
		</NavLink>
	);
}

export function Header({ onSearch, searchPlaceholder = "Search" }: HeaderProps) {
	const [search, setSearch] = useState("");
	const [notificationsOpen, setNotificationsOpen] = useState(false);

	const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;

		setSearch(value);

		onSearch?.(value);
	};

	return (
		<>
			<header className="sticky top-0 z-30 flex h-19 items-center justify-between border-b border-gray-100 bg-[#faf7f8]/95 px-5 backdrop-blur md:px-8 lg:px-10">
				{/* Mobile menu */}

				<button className="mr-4 rounded-lg p-2 text-gray-600 lg:hidden" aria-label="Open menu">
					<Menu size={24} />
				</button>

				{/* Search */}

				<div className="relative max-w-125 flex-1">
					<Search size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

					<input
						type="text"
						value={search}
						onChange={handleSearch}
						placeholder={searchPlaceholder}
						className="h-11 w-full rounded-full border border-gray-200 bg-white pl-11 pr-5 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#ca2e6b] focus:ring-2 focus:ring-[#ca2e6b]/10"
					/>
				</div>

				{/* Right side */}

				<div className="ml-4 flex items-center gap-3">
					<button
						type="button"
						onClick={() => setNotificationsOpen(true)}
						className="relative hidden h-10 w-10 place-items-center rounded-full bg-white text-gray-600 shadow-sm sm:grid">
						<Bell size={19} />

						<span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#ca2e6b]" />
					</button>

					<Link to="/profile" className="flex items-center gap-2">
						<div className="grid h-10 w-10 place-items-center rounded-full bg-linear-to-br from-[#ca2e6b] to-[#67307d] text-white">
							<User size={19} />
						</div>

						<span className="hidden text-sm font-semibold text-gray-700 md:block">Profile</span>
					</Link>
				</div>
			</header>
			<NotificationPanel isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
		</>
	);
}

export function FilterButton({ onClick }: { onClick: () => void }) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="rounded-full border border-[#ca2e6b] bg-white px-6 py-3 text-sm font-medium text-[#ca2e6b] transition hover:bg-[#ca2e6b] hover:text-white">
			Filters
		</button>

		
	);
}

function Sidebar() {
	return (
		<aside className="fixed left-0 top-0 z-40 hidden h-screen w-61.25 flex-col overflow-y-auto border-r border-gray-100 bg-white px-5 py-7 lg:flex">
			{/* Logo */}

			{/* Logo */}
			<Link to="/discover" className="mb-5 flex items-center justify-center">
				<span className="text-2xl font-bold text-[#ca2e6b]">
					<img src={Logo} alt="" />
				</span>
			</Link>

			{/* User Profile */}
			<div className="mb-5 flex flex-col items-center">
				<div className="relative">
					<img
						src={user?.profilepicture || "/profile.jpg"}
						alt={user?.name || "Profile"}
						className="h-16 w-16 rounded-full border-2 border-[#ca2e6b] object-cover"
					/>

					<span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
				</div>

				<h3 className="mt-3 text-sm font-medium text-gray-900">{user?.name || "User"}</h3>

				<p className="mt-1 text-xs text-gray-500">{user?.email || ""}</p>
			</div>

			{/* Main navigation */}

			<div className="space-y-2">
				<p className="mb-3 px-4 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
					Menu
				</p>

				{navigation.map((item) => (
					<NavigationItem key={item.name} {...item} />
				))}
			</div>

			{/* Account */}

			<div className="mt-3 space-y-2">
				<p className="mb-3 px-4 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
					Account
				</p>
				<NavigationItem name="Profile" path="/profile" icon="solar:user-linear" />

				<NavigationItem
					name="Face Verification"
					path="/verify"
					icon="solar:face-scan-circle-linear"
				/>

				<Link
					to="/premium"
					className="mt-5 flex items-center gap-3 rounded-xl bg-linear-to-r from-[#ca2e6b] to-[#67307d] px-4 py-3 text-sm font-semibold text-white">
					<Sparkles size={19} />

					<span>Go Premium</span>
				</Link>
			</div>
		</aside>
	);
}

function MobileNavigation() {
	return (
		<nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-100 bg-white px-2 py-2 shadow-[0_-5px_20px_rgba(0,0,0,.05)] lg:hidden">
			<div className="grid grid-cols-5">
				{[
					{
						name: "Discover",
						path: "/discover",
						icon: Home,
					},
					{
						name: "Connect",
						path: "/connections",
						icon: Heart,
					},
					{
						name: "Matches",
						path: "/matches",
						icon: MessageCircle,
					},
					{
						name: "Groups",
						path: "/communities",
						icon: Users,
					},
					{
						name: "Profile",
						path: "/profile",
						icon: User,
					},
				].map((item) => {
					const Icon = item.icon;

					return (
						<NavLink
							key={item.path}
							to={item.path}
							className={({ isActive }) =>
								`flex flex-col items-center gap-1 py-2 text-[10px] ${
									isActive ? "font-semibold text-[#ca2e6b]" : "text-gray-400"
								}`
							}>
							<Icon size={20} />

							<span>{item.name}</span>
						</NavLink>
					);
				})}
			</div>
		</nav>
	);
}

export default function Layout() {
	const location = useLocation();

	return (
		<div className="min-h-screen bg-[#faf7f8]">
			<Sidebar />

			<main className="min-h-screen lg:ml-61.25">
				<div key={location.pathname}>
					<Outlet />
				</div>
			</main>

			<MobileNavigation />
		</div>
	);
}
