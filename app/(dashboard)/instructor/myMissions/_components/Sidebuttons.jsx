'use client'
import { FiChevronDown } from "react-icons/fi";
import { useState } from "react";

export default function Sidebuttons({ text, icons, width = "w-fit", items = [] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          paddingTop: "2px",
          paddingBottom: "2px",
          paddingLeft: "15px",
          paddingRight: "15px",
        }}
        className={`${width} flex items-center justify-center gap-1 border-[0.5px] border-[#656565] rounded-[7px] transition-all duration-300 hover:shadow-md hover:scale-[1.02] active:scale-95`}
      >
        <span className="transition-all duration-300">{icons}</span>
        <span className="text-[12px] font-[500] leading-[40px] text-[#BABABA]">
          {text}
        </span>
        <span
          className={`transform transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        >
          <FiChevronDown />
        </span>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div style={{padding:'5px'}} className="absolute mt-2 w-full z-50 bg-white border border-gray-200 rounded-md shadow-lg">
          <ul className="py-1">
            {items.map((item, idx) => (
              <li
                key={idx}
                onClick={() => {
                  item.onClick?.();
                  setIsOpen(false);
                }}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors"
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
