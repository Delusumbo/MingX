import { useState } from "react";
import Logo from "../../assets/images/Mingx.png";

type FormData = {
	name: string;
	dateOfBirth: string;
	gender: string;
	location: string;
	lookingFor: string;
	goal: string;
	belief: string;
	sexualOrientation: string;
	interests: string[];
	zodiac: string;
	education: string;
	maritalStatus: string;
	kids: string;
	bio: string;
	drinking: string;
	smoking: string;
	photos: File[];
	height: string;
	weight: string;
};

const Register = () => {
	const [step, setStep] = useState(1);

	const [formData, setFormData] = useState<FormData>({
		name: "",
		dateOfBirth: "",
		gender: "",
		location: "",
		lookingFor: "",
		goal: "",
		belief: "",
		sexualOrientation: "",
		interests: [],
		zodiac: "",
		education: "",
		maritalStatus: "",
		kids: "",
		bio: "",
		drinking: "",
		smoking: "",
		photos: [],
		height: "",
		weight: "",
	});

	const totalSteps = 20;

	// --------------------------------
	// UPDATE FORM DATA
	// --------------------------------

	const updateField = (field: keyof FormData, value: string) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	// --------------------------------
	// INTERESTS
	// --------------------------------

	const toggleInterest = (interest: string) => {
		setFormData((prev) => ({
			...prev,
			interests: prev.interests.includes(interest)
				? prev.interests.filter((item) => item !== interest)
				: [...prev.interests, interest],
		}));
	};

	// --------------------------------
	// PHOTO UPLOAD
	// --------------------------------

	const handlePhotos = (files: FileList | null) => {
		if (!files) return;

		const newPhotos = Array.from(files);

		setFormData((prev) => ({
			...prev,
			photos: [...prev.photos, ...newPhotos],
		}));
	};

	// --------------------------------
	// NEXT
	// --------------------------------

	const handleNext = () => {
		if (step < totalSteps) {
			setStep((prev) => prev + 1);
		} else {
			console.log("Registration completed:", formData);

			// Submit your registration here
		}
	};

	// --------------------------------
	// BACK
	// --------------------------------

	const handleBack = () => {
		if (step > 1) {
			setStep((prev) => prev - 1);
		}
	};

	// --------------------------------
	// SKIP
	// --------------------------------

	const handleSkip = () => {
		if (step < totalSteps) {
			setStep((prev) => prev + 1);
		}
	};

	// --------------------------------
	// PROGRESS
	// --------------------------------

	const progress = `${(step / totalSteps) * 100}%`;

	// --------------------------------
	// OPTIONS
	// --------------------------------

	const genderOptions = ["Male", "Female", "Non-binary"];

	const lookingForOptions = ["Men", "Women", "Everyone"];

	const goalOptions = ["Friendship", "Casual Dating", "Serious Relationship", "Marriage"];

	const beliefOptions = [
		"Christian",
		"Muslim",
		"Hindu",
		"Traditional",
		"Spiritual",
		"Other",
		"Prefer not to say",
	];

	const orientationOptions = ["Straight", "Gay", "Lesbian", "Bisexual", "Asexual", "Other"];

	const interests = [
		"Travel",
		"Music",
		"Movies",
		"Reading",
		"Fitness",
		"Cooking",
		"Photography",
		"Gaming",
		"Art",
		"Sports",
		"Dancing",
		"Fashion",
	];

	const zodiacOptions = [
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
	];

	const educationOptions = [
		"High School",
		"Diploma",
		"Bachelor's Degree",
		"Master's Degree",
		"PhD",
		"Other",
	];

	const maritalOptions = ["Single", "Divorced", "Widowed", "Separated", "It's complicated"];

	const kidsOptions = ["No kids", "1", "2", "3", "4+"];

	const drinkingOptions = ["Never", "Occasionally", "Socially", "Frequently"];

	const smokingOptions = ["Never", "Occasionally", "Socially", "Regularly"];

	// --------------------------------
	// OPTION BUTTON
	// --------------------------------

	const OptionButton = ({
		value,
		selected,
		onClick,
	}: {
		value: string;
		selected: boolean;
		onClick: () => void;
	}) => (
		<button
			type="button"
			onClick={onClick}
			className={`
        rounded-lg
        border
        px-5
        py-3
        text-sm
        transition-all
        duration-200
        ${
					selected
						? "border-[#C43266] bg-[#C43266] text-white"
						: "border-transparent bg-[#F9E8EE] text-gray-700 hover:border-[#C43266]"
				}
      `}>
			{value}
		</button>
	);

	// --------------------------------
	// STEP CONTENT
	// --------------------------------

	const renderStep = () => {
		switch (step) {
			// ============================
			// 1. NAME
			// ============================

			case 1:
				return (
					<>
						<p className="text-sm text-gray-800">Hey You!</p>

						<h1 className="mt-5 text-2xl font-bold text-black sm:text-3xl">What's your name?</h1>

						<input
							type="text"
							value={formData.name}
							onChange={(e) => updateField("name", e.target.value)}
							placeholder="Enter your names"
							className="mt-8 h-12.5 w-full max-w-90 rounded-xl border-none bg-[#F9E8EE] px-5 text-center outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-[#C43266]/30"
						/>
					</>
				);

			// ============================
			// 2. DATE OF BIRTH
			// ============================

			case 2:
				return (
					<>
						<h1 className="text-2xl font-bold text-black sm:text-3xl">Enter your date of birth?</h1>

						<p className="mt-5 text-sm text-gray-700">This age will be seen by other users</p>

						<input
							type="date"
							value={formData.dateOfBirth}
							onChange={(e) => updateField("dateOfBirth", e.target.value)}
							className="mt-8 h-12.5 w-full max-w-90 rounded-xl border-none bg-[#F9E8EE] px-5 text-center text-gray-600 outline-none focus:ring-2 focus:ring-[#C43266]/30"
						/>
					</>
				);

			// ============================
			// 3. GENDER
			// ============================

			case 3:
				return (
					<>
						<h1 className="text-2xl font-bold text-black sm:text-3xl">Tell us your gender?</h1>

						<p className="mt-4 max-w-md text-center text-sm text-gray-700">
							We want to get to know you better. Choose the option that best describes you!
						</p>

						<div className="mt-8 flex flex-wrap justify-center gap-3">
							{genderOptions.map((option) => (
								<OptionButton
									key={option}
									value={option}
									selected={formData.gender === option}
									onClick={() => updateField("gender", option)}
								/>
							))}
						</div>
					</>
				);

			// ============================
			// 4. LOOKING FOR
			// ============================

			case 4:
				return (
					<>
						<h1 className="text-2xl font-bold text-black sm:text-3xl">Who are you looking for?</h1>

						<p className="mt-4 text-sm text-gray-700">
							Help us find your perfect match by letting us know who you are interested in.
						</p>

						<div className="mt-8 flex flex-wrap justify-center gap-3">
							{lookingForOptions.map((option) => (
								<OptionButton
									key={option}
									value={option}
									selected={formData.lookingFor === option}
									onClick={() => updateField("lookingFor", option)}
								/>
							))}
						</div>
					</>
				);

			// ============================
			// 5. GOAL
			// ============================

			case 5:
				return (
					<>
						<h1 className="text-2xl font-bold text-black sm:text-3xl">What's your goal?</h1>

						<p className="mt-4 max-w-lg text-center text-sm text-gray-700">
							Tell us what kind of connections you are seeking. Whether it's fun, casual or
							something serious.
						</p>

						<div className="mt-8 flex flex-wrap justify-center gap-3">
							{goalOptions.map((option) => (
								<OptionButton
									key={option}
									value={option}
									selected={formData.goal === option}
									onClick={() => updateField("goal", option)}
								/>
							))}
						</div>
					</>
				);

			// ============================
			// 6. INTERESTS
			// ============================

			case 6:
				return (
					<>
						<h1 className="text-2xl font-bold text-black sm:text-3xl">What's your interest?</h1>

						<p className="mt-4 max-w-xl text-center text-sm text-gray-700">
							Help us match you with people who share your passions. Pick your favorite activities
							and hobbies!
						</p>

						<div className="mt-8 flex max-w-3xl flex-wrap justify-center gap-3">
							{interests.map((interest) => (
								<OptionButton
									key={interest}
									value={interest}
									selected={formData.interests.includes(interest)}
									onClick={() => toggleInterest(interest)}
								/>
							))}
						</div>
					</>
				);

			// ============================
			// 7. HEIGHT
			// ============================

			case 7:
				return (
					<>
						<h1 className="text-2xl font-bold text-black sm:text-3xl">What's your Height?</h1>

						<input
							type="text"
							value={formData.height}
							onChange={(e) => updateField("height", e.target.value)}
							placeholder="Enter your height"
							className="mt-8 h-12.5 w-full max-w-90 rounded-xl border-none bg-[#F9E8EE] px-5 text-center outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-[#C43266]/30"
						/>
					</>
				);

			// ============================
			// 8. WEIGHT
			// ============================

			case 8:
				return (
					<>
						<h1 className="text-2xl font-bold text-black sm:text-3xl">What's your Weight?</h1>

						<input
							type="text"
							value={formData.weight}
							onChange={(e) => updateField("weight", e.target.value)}
							placeholder="Enter your weight"
							className="mt-8 h-12.5 w-full max-w-90 rounded-xl border-none bg-[#F9E8EE] px-5 text-center outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-[#C43266]/30"
						/>
					</>
				);

			// ============================
			// 9. BELIEF
			// ============================

			case 9:
				return (
					<>
						<h1 className="text-2xl font-bold text-black sm:text-3xl">What's your Belief?</h1>

						<p className="mt-4 max-w-lg text-center text-sm text-gray-700">
							Let us know your beliefs to help find matches who share or respect your values.
						</p>

						<div className="mt-8 flex max-w-2xl flex-wrap justify-center gap-3">
							{beliefOptions.map((option) => (
								<OptionButton
									key={option}
									value={option}
									selected={formData.belief === option}
									onClick={() => updateField("belief", option)}
								/>
							))}
						</div>
					</>
				);

			// ============================
			// 10. ORIENTATION
			// ============================

			case 10:
				return (
					<>
						<h1 className="text-2xl font-bold text-black sm:text-3xl">
							What's your sexual orientation?
						</h1>

						<p className="mt-4 max-w-xl text-center text-sm text-gray-700">
							We want to ensure we find matches that respect and align with your orientation.
						</p>

						<div className="mt-8 flex max-w-2xl flex-wrap justify-center gap-3">
							{orientationOptions.map((option) => (
								<OptionButton
									key={option}
									value={option}
									selected={formData.sexualOrientation === option}
									onClick={() => updateField("sexualOrientation", option)}
								/>
							))}
						</div>
					</>
				);

			// ============================
			// 11. ZODIAC
			// ============================

			case 11:
				return (
					<>
						<h1 className="text-2xl font-bold text-black sm:text-3xl">What's your Zodiac sign?</h1>

						<p className="mt-4 text-sm text-gray-700">
							We're curious about your astrological profile.
						</p>

						<div className="mt-8 flex max-w-3xl flex-wrap justify-center gap-3">
							{zodiacOptions.map((option) => (
								<OptionButton
									key={option}
									value={option}
									selected={formData.zodiac === option}
									onClick={() => updateField("zodiac", option)}
								/>
							))}
						</div>
					</>
				);

			// ============================
			// 12. EDUCATION
			// ============================

			case 12:
				return (
					<>
						<h1 className="text-2xl font-bold text-black sm:text-3xl">
							What's your education level?
						</h1>

						<p className="mt-4 text-sm text-gray-700">Share your highest level of education.</p>

						<div className="mt-8 flex flex-wrap justify-center gap-3">
							{educationOptions.map((option) => (
								<OptionButton
									key={option}
									value={option}
									selected={formData.education === option}
									onClick={() => updateField("education", option)}
								/>
							))}
						</div>
					</>
				);

			// ============================
			// 13. DRINKING
			// ============================

			case 13:
				return (
					<>
						<h1 className="text-2xl font-bold text-black sm:text-3xl">Do you drink?</h1>

						<p className="mt-4 max-w-lg text-center text-sm text-gray-700">
							Tell us about your drinking habits. Whether it's a casual sip or the occasional toast.
						</p>

						<div className="mt-8 flex flex-wrap justify-center gap-3">
							{drinkingOptions.map((option) => (
								<OptionButton
									key={option}
									value={option}
									selected={formData.drinking === option}
									onClick={() => updateField("drinking", option)}
								/>
							))}
						</div>
					</>
				);

			// ============================
			// 14. SMOKING
			// ============================

			case 14:
				return (
					<>
						<h1 className="text-2xl font-bold text-black sm:text-3xl">Do you smoke?</h1>

						<p className="mt-4 max-w-lg text-center text-sm text-gray-700">
							We want to know a bit about your lifestyle.
						</p>

						<div className="mt-8 flex flex-wrap justify-center gap-3">
							{smokingOptions.map((option) => (
								<OptionButton
									key={option}
									value={option}
									selected={formData.smoking === option}
									onClick={() => updateField("smoking", option)}
								/>
							))}
						</div>
					</>
				);

			// ============================
			// 17. ADD PHOTO
			// ============================

			case 15:
				return (
					<>
						<h1 className="text-2xl font-bold text-black sm:text-3xl">Add a Photo</h1>

						<p className="mt-4 max-w-lg text-center text-sm text-gray-700">
							Profiles with photos get more attention! Upload a photo that captures your
							personality.
						</p>

						<label className="mt-8 flex h-28 w-28 cursor-pointer flex-col items-center justify-center rounded-xl bg-[#F9E8EE] text-sm text-[#C43266]">
							<span className="text-2xl">📷</span>
							<span className="mt-1">Upload</span>

							<input
								type="file"
								accept="image/*"
								className="hidden"
								onChange={(e) => handlePhotos(e.target.files)}
							/>
						</label>

						{formData.photos.length > 0 && (
							<p className="mt-4 text-sm text-[#C43266]">Photo selected ✓</p>
						)}
					</>
				);

			// ============================
			// 16. MORE PHOTOS
			// ============================

			case 16:
				return (
					<>
						<h1 className="text-2xl font-bold text-black sm:text-3xl">Add more photos</h1>

						<p className="mt-4 max-w-lg text-center text-sm text-gray-700">
							Profiles with multiple photos get more attention! Upload a few photos that capture
							different aspects of your life and personality.
						</p>

						<label className="mt-8 flex cursor-pointer items-center justify-center rounded-xl bg-[#F9E8EE] px-8 py-5 text-sm text-[#C43266]">
							+ Add photos
							<input
								type="file"
								accept="image/*"
								multiple
								className="hidden"
								onChange={(e) => handlePhotos(e.target.files)}
							/>
						</label>

						{formData.photos.length > 0 && (
							<p className="mt-4 text-sm text-[#C43266]">
								{formData.photos.length} photo(s) selected ✓
							</p>
						)}
					</>
				);

			// ============================
			// 17. LOCATION
			// ============================

			case 17:
				return (
					<>
						<h1 className="text-2xl font-bold text-black sm:text-3xl">Location</h1>

						<p className="mt-4 max-w-md text-center text-sm text-gray-700">
							Let the app locate you to provide best searched results around you
						</p>

						<button
							type="button"
							onClick={() => updateField("location", "Current location")}
							className="mt-8 rounded-xl bg-[#F9E8EE] px-8 py-4 text-sm text-gray-700 hover:ring-2 hover:ring-[#C43266]/30">
							📍 Use my current location
						</button>

						{formData.location && (
							<p className="mt-3 text-sm text-[#C43266]">{formData.location}</p>
						)}
					</>
				);

			// ============================
			// 18. MARITAL STATUS
			// ============================

			case 18:
				return (
					<>
						<h1 className="text-2xl font-bold text-black sm:text-3xl">
							What's your marital status?
						</h1>

						<p className="mt-4 text-sm text-gray-700">
							Help us understand your current relationship status.
						</p>

						<div className="mt-8 flex flex-wrap justify-center gap-3">
							{maritalOptions.map((option) => (
								<OptionButton
									key={option}
									value={option}
									selected={formData.maritalStatus === option}
									onClick={() => updateField("maritalStatus", option)}
								/>
							))}
						</div>
					</>
				);

			// ============================
			// 19. KIDS
			// ============================

			case 19:
				return (
					<>
						<h1 className="text-2xl font-bold text-black sm:text-3xl">Do you have kids?</h1>

						<p className="mt-4 text-sm text-gray-700">
							Help us understand your current relationship status.
						</p>

						<div className="mt-8 flex flex-wrap justify-center gap-3">
							{kidsOptions.map((option) => (
								<OptionButton
									key={option}
									value={option}
									selected={formData.kids === option}
									onClick={() => updateField("kids", option)}
								/>
							))}
						</div>
					</>
				);

			// ============================
			// 20. BIO
			// ============================

			case 20:
				return (
					<>
						<h1 className="text-2xl font-bold text-black sm:text-3xl">
							Your Profile is almost ready!
						</h1>

						<p className="mt-4 max-w-lg text-center text-sm text-gray-700">
							A great bio can make all the difference. Tell others a little more about yourself in a
							few words.
						</p>

						<textarea
							value={formData.bio}
							onChange={(e) => updateField("bio", e.target.value)}
							placeholder="Tell us about yourself..."
							rows={5}
							className="mt-8 w-full max-w-xl resize-none rounded-xl border-none bg-[#F9E8EE] px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-[#C43266]/30"
						/>
					</>
				);

			default:
				return null;
		}
	};

	return (
		<div className="min-h-screen bg-linear-to-b from-[#C43266] to-[#652F7B] px-4 py-5 sm:px-8 lg:px-12">
			{/* ================= LOGO ================= */}

			<img src={Logo} alt="MingX" className="w-28 sm:w-32" />

			{/* ================= MAIN CARD ================= */}

			<div className="mx-auto mt-6 flex min-h-[calc(100vh-125px)] max-w-7xl flex-col rounded-3xl bg-white px-5 py-8 sm:px-10 sm:py-10 lg:px-16">
				{/* ================= PROGRESS ================= */}

				<div className="w-full">
					<div
						className="h-2 rounded-full bg-[#652F7B] transition-all duration-500"
						style={{
							width: progress,
							maxWidth: "100%",
						}}
					/>
				</div>

				{/* ================= STEP CONTENT ================= */}

				<div className="flex flex-1 items-center justify-center py-10">
					<div className="flex w-full flex-col items-center text-center">{renderStep()}</div>
				</div>

				{/* ================= NAVIGATION ================= */}

				<div className="flex items-center justify-between gap-4">
					{/* Skip / Back */}

					<div>
						{step > 1 && (
							<button
								type="button"
								onClick={handleBack}
								className="rounded-xl border border-[#C43266] px-5 py-3 text-sm text-[#652F7B] transition hover:bg-[#F9E8EE]">
								← Back
							</button>
						)}
					</div>

					{/* Next */}

					<div className="flex gap-3">
						{step > 1 && step < 20 && (
							<button
								type="button"
								onClick={handleSkip}
								className="rounded-xl border border-[#C43266] px-5 py-3 text-sm text-[#652F7B] transition hover:bg-[#F9E8EE]">
								Skip
							</button>
						)}

						<button
							type="button"
							onClick={handleNext}
							className="rounded-xl bg-[#C43266] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#A82A55]">
							{step === totalSteps ? "Finish" : "Next"} →
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Register;
