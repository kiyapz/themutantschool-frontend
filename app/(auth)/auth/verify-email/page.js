"use client";

import { useState, useEffect } from "react";
import authApiUrl from "@/lib/baseUrl";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function VerifyEmail() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [step, setStep] = useState(1); // 1 = enter email, 2 = enter OTP
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Countdown timer for resend
  useEffect(() => {
    let interval;
    if (step === 2 && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timeLeft, step]);

  const handleResendVerification = async () => {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await authApiUrl.post("resend-verification", { email });

      // Log full response from backend
      console.log("=== RESEND VERIFICATION - FULL RESPONSE ===");
      console.log("Status:", response.status);
      console.log("Status Text:", response.statusText);
      console.log("Headers:", response.headers);
      console.log("Data:", response.data);
      console.log("Full Response Object:", response);
      console.log("===========================================");

      if (response.status === 200 || response.status === 201) {
        setSuccessMessage("Verification code sent! Check your email.");
        setStep(2);
        setTimeLeft(60);
        setCanResend(false);
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (error) {
      // Log full error response from backend
      console.log("=== RESEND VERIFICATION - ERROR RESPONSE ===");
      console.log("Error Object:", error);
      console.log("Error Response:", error?.response);
      console.log("Error Status:", error?.response?.status);
      console.log("Error Status Text:", error?.response?.statusText);
      console.log("Error Headers:", error?.response?.headers);
      console.log("Error Data:", error?.response?.data);
      console.log("Error Message:", error?.message);
      console.log("============================================");

      const errorMsg =
        error?.response?.data?.message || "Failed to send verification code.";
      setErrorMessage(errorMsg);
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (token.length !== 6) {
      setErrorMessage("Please enter a valid 6-digit code.");
      setTimeout(() => setErrorMessage(""), 2000);
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await authApiUrl.post("verify", {
        email,
        token,
      });

      // Log full response from backend
      console.log("=== VERIFY OTP - FULL RESPONSE ===");
      console.log("Status:", response.status);
      console.log("Status Text:", response.statusText);
      console.log("Headers:", response.headers);
      console.log("Data:", response.data);
      console.log("Full Response Object:", response);
      console.log("===================================");

      if (response.status === 200 || response.status === 201) {
        setSuccessMessage(
          "Email verified successfully! Redirecting to login..."
        );
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      }
    } catch (error) {
      // Log full error response from backend
      console.log("=== VERIFY OTP - ERROR RESPONSE ===");
      console.log("Error Object:", error);
      console.log("Error Response:", error?.response);
      console.log("Error Status:", error?.response?.status);
      console.log("Error Status Text:", error?.response?.statusText);
      console.log("Error Headers:", error?.response?.headers);
      console.log("Error Data:", error?.response?.data);
      console.log("Error Message:", error?.message);
      console.log("====================================");

      const errorMsg =
        error?.response?.data?.message || "Invalid verification code.";
      setErrorMessage(errorMsg);
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-4">
      <div className="max-w-[500px] w-full flex flex-col gap-8">
        <div className="text-center">
          <h1 className="font-[400] text-[31px] leading-[40px] text-center Xirod text-[var(--background)]">
            VERIFY YOUR EMAIL
          </h1>
          <p className="text-center text-[var(--info)] font-[700] text-[13px] leading-[27px] mt-2">
            {step === 1
              ? "Enter your email to receive a verification code"
              : "Enter the 6-digit code sent to your email"}
          </p>
        </div>

        {step === 1 ? (
          <div className="flex flex-col gap-5">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="h-[70px] outline-none font-[400] text-[17px] leading-[57px] rounded-[10px] w-full px-4 py-2 !bg-[var(--accent)] text-white placeholder-gray-400"
            />

            <button
              onClick={handleResendVerification}
              disabled={isLoading || !email}
              className={`h-[60px] w-full rounded-[10px] flex items-center justify-center font-[700] text-[18px] ${
                isLoading || !email
                  ? "bg-[var(--disabled-button-bg)] cursor-not-allowed"
                  : "btn cursor-pointer"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin inline-block" />
                  Sending...
                </span>
              ) : (
                "Send Verification Code"
              )}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <p className="text-center text-[var(--text-light)] text-[14px]">
              Code sent to:{" "}
              <span className="text-[var(--background)]">{email}</span>
            </p>

            <input
              type="text"
              value={token}
              onChange={(e) =>
                setToken(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="Enter 6-digit code"
              maxLength={6}
              className="h-[70px] outline-none font-[400] text-[17px] text-center tracking-widest rounded-[10px] w-full px-4 py-2 !bg-[var(--accent)] text-white placeholder-gray-400"
            />

            <button
              onClick={handleVerifyOtp}
              disabled={isLoading || token.length !== 6}
              className={`h-[60px] w-full rounded-[10px] flex items-center justify-center font-[700] text-[18px] ${
                isLoading || token.length !== 6
                  ? "bg-[var(--disabled-button-bg)] cursor-not-allowed"
                  : "btn cursor-pointer"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin inline-block" />
                  Verifying...
                </span>
              ) : (
                "Verify Email"
              )}
            </button>

            <div className="text-center text-[var(--text)] flex items-center justify-center gap-2 font-[700] text-[14px]">
              Didn&apos;t receive code?
              <div className="text-sm">
                {!canResend ? (
                  <span className="text-[var(--secondary)]">
                    Resend in 00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      setTimeLeft(60);
                      setCanResend(false);
                      handleResendVerification();
                    }}
                    className="text-[var(--secondary)] underline cursor-pointer"
                  >
                    Resend Code
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={() => {
                setStep(1);
                setToken("");
                setEmail("");
              }}
              className="text-[var(--text-light)] text-[14px] underline"
            >
              Change Email
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="text-[var(--error-text-color)] text-center">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="text-[var(--success-text-color)] text-center">
            {successMessage}
          </div>
        )}

        <div className="text-center">
          <Link href="/auth/login">
            <span className="text-[var(--text-light)] text-[14px] hover:text-[var(--secondary)] cursor-pointer">
              Back to Login
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
