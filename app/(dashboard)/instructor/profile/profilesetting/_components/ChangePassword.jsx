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

export default function ChangePasswordValue({ onBack }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
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
      resetForm();
      if (onBack) {
        setTimeout(() => {
          onBack();
        }, 1500);
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
            Change Your Password
          </p>
          <p className="text-[#999999] text-sm sm:text-[15px] font-[400] leading-relaxed">
            Enter your current password and choose a new, secure password.
          </p>
        </div>

        {success && (
          <div className="p-4 bg-green-500/20 rounded-[10px] flex items-start gap-3">
            <AiOutlineCheckCircle className="text-green-500 text-xl flex-shrink-0 mt-0.5" />
            <p className="text-green-500 text-sm">{success}</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-500/20 rounded-[10px] flex items-start gap-3">
            <AiOutlineCloseCircle className="text-red-500 text-xl flex-shrink-0 mt-0.5" />
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-5">
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
                className="w-full px-4 py-3 bg-[#1A1A1A] rounded-[10px] text-white placeholder-[#666666] focus:outline-none focus:ring-2 focus:ring-[#604196] transition-all pr-12"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999999] hover:text-white transition-colors"
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
                placeholder="Enter new password"
                required
                className="w-full px-4 py-3 bg-[#1A1A1A] rounded-[10px] text-white placeholder-[#666666] focus:outline-none focus:ring-2 focus:ring-[#604196] transition-all pr-12"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999999] hover:text-white transition-colors"
              >
                {showNewPassword ? (
                  <AiOutlineEyeInvisible className="text-xl" />
                ) : (
                  <AiOutlineEye className="text-xl" />
                )}
              </button>
            </div>
            <p className="text-xs text-[#999999] mt-1">
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
                type={showConfirmPassword ? "text" : "password"}
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
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
                resetForm();
                if (onBack) onBack();
              }}
              className="flex-1 px-6 py-3 bg-transparent border border-[#4D4D4D] text-white rounded-[10px] font-semibold hover:bg-[#1A1A1A] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                loading || !currentPassword || !newPassword || !confirmNewPassword
              }
              className="flex-1 px-6 py-3 bg-[#604196] text-white rounded-[10px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:bg-[#7051a8] transition-all"
            >
              {loading ? (
                <>
                  <AiOutlineLoading3Quarters className="animate-spin text-xl" />
                  Updating...
                </>
              ) : (
                <>Change Password</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
