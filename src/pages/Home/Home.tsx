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
	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<div className="min-h-screen">
			<header className="relative flex items-center justify-between bg-white px-5 py-4 lg:px-24">
				{/* Logo */}
				<div>
					<img src={Logo} alt="Logo" className="w-24 lg:w-auto" />
				</div>

				{/* Desktop Navigation */}
				<nav className="hidden lg:block">
					<ul className="flex items-center">
						<li className="px-4 py-2 text-xl text-[#C43266] hover:text-black">
							<a href="/">Features</a>
						</li>

						<li className="px-4 py-2 text-xl text-[#C43266] hover:text-black">
							<a href="/about">Stories</a>
						</li>

						<li className="px-4 py-2 text-xl text-[#C43266] hover:text-black">
							<a href="/contact">Premium</a>
						</li>

						<li className="px-4 py-2 text-xl text-[#C43266] hover:text-black">
							<a href="/contact">App</a>
						</li>
					</ul>
				</nav>

				{/* Desktop Button */}
				<div className="hidden lg:block">
					<Link to='/login' className="rounded-xl bg-black px-5 py-4 text-xl text-white">
						Get Started
					</Link>
				</div>

				{/* Mobile Menu Button */}
				<button
					onClick={() => setMenuOpen(!menuOpen)}
					className="rounded-lg bg-black px-4 py-2 text-white lg:hidden">
					{menuOpen ? "Close" : "Menu"}
				</button>

				{/* Mobile Menu */}
				{menuOpen && (
					<div className="absolute left-0 top-full z-50 w-full bg-white px-5 py-5 shadow-lg lg:hidden">
						<ul className="flex flex-col">
							<li className="border-b py-3 text-lg text-[#C43266]">
								<a href="/">Features</a>
							</li>

							<li className="border-b py-3 text-lg text-[#C43266]">
								<a href="/about">Stories</a>
							</li>

							<li className="border-b py-3 text-lg text-[#C43266]">
								<a href="/contact">Premium</a>
							</li>

							<li className="border-b py-3 text-lg text-[#C43266]">
								<a href="/contact">App</a>
							</li>

							<li className="pt-4">
								<a
									href="/login"
									className="block rounded-xl bg-black px-5 py-3 text-center text-white">
									Get Started
								</a>
							</li>
						</ul>
					</div>
				)}
			</header>

			{/* Hero */}
			<section className="relative min-h-screen overflow-hidden">
				{/* Decorative dots */}
				<div className="hidden lg:block">
					<div className="absolute left-[8%] top-[20%] h-5 w-5 rounded-full bg-white" />

					{/* Heart */}
					<img src={Heart} alt="" className="absolute right-[8%] top-[5%]" />

					{/* Abstract line */}
					<img src={AbstractLine} alt="" className="absolute right-[8%] top-[27%] z-10" />

					{/* Profile card */}
					<img src={ProfileCard} alt="" className="absolute right-[5%] top-[57%] z-30" />

					{/* Right card */}
					<img src={MessageCard} alt="" className="absolute right-[10%] top-[22%] z-30" />
					<img src={View} alt="" className="absolute left-[10%] top-[22%] z-30" />
				</div>

				{/* Heading */}
				<div className="relative z-10 px-5 pt-16 text-center">
					<h1 className="text-5xl font-bold text-white lg:text-6xl">
						Meet the <br />
						Chosen ones
					</h1>

					<p className="mx-auto mt-5 max-w-xs text-sm text-white/90">
						Real conversations, verified people, and matches worth showing up for.
					</p>
				</div>

				{/* Bottom purple shape */}
				<div className="hidden lg:block">
					<img src={Purple} alt="" className="absolute bottom-50 left-0 w-full h-60  z-0" />
				</div>

				{/* People */}
				<img src={People} alt="" className="absolute lg:bottom-50 left-1/2 z-20 -translate-x-1/2" />
			</section>

			{/* Rating section */}
			<section className="flex flex-wrap items-center justify-center gap-25 lg:gap-60 text-white">
				<div>
					<h3 className="text-7xl mb-2 font-bold">4.2M</h3>
					<p className="text-center">Active People</p>
				</div>
				<div>
					<h3 className="text-7xl mb-2 font-bold">78%</h3>
					<p className="text-center">Match till date</p>
				</div>
				<div>
					<h3 className="text-7xl mb-2 font-bold">150+</h3>
					<p className="text-center">Cities</p>
				</div>
				<div>
					<h3 className="text-7xl mb-2 font-bold">
						4.8
						<FaStar className="text-white w-10 inline" />
					</h3>
					<p className="text-center">App Rating</p>
				</div>
			</section>

			{/* dating feels */}
			<section className="mt-20 lg:m-30 rounded-4xl p-10 lg:p-20 bg-white">
				<h2 className="text-5xl font-bold text-black mb-10 w-full lg:w-125">
					Dating that feels like <span className="text-[#C43266]">a conversation</span>
				</h2>
				<div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 w-full">
					<div className="bg-[#C432661A] rounded-4xl p-10">
						<img src={Sparkles} alt="" className="" />
						<div className="mt-5">
							<h3 className="text-xl font-bold text-black mt-3">Smart matching</h3>
							<p className="">
								Our vibe engine reads your interests, not just your selfies, and surfaces people
								you'd actually text back.
							</p>
						</div>
					</div>
					<div className="bg-[#C432661A] rounded-4xl p-10">
						<img src={Ice} alt="" className="" />
						<div className="mt-5">
							<h3 className="text-xl font-bold text-black mt-3">Ice breakers tha work</h3>
							<p className="">
								No more 'hey'. Every match opens with a prompt built from what you both love.
							</p>
						</div>
					</div>
					<div className="bg-[#C432661A] rounded-4xl p-10">
						<img src={Sparkles} alt="" className="" />
						<div className="mt-5">
							<h3 className="text-xl font-bold text-black mt-3">Verified & safe</h3>
							<p className="">
								Photo verification, instant reporting and human moderation keep the creeps out of
								your inbox.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* steps */}
			<section className="mx-10 my-20 lg:m-30 rounded-4xl">
				<h3 className="text-5xl font-bold text-white mb-10">Three steps to say hello</h3>
				<div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
					<div className="bg-white rounded-4xl p-10">
						<p className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C43266] text-white">
							01
						</p>
						<div className="mt-5">
							<h3 className="text-xl font-bold text-black my-3">Build your vibe</h3>
							<hr className="text-[#652F7B4D]" />
							<p className="my-3">Six photos, three prompts, one honest bio. Two minutes, tops.</p>
						</div>
					</div>
					<div className="bg-white rounded-4xl p-10">
						<p className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C43266] text-white">
							02
						</p>
						<div className="mt-5">
							<h3 className="text-xl font-bold text-black my-3">Meet daily pick</h3>
							<hr className="text-[#652F7B4D]" />
							<p className="my-3">
								A handful of quality matches every morning, no endless swiping.
							</p>
						</div>
					</div>
					<div className="bg-white rounded-4xl p-10">
						<p className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C43266] text-white">
							03
						</p>
						<div className="mt-5">
							<h3 className="text-xl font-bold text-black my-3">Say hello</h3>
							<hr className="text-[#652F7B4D]" />
							<p className="my-3">Start with a prompt, move to a date. That's the whole idea.</p>
						</div>
					</div>
				</div>
			</section>

			{/* ready to chat */}
			<section className="lg:m-30 p-10 lg:p-20 flex flex-col items-center justify-between gap-10 lg:flex-row">
				<div>
					<h3 className="text-6xl font-bold text-white mb-10">Ready to chat now?</h3>
					<p className="w-full lg:w-125 mb-10 text-white">
						"No long back-and-forth messaging here. If we match, let’s jump straight to a quick
						conversation, share a few laughs, and see if there's real chemistry."
					</p>
					<a
						href="/login"
						className="block rounded-xl bg-black px-5 py-4 text-center text-xl text-white w-full lg:w-60">
						Sign Up
					</a>
				</div>
				<div className="">
					<img src={Chat} alt="" className="w-full" />
				</div>
			</section>

			{/* forever */}
			<section className="mx-10 my-20 lg:m-30">
				<h3 className="text-5xl mb-20 font-bold text-white text-center">From mingX to forever</h3>
				<div className="grid w-full grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
					{/* Card */}
					<div className="group">
						{/* Image area */}
						<div className="relative rounded-t-2xl mb-7">
							{/* Default image */}
							<img
								src={Forever1}
								alt=""
								className="
          relative z-0
          block h-full w-full object-cover
          transition-opacity duration-500 ease-in-out
          group-hover:opacity-0
        "
							/>

							{/* Hover image */}
							<img
								src={Variant1}
								alt=""
								className="
          absolute inset-0 z-0
          h-full w-full object-cover
          opacity-0
          transition-opacity duration-500 ease-in-out
          group-hover:opacity-100
        "
							/>

							{/* Australia flag - top right */}
							<img
								src={Aussie}
								alt=""
								className="
          absolute right-0 bottom-65 lg:bottom-125 z-20
          w-25
        "
							/>

							{/* Spain flag - bottom left */}
							<img
								src={Spain}
								alt=""
								className="
          absolute top-65 lg:top-125 left-0 z-20
          w-25
        "
							/>
						</div>

						{/* Testimonial */}
						<div className="rounded-b-2xl bg-[#652F7B] px-6 py-6 text-center text-white">
							<p className="text-base leading-6">
								"Our first chat felt natural because we already shared the same core values and
								cultural background. One quick message turned into hours of talking, and now we’re
								planning our future together"
							</p>

							<p className="mt-8 font-bold">David & Anita</p>
						</div>
					</div>
					<div className="group">
						{/* Image area */}
						<div className="relative rounded-t-2xl mb-7">
							{/* Default image */}
							<img
								src={Forever2}
								alt=""
								className="
          relative z-0
          block h-full w-full object-cover
          transition-opacity duration-500 ease-in-out
          group-hover:opacity-0
        "
							/>

							{/* Hover image */}
							<img
								src={Variant2}
								alt=""
								className="
          absolute inset-0 z-0
          h-full w-full object-cover
          opacity-0
          transition-opacity duration-500 ease-in-out
          group-hover:opacity-100
        "
							/>

							{/* Australia flag - top right */}
							<img
								src={Canada}
								alt=""
								className="
          absolute right-0 bottom-65 lg:bottom-125 z-20
          w-25
        "
							/>

							{/* Spain flag - bottom left */}
							<img
								src={Swede}
								alt=""
								className="
          absolute bottom-65 lg:top-125 left-0 z-20
          w-25
        "
							/>
						</div>

						{/* Testimonial */}
						<div className="rounded-b-2xl bg-[#652F7B] px-6 py-6 text-center text-white">
							<p className="text-base leading-6">
								"I almost gave up on dating apps until I tried MingX. The app made it so easy to
								skip the superficial small talk and jump right into real conversations.We matched on
								a Tuesday, met for coffee that weekend."
							</p>

							<p className="mt-8 font-bold">Katherine & Moses</p>
						</div>
					</div>
					<div className="group">
						{/* Image area */}
						<div className="relative rounded-t-2xl mb-7">
							{/* Default image */}
							<img
								src={Forever3}
								alt=""
								className="
          relative z-0
          block h-full w-full object-cover
          transition-opacity duration-500 ease-in-out
          group-hover:opacity-0
        "
							/>

							{/* Hover image */}
							<img
								src={Variant3}
								alt=""
								className="
          absolute inset-0 z-0
          h-full w-full object-cover
          opacity-0
          transition-opacity duration-500 ease-in-out
          group-hover:opacity-100
        "
							/>

							{/* Australia flag - top right */}
							<img
								src={USA}
								alt=""
								className="
          absolute right-0 bottom-65 lg:bottom-125 z-20
          w-25
        "
							/>

							{/* Spain flag - bottom left */}
							<img
								src={Mexico}
								alt=""
								className="
          absolute top-65 lg:top-125 left-0 z-20
          w-25
        "
							/>
						</div>

						{/* Testimonial */}
						<div className="rounded-b-2xl bg-[#652F7B] px-6 py-6 text-center text-white">
							<p className="text-base leading-6">
								"Living in the diaspora, finding someone who genuinely understood my background and
								vision for a relationship felt impossible,From our very first chat, the connection
								was effortless. Two years later, we're engaged!"
							</p>

							<p className="mt-8 font-bold">Annabel & Jerome</p>
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
							Don’t let your busy schedule stand in the way of love. Download MingX today and start
							connecting with people who truly understand
						</p>
						<div className="flex flex-col gap-5 md:flex-row">
							<a href="#">
								<img src={Apple} alt="App Store" className="" />
							</a>
							<a href="#">
								<img src={Google} alt="Google Play" className="" />
							</a>
						</div>
					</div>
				</div>
			</section>

			{/* match */}
			<section className="mx-4 rounded-t-3xl bg-white px-6 py-12 sm:mx-6 sm:px-10 lg:mx-30 lg:px-20 lg:py-16">
				<div className="mx-auto max-w-4xl text-center">
					<h3 className="mb-5 text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
						Your match is one <span className="text-[#C43266]">Hello</span> away
					</h3>

					<p className="mb-8 text-sm text-gray-600 sm:text-base">
						Join free today. No swiping marathons, no bots, no games.
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
          sm:w-auto
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
							Redefining modern dating through authentic, real-time conversations. Skip the
							ghosting, find your match, and connect when it actually matters.
						</p>
					</div>

					{/* Legal */}
					<div>
						<h4 className="mb-5 text-lg font-semibold text-black">Legal</h4>

						<ul className="space-y-3">
							<li>
								<a href="#" className="text-sm text-gray-600 transition hover:text-[#C43266]">
									Terms of Service
								</a>
							</li>

							<li>
								<a href="#" className="text-sm text-gray-600 transition hover:text-[#C43266]">
									Privacy Policy
								</a>
							</li>

							<li>
								<a href="#" className="text-sm text-gray-600 transition hover:text-[#C43266]">
									Cookie Policy
								</a>
							</li>

							<li>
								<a href="#" className="text-sm text-gray-600 transition hover:text-[#C43266]">
									Community Guidelines
								</a>
							</li>
						</ul>
					</div>

					{/* Socials */}
					<div>
						<h4 className="mb-5 text-lg font-semibold text-black">Socials</h4>

						<ul className="space-y-3">
							<li>
								<a href="#" className="text-sm text-gray-600 transition hover:text-[#C43266]">
									Instagram
								</a>
							</li>

							<li>
								<a href="#" className="text-sm text-gray-600 transition hover:text-[#C43266]">
									Twitter
								</a>
							</li>

							<li>
								<a href="#" className="text-sm text-gray-600 transition hover:text-[#C43266]">
									Facebook
								</a>
							</li>

							<li>
								<a href="#" className="text-sm text-gray-600 transition hover:text-[#C43266]">
									LinkedIn
								</a>
							</li>
						</ul>
					</div>

					{/* Contact */}
					<div>
						<h4 className="mb-5 text-lg font-semibold text-black">Contact</h4>

						<ul>
							<li>
								<a
									href="mailto:info@mingx.com"
									className="flex items-center gap-3 text-sm text-gray-600 transition hover:text-[#C43266]">
									<span className="flex h-9 w-9 items-center justify-center rounded-md bg-[#C43266] text-white">
										<IoIosMail />
									</span>
									info@mingx.com
								</a>
							</li>
						</ul>
					</div>
				</div>
				
			</footer>
		</div>
	);
};

export default Home;
