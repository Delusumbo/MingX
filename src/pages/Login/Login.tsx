import { useState, useEffect } from "react";
import Banner1 from "../../assets/images/banner1.png";
import Banner2 from "../../assets/images/banner2.png";
import Banner3 from "../../assets/images/banner3.png";
import Logo from "../../assets/images/Mingx.png";


const Login = () => {
	const slides = [
		{
			image: Banner1,
			title: "Meet New People, Build Real Connections.",
			description:
				"Discover a seamless digital experience designed to keep everything you need within reach.",
		},
		{
			image: Banner2,
			title: "Connect, Chat, and Find Someone Special.",
			description:
				"MingX makes it easier to stay connected, informed, and engaged wherever your journey takes you.",
		},
		{
			image: Banner3,
			title: "Find Someone Who Gets You.",
			description: "Real conversations and meaningful connections start with just one hello.",
		},
	];

	const [currentSlide, setCurrentSlide] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % slides.length);
		}, 5000);

		return () => clearInterval(interval);
	}, []);

	return (
		<div className="relative min-h-screen overflow-hidden">
			<img src={Logo} alt="MingX" className="absolute left-6 top-6 z-30 w-28 sm:left-10 sm:top-8" />
			{/* ================= CAROUSEL ================= */}
			<div className="absolute inset-0">
				{/* Images */}
				{slides.map((slide, index) => (
					<img
						key={index}
						src={slide.image}
						alt=""
						className={`
            absolute inset-0
            h-full w-full
            object-cover
            transition-all duration-1000 ease-in-out
            ${currentSlide === index ? "scale-100 opacity-100" : "scale-105 opacity-0"}
          `}
					/>
				))}

				{/* Overlay */}
				<div className="absolute inset-0 bg-linear-to-t from-[#652F7B]/90 via-[#C43266]/30 to-transparent" />
			</div>

			{/* ================= CAROUSEL CONTENT ================= */}
			<div className="absolute bottom-10 left-6 z-10 max-w-lg text-white sm:left-10 lg:bottom-16 lg:left-12">
				<h2 className="text-3xl font-bold leading-tight sm:text-4xl">
					{slides[currentSlide].title}
				</h2>

				<p className="mt-4 text-sm leading-6 text-white/90 sm:text-base">
					{slides[currentSlide].description}
				</p>

				{/* Indicators */}
				<div className="mt-6 flex items-center gap-3">
					{slides.map((_, index) => (
						<button
							key={index}
							onClick={() => setCurrentSlide(index)}
							className={`
              h-1 rounded-full transition-all duration-500
              ${currentSlide === index ? "w-8 bg-[#C43266]" : "w-6 bg-white"}
            `}
							aria-label={`Go to slide ${index + 1}`}
						/>
					))}
				</div>
			</div>

			{/* ================= LOGIN FORM ================= */}
			<div
				className="
    absolute right-5 top-5 z-20
    flex min-h-[calc(100vh-40px)] w-[calc(100%-40px)]
    items-center justify-center
    rounded-3xl bg-white
    px-6 py-10
    shadow-2xl

    md:right-6
    md:w-[50%]
    md:px-10

    lg:right-5
    lg:top-5
    lg:min-h-[calc(100vh-40px)]
    lg:w-[48%]
    lg:px-14
    xl:px-16
  ">
				<div className="w-full max-w-137.5">
					{/* Heading */}
					<div className="mb-12">
						<h1
							className="
          text-3xl font-bold
          bg-linear-to-r
          from-[#652F7B]
          via-[#C43266]
          to-[#C43266]
          bg-clip-text
          text-transparent
          sm:text-4xl
        ">
							Welcome to MingX!
						</h1>

						<p className="mt-2 text-base text-gray-900 sm:text-lg">Sign in to enjoy MingX.</p>
					</div>

					{/* Form */}
					<form className="space-y-7">
						{/* Email */}
						<div>
							<label htmlFor="email" className="mb-3 block text-sm font-bold text-black">
								Email
							</label>

							<input
								id="email"
								type="email"
								placeholder="Input your email"
								className="
            h-12.75 w-full
            rounded-xl
            border border-gray-200
            bg-white
            px-4
            text-sm text-gray-900
            outline-none
            transition
            placeholder:text-gray-400
            focus:border-[#C43266]
            focus:ring-2
            focus:ring-[#C43266]/20
          "
							/>
						</div>

						{/* Password */}
						<div>
							<label htmlFor="password" className="mb-3 block text-sm font-bold text-black">
								Password
							</label>

							<input
								id="password"
								type="password"
								placeholder="Input your password"
								className="
            h-12.75 w-full
            rounded-xl
            border border-gray-200
            bg-white
            px-4
            text-sm text-gray-900
            outline-none
            transition
            placeholder:text-gray-400
            focus:border-[#C43266]
            focus:ring-2
            focus:ring-[#C43266]/20
          "
							/>

							{/* Remember + Forgot */}
							<div className="mt-3 flex items-center justify-between">
								<label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
									<input id="remember" type="checkbox" className="h-5 w-5 accent-[#C43266]" />
									Remember Me
								</label>

								<a href="#" className="text-sm text-gray-700 transition hover:text-[#C43266]">
									Forget Password?
								</a>
							</div>
						</div>

						{/* Login */}
						<button
							type="submit"
							className="
          h-12.75 w-full
          rounded-xl
          bg-linear-to-r
          from-[#C43266]
          to-[#652F7B]
          font-medium
          text-white
          transition-all
          duration-300
          hover:opacity-90
          hover:shadow-lg
        ">
							Login
						</button>

						{/* Divider */}
						<div className="flex items-center gap-3 py-1">
							<div className="h-px flex-1 bg-black" />

							<span className="text-sm text-gray-600">Or continue with</span>

							<div className="h-px flex-1 bg-black" />
						</div>

						{/* Google */}
						<button
							type="button"
							className="
          flex h-12.5 w-full
          items-center justify-center
          gap-3
          rounded-xl
          border border-gray-200
          bg-white
          font-medium
          text-gray-900
          transition
          hover:bg-gray-50
        ">
							<span className="text-lg font-bold text-[#4285F4]">G</span>
							Continue with Google
						</button>
					</form>

					{/* Sign up */}
					<p className="mt-8 text-center text-sm text-gray-700">
						Don’t have an account?{" "}
						<a href="/register" className="font-medium text-[#C43266] hover:text-[#652F7B]">
							Sign Up here
						</a>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Login;
