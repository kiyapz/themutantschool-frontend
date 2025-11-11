"use client";
import { useState } from "react";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineLoading3Quarters,
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
} from "react-icons/ai";
import { BASE_URL } from "@/lib/api";

export default function Page() {
  const [activeTab, setActiveTab] = useState("overview");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const clearPasswordFields = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmNewPassword(false);
  };

  const resetForm = () => {
    clearPasswordFields();
    setError("");
    setSuccess("");
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("login-accessToken")
        : null;

    if (!token) {
      setError("You must be logged in to change your password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmNewPassword,
        }),
      });

      let data = {};
      try {
        data = await response.json();
      } catch (_err) {
        data = {};
      }

      if (!response.ok) {
        if (response.status === 401) {
          setError(
            data.message || "Your session has expired. Please log in again."
          );
          return;
        }

        setError(
          data.message || "Failed to change password. Please try again."
        );
        return;
      }

      setSuccess(data.message || "Password changed successfully.");
      clearPasswordFields();
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 h-full w-full bg-[var(--foreground)]">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Security Settings
        </h1>
        <p className="text-[var(--text)] text-sm">
          Manage your account security and password
        </p>
      </div>

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

      <div className="max-w-3xl">
        {activeTab === "overview" && (
          <div className="space-y-6">
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
                    Update your password regularly to keep your lab secure and
                    protect your research notes.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setActiveTab("change-password");
                    resetForm();
                  }}
                  className="w-full sm:w-auto px-6 py-3 btn text-white rounded-[10px] font-semibold"
                >
                  Change Password
                </button>
              </div>
            </div>

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

        {activeTab === "change-password" && (
          <div className="w-full bg-[var(--card)] rounded-xl p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Change Your Password
              </h2>
              <p className="text-sm text-[var(--text)]">
                Enter your current password and choose a new, secure password.
              </p>
            </div>

            {success && (
              <div className="mb-6 p-4 bg-[var(--success)]/20 rounded-[10px] flex items-start gap-3 animate-in fade-in duration-300">
                <AiOutlineCheckCircle className="text-[var(--success)] text-xl flex-shrink-0 mt-0.5" />
                <p className="text-[var(--success)] text-sm">{success}</p>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-[var(--error)]/20 rounded-[10px] flex items-start gap-3 animate-in fade-in duration-300">
                <AiOutlineCloseCircle className="text-[var(--error)] text-xl flex-shrink-0 mt-0.5" />
                <p className="text-[var(--error)] text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter your current password"
                    required
                    className="w-full px-4 py-3 bg-[var(--accent)] rounded-[10px] text-white placeholder-[var(--text-light)] focus:outline-none transition-all pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text)] hover:text-white transition-colors"
                  >
                    {showCurrentPassword ? (
                      <AiOutlineEyeInvisible className="text-xl" />
                    ) : (
                      <AiOutlineEye className="text-xl" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter a new password"
                    required
                    className="w-full px-4 py-3 bg-[var(--accent)] rounded-[10px] text-white placeholder-[var(--text-light)] focus:outline-none transition-all pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text)] hover:text-white transition-colors"
                  >
                    {showNewPassword ? (
                      <AiOutlineEyeInvisible className="text-xl" />
                    ) : (
                      <AiOutlineEye className="text-xl" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-[var(--text-light)] mt-1">
                  Use at least 8 characters with a mix of letters, numbers, and
                  symbols.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmNewPassword ? "text" : "password"}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Re-enter your new password"
                    required
                    className="w-full px-4 py-3 bg-[var(--accent)] rounded-[10px] text-white placeholder-[var(--text-light)] focus:outline-none transition-all pr-12"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmNewPassword(!showConfirmNewPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text)] hover:text-white transition-colors"
                  >
                    {showConfirmNewPassword ? (
                      <AiOutlineEyeInvisible className="text-xl" />
                    ) : (
                      <AiOutlineEye className="text-xl" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={
                  loading ||
                  !currentPassword ||
                  !newPassword ||
                  !confirmNewPassword
                }
                className="w-full px-6 py-3 btn text-white rounded-[10px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <AiOutlineLoading3Quarters className="animate-spin text-xl" />
                    Updating password...
                  </>
                ) : (
                  <>Change Password</>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
