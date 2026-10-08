import {
	Bell,
	Heart,
	Home,
	LogOut,
	MessageCircle,
	Search,
	Sparkles,
	Trash2,
	User,
	Users,
	X,
} from "lucide-react";
import { Icon } from "@iconify/react";
import NotificationPanel from "./NotificationPanel";
import Logo from "../assets/images/Mingx.png";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { LayoutProvider, useLayout } from "./LayoutContext";
import { useAuth } from "../context/AuthContext";
import { deleteAccount as deleteAccountRequest } from "../auth/authService";
import { getApiMessage } from "../utils/apiMessages";

type HeaderProps = {
	onSearch?: (value: string) => void;
	searchPlaceholder?: string;
	onMenuClick?: () => void;
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

function AccountActions() {
	const { logout } = useAuth();
	const { closeMobileMenu } = useLayout();
	const navigate = useNavigate();
	const [deleting, setDeleting] = useState(false);
	const [error, setError] = useState("");

	const handleLogout = () => {
		logout();
		closeMobileMenu();
		navigate("/login", { replace: true });
	};

	const handleDeleteAccount = async () => {
		const confirmed = window.confirm(
			"Delete your account permanently? This action cannot be undone.",
		);
		if (!confirmed) return;

		setDeleting(true);
		setError("");
		try {
			const response = await deleteAccountRequest();
			logout();
			closeMobileMenu();
			navigate("/", {
				replace: true,
				state: { message: getApiMessage(response, "Request completed.") },
			});
		} catch (deleteError) {
			setError(getApiMessage(deleteError));
		} finally {
			setDeleting(false);
		}
	};

	return (
		<>
			<button
				type="button"
				onClick={handleLogout}
				className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-[#f8edf3] hover:text-[#67307d]">
				<LogOut size={19} />
				<span>Log out</span>
			</button>
			<button
				type="button"
				onClick={() => void handleDeleteAccount()}
				disabled={deleting}
				className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50">
				<Trash2 size={19} />
				<span>{deleting ? "Deleting account..." : "Delete account"}</span>
			</button>
			{error && (
				<p role="alert" className="px-4 text-xs leading-5 text-red-600">
					{error}
				</p>
			)}
		</>
	);
}

export function Header({ onSearch, searchPlaceholder = "Search" }: HeaderProps) {
	const [search, setSearch] = useState("");
	const [notificationsOpen, setNotificationsOpen] = useState(false);

	const { openMobileMenu } = useLayout();

	const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		setSearch(value);
		onSearch?.(value);
	};

	return (
		<>
			<header className="sticky top-0 z-30 flex h-19 items-center justify-between border-b border-gray-100 bg-[#faf7f8]/95 px-5 backdrop-blur md:px-8 lg:px-10">
				{/* Mobile menu */}
				<button
					type="button"
					onClick={openMobileMenu}
					className="mr-4 rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 lg:hidden"
					aria-label="Open menu">
					<Icon icon="solar:hamburger-menu-linear" width="24" height="24" />
				</button>

				{/* Search */}
				<div className="relative max-w-125 flex-1">
					<Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

					<input
						type="text"
						value={search}
						onChange={handleSearch}
						placeholder={searchPlaceholder}
						className="h-12 w-full rounded-2xl border-none bg-white pl-12 pr-5 text-sm outline-none"
					/>
				</div>

				{/* Notification */}
				<button
					type="button"
					onClick={() => setNotificationsOpen(true)}
					className="relative ml-4 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-linear-to-r from-[#ca2e6b] to-[#67307d] text-white">
					<Bell size={19} />

					<span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-[9px] font-bold text-[#67307d]">
						1
					</span>
				</button>
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
				<AccountActions />
			</div>
		</aside>
	);
}
function MobileSidebar() {
	const { mobileMenuOpen, closeMobileMenu } = useLayout();

	if (!mobileMenuOpen) return null;

	const navigation = [
		{
			name: "Discover",
			path: "/discover",
			icon: <Home size={19} />,
		},
		{
			name: "Connections",
			path: "/connections",
			icon: <Heart size={19} />,
		},
		{
			name: "Messages",
			path: "/message",
			icon: <MessageCircle size={19} />,
		},
		{
			name: "Communities",
			path: "/communities",
			icon: <Users size={19} />,
		},
	];

	return (
		<>
			{/* Overlay */}
			<button
				type="button"
				aria-label="Close menu"
				onClick={closeMobileMenu}
				className="fixed inset-0 z-50 bg-black/40 lg:hidden"
			/>

			{/* Drawer */}
			<aside className="fixed inset-y-0 left-0 z-60 flex w-70 flex-col overflow-y-auto bg-white px-5 py-7 shadow-2xl lg:hidden">
				{/* Header */}
				<div className="mb-8 flex items-center justify-between">
					<Link to="/discover" onClick={closeMobileMenu}>
						<img src={Logo} alt="MingX" className="h-auto w-24" />
					</Link>

					<button
						type="button"
						onClick={closeMobileMenu}
						className="grid h-9 w-9 place-items-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200"
						aria-label="Close menu">
						<X size={18} />
					</button>
				</div>

				{/* Navigation */}
				<nav className="space-y-2">
					{navigation.map((item) => (
						<NavLink
							key={item.path}
							to={item.path}
							onClick={closeMobileMenu}
							className={({ isActive }) =>
								`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
									isActive
										? "bg-linear-to-r from-[#ca2e6b] to-[#67307d] text-white"
										: "text-gray-600 hover:bg-gray-50 hover:text-[#67307d]"
								}`
							}>
							{item.icon}
							<span>{item.name}</span>
						</NavLink>
					))}
				</nav>

				{/* Account */}
				<div className="mt-8 border-t border-gray-100 pt-6">
					<p className="mb-3 px-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
						Account
					</p>

					<NavLink
						to="/profile"
						onClick={closeMobileMenu}
						className={({ isActive }) =>
							`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
								isActive
									? "bg-linear-to-r from-[#ca2e6b] to-[#67307d] text-white"
									: "text-gray-600 hover:bg-gray-50 hover:text-[#67307d]"
							}`
						}>
						<User size={19} />
						<span>Profile</span>
					</NavLink>

					<NavLink
						to="/premium"
						onClick={closeMobileMenu}
						className={({ isActive }) =>
							`mt-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
								isActive
									? "bg-linear-to-r from-[#ca2e6b] to-[#67307d] text-white"
									: "text-gray-600 hover:bg-gray-50 hover:text-[#67307d]"
							}`
						}>
						<Sparkles size={19} />
						<span>Premium</span>
					</NavLink>
					<div className="mt-2">
						<AccountActions />
					</div>
				</div>
			</aside>
		</>
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
						name: "Messages",
						path: "/message",
						icon: MessageCircle,
					},
					{
						name: "Communities",
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
		<LayoutProvider>
			<div className="min-h-screen bg-[#faf7f8]">
				{/* Desktop sidebar */}
				<Sidebar />

				{/* Mobile sidebar */}
				<MobileSidebar />

				{/* Main content */}
				<main className="min-h-screen lg:ml-61.25 pb-20 lg:pb-0">
					<div key={location.pathname}>
						<Outlet />
					</div>
				</main>

				{/* Mobile bottom navigation */}
				<MobileNavigation />
			</div>
		</LayoutProvider>
	);
}
