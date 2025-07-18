"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { InstructorContext } from "../../../_components/context/InstructorContex";
import { ChevronDown, ChevronUp } from "lucide-react";

const options = [
  { label: "(7/10) 70%", value: 70 },
  { label: "(8/10) 80%", value: 80 },
  { label: "(9/10) 90%", value: 90 },
  { label: "(10/10) 100%", value: 100 },
];

export default function QuizeCustomDropdown() {
  const { passingScore, setPassingScore } = useContext(InstructorContext);
  const initialOption =
    options.find((opt) => opt.value === passingScore) || options[0];

  const [selected, setSelected] = useState(initialOption);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    setSelected(option);
    setPassingScore(option.value);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        style={{ padding: "10px" }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-[75.76px] bg-[#070707] text-white rounded-[14px] px-4 py-2 text-left flex items-center justify-between cursor-pointer"
      >
        <span>{selected.label}</span>
        {isOpen ? (
          <ChevronUp size={20} className="text-white" />
        ) : (
          <ChevronDown size={20} className="text-white" />
        )}
      </div>
      {isOpen && (
        <div 
        
        style={{ padding: "10px" }}
        className="absolute mt-1 w-full rounded-md bg-black shadow-lg z-10">
          {options.map((option, idx) => (
            <div
              key={idx}
              onClick={() => handleSelect(option)}
              className={`cursor-pointer select-none p-3 text-[15px] font-[400] text-white hover:bg-white/10 ${
                selected.value === option.value ? "bg-[#111]" : "bg-black"
              }`}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
