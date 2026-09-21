import {
	CalendarDays,
	CircleUserRound,
	Crosshair,
	GraduationCap,
	Heart,
	MapPin,
	Pencil,
	Ruler,
	Star,
	Wine,
	Cigarette,
	UsersRound,
} from "lucide-react";
import { Header } from "../../components/Layout";
import joseph from "../../assets/images/joseph.png";


const storedUser = localStorage.getItem("user");

const user = storedUser ? JSON.parse(storedUser) : null;

let interests = "Not provided";

try {
	const parsed = JSON.parse(user?.yourinterest || "[]");
	interests = parsed.join(", ");
} catch {
	interests = user?.yourinterest || "Not provided";
}

type ProfileInfo = {
	label: string;
	value: string;
	icon: React.ElementType;
};

const information: ProfileInfo[] = [
	{
		label: "Gender",
		value: user?.gender || "Not provided",
		icon: CircleUserRound,
	},
	{
		label: "Date of Birth",
		value: user?.dob || "Not provided",
		icon: CalendarDays,
	},
	{
		label: "Looking For",
		value: user?.lookingfor || "Not provided",
		icon: CircleUserRound,
	},
	{
		label: "Goal",
		value: user?.goal || "Not provided",
		icon: Crosshair,
	},
	{
		label: "Interest",
		value: interests || "Not provided",
		icon: Star,
	},
	{
		label: "Height",
		value: user?.height || "Not provided",
		icon: Ruler,
	},
	{
		label: "Weight",
		value: user?.weight || "Not provided",
		icon: Ruler,
	},
	{
		label: "Belief",
		value: user?.belief || "Not provided",
		icon: Heart,
	},
	{
		label: "Sexual Orientation",
		value: user?.sexual_orientation || "Not provided",
		icon: UsersRound,
	},
	{
		label: "Zodiac",
		value: user?.zodiac_sign || "Not provided",
		icon: Star,
	},
	{
		label: "Education",
		value: user?.education_level || "Not provided",
		icon: GraduationCap,
	},
	{
		label: "Drink",
		value: user?.doyoudrink || "Not provided",
		icon: Wine,
	},
	{
		label: "Smoke",
		value: user?.doyousmoke || "Not provided",
		icon: Cigarette,
	},
	{
		label: "Marital Status",
		value: user?.maritalstatus || "Not provided",
		icon: Heart,
	},
	{
		label: "Kids",
		value: user?.doyouhavekids || "Not provided",
		icon: UsersRound,
	},
	{
		label: "Location",
		value: [user?.state, user?.country].filter(Boolean).join(", ") || "Not provided",
		icon: MapPin,
	},
];

export default function Profile() {
	return (
		<>
			<Header searchPlaceholder="Search by name or message" />

			<section className="px-5 pb-24 pt-10 md:px-8 lg:px-10">
				<div className="flex items-center justify-between">
					<h1 className="text-3xl font-bold text-[#67307d]">Profile</h1>

					<button className="rounded-full bg-linear-to-r from-[#ca2e6b] to-[#67307d] px-7 py-3 text-sm font-semibold text-white">
						Edit Profile
					</button>
				</div>

				{/* Profile image */}

				<div className="flex flex-col items-center py-8">
					<div className="relative">
						<img
							src={user?.profilepicture}
							className="h-36 w-36 rounded-full border-4 border-[#ca2e6b] object-cover p-1"
						/>

						<span className="absolute bottom-0 right-0 grid h-7 w-7 place-items-center rounded-full bg-[#ca2e6b] text-white">
							<Pencil size={13} />
						</span>
					</div>

					<h2 className="mt-4 text-lg font-semibold">{ user?.name}</h2>

					<span className="mt-2 rounded-full bg-[#ca2e6b] px-5 py-2 text-xs text-white">
						⚑ {user?.goal}
					</span>
				</div>

				{/* About */}

				<h3 className="mb-3 font-semibold">About Me</h3>

				<div className="rounded-2xl bg-white p-5 text-sm text-gray-500">
					Am good looking and God fearing
				</div>

				{/* Information */}

				<h3 className="mb-4 mt-8 font-semibold">Basic Information</h3>

				<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
					{information.map((item) => {
						const Icon = item.icon;

						return (
							<div key={item.label} className="rounded-2xl bg-white p-5">
								<span className="mb-3 grid h-8 w-8 place-items-center rounded-lg bg-[#f9e8ef] text-[#ca2e6b]">
									<Icon size={15} />
								</span>

								<div className="text-sm text-gray-400">{item.label}</div>

								<div className="mt-1 text-sm font-medium">{item.value}</div>
							</div>
						);
					})}
				</div>
			</section>
		</>
	);
}
