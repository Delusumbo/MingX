import { Check } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import Logo from "../../assets/images/Mingx.png";

export default function VerifyEmail() {
	const location = useLocation();
	const email = (location.state as { email?: unknown } | null)?.email;

	return (
		<main className="flex min-h-screen items-center justify-center bg-gray-50 px-5 py-10">
			<div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl sm:p-10">
				<img src={Logo} alt="MingX" className="mx-auto mb-8 w-32" />
				<div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-green-100 text-green-700">
					<Check size={32} aria-hidden="true" />
				</div>
				<h1 className="mt-6 text-2xl font-bold text-[#67307d]">Your email has been verified</h1>
				{typeof email === "string" && email && (
					<p className="mt-2 font-medium text-gray-800">{email}</p>
				)}
				<p className="mt-4 text-sm leading-6 text-gray-600">
					Go back to the MingX app or website and log in with your verified email.
				</p>
				<Link
					to="/login"
					className="mt-7 inline-flex w-full items-center justify-center rounded-xl bg-linear-to-r from-[#ca2e6b] to-[#67307d] px-6 py-3 font-semibold text-white transition hover:opacity-90">
					Go to Login
				</Link>
			</div>
		</main>
	);
}
