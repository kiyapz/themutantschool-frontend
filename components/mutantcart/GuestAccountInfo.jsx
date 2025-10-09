"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function GuestAccountInfo() {
  const [showInfo, setShowInfo] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Check if guest credentials exist
    const storedUsername = localStorage.getItem("guest-username");
    const storedPassword = localStorage.getItem("guest-password");
    const storedEmail = localStorage.getItem("guest-email");

    if (storedUsername && storedPassword) {
      setUsername(storedUsername);
      setPassword(storedPassword);
      setEmail(storedEmail || "");
      setShowInfo(true);
    }
  }, []);

  const handleClose = () => {
    setShowInfo(false);
  };

  if (!showInfo) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-[#1A1A1A] p-4 rounded-lg border-2 border-[#844CDC] shadow-lg max-w-md z-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-[#844CDC] font-bold">Your Guest Account</h3>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      <p className="text-white text-sm mb-3">
        We created an account for you to access your purchased courses:
      </p>

      <div className="bg-[#0A0A0A] p-3 rounded mb-3">
        <div className="mb-2">
          <span className="text-gray-400 text-xs">Username:</span>
          <span className="text-white font-mono ml-2">{username}</span>
        </div>
        <div className="mb-2">
          <span className="text-gray-400 text-xs">Password:</span>
          <span className="text-white font-mono ml-2">{password}</span>
        </div>
        {email && (
          <div>
            <span className="text-gray-400 text-xs">Email:</span>
            <span className="text-white font-mono ml-2">{email}</span>
          </div>
        )}
      </div>

      <div className="text-xs text-red-500 mb-3">
        ⚠️ Save these credentials! You'll need them to access your courses.
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => {
            navigator.clipboard.writeText(
              `Username: ${username}\nPassword: ${password}`
            );
            alert("Credentials copied to clipboard!");
          }}
          className="text-xs bg-[#232323] text-white px-3 py-1 rounded hover:bg-[#333]"
        >
          Copy to clipboard
        </button>
        <Link
          href="/auth/login"
          className="text-xs bg-[#844CDC] text-white px-3 py-1 rounded hover:bg-[#6a3ab0]"
        >
          Go to login
        </Link>
      </div>
    </div>
  );
}
