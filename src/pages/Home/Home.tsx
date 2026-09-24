import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/images/Mingx.png";
import Heart from "../../assets/images/love.png";
import AbstractLine from "../../assets/images/Line.png";
import People from "../../assets/images/people.png";
import ProfileCard from "../../assets/images/Frame.png";
import Purple from "../../assets/images/purple.png";
import MessageCard from "../../assets/images/Vector.png";
import View from "../../assets/images/view.png";
import { FaStar } from "react-icons/fa";
import Sparkles from "../../assets/images/sparkles.png";
import Ice from "../../assets/images/ice.png";
import Chat from "../../assets/images/chat.png";
import Forever1 from "../../assets/images/forever1.png";
import Forever2 from "../../assets/images/forever2.png";
import Forever3 from "../../assets/images/forever3.png";
import Variant1 from "../../assets/images/variant1.png";
import Variant2 from "../../assets/images/variant2.png";
import Variant3 from "../../assets/images/variant3.png";
import Canada from "../../assets/images/canada.png";
import Aussie from "../../assets/images/aussie.png";
import Spain from "../../assets/images/spain.png";
import USA from "../../assets/images/usa.png";
import Swede from "../../assets/images/swede.png";
import Mexico from "../../assets/images/mexico.png";
import Welcome from "../../assets/images/welcome.png";
import Apple from "../../assets/images/apple.png";
import Google from "../../assets/images/google.png";
import { IoIosMail } from "react-icons/io";


