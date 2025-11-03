"use client";
import { useState } from "react";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineLoading3Quarters,
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
} from "react-icons/ai";

export default function Page() {
  const [activeTab, setActiveTab] = useState("overview"); // "overview" or "change-password"
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
          setActiveTab("overview");
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
    <div className="p-4 sm:p-6 h-full w-full bg-[var(--foreground)]">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Security Settings
        </h1>
        <p className="text-[var(--text)] text-sm">
          Manage your account security and password
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => {
            setActiveTab("overview");
            resetForm();
          }}
          className={`px-6 py-3 font-semibold transition-all duration-300 border-b-2 ${
            activeTab === "overview"
              ? "border-[var(--mutant-color)] text-[var(--mutant-color)]"
              : "border-transparent text-[var(--text)] hover:text-[var(--text-light-2)]"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => {
            setActiveTab("change-password");
            resetForm();
          }}
          className={`px-6 py-3 font-semibold transition-all duration-300 border-b-2 ${
            activeTab === "change-password"
              ? "border-[var(--mutant-color)] text-[var(--mutant-color)]"
              : "border-transparent text-[var(--text)] hover:text-[var(--text-light-2)]"
          }`}
        >
          Change Password
        </button>
      </div>

      {/* Tab Content */}
      <div className="max-w-3xl">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Change Password Card */}
            <div className="w-full bg-[var(--card)] rounded-xl p-4 sm:p-6 transition-all duration-300">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🔐</span>
                    <h2 className="text-lg sm:text-xl font-semibold text-white">
                      Change Password
                    </h2>
                  </div>
                  <p className="text-[var(--text)] text-sm sm:text-base">
                    Set a unique password to protect your account and keep your
                    lab secure
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab("change-password")}
                  className="w-full sm:w-auto px-6 py-3 btn text-white rounded-[10px] font-semibold"
                >
                  Change Password
                </button>
              </div>
            </div>

            {/* Additional security settings can go here */}
            <div className="w-full bg-[var(--card)] rounded-xl p-4 sm:p-6 transition-all duration-300">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🔒</span>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Two-Factor Authentication
                  </h3>
                  <p className="text-[var(--text)] text-sm mb-4">
                    Add an extra layer of security to your account
                  </p>
                  <span className="text-sm text-[var(--text-light)] italic">
                    Coming soon...
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Change Password Tab */}
        {activeTab === "change-password" && (
          <div className="w-full bg-[var(--card)] rounded-xl p-6 sm:p-8">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                {step === 1 ? "Request Password Reset" : "Reset Your Password"}
              </h2>
              <p className="text-sm text-[var(--text)]">
                {step === 1
                  ? "Step 1 of 2: Verify your email"
                  : "Step 2 of 2: Set new password"}
              </p>
            </div>

            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 bg-[var(--success)]/20 rounded-[10px] flex items-start gap-3 animate-in fade-in duration-300">
                <AiOutlineCheckCircle className="text-[var(--success)] text-xl flex-shrink-0 mt-0.5" />
                <p className="text-[var(--success)] text-sm">{success}</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-[var(--error)]/20 rounded-[10px] flex items-start gap-3 animate-in fade-in duration-300">
                <AiOutlineCloseCircle className="text-[var(--error)] text-xl flex-shrink-0 mt-0.5" />
                <p className="text-[var(--error)] text-sm">{error}</p>
              </div>
            )}

            {/* Step 1: Email Input */}
            {step === 1 && (
              <form onSubmit={handleRequestOTP} className="space-y-6">
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
                    className="w-full px-4 py-3 bg-[var(--accent)] rounded-[10px] text-white placeholder-[var(--text-light)] focus:outline-none transition-all"
                  />
                  <p className="text-xs text-[var(--text-light)] mt-2">
                    We&apos;ll send a one-time password (OTP) to this email
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading || !isValidEmail}
                  className="w-full px-6 py-3 btn text-white rounded-[10px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <AiOutlineLoading3Quarters className="animate-spin text-xl" />
                      Sending OTP...
                    </>
                  ) : (
                    <>Send OTP</>
                  )}
                </button>
              </form>
            )}

            {/* Step 2: OTP and New Password */}
            {step === 2 && (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full px-4 py-3 bg-[var(--accent)] rounded-[10px] text-[var(--text)] cursor-not-allowed"
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
                      setOtp(
                        e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "")
                      )
                    }
                    placeholder="Enter OTP from email"
                    required
                    className="w-full px-4 py-3 bg-[var(--accent)] rounded-[10px] text-white placeholder-[var(--text-light)] focus:outline-none transition-all"
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
                      className="w-full px-4 py-3 bg-[var(--accent)] rounded-[10px] text-white placeholder-[var(--text-light)] focus:outline-none transition-all pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text)] hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <AiOutlineEyeInvisible className="text-xl" />
                      ) : (
                        <AiOutlineEye className="text-xl" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-[var(--text-light)] mt-1">
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
                      className="w-full px-4 py-3 bg-[var(--accent)] rounded-[10px] text-white placeholder-[var(--text-light)] focus:outline-none transition-all pr-12"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text)] hover:text-white transition-colors"
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
                    className="flex-1 px-6 py-3 bg-[var(--button-background)] hover:bg-[var(--accent)] text-white rounded-[10px] font-semibold transition-all duration-300"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={
                      loading || !otp || !newPassword || !confirmPassword
                    }
                    className="flex-1 px-6 py-3 btn text-white rounded-[10px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
        )}
      </div>
    </div>
  );
}
