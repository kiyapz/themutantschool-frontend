'use client';
import { useState } from "react";
import { FiClock, FiChevronDown } from "react-icons/fi";

export default function Sidebuttons({
  text,
  icons,
  width = "w-fit",
  items = [],
  onSelect,
  selectedValue = null,
  flex = "flex",
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        style={{ padding: "0px 15px" }}
        onClick={() => setIsOpen(!isOpen)}
        className={`${width} ${flex} items-center justify-center gap-1 border-[0.5px] border-[#656565] rounded-[7px] transition-all duration-300 hover:shadow-md hover:scale-[1.02] active:scale-95 px-4 py-1`}
      >
        <span className="transition-all duration-300">{icons}</span>
        <span className="text-[12px] font-[500] leading-[40px] text-[#BABABA]">
          {selectedValue ? `${text}: ${selectedValue}` : text}
        </span>
        <span
          className={`transform transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        >
          <FiChevronDown />
        </span>
      </button>

      {isOpen && (
        <div
          style={{ padding: "5px" }}
          className="absolute mt-2 w-full z-50 bg-[#1a1a1a] border border-gray-600 rounded-md shadow-lg"
        >
          <ul className="py-1">
            <li
              onClick={() => {
                onSelect?.(null);
                setIsOpen(false);
              }}
              className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 cursor-pointer transition-colors"
            >
              All
            </li>
            {items.map((item, idx) => (
              <li
                key={idx}
                onClick={() => {
                  onSelect?.(item.value);
                  setIsOpen(false);
                }}
                className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 cursor-pointer transition-colors"
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