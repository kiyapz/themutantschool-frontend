"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SecuritySettingsPage() {
  const pathname = usePathname();

  const [security, setSecurity] = useState({
    twoFactor: false,
    loginAlerts: true,
    sessionTimeout: "30",
    passwordExpiry: "90",
  });

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

            <div className="space-y-4">
              <button
                className="w-full sm:w-auto px-6 py-3 rounded-lg text-white font-medium"
                style={{ backgroundColor: "#7C3AED" }}
              >
                Change Password
              </button>
              <button
                className="w-full sm:w-auto px-6 py-3 rounded-lg text-white font-medium ml-0 sm:ml-4"
                style={{ backgroundColor: "#2A2A2A" }}
              >
                View Login History
              </button>
            </div>

            <div className="flex justify-end">
              <button
                className="px-6 py-3 rounded-lg text-white font-medium"
                style={{ backgroundColor: "#7C3AED" }}
              >
                Save Security Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