const Home = () => {
	

	return (
		<div className="min-h-screen">
			<header className="relative flex items-center justify-between bg-white px-5 py-4 lg:px-24">
				{/* Logo */}
				<div>
					<img src={Logo} alt="Logo" className="w-24 lg:w-auto" />
				</div>

				{/* Desktop Navigation */}

				{/* Desktop Button */}
				<div>
					<Link
						to="/login"
						className="rounded-xl bg-black px-5 py-4 text-xl text-white hover:bg-[#ED2882]">
						Get Started
					</Link>
				</div>
			</header>

			{/* Hero */}
			<section className="relative min-h-[640px] overflow-hidden sm:min-h-[720px] md:min-h-[820px] lg:h-200">
				{/* Decorative elements — hidden on mobile, shown from md up */}
				<div className="hidden md:block">
					<div className="absolute left-[8%] top-[20%] h-4 w-4 rounded-full bg-white md:h-5 md:w-5" />

					<img src={Heart} alt="" className="absolute right-[6%] top-[4%] w-16 md:w-20 lg:w-auto" />

					<img
						src={AbstractLine}
						alt=""
						className="absolute right-[8%] top-[26%] z-10 w-24 md:w-32 lg:w-auto"
					/>

					<img
						src={ProfileCard}
						alt=""
						className="absolute right-[5%] top-[60%] z-30 w-28 md:w-36 lg:w-auto"
					/>

					<img
						src={MessageCard}
						alt=""
						className="absolute right-[10%] top-[22%] z-30 w-28 md:w-36 lg:w-auto"
					/>

					<img
						src={View}
						alt=""
						className="absolute left-[10%] top-[28%] z-30 w-28 md:w-36 lg:w-auto"
					/>
				</div>

				{/* Heading */}
				<div className="relative z-10 px-5 pt-12 text-center sm:pt-16 md:pt-20 lg:pt-16">
					<h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
						Meet the <br />
						right people
					</h1>

					<p className="mx-auto mt-4 max-w-xs text-sm text-white/90 sm:mt-5 sm:max-w-sm sm:text-base">
						Real conversations, verified people, and meaningful connections built around what
						matters to you.
					</p>
				</div>

				{/* Bottom purple shape */}
				<img
					src={Purple}
					alt=""
					className="absolute left-0 top-95 z-0 h-40 w-full sm:top-105 sm:h-48 md:top-115 md:h-56 lg:top-125 lg:h-60"
				/>

				{/* People */}
				<img
					src={People}
					alt=""
					className="absolute left-1/2 top-72 z-20 w-64 -translate-x-1/2 sm:top-80 sm:w-80 md:top-90 md:w-96 lg:top-85 lg:w-100"
				/>
			</section>

			{/* Rating section */}
			<section className="container mx-auto px-5 py-10">
				<div className="grid grid-cols-1 gap-10 text-white sm:grid-cols-2 lg:grid-cols-4 lg:gap-20">
					<div className="text-center">
						<h3 className="mb-2 text-5xl font-bold lg:text-7xl">4.2M</h3>
						<p>Active Members</p>
					</div>

					<div className="text-center">
						<h3 className="mb-2 text-5xl font-bold lg:text-7xl">78%</h3>
						<p>Connections made</p>
					</div>

					<div className="text-center">
						<h3 className="mb-2 text-5xl font-bold lg:text-7xl">150+</h3>
						<p>Cities</p>
					</div>

					<div className="text-center">
						<h3 className="mb-2 flex items-center justify-center gap-2 text-5xl font-bold lg:text-7xl">
							4.8
							<FaStar className="w-7 lg:w-10" />
						</h3>
						<p>App Rating</p>
					</div>
				</div>
			</section>

			{/* dating feels */}
			<section className="container mx-auto px-10 py-10 ">
				<div className="bg-white rounded-4xl p-10">
					<h2 className="text-4xl lg:text-5xl font-bold text-black mb-10 w-full lg:w-125">
						Connecting people that <span className="text-[#C43266]">feels</span> like a{" "}
						<span className="text-[#C43266]">conversation</span>
					</h2>
					<div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 w-full">
						<div className="bg-[#C432661A] rounded-4xl p-10">
							<img src={Sparkles} alt="" className="" />
							<div className="mt-5">
								<h3 className="text-xl font-bold text-black mt-3">Smart connection</h3>
								<p>
									{" "}
									Our discovery engine considers your interests, values, and communities to help you
									discover people you genuinely connect with.{" "}
								</p>
							</div>
						</div>
						<div className="bg-[#C432661A] rounded-4xl p-10">
							<img src={Ice} alt="" className="" />
							<div className="mt-5">
								<h3 className="text-xl font-bold text-black mt-3">Conversation starter</h3>
								<p>
									{" "}
									Break the ice with thoughtful prompts based on shared interests, experiences, and
									things you both care about.{" "}
								</p>
							</div>
						</div>
						<div className="bg-[#C432661A] rounded-4xl p-10">
							<img src={Sparkles} alt="" className="" />
							<div className="mt-5">
								<h3 className="text-xl font-bold text-black mt-3">Verified & safe</h3>
								<p>
									{" "}
									Profile verification, reporting tools, and human moderation help create a trusted
									environment for everyone.{" "}
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* steps */}
			<section className="container mx-auto p-10">
				<div className="rounded-4xl">
					<h3 className="text-5xl font-bold text-white mb-10">Three steps to say hello</h3>
					<div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
						<div className="bg-white rounded-4xl p-10">
							<p className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C43266] text-white">
								01
							</p>
							<div className="mt-5">
								<h3 className="text-xl font-bold text-black my-3">Build your profile</h3>
								<hr className="text-[#652F7B4D]" />
								<p className="my-3">
									Add your photos, interests, communities, and a little about what makes you unique.
								</p>
							</div>
						</div>
						<div className="bg-white rounded-4xl p-10">
							<p className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C43266] text-white">
								02
							</p>
							<div className="mt-5">
								<h3 className="text-xl font-bold text-black my-3">Discover people</h3>
								<hr className="text-[#652F7B4D]" />
								<p className="my-3">
									Explore people, communities, and conversations that align with your interests and
									values.
								</p>
							</div>
						</div>
						<div className="bg-white rounded-4xl p-10">
							<p className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C43266] text-white">
								03
							</p>
							<div className="mt-5">
								<h3 className="text-xl font-bold text-black my-3">Start a conersation</h3>
								<hr className="text-[#652F7B4D]" />
								<p className="my-3">
									Connect, exchange ideas, and build meaningful relationships through genuine
									conversations.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* ready to chat */}
			<section className="container mx-auto px-6 py-10 sm:px-8 lg:p-10">
				<div className="flex flex-col items-center justify-between gap-8 lg:flex-row lg:gap-10">
					<div className="text-center lg:text-left">
						<h3 className="text-3xl font-bold text-white mb-6 sm:text-4xl md:text-5xl lg:text-6xl lg:mb-10">
							Ready to connect?
						</h3>
						<p className="mx-auto mb-6 max-w-md text-sm text-white sm:text-base lg:mx-0 lg:mb-10 lg:w-125 lg:max-w-none">
							"Skip the small talk and discover conversations with people who share your interests,
							experiences, and perspective."
						</p>
						<Link
							to="/login"
							className="block w-full rounded-xl bg-black px-5 py-3 text-center text-lg text-white hover:bg-[#ED2882] sm:w-auto sm:inline-block lg:w-60 lg:py-4 lg:text-xl">
							Sign Up
						</Link>
					</div>
					<div className="w-full max-w-sm lg:max-w-none lg:w-auto">
						<img src={Chat} alt="" className="w-full" />
					</div>
				</div>
			</section>

			{/* forever */}
			<section className="mx-6 my-12 sm:mx-8 md:mx-10 md:my-16 lg:m-30">
				<h3 className="mb-10 text-center text-3xl font-bold text-white sm:text-4xl md:mb-16 md:text-5xl lg:mb-20">
					Real people. Real connections.
				</h3>
				<div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 md:gap-10 lg:grid-cols-3">
					{/* Card */}
					<div className="group">
						{/* Image area */}
						<div className="relative mb-7 aspect-4/5 rounded-t-2xl">
							{/* Default image */}
							<img
								src={Forever1}
								alt=""
								className="relative z-0 block h-full w-full object-cover transition-opacity duration-500 ease-in-out group-hover:opacity-0"
							/>

							{/* Hover image */}
							<img
								src={Variant1}
								alt=""
								className="absolute inset-0 z-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100"
							/>

							{/* Australia flag - top right corner */}
							<img
								src={Aussie}
								alt=""
								className="absolute -right-2 -top-7 z-20 sm:-right-3 sm:-top-3 lg:-right-4 lg:-top-4"
							/>

							{/* Spain flag - bottom left corner */}
							<img
								src={Spain}
								alt=""
								className="absolute -bottom-7 -left-2 z-20 sm:-bottom-4 sm:-left-3 lg:-bottom-7 lg:-left-4"
							/>
						</div>

						{/* Testimonial */}
						<div className="rounded-b-2xl bg-[#652F7B] px-5 py-5 text-center text-white sm:px-6 sm:py-6">
							<p className="text-sm leading-6 sm:text-base">
								"Our first conversation felt natural because we already shared the same core values
								and cultural background. MingX made it easy to discover someone who understood where
								I was coming from"
							</p>
							<p className="mt-6 font-bold sm:mt-8">David & Anita</p>
						</div>
					</div>

					{/* Card 2 — same structure */}
					<div className="group">
						<div className="relative mb-7 aspect-4/5 rounded-t-2xl">
							<img
								src={Forever2}
								alt=""
								className="relative z-0 block h-full w-full object-cover transition-opacity duration-500 ease-in-out group-hover:opacity-0"
							/>
							<img
								src={Variant2}
								alt=""
								className="absolute inset-0 z-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100"
							/>
							<img
								src={Canada}
								alt=""
								className="absolute -right-2 -top-7 z-20 sm:-right-3 sm:-top-3 lg:-right-4 lg:-top-4"
							/>
							<img
								src={Swede}
								alt=""
								className="absolute -bottom-7 -left-2 z-20 sm:-bottom-4 sm:-left-3 lg:-bottom-7 lg:-left-4"
							/>
						</div>
						<div className="rounded-b-2xl bg-[#652F7B] px-5 py-5 text-center text-white sm:px-6 sm:py-6">
							<p className="text-sm leading-6 sm:text-base">
								"I almost gave up on social platforms until I found MingX. It made it easy to move
								beyond superficial conversations and connect around things that actually matter."
							</p>
							<p className="mt-6 font-bold sm:mt-8">Katherine & Moses</p>
						</div>
					</div>

					{/* Card 3 — same structure */}
					<div className="group">
						<div className="relative mb-7 aspect-4/5 rounded-t-2xl">
							<img
								src={Forever3}
								alt=""
								className="relative z-0 block h-full w-full object-cover transition-opacity duration-500 ease-in-out group-hover:opacity-0"
							/>
							<img
								src={Variant3}
								alt=""
								className="absolute inset-0 z-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100"
							/>
							<img
								src={USA}
								alt=""
								className="absolute -right-2 -top-7 z-20 sm:-right-3 sm:-top-3 lg:-right-4 lg:-top-4"
							/>
							<img
								src={Mexico}
								alt=""
								className="absolute -bottom-7 -left-2 z-20 sm:-bottom-4 sm:-left-3 lg:-bottom-7 lg:-left-4"
							/>
						</div>
						<div className="rounded-b-2xl bg-[#652F7B] px-5 py-5 text-center text-white sm:px-6 sm:py-6">
							<p className="text-sm leading-6 sm:text-base">
								"Living in the diaspora, finding people who genuinely understood my background and
								perspective was difficult. MingX helped me discover a community where conversations
								felt effortless."
							</p>
							<p className="mt-6 font-bold sm:mt-8">Annabel & Jerome</p>
						</div>
					</div>
				</div>
			</section>

			{/* DOWNLOAD */}
			<section className="p-10 lg:p-20 ">
				<div className="grid grid-cols-1 md:grid-cols-2">
					<div className="">
						<img src={Welcome} alt="App Store" className="" />
					</div>
					<div className="pt-15">
						<h3 className="text-5xl font-bold text-white mb-10 lg:w-100 ">
							Download the <span className="text-[#C43266]">MingX</span> App
						</h3>
						<p className="text-white lg:w-90 mb-10 lg:mb-20">
							Stay connected wherever you go. Discover new people, join communities, and have
							meaningful conversations from anywhere
						</p>
						<div className="flex flex-col gap-5 md:flex-row">
							<Link to="#">
								<img src={Apple} alt="App Store" className="" />
							</Link>
							<Link to="#">
								<img src={Google} alt="Google Play" className="" />
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* match */}
			<section className="mx-4 rounded-t-3xl bg-white px-6 py-12 sm:mx-6 sm:px-10 lg:mx-30 lg:px-20 lg:py-16">
				<div className="mx-auto max-w-4xl text-center">
					<h3 className="mb-5 text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
						Your next connection is one <span className="text-[#C43266]">Hello</span> away
					</h3>

					<p className="mb-8 text-sm text-gray-600 sm:text-base">
						Join MingX today and discover people, communities, and conversations that matter to you.
					</p>

					<form className="mx-auto flex flex-col gap-3 sm:flex-row">
						<input
							type="email"
							placeholder="you@email.com"
							className="w-full
          lg:w-[80%]
          rounded-md
          border-none
          bg-[#F9E8EEB0]
          px-4
          py-3
          text-black
          placeholder:text-gray-500
          outline-none
          focus:ring-2
          focus:ring-[#C43266]
        "
						/>

						<button
							type="submit"
							className="
          w-full
          rounded-md
          bg-[#C43266]
          px-6
          py-3
          font-medium
          text-white
          transition
          duration-300
          hover:bg-[#A82A55]
          focus:outline-none
          focus:ring-2
          focus:ring-[#C43266]
          focus:ring-offset-2
          sm:w-auto hover:bg-linear-to-r
          from-[#C43266]
          to-[#652F7B]

        ">
							Join for free
						</button>
					</form>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-white pt-15">
				<div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
					{/* Logo / Description */}
					<div>
						<img src={Logo} alt="MingX" className="w-28" />

						<p className="mt-6 max-w-sm text-sm leading-6 text-gray-600">
							MingX is a modern platform for discovering people, building communities, and having
							authentic conversations around the things that matter to you.
						</p>
					</div>

					{/* Legal */}
					<div>
						<h4 className="mb-5 text-lg font-semibold text-black">Legal</h4>

						<ul className="space-y-3">
							<li>
								<Link to="#" className="text-sm text-gray-600 transition hover:text-[#C43266]">
									Terms of Service
								</Link>
							</li>

							<li>
								<Link to="#" className="text-sm text-gray-600 transition hover:text-[#C43266]">
									Privacy Policy
								</Link>
							</li>

							<li>
								<Link to="#" className="text-sm text-gray-600 transition hover:text-[#C43266]">
									Cookie Policy
								</Link>
							</li>

							<li>
								<Link to="#" className="text-sm text-gray-600 transition hover:text-[#C43266]">
									Community Guidelines
								</Link>
							</li>
						</ul>
					</div>

					{/* Socials */}
					<div>
						<h4 className="mb-5 text-lg font-semibold text-black">Socials</h4>

						<ul className="space-y-3">
							<li>
								<Link to="#" className="text-sm text-gray-600 transition hover:text-[#C43266]">
									Instagram
								</Link>
							</li>

							<li>
								<Link to="#" className="text-sm text-gray-600 transition hover:text-[#C43266]">
									Twitter
								</Link>
							</li>

							<li>
								<Link to="#" className="text-sm text-gray-600 transition hover:text-[#C43266]">
									Facebook
								</Link>
							</li>

							<li>
								<Link to="#" className="text-sm text-gray-600 transition hover:text-[#C43266]">
									LinkedIn
								</Link>
							</li>
						</ul>
					</div>

					{/* Contact */}
					<div>
						<h4 className="mb-5 text-lg font-semibold text-black">Contact</h4>

						<ul>
							<li>
								<Link
									to="mailto:info@mingx.com"
									className="flex items-center gap-3 text-sm text-gray-600 transition hover:text-[#C43266]">
									<span className="flex h-9 w-9 items-center justify-center rounded-md bg-[#C43266] text-white">
										<IoIosMail />
									</span>
									info@mingx.com
								</Link>
							</li>
						</ul>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default Home;
