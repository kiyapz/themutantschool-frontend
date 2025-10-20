"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [securityAlerts, setSecurityAlerts] = useState({
    newDeviceLogin: true,
    unusualActivities: false,
  });

  const [newsUpdates, setNewsUpdates] = useState({
    newFeatures: false,
    tipsNews: false,
  });

  const handleSecurityToggle = (key) => {
    setSecurityAlerts((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleNewsToggle = (key) => {
    setNewsUpdates((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div>
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Notifications Settings
        </h1>
      </div>

      {/* Security Alerts Section */}
      <div
        className="rounded-lg p-6 mb-8"
        style={{ backgroundColor: "#0C0C0C" }}
      >
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-2">
            Security Alerts
          </h2>
          <p className="text-gray-400">
            Set up the security alerts you want to receive
          </p>
        </div>

        <div className="space-y-6">
          {/* New Device Login */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-medium text-white mb-1">
                Notify me of a new device login
              </h3>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={securityAlerts.newDeviceLogin}
                onChange={() => handleSecurityToggle("newDeviceLogin")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          {/* Unusual Activities */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-medium text-white mb-1">
                Email me when unusual activities are encountered
              </h3>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={securityAlerts.unusualActivities}
                onChange={() => handleSecurityToggle("unusualActivities")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* News and Updates Section */}
      <div className="rounded-lg p-6" style={{ backgroundColor: "#0C0C0C" }}>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-2">
            News and Updates
          </h2>
          <p className="text-gray-400">
            Set up newsletter alerts you want to receive
          </p>
        </div>

        <div className="space-y-6">
          {/* New Features */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-medium text-white mb-1">
                Send me notifications of new features and updates through email
              </h3>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={newsUpdates.newFeatures}
                onChange={() => handleNewsToggle("newFeatures")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          {/* Tips and News */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-medium text-white mb-1">
                Send me tips and latest news
              </h3>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={newsUpdates.tipsNews}
                onChange={() => handleNewsToggle("tipsNews")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
