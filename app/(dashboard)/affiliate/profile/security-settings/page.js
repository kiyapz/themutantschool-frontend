"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import api from "@/lib/api";
import { EyeIcon, EyeSlashIcon, XMarkIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

export default function SecuritySettingsPage() {
  const pathname = usePathname();

  const [security, setSecurity] = useState({
    twoFactor: false,
    loginAlerts: true,
    sessionTimeout: "30",
    passwordExpiry: "90",
  });

  // Password change states
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const profileNavItems = [
    {
      name: "Personal Information",
      href: "/affiliate/profile/personal-information",
    },
    { name: "Notifications", href: "/affiliate/profile/notifications" },
    {
      name: "Payment Information",
      href: "/affiliate/profile/payment-information",
    },
    { name: "Security Settings", href: "/affiliate/profile/security-settings" },
  ];

  // Handle password change
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    // Validation
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordError("All fields are required.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }

    setPasswordLoading(true);

    try {
      const response = await api.post("/auth/change-password", {
        currentPassword,
        newPassword,
        confirmNewPassword,
      });

      setPasswordSuccess(response.data?.message || "Password changed successfully.");
      
      // Reset form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);

      // Close modal after 2 seconds
      setTimeout(() => {
        setIsPasswordModalOpen(false);
        setPasswordSuccess("");
      }, 2000);
    } catch (error) {
      setPasswordError(
        error.response?.data?.message || "Failed to change password. Please try again."
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setPasswordError("");
    setPasswordSuccess("");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Profile Navigation */}
      <div className="w-full lg:w-64">
        <div className="rounded-lg p-4" style={{ backgroundColor: "#0F0F0F" }}>
          <nav className="space-y-2">
            {profileNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "text-purple-400"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Security Settings Content */}
      <div className="flex-1">
        <div className="rounded-lg p-6" style={{ backgroundColor: "#0F0F0F" }}>
          <h2 className="text-xl font-semibold mb-6">Security Settings</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-400">
                  Add an extra layer of security to your account
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={security.twoFactor}
                  onChange={(e) =>
                    setSecurity({
                      ...security,
                      twoFactor: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Login Alerts</h3>
                <p className="text-sm text-gray-400">
                  Get notified when someone logs into your account
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={security.loginAlerts}
                  onChange={(e) =>
                    setSecurity({
                      ...security,
                      loginAlerts: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                value={security.sessionTimeout}
                onChange={(e) =>
                  setSecurity({
                    ...security,
                    sessionTimeout: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-lg text-white"
                style={{ backgroundColor: "#000000" }}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Password Expiry (days)
              </label>
              <input
                type="number"
                value={security.passwordExpiry}
                onChange={(e) =>
                  setSecurity({
                    ...security,
                    passwordExpiry: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-lg text-white"
                style={{ backgroundColor: "#000000" }}
              />
            </div>

            <div>
              <button
                onClick={() => setIsPasswordModalOpen(true)}
                className="w-full sm:w-auto px-6 py-3 rounded-lg text-white font-medium transition-all duration-200"
                style={{ backgroundColor: "#7343B3" }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#9159d1";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#7343B3";
                }}
              >
                Change Password
              </button>
            </div>

            <div className="flex justify-end">
              <button
                className="px-6 py-3 rounded-lg text-white font-medium transition-all duration-200"
                style={{ backgroundColor: "#7343B3" }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#9159d1";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#7343B3";
                }}
              >
                Save Security Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className="w-full max-w-md rounded-lg shadow-lg"
            style={{ backgroundColor: "#0F0F0F" }}
          >
            {/* Modal Header */}
            <div
              className="flex items-center justify-between p-6 border-b"
              style={{ borderColor: "#1A1A1A" }}
            >
              <h2 className="text-xl font-semibold text-white">Change Password</h2>
              <button
                onClick={closePasswordModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleChangePassword} className="p-6 space-y-6">
              {/* Error Message */}
              {passwordError && (
                <div
                  className="p-4 rounded-lg text-red-400 text-sm"
                  style={{ backgroundColor: "#301B19" }}
                >
                  {passwordError}
                </div>
              )}

              {/* Success Message */}
              {passwordSuccess && (
                <div
                  className="p-4 rounded-lg text-green-400 text-sm flex items-center gap-2"
                  style={{ backgroundColor: "#1A2E1A" }}
                >
                  <CheckCircleIcon className="h-5 w-5" />
                  {passwordSuccess}
                </div>
              )}

              {/* Current Password */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg text-white transition-all duration-200 pr-12"
                    style={{
                      backgroundColor: "#000000",
                      border: "1px solid #1A1A1A",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#7343B3")}
                    onBlur={(e) => (e.target.style.borderColor = "#1A1A1A")}
                    placeholder="Enter current password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showCurrentPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg text-white transition-all duration-200 pr-12"
                    style={{
                      backgroundColor: "#000000",
                      border: "1px solid #1A1A1A",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#7343B3")}
                    onBlur={(e) => (e.target.style.borderColor = "#1A1A1A")}
                    placeholder="Enter new password (min. 8 characters)"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showNewPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg text-white transition-all duration-200 pr-12"
                    style={{
                      backgroundColor: "#000000",
                      border: "1px solid #1A1A1A",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#7343B3")}
                    onBlur={(e) => (e.target.style.borderColor = "#1A1A1A")}
                    placeholder="Confirm new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closePasswordModal}
                  className="px-6 py-3 rounded-lg text-white font-medium transition-all duration-200"
                  style={{ backgroundColor: "#2A2A2A" }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#404040";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#2A2A2A";
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="px-6 py-3 rounded-lg text-white font-medium transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: passwordLoading ? "#5a2d8a" : "#7343B3" }}
                  onMouseEnter={(e) => {
                    if (!passwordLoading) {
                      e.target.style.backgroundColor = "#9159d1";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!passwordLoading) {
                      e.target.style.backgroundColor = "#7343B3";
                    }
                  }}
                >
                  {passwordLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Changing...</span>
                    </>
                  ) : (
                    "Change Password"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
