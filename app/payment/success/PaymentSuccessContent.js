"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import LoggedInSuccess from "./LoggedInSuccess";

export default function PaymentSuccessContent() {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const loggedInUser = localStorage.getItem("USER");
    if (loggedInUser) {
      setIsLoggedIn(true);
    } else {
      const guestUser = localStorage.getItem("guest-username");
      const guestPass = localStorage.getItem("guest-password");

      if (guestUser && guestPass) {
        setUsername(guestUser);
        setPassword(guestPass);
      }
    }

    if (sessionId) {
      console.log("Payment successful with session ID:", sessionId);

      localStorage.removeItem("guest-cart-id");
      localStorage.removeItem("guest-email");
      localStorage.removeItem("guest-session-id");

      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("cart:changed"));
      }
    } else {
      setError(
        "No session ID found. Your payment may not have been processed correctly."
      );
    }

    setIsLoading(false);
  }, [sessionId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-[#844CDC] border-gray-700 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl sm:text-2xl text-[var(--text)]">
            Verifying your payment...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <div className="max-w-md w-full">
          <div className="text-5xl sm:text-6xl mb-4 sm:mb-6">❌</div>
          <h1 className="font-[400] text-[32px] sm:text-[40px] leading-[40px] sm:leading-[50px] Xirod text-[var(--error-text-color)] mb-3 sm:mb-4 px-2">
            PAYMENT ERROR
          </h1>
          <p className="text-[var(--text)] mb-6 sm:mb-8 text-[15px] sm:text-[16px] leading-[23px] sm:leading-[24px] px-2">
            {error}
          </p>
          <Link
            href="/missions"
            className="inline-block px-6 sm:px-8 py-3 sm:py-4 btn font-[700] text-[15px] sm:text-[16px] rounded-[10px] hover:opacity-90 active:opacity-80 transition-opacity"
          >
            Explore Missions
          </Link>
        </div>
      </div>
    );
  }

  if (isLoggedIn) {
    return <LoggedInSuccess />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-6 sm:py-8">
      <div className="max-w-3xl w-full">
        {/* Success Icon */}
        <div className="text-center mb-4 sm:mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-full bg-gradient-to-br from-[#844CDC] to-[#6a3ab0] flex items-center justify-center shadow-lg">
            <svg
              className="w-10 h-10 sm:w-12 sm:h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="font-[400] text-[28px] sm:text-[38px] md:text-[45px] leading-[36px] sm:leading-[46px] md:leading-[55px] Xirod text-[#844CDC] mb-2 sm:mb-3 px-2">
            PAYMENT SUCCESSFUL!
          </h1>
          <p className="text-[var(--text)] text-[15px] sm:text-[17px] md:text-[18px] leading-[24px] sm:leading-[26px] md:leading-[28px] font-[400] max-w-xl mx-auto px-2">
            Welcome to The Mutant School! Your mission access has been granted.
          </p>
        </div>

        {/* Credentials Section */}
        {username && password ? (
          <div className="bg-[var(--accent)] rounded-[12px] sm:rounded-[15px] p-5 sm:p-6 md:p-8 mb-6 sm:mb-8 border border-[#844CDC]/30">
            <h2 className="font-[700] text-[20px] sm:text-[22px] md:text-[24px] text-[var(--background)] mb-2 sm:mb-3 text-center">
              Your Account Credentials
            </h2>
            <p className="text-[13px] sm:text-[14px] text-[var(--text)] mb-5 sm:mb-6 text-center px-2">
              Save these credentials to access your courses
            </p>

            <div className="space-y-3 sm:space-y-4 max-w-md mx-auto">
              <div className="bg-[var(--background)]/10 backdrop-blur-sm p-3 sm:p-4 rounded-[10px]">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[var(--text)] text-[13px] sm:text-[14px] font-[500] flex-shrink-0">
                    Username
                  </span>
                  <span className="font-mono text-[14px] sm:text-[16px] text-[var(--background)] font-[600] break-all text-right">
                    {username}
                  </span>
                </div>
              </div>

              <div className="bg-[var(--background)]/10 backdrop-blur-sm p-3 sm:p-4 rounded-[10px]">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[var(--text)] text-[13px] sm:text-[14px] font-[500] flex-shrink-0">
                    Password
                  </span>
                  <span className="font-mono text-[14px] sm:text-[16px] text-[var(--background)] font-[600] break-all text-right">
                    {password}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 sm:mt-6 p-3 sm:p-4 bg-[#844CDC]/10 rounded-[10px] border border-[#844CDC]/30">
              <p className="text-[12px] sm:text-[13px] text-[var(--text)] text-center leading-[19px] sm:leading-[20px] px-2">
                💡 <span className="font-[600]">Important:</span> These
                credentials have also been sent to your email. Please keep them
                safe!
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-[var(--accent)] rounded-[12px] sm:rounded-[15px] p-6 sm:p-8 mb-6 sm:mb-8 border border-[#FFA500]/30">
            <div className="text-center">
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">📧</div>
              <h2 className="font-[700] text-[20px] sm:text-[22px] text-[var(--background)] mb-2 sm:mb-3 px-2">
                Check Your Email
              </h2>
              <p className="text-[var(--warning-text-color)] text-[14px] sm:text-[16px] leading-[22px] sm:leading-[24px] max-w-md mx-auto px-2">
                Your account credentials have been sent to your email address.
                Please check your inbox (and spam folder) for login details.
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Link
            href="/auth/login"
            className="w-full sm:w-auto sm:min-w-[200px] h-[54px] sm:h-[60px] flex items-center justify-center btn font-[700] text-[16px] sm:text-[18px] rounded-[10px] hover:opacity-90 active:opacity-80 transition-opacity"
          >
            Login Now
          </Link>
          <Link
            href="/missions"
            className="w-full sm:w-auto sm:min-w-[200px] h-[54px] sm:h-[60px] flex items-center justify-center bg-[var(--accent)] text-[var(--background)] font-[700] text-[16px] sm:text-[18px] rounded-[10px] hover:opacity-90 active:opacity-80 transition-opacity border border-[#844CDC]/30"
          >
            Explore Missions
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-6 sm:mt-8 text-center px-2">
          <p className="text-[var(--text)] text-[13px] sm:text-[14px]">
            Need help?{" "}
            <Link
              href="/support"
              className="text-[#844CDC] hover:underline active:text-[#6a3ab0] font-[600]"
            >
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
