import { Header } from "../../components/Layout";
import joseph from "../../assets/images/joseph.png";


const faceParts = ["Forehead", "Eyes", "Nose", "Chin"];

export default function Verify() {
	return (
		<>
			<Header />

			<section className="px-5 pb-24 pt-10 md:px-8 lg:px-10">
				<h1 className="text-3xl font-bold text-[#67307d]">Verify Face</h1>

				<p className="mt-2 font-medium">Take a selfie to verify you human.</p>

				<div className="mt-12 grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
					{/* Face */}

					<div className="rounded-2xl bg-white p-7">
						<div className="text-sm text-gray-500">Your Face</div>

						<div className="grid place-items-center py-8">
							<img src={joseph} className="h-72 w-56 rounded-[45%] object-cover" />
						</div>
					</div>

					{/* Result */}

					<div className="rounded-2xl bg-white p-7">
						<div className="text-sm text-gray-500">Analyzing Result</div>

						<div className="mt-5 flex items-center gap-3">
							<span className="text-3xl">85</span>

							<span>/100</span>

							<div className="h-2 flex-1 bg-[#f6e1ea]" />
						</div>

						<div className="mt-7 space-y-6">
							{faceParts.map((part) => (
								<div key={part} className="flex gap-4">
									<img src={joseph} className="h-16 w-16 rounded-full object-cover" />

									<div>
										<b className="text-sm">{part}</b>

										<p className="mt-1 text-sm text-gray-500">
											The {part.toLowerCase()} appears to be within a good range. There are some
											details to review for verification...
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
