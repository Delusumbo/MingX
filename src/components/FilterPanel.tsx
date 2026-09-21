import { useState } from "react";
import { X } from "lucide-react";

type FilterPanelProps = {
	isOpen: boolean;
	onClose: () => void;
	onApply: (filters: Record<string, unknown>) => void;
};

export default function FilterPanel({ isOpen, onClose, onApply }: FilterPanelProps) {
	const [gender, setGender] = useState("");
	const [goal, setGoal] = useState("");
	const [belief, setBelief] = useState("");
	const [education, setEducation] = useState("");
	const [maritalStatus, setMaritalStatus] = useState("");
	const [ageFrom, setAgeFrom] = useState(18);
	const [ageTo, setAgeTo] = useState(50);
	const [distance, setDistance] = useState(50);
	const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

	const interests = ["Music", "Travel", "Sports", "Reading", "Movies", "Fitness", "Cooking", "Art"];

	const toggleInterest = (interest: string) => {
		setSelectedInterests((prev) =>
			prev.includes(interest) ? prev.filter((item) => item !== interest) : [...prev, interest],
		);
	};

	const resetFilters = () => {
		setGender("");
		setGoal("");
		setBelief("");
		setEducation("");
		setMaritalStatus("");		
		setAgeFrom(18);
		setAgeTo(50);
		setDistance(50);
		setSelectedInterests([]);
	};

	const handleApply = () => {
		onApply({
			gender,
			goal,
			belief,
			education,
			maritalStatus,			
			ageFrom,
			ageTo,
			distance,
			interests: selectedInterests,
		});

		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-100">
			{/* Overlay */}
			<div className="absolute inset-0 bg-black/40" onClick={onClose} />

			{/* Panel */}
			<div
				className="
					absolute right-0 top-0
					flex h-dvh w-full flex-col bg-white
					sm:max-w-md
					lg:w-105
					lg:max-w-none
				">
				{/* Header */}
				<div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-5 py-4">
					<div>
						<h2 className="text-lg font-semibold text-gray-800">Filters</h2>
						<p className="text-xs text-gray-400">Find people that match your preferences</p>
					</div>

					<button
						type="button"
						onClick={onClose}
						className="grid h-9 w-9 place-items-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200">
						<X size={19} />
					</button>
				</div>

				{/* Scrollable filter content */}
				<div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
					{/* Gender */}
					<div className="mb-6">
						<label className="mb-3 block text-sm font-semibold text-gray-700">Gender</label>

						<div className="grid grid-cols-2 gap-2">
							{["Male", "Female"].map((item) => (
								<button
									key={item}
									type="button"
									onClick={() => setGender(item)}
									className={`rounded-xl border px-4 py-3 text-sm transition ${
										gender === item
											? "border-[#ca2e6b] bg-[#ca2e6b] text-white"
											: "border-gray-200 bg-white text-gray-600 hover:border-[#ca2e6b]"
									}`}>
									{item}
								</button>
							))}
						</div>
					</div>

					{/* Looking for */}
					<div className="mb-6">
						<label className="mb-3 block text-sm font-semibold text-gray-700">Looking for</label>

						<div className="grid grid-cols-2 gap-2">
							{["Relationship", "Friendship", "Marriage", "Networking"].map((item) => (
								<button
									key={item}
									type="button"
									onClick={() => setGoal(item)}
									className={`rounded-xl border px-3 py-3 text-sm transition ${
										goal === item
											? "border-[#ca2e6b] bg-[#ca2e6b] text-white"
											: "border-gray-200 text-gray-600 hover:border-[#ca2e6b]"
									}`}>
									{item}
								</button>
							))}
						</div>
					</div>

					{/* Belief */}
					<div className="mb-6">
						<label className="mb-3 block text-sm font-semibold text-gray-700">Belief</label>

						<select
							value={belief}
							onChange={(e) => setBelief(e.target.value)}
							className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 outline-none focus:border-[#ca2e6b]">
							<option value="">Any belief</option>
							<option value="Christianity">Christianity</option>
							<option value="Islam">Islam</option>
							<option value="Traditional">Traditional</option>
							<option value="Other">Other</option>
						</select>
					</div>

					{/* Education */}
					<div className="mb-6">
						<label className="mb-3 block text-sm font-semibold text-gray-700">Education</label>

						<select
							value={education}
							onChange={(e) => setEducation(e.target.value)}
							className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 outline-none focus:border-[#ca2e6b]">
							<option value="">Any education</option>
							<option value="Secondary">Secondary</option>
							<option value="Diploma">Diploma</option>
							<option value="Bachelor's">Bachelor's</option>
							<option value="Master's">Master's</option>
							<option value="PhD">PhD</option>
						</select>
					</div>

					{/* Marital Status */}
					<div className="mb-6">
						<label className="mb-3 block text-sm font-semibold text-gray-700">Marital Status</label>

						<div className="grid grid-cols-2 gap-2">
							{["Single", "Divorced", "Widowed", "Separated"].map((item) => (
								<button
									key={item}
									type="button"
									onClick={() => setMaritalStatus(item)}
									className={`rounded-xl border px-3 py-3 text-sm transition ${
										maritalStatus === item
											? "border-[#ca2e6b] bg-[#ca2e6b] text-white"
											: "border-gray-200 text-gray-600 hover:border-[#ca2e6b]"
									}`}>
									{item}
								</button>
							))}
						</div>
					</div>  					

					{/* Age */}
					<div className="mb-6">
						<div className="mb-3 flex items-center justify-between">
							<label className="text-sm font-semibold text-gray-700">Age</label>

							<span className="text-sm font-medium text-[#ca2e6b]">
								{ageFrom} - {ageTo}
							</span>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<input
								type="number"
								min="18"
								max="100"
								value={ageFrom}
								onChange={(e) => setAgeFrom(Number(e.target.value))}
								className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#ca2e6b]"
							/>

							<input
								type="number"
								min="18"
								max="100"
								value={ageTo}
								onChange={(e) => setAgeTo(Number(e.target.value))}
								className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#ca2e6b]"
							/>
						</div>
					</div>

					{/* Distance */}
					<div className="mb-6">
						<div className="mb-3 flex items-center justify-between">
							<label className="text-sm font-semibold text-gray-700">Distance</label>

							<span className="text-sm font-medium text-[#ca2e6b]">{distance} km</span>
						</div>

						<input
							type="range"
							min="1"
							max="100"
							value={distance}
							onChange={(e) => setDistance(Number(e.target.value))}
							className="w-full accent-[#ca2e6b]"
						/>
					</div>

					{/* Interests */}
					<div className="pb-4">
						<label className="mb-3 block text-sm font-semibold text-gray-700">Interests</label>

						<div className="flex flex-wrap gap-2">
							{interests.map((interest) => (
								<button
									key={interest}
									type="button"
									onClick={() => toggleInterest(interest)}
									className={`rounded-full border px-4 py-2 text-sm transition ${
										selectedInterests.includes(interest)
											? "border-[#ca2e6b] bg-[#ca2e6b] text-white"
											: "border-gray-200 bg-white text-gray-600 hover:border-[#ca2e6b]"
									}`}>
									{interest}
								</button>
							))}
						</div>
					</div>
				</div>

				{/* Bottom actions - ALWAYS VISIBLE */}
				<div
					className="
						flex shrink-0 items-center gap-3
						border-t border-gray-100
						bg-white px-5 py-4
						pb-[calc(1rem+env(safe-area-inset-bottom))]
					">
					<button
						type="button"
						onClick={resetFilters}
						className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50">
						Reset
					</button>

					<button
						type="button"
						onClick={handleApply}
						className="flex-1 rounded-xl bg-linear-to-r from-[#ca2e6b] to-[#67307d] px-4 py-3.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90">
						Apply Filters
					</button>
				</div>
			</div>
		</div>
	);
}
