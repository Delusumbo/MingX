import { Video } from "lucide-react";
import { Link } from "react-router-dom";

export default function LiveStreaming() {
	return (
		<div className="min-h-screen bg-[#faf7f8] px-4 py-10 sm:px-6 lg:px-8">
			<div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl items-center justify-center">
				<section className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-[#f0e4ea] bg-white px-6 py-14 text-center shadow-sm sm:px-12 sm:py-20">
					<div
						aria-hidden="true"
						className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#ca2e6b]/10 blur-3xl"
					/>
					<div
						aria-hidden="true"
						className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-[#67307d]/10 blur-3xl"
					/>

					<div className="relative mx-auto flex max-w-xl flex-col items-center">
						<div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-linear-to-br from-[#ca2e6b] to-[#67307d] text-white shadow-lg shadow-[#ca2e6b]/20">
							<Video size={36} strokeWidth={1.8} />
						</div>
						<span className="mb-4 rounded-full border border-[#f0d7e2] bg-[#fdf5f8] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#b52d62]">
							Coming soon
						</span>
						<h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
							Ming-X Live is on the way
						</h1>
						<p className="mt-5 text-base leading-7 text-gray-500 sm:text-lg">
							Live streaming is coming soon. We’re working on bringing live streams to Ming-X.
							Check back soon.
						</p>
						<Link
							to="/discover"
							className="mt-8 inline-flex items-center justify-center rounded-xl bg-linear-to-r from-[#ca2e6b] to-[#67307d] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ca2e6b]">
							Explore Ming-X
						</Link>
					</div>
				</section>
			</div>
		</div>
	);
}
