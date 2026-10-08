import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/images/Mingx.png";

type PublicInfoPageProps = {
	title: string;
	description: string;
	children?: ReactNode;
};

const PublicInfoPage = ({ title, description, children }: PublicInfoPageProps) => (
	<div className="min-h-screen bg-[#faf7f8]">
		<header className="border-b border-gray-100 bg-white">
			<div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
				<Link to="/" aria-label="MingX home">
					<img src={Logo} alt="MingX" className="w-28" />
				</Link>
				<Link
					to="/login"
					className="rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-[#C43266]">
					Get Started
				</Link>
			</div>
		</header>

		<main className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
			<Link to="/" className="text-sm font-medium text-[#C43266] hover:underline">
				Back to home
			</Link>
			<article className="mt-6 rounded-3xl bg-white p-6 shadow-sm sm:p-10">
				<h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{title}</h1>
				<p className="mt-4 text-base leading-7 text-gray-600">{description}</p>
				<div className="mt-8 space-y-5 text-sm leading-7 text-gray-700">{children}</div>
			</article>
		</main>

		<footer className="border-t border-gray-200 bg-white">
			<nav
				aria-label="Policies and support"
				className="mx-auto flex max-w-7xl flex-wrap gap-x-6 gap-y-3 px-6 py-6 text-sm text-gray-600 lg:px-8">
				<Link to="/terms-of-use" className="transition hover:text-[#C43266]">
					Terms of Use
				</Link>
				<Link to="/privacy-policy" className="transition hover:text-[#C43266]">
					Privacy Policy
				</Link>
				<Link to="/support" className="transition hover:text-[#C43266]">
					Support
				</Link>
				<Link to="/child-policy" className="transition hover:text-[#C43266]">
					Child Policy
				</Link>
				<Link to="/delete-account" className="transition hover:text-[#C43266]">
					Delete Account
				</Link>
			</nav>
		</footer>
	</div>
);

export default PublicInfoPage;
