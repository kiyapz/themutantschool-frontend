"use client";

import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function PasswordInput({
  value,
  onchange,
  placeholder = "passwprd",
}) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword((prev) => !prev);

  return (
    <div className="relative bg-[var(--accent)] rounded-[8px] sm:rounded-[10px] w-full">
      <input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        className="w-full px-3 sm:px-4 py-2 h-[50px] sm:h-[70px] outline-none rounded-[8px] sm:rounded-[10px] bg-transparent text-white placeholder-gray-400 text-[14px] sm:text-[17px] leading-[20px] sm:leading-[57px] focus:bg-transparent active:bg-transparent"
        value={value}
        onChange={onchange}
        style={{
          WebkitBoxShadow: "0 0 0px 1000px var(--accent) inset",
          WebkitTextFillColor: "white",
        }}
      />
      <span
        onClick={togglePassword}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
      >
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </span>
    </div>
  );
}
