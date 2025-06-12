'use client';

import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function PasswordInput({placeholder,value ,onchange }) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword((prev) => !prev);

  return (
    <div className="relative bg-[var(--accent)]   w-full ">
      <input
        type={showPassword ? "text" : "password"}
        placeholder={`${placeholder}`}
        className="w-full px h-[75.16px]  text-white   rounded-[10px]"
        value={value}
        onChange={onchange}
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

