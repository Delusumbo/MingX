import { useState } from "react";
import { ArrowLeft, Camera, Save, User, Heart, Ruler, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../components/Layout";
import { updateProfile } from "../../services/profileService";

type UserData = {
	id?: number;
	name: string;
	dob: string;
	gender: string;
	lookingfor: string;
	goal: string;
	yourinterest: string;
	height: string;
	weight: string;
	belief: string;
	sexual_orientation: string;
	zodiac_sign: string;
	education_level: string;
	doyoudrink: string;
	doyousmoke: string;
	profilepicture: string;
	images: string;
	maritalstatus: string;
	doyouhavekids: string;
	email: string;
	state: string;
	country: string;
};

function formatInterests(value: unknown) {
	if (Array.isArray(value)) {
		return value.join(", ");
	}

	if (typeof value !== "string") {
		return "";
	}

	try {
		const parsed = JSON.parse(value);
		return Array.isArray(parsed) ? parsed.join(", ") : value;
	} catch {
		return value;
	}
}

export default function EditProfile() {
	const navigate = useNavigate();
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");

	const storedUser = localStorage.getItem("user");

	const initialUser: UserData = storedUser
		? {
				...JSON.parse(storedUser),
				yourinterest: formatInterests(JSON.parse(storedUser).yourinterest),
			}
		: {
				name: "",
				dob: "",
				gender: "",
				lookingfor: "",
				goal: "",
				yourinterest: "[]",
				height: "",
				weight: "",
				belief: "",
				sexual_orientation: "",
				zodiac_sign: "",
				education_level: "",
				doyoudrink: "",
				doyousmoke: "",
				profilepicture: "",
				images: "[]",
				maritalstatus: "",
				doyouhavekids: "",
				email: "",
				state: "",
				country: "",
			};

	const [formData, setFormData] = useState<UserData>(initialUser);
	const [saved, setSaved] = useState(false);
	const [profileImage, setProfileImage] = useState<File | null>(null);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;

		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		setSaved(false);
	};

	const handleSave = async () => {
		try {
			setSaving(true);
			setError("");

			const form = new FormData();
			const interests = formData.yourinterest
				.split(",")
				.map((item) => item.trim())
				.filter(Boolean);

			form.append("name", formData.name);
			form.append("dob", formData.dob);
			form.append("gender", formData.gender);
			form.append("lookingfor", formData.lookingfor);
			form.append("goal", formData.goal);
			form.append("height", formData.height);
			form.append("weight", formData.weight);
			form.append("belief", formData.belief);
			form.append("sexual_orientation", formData.sexual_orientation);
			form.append("zodiac_sign", formData.zodiac_sign);
			form.append("education_level", formData.education_level);
			form.append("doyoudrink", formData.doyoudrink);
			form.append("doyousmoke", formData.doyousmoke);
			form.append("maritalstatus", formData.maritalstatus);
			form.append("doyouhavekids", formData.doyouhavekids);
			form.append("email", formData.email);
			form.append("state", formData.state);
			form.append("country", formData.country);
			form.append("yourinterest", JSON.stringify(interests));

			if (profileImage) {
				form.append("profilepicture", profileImage);
			}

			const data = await updateProfile(form);

			// Update localStorage with the user returned by the API
			if (data.user) {
				localStorage.setItem("user", JSON.stringify(data.user));
			}

			setSaved(true);

			setTimeout(() => {
				navigate("/profile");
			}, 700);
		} catch (error) {
			console.error("Profile update error:", error);

			setError(error instanceof Error ? error.message : "Failed to update profile");
		} finally {
			setSaving(false);
		}
	};

	return (
		<>
			<Header searchPlaceholder="Search by name or message" />

			<section className="px-5 pb-24 pt-8 md:px-8 lg:px-10">
				{/* Header */}
				<div className="mb-8 flex items-center justify-between">
					<button
						type="button"
						onClick={() => navigate("/profile")}
						className="flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-[#ca2e6b]">
						<ArrowLeft size={18} />
						Back
					</button>

					<h1 className="text-2xl font-bold text-[#67307d]">Edit Profile</h1>

					<button
						type="button"
						onClick={handleSave}
						disabled={saving}
						className="flex items-center gap-2 rounded-xl bg-linear-to-r from-[#ca2e6b] to-[#67307d] px-7 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
						<Save size={17} />

						{saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
					</button>
				</div>

				{error && (
					<div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
				)}

				{/* Profile photo */}
				<div className="mb-8 rounded-2xl bg-white p-6">
					<h2 className="mb-5 text-lg font-semibold text-gray-800">Profile Photo</h2>

					<div className="flex flex-col items-center">
						<div className="relative">
							<img
								src={formData.profilepicture || "/profile-placeholder.png"}
								alt={formData.name}
								className="h-32 w-32 rounded-full border-4 border-[#ca2e6b] object-cover p-1"
							/>

							<label className="absolute bottom-0 right-0 grid h-9 w-9 cursor-pointer place-items-center rounded-full bg-linear-to-r from-[#ca2e6b] to-[#67307d] text-white shadow-md">
								<Camera size={16} />

								<input
									type="file"
									accept="image/*"
									className="hidden"
									onChange={(e) => {
										const file = e.target.files?.[0];

										if (!file) return;

										setProfileImage(file);

										const preview = URL.createObjectURL(file);

										setFormData((prev) => ({
											...prev,
											profilepicture: preview,
										}));

										setSaved(false);
									}}
								/>
							</label>
						</div>

						<p className="mt-3 text-xs text-gray-400">Click the camera icon to change your photo</p>
					</div>
				</div>

				{/* Personal Information */}
				<div className="mb-6 rounded-2xl bg-white p-6">
					<div className="mb-6 flex items-center gap-3">
						<div className="grid h-10 w-10 place-items-center rounded-xl bg-[#f9e8ef] text-[#ca2e6b]">
							<User size={19} />
						</div>

						<div>
							<h2 className="font-semibold text-gray-800">Personal Information</h2>

							<p className="text-xs text-gray-400">Update your basic profile details</p>
						</div>
					</div>

					<div className="grid gap-5 md:grid-cols-2">
						<Input label="Full Name" name="name" value={formData.name} onChange={handleChange} />

						<Input
							label="Email"
							name="email"
							type="email"
							value={formData.email}
							onChange={handleChange}
						/>

						<Input
							label="Date of Birth"
							name="dob"
							type="date"
							value={formData.dob}
							onChange={handleChange}
						/>

						<Select
							label="Gender"
							name="gender"
							value={formData.gender}
							onChange={handleChange}
							options={["Male", "Female", "Other"]}
						/>

						<Select
							label="Looking For"
							name="lookingfor"
							value={formData.lookingfor}
							onChange={handleChange}
							options={["Men", "Women", "Everyone"]}
						/>

						<Select
							label="Goal"
							name="goal"
							value={formData.goal}
							onChange={handleChange}
							options={["New friends", "Casual Fun", "Long-term relationship", "Marriage"]}
						/>

						<Select
							label="Belief"
							name="belief"
							value={formData.belief}
							onChange={handleChange}
							options={["Christianity", "Islam", "Other", "Prefer not to say"]}
						/>
					</div>
				</div>

				{/* Physical Information */}
				<div className="mb-6 rounded-2xl bg-white p-6">
					<div className="mb-6 flex items-center gap-3">
						<div className="grid h-10 w-10 place-items-center rounded-xl bg-[#f9e8ef] text-[#ca2e6b]">
							<Ruler size={19} />
						</div>

						<h2 className="font-semibold text-gray-800">Physical Information</h2>
					</div>

					<div className="grid gap-5 md:grid-cols-2">
						<Input
							label="Height"
							name="height"
							value={formData.height}
							onChange={handleChange}
							placeholder="e.g. 175.5"
						/>

						<Input
							label="Weight"
							name="weight"
							value={formData.weight}
							onChange={handleChange}
							placeholder="e.g. 70.2"
						/>

						<Select
							label="Zodiac"
							name="zodiac_sign"
							value={formData.zodiac_sign}
							onChange={handleChange}
							options={[
								"Aries",
								"Taurus",
								"Gemini",
								"Cancer",
								"Leo",
								"Virgo",
								"Libra",
								"Scorpio",
								"Sagittarius",
								"Capricorn",
								"Aquarius",
								"Pisces",
							]}
						/>

						<Select
							label="Sexual Orientation"
							name="sexual_orientation"
							value={formData.sexual_orientation}
							onChange={handleChange}
							options={["Heterosexual", "Homosexual", "Bisexual", "Other"]}
						/>
					</div>
				</div>

				{/* Lifestyle */}
				<div className="mb-6 rounded-2xl bg-white p-6">
					<div className="mb-6 flex items-center gap-3">
						<div className="grid h-10 w-10 place-items-center rounded-xl bg-[#f9e8ef] text-[#ca2e6b]">
							<Heart size={19} />
						</div>

						<h2 className="font-semibold text-gray-800">Lifestyle</h2>
					</div>

					<div className="grid gap-5 md:grid-cols-2">
						<Select
							label="Education"
							name="education_level"
							value={formData.education_level}
							onChange={handleChange}
							options={[
								"High School",
								"Bachelor's degree",
								"Master's degree",
								"Doctorate",
								"Tech Degree",
								"Other",
							]}
						/>

						<Select
							label="Marital Status"
							name="maritalstatus"
							value={formData.maritalstatus}
							onChange={handleChange}
							options={["Single", "Married", "Divorced", "Widowed"]}
						/>

						<Select
							label="Do you drink?"
							name="doyoudrink"
							value={formData.doyoudrink}
							onChange={handleChange}
							options={["No", "Yes", "Occasionally"]}
						/>

						<Select
							label="Do you smoke?"
							name="doyousmoke"
							value={formData.doyousmoke}
							onChange={handleChange}
							options={["No", "Yes", "Occasionally"]}
						/>

						<Select
							label="Do you have kids?"
							name="doyouhavekids"
							value={formData.doyouhavekids}
							onChange={handleChange}
							options={["No", "Yes"]}
						/>

						<Input
							label="Interests"
							name="yourinterest"
							value={formData.yourinterest}
							onChange={handleChange}
							placeholder="e.g. travel,music"
						/>
					</div>
				</div>

				{/* Location */}
				<div className="mb-6 rounded-2xl bg-white p-6">
					<div className="mb-6 flex items-center gap-3">
						<div className="grid h-10 w-10 place-items-center rounded-xl bg-[#f9e8ef] text-[#ca2e6b]">
							<MapPin size={19} />
						</div>

						<h2 className="font-semibold text-gray-800">Location</h2>
					</div>

					<div className="grid gap-5 md:grid-cols-2">
						<Input label="State" name="state" value={formData.state} onChange={handleChange} />

						<Input
							label="Country"
							name="country"
							value={formData.country}
							onChange={handleChange}
						/>
					</div>
				</div>

				{/* Bottom save */}
				<div className="flex justify-end gap-3">
					<button
						type="button"
						onClick={() => navigate("/profile")}
						className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50">
						Cancel
					</button>

					<button
						type="button"
						onClick={handleSave}
						className="flex items-center gap-2 rounded-xl bg-linear-to-r from-[#ca2e6b] to-[#67307d] px-7 py-3 text-sm font-semibold text-white transition hover:opacity-90">
						<Save size={17} />
						{saved ? "Saved!" : "Save Changes"}
					</button>
				</div>
			</section>
		</>
	);
}

/* -----------------------------
   Reusable Input
------------------------------ */

type InputProps = {
	label: string;
	name: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	type?: string;
	placeholder?: string;
};

function Input({ label, name, value, onChange, type = "text", placeholder }: InputProps) {
	return (
		<div>
			<label className="mb-2 block text-sm font-medium text-gray-700">{label}</label>

			<input
				type={type}
				name={name}
				value={value}
				onChange={onChange}
				placeholder={placeholder}
				className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#ca2e6b] focus:ring-2 focus:ring-[#ca2e6b]/10"
			/>
		</div>
	);
}

/* -----------------------------
   Reusable Select
------------------------------ */

type SelectProps = {
	label: string;
	name: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
	options: string[];
};

function Select({ label, name, value, onChange, options }: SelectProps) {
	return (
		<div>
			<label className="mb-2 block text-sm font-medium text-gray-700">{label}</label>

			<select
				name={name}
				value={value}
				onChange={onChange}
				className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-700 outline-none transition focus:border-[#ca2e6b] focus:ring-2 focus:ring-[#ca2e6b]/10">
				<option value="">Select {label}</option>

				{options.map((option) => (
					<option key={option} value={option}>
						{option}
					</option>
				))}
			</select>
		</div>
	);
}
