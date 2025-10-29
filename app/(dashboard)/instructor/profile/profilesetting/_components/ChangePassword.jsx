"use client";

import { useState } from "react";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineLoading3Quarters,
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
} from "react-icons/ai";

export default function ChangePasswordValue({ onBack }) {
  const [step, setStep] = useState(1); // 1: email, 2: OTP + new password
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle email change
  const handleEmailChange = (e) => {
    const value = e.target.value.toLowerCase();
    setEmail(value);
    setIsValidEmail(validateEmail(value));
  };

  // Reset all fields
  const resetForm = () => {
    setStep(1);
    setEmail("");
    setIsValidEmail(false);
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  // Request OTP
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://themutantschool-backend.onrender.com/api/auth/reset-password/request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess("OTP sent to your email! Please check your inbox.");
        setStep(2);
      } else {
        setError(data.message || "Failed to send OTP. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Reset password with OTP
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!otp || otp.length < 4) {
      setError("Please enter a valid OTP");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://themutantschool-backend.onrender.com/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess(
          "Password changed successfully! You can now use your new password."
        );
        setTimeout(() => {
          if (onBack) onBack();
          resetForm();
        }, 2000);
      } else {
        setError(data.message || "Invalid or expired OTP. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="h-fit flex flex-col gap-4">
        <div className="mb-2">
          <p className="text-white text-xl sm:text-[22px] font-[700]">
            {step === 1 ? "Request Password Reset" : "Reset Your Password"}
          </p>
          <p className="text-[#999999] text-sm sm:text-[15px] font-[400] leading-relaxed">
            {step === 1
              ? "Step 1 of 2: Verify your email"
              : "Step 2 of 2: Set new password"}
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="p-4 bg-green-500/20 rounded-[10px] flex items-start gap-3">
            <AiOutlineCheckCircle className="text-green-500 text-xl flex-shrink-0 mt-0.5" />
            <p className="text-green-500 text-sm">{success}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-500/20 rounded-[10px] flex items-start gap-3">
            <AiOutlineCloseCircle className="text-red-500 text-xl flex-shrink-0 mt-0.5" />
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        {/* Step 1: Email Input */}
        {step === 1 && (
          <form onSubmit={handleRequestOTP} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 bg-[#1A1A1A] rounded-[10px] text-white placeholder-[#666666] focus:outline-none focus:ring-2 focus:ring-[#604196] transition-all"
              />
              <p className="text-xs text-[#999999] mt-2">
                We&apos;ll send a one-time password (OTP) to this email
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  if (onBack) onBack();
                  resetForm();
                }}
                className="flex-1 px-6 py-3 bg-transparent border border-[#4D4D4D] text-white rounded-[10px] font-semibold hover:bg-[#1A1A1A] transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !isValidEmail}
                className="flex-1 px-6 py-3 bg-[#604196] text-white rounded-[10px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:bg-[#7051a8] transition-all"
              >
                {loading ? (
                  <>
                    <AiOutlineLoading3Quarters className="animate-spin text-xl" />
                    Sending...
                  </>
                ) : (
                  <>Send OTP</>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Step 2: OTP and New Password */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-3 bg-[#1A1A1A] rounded-[10px] text-[#999999] cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                OTP Code
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))
                }
                placeholder="Enter OTP from email"
                required
                className="w-full px-4 py-3 bg-[#1A1A1A] rounded-[10px] text-white placeholder-[#666666] focus:outline-none focus:ring-2 focus:ring-[#604196] transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  className="w-full px-4 py-3 bg-[#1A1A1A] rounded-[10px] text-white placeholder-[#666666] focus:outline-none focus:ring-2 focus:ring-[#604196] transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999999] hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible className="text-xl" />
                  ) : (
                    <AiOutlineEye className="text-xl" />
                  )}
                </button>
              </div>
              <p className="text-xs text-[#999999] mt-1">
                Must be at least 6 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  className="w-full px-4 py-3 bg-[#1A1A1A] rounded-[10px] text-white placeholder-[#666666] focus:outline-none focus:ring-2 focus:ring-[#604196] transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999999] hover:text-white transition-colors"
                >
                  {showConfirmPassword ? (
                    <AiOutlineEyeInvisible className="text-xl" />
                  ) : (
                    <AiOutlineEye className="text-xl" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setOtp("");
                  setNewPassword("");
                  setConfirmPassword("");
                  setError("");
                  setSuccess("");
                }}
                className="flex-1 px-6 py-3 bg-transparent border border-[#4D4D4D] text-white rounded-[10px] font-semibold hover:bg-[#1A1A1A] transition-all"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading || !otp || !newPassword || !confirmPassword}
                className="flex-1 px-6 py-3 bg-[#604196] text-white rounded-[10px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:bg-[#7051a8] transition-all"
              >
                {loading ? (
                  <>
                    <AiOutlineLoading3Quarters className="animate-spin text-xl" />
                    Resetting...
                  </>
                ) : (
                  <>Reset Password</>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
