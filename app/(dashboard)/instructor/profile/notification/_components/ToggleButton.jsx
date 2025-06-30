'use client';
import { useState } from "react";

export default function ToggleButton({ label = "", initialState = false, onToggle }) {
  const [isOn, setIsOn] = useState(initialState);

  const handleToggle = () => {
    const newState = !isOn;
    setIsOn(newState);
    if (onToggle) onToggle(newState);
  };

  return (
    <div className="flex w-full items-center gap-4">
      {/* Toggle (fixed size) */}
      <div
        onClick={handleToggle}
        className={`shrink-0 w-[43.77px] h-[22.22px] sm:w-[66px] sm:h-[30px] rounded-full border-2 transition-colors duration-300 cursor-pointer
          ${isOn ? "border-[#8E5BB5]" : "border-[#525252]"} flex items-center p-[2px]`}
      >
        <div
          className={`h-[16.88px] w-[16.88px] sm:w-[24px] sm:h-[24px] rounded-full transition-all duration-300
            ${isOn ? "translate-x-[20px] sm:translate-x-[34px] bg-[#8E5BB5]" : "translate-x-0 bg-[#979797]"}`}
        />
      </div>

      {/* Label (responsive text, can wrap) */}
      <div
        className={`flex-1 text-[12px] sm:text-[17px]  leading-[150%] ${
          isOn ? "text-[#8E5B8B]" : "text-[#6C6C6C]  "
        }`}
      >
        {label}
      </div>
    </div>
  );
}
