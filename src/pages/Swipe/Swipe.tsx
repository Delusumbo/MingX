import { useState } from "react";
import { Icon } from "@iconify/react";
import Header from "../../components/Header";
import astra from "../../assets/images/astra.png";
import cynthia from "../../assets/images/cynthia.png";
import sophie from "../../assets/images/sophie.png";
import margret from "../../assets/images/margret.png";

type Person = {
	id: number;
	name: string;
	age: number;
	image: string;
	location: string;
	distance: string;
	category: string;
	intent: string;
	bio: string;
};

const people: Person[] = [
	{
		id: 1,
		name: "Astra Gaze",
		age: 32,
		image: astra,
		location: "California, USA",
		distance: "2 miles away",
		category: "Casual Fun",
		intent: "Travelling & Painting",
		bio: "A single mother who is God fearing and likes to have lots of fun over the weekend",
	},
	{
		id: 2,
		name: "Cynthia Fish",
		age: 32,
		image: cynthia,
		location: "California, USA",
		distance: "4 miles away",
		category: "Casual Fun",
		intent: "Travelling & Painting",
		bio: "I enjoy good conversations, travelling and discovering new places.",
	},
	{
		id: 3,
		name: "Sophie Miller",
		age: 28,
		image: sophie,
		location: "California, USA",
		distance: "5 miles away",
		category: "Long Term",
		intent: "Travel & Photography",
		bio: "Looking for meaningful conversations and someone to explore life with.",
	},
	{
		id: 4,
		name: "Margret Hills",
		age: 30,
		image: margret,
		location: "California, USA",
		distance: "7 miles away",
		category: "Relationship",
		intent: "Music & Travel",
		bio: "Love music, travelling and spending time with people who make me laugh.",
	},
];

  
export default function Swipe() {    
	const [currentIndex, setCurrentIndex] = useState(0);

	const currentPerson = people[currentIndex];

	const leftPerson = people[(currentIndex - 1 + people.length) % people.length];

    const rightPerson = people[(currentIndex + 1) % people.length];
    

	const handleLike = () => {
		console.log("Liked:", currentPerson.name);
		setCurrentIndex((prev) => (prev + 1) % people.length);
	};

	const handlePass = () => {
		console.log("Passed:", currentPerson.name);
		setCurrentIndex((prev) => (prev + 1) % people.length);
	};

	return (
		<>
			<Header />
			<section className="min-h-[calc(100vh-76px)] bg-[#faf7f8] px-5 py-8 md:px-8 lg:px-10">			
				{/* Search / top actions */}			

				{/* Swipe area */}
				<div className="flex min-h-[calc(100vh-180px)] flex-col items-center justify-center">
					{/* Cards behind */}
					<div className="relative w-full max-w-108.75">
						{/* LEFT CARD */}
						<div className="absolute -left-47.5 top-13.5 hidden h-105 w-75 -rotate-25 overflow-hidden rounded-3xl border-10 border-white bg-white shadow-lg transition-all duration-500 ease-in-out md:block">
							<img
								src={leftPerson.image}
								alt={leftPerson.name}
								className="h-full w-full object-cover transition-opacity duration-500 ease-in-out"
							/>
						</div>

						{/* RIGHT CARD */}
						<div className="absolute -right-47.5 top-13.5 hidden h-105 w-75 rotate-25 overflow-hidden rounded-3xl border-10 border-white bg-white shadow-lg transition-all duration-500 ease-in-out md:block">
							<img
								src={rightPerson.image}
								alt={rightPerson.name}
								className="h-full w-full object-cover transition-opacity duration-500 ease-in-out"
							/>
						</div>

						{/* MAIN CARD */}
						<div className="relative z-10 overflow-hidden rounded-3xl bg-white shadow-xl transition-all duration-500 ease-in-out">
							<div className="h-70 w-full overflow-hidden p-2">
								<img
									src={currentPerson.image}
									alt={currentPerson.name}
									className="h-full w-full object-cover transition-opacity duration-500 ease-in-out"
								/>
							</div>

							<div className="px-4 pb-5 pt-2">
								<h1 className="text-xl font-bold text-black">
									{currentPerson.name}, {currentPerson.age}
								</h1>

								<div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-400">
									<span>{currentPerson.category}</span>

									<Icon
										icon="solar:map-point-linear"
										width="15"
										height="15"
										className="text-[#ca2e6b]"
									/>

									<span>{currentPerson.distance}</span>

									<span className="ml-auto rounded-full bg-[#f9e8ef] px-4 py-1.5 text-xs text-gray-500">
										{currentPerson.intent}
									</span>
								</div>

								<p className="mt-4 max-w-97.5 text-sm leading-5 text-gray-400">{currentPerson.bio}</p>

								<div className="mt-5 flex items-center gap-7">
									{/* LIKE */}
									<button
										type="button"
										onClick={handleLike}
										className="grid h-16.5 w-16.5 place-items-center rounded-full bg-[#f9e8ef] text-[#ca2e6b] transition hover:scale-105">
										<Icon icon="solar:heart-bold" width="34" height="34" />
									</button>

									{/* PASS */}
									<button
										type="button"
										onClick={handlePass}
										className="grid h-16.5 w-16.5 place-items-center rounded-full bg-[#f9e8ef] text-[#ca2e6b] transition hover:scale-105">
										<Icon icon="solar:close-circle-linear" width="32" height="32" />
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
