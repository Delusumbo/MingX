import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../../assets/images/Mingx.png";
import { verifyOtp } from "../../auth/authService";
import { useAuth } from "../../context/AuthContext"; // adjust to your actual path/file

const OTP = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email;

    const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);	
    const [countdown, setCountdown] = useState(60);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Redirect if user visits /otp directly without an email
    useEffect(() => {
        if (!email) {
            navigate("/login", { replace: true });
        }
    }, [email, navigate]);

    // Countdown for resend OTP
    useEffect(() => {
        if (countdown <= 0) return;

        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [countdown]);

    const handleChange = (index: number, value: string) => {
        // Only allow numbers
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);

        setOtp(newOtp);
        setError("");

        // Move to next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();

        const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);

        if (!pastedData) return;

        const newOtp = [...otp];

        pastedData.split("").forEach((digit, index) => {
            newOtp[index] = digit;
        });

        setOtp(newOtp);

        const nextIndex = Math.min(pastedData.length, 5);
        inputRefs.current[nextIndex]?.focus();
    };
    const { login } = useAuth();

    const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const code = otp.join("");

        if (code.length !== 6) {
            setError("Please enter the 6-digit verification code.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const data = await verifyOtp(email, code);
			login(data.user, data.token); // updates context state, not just localStorage			
            window.location.href = "/discover";         
        } catch (error) {
            console.error("OTP verification error:", error);

            setError(
                error instanceof Error ? error.message : "Invalid verification code. Please try again.",
            );
        } finally {
            setLoading(false);
        }
    };
    

    if (!email) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-5">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <img src={Logo} alt="MingX" className="w-32" />
                </div>

                {/* Card */}
                <div className="rounded-3xl bg-white p-8 shadow-xl sm:p-10">
                    {/* Heading */}
                    <div className="text-center">
                        <h1
                            className="
                                text-3xl
                                font-bold
                                bg-linear-to-r
                                from-[#652F7B]
                                via-[#C43266]
                                to-[#C43266]
                                bg-clip-text
                                text-transparent
                            ">
                            Verify your email
                        </h1>

                        <p className="mt-3 text-sm leading-6 text-gray-600">
                            We sent a 6-digit verification code to
                        </p>

                        <p className="mt-1 font-semibold text-gray-900">{email}</p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    {/* OTP Form */}
                    <form onSubmit={handleVerify} className="mt-8">
                        <div className="flex justify-center gap-2 sm:gap-3">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(element) => {
                                        inputRefs.current[index] = element;
                                    }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={handlePaste}
                                    className="
                                        h-12
                                        w-10
                                        rounded-xl
                                        border
                                        border-gray-200
                                        bg-white
                                        text-center
                                        text-lg
                                        font-semibold
                                        text-gray-900
                                        outline-none
                                        transition
                                        focus:border-[#C43266]
                                        focus:ring-2
                                        focus:ring-[#C43266]/20
                                        sm:h-14
                                        sm:w-12
                                    "
                                    aria-label={`OTP digit ${index + 1}`}
                                />
                            ))}
                        </div>

                        {/* Verify */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                mt-8
                                h-11
                                w-full
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
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                            ">
                            {loading ? "Verifying..." : "Verify email"}
                        </button>
                    </form>

                    

                    {/* Back to login */}
                    <button
                        type="button"
                        onClick={() =>
                            navigate("/login", {
                                replace: true,
                            })
                        }
                        className="
                            mt-6
                            w-full
                            text-center
                            text-sm
                            text-gray-500
                            hover:text-[#652F7B]
                        ">
                        ← Back to login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OTP;
