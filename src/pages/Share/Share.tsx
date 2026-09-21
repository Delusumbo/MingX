import { useState } from "react";
import { Icon } from "@iconify/react";
import Header from "../../components/Header";

type PostOption = {
	label: string;
	icon: string;
};

const postOptions: PostOption[] = [
	{
		label: "Music",
		icon: "boxicons:music",
	},
	{
		label: "People",
		icon: "boxicons:group",
	},
	{
		label: "Location",
		icon: "boxicons:map",
	},
	{
		label: "Feelings",
		icon: "boxicons:happy",
	},
];

export default function Share() {
	const [content, setContent] = useState("");
	const [selectedOption, setSelectedOption] = useState<string | null>(null);

	const handleSubmit = () => {
		if (!content.trim()) return;

		console.log({
			content,
			selectedOption,
		});
	};

	return (
		<main className="bg-[#d9d9d9]">
			<Header />
			<div className="min-h-screen  px-5 pb-24 pt-8 md:px-8 lg:px-10 lg:pb-10">
				{/* Page heading */}
				<div className="mx-auto max-w-262">
					<h1 className="text-3xl font-bold text-[#67307d] md:text-[32px]">New post</h1>

					<p className="mt-1 max-w-142.5 text-sm font-medium leading-5 text-gray-700">
						Turn your ideas into conversations. Share updates, insights, announcements, and moments
						that matter.
					</p>
				</div>

				{/* Post card */}
				<section className="mx-auto mt-7 max-w-262 rounded-[20px] bg-white px-7 py-14 md:px-9 lg:px-9">
					{/* Post options */}
					<div className="flex flex-wrap items-center gap-4">
						{postOptions.map((option) => {
							const isSelected = selectedOption === option.label;

							return (
								<button
									key={option.label}
									type="button"
									onClick={() => setSelectedOption(isSelected ? null : option.label)}
									className={`flex h-9.75 w-37.75 items-center justify-center gap-2 rounded-xl border-2 bg-white text-sm font-medium transition-all ${
										isSelected
											? "border-[#67307d] text-[#67307d]"
											: "border-[#ca2e6b] text-gray-500 hover:border-[#67307d]"
									}`}>
									<Icon
										icon={option.icon}
										width="18"
										height="18"
										className={isSelected ? "text-[#67307d]" : "text-[#67307d]"}
									/>

									<span>{option.label}</span>
								</button>
							);
						})}

						{/* Add button */}
						<button
							type="button"
							className="grid h-10 w-10 place-items-center rounded-xl border border-[#ca2e6b] bg-white text-black transition hover:bg-[#fff5f8]">
							<Icon icon="boxicons:plus" width="27" height="27" />
						</button>
					</div>

					{/* Text area */}
					<div className="mt-6">
						<textarea
							value={content}
							onChange={(e) => setContent(e.target.value)}
							placeholder="What’s on your mind?"
							className="h-46.25 w-full resize-none rounded-[18px] border-none bg-[#fcf5f8] px-5 py-5 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-[#ca2e6b]/20"
						/>
					</div>

					{/* Optional submit button */}
					<div className="mt-5 flex justify-end">
						<button
							type="button"
							onClick={handleSubmit}
							disabled={!content.trim()}
							className="rounded-xl bg-linear-to-r from-[#ca2e6b] to-[#67307d] px-7 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40">
							Post
						</button>
					</div>
				</section>
			</div>
		</main>
	);
}
