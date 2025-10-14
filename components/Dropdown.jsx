import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const DropDown = ({ label, options, value, onChange, type = "text" }) => {
  const [isOpen, setIsOpen] = useState(true);
  const dropdownRef = useRef(null);

  // handle select value
  const handleSelect = (optionValue) => {
    console.log(
      `[Dropdown ${label}] handleSelect called with:`,
      optionValue,
      "type:",
      type,
      "current value:",
      value
    );
    if (type === "checkbox") {
      const currentValues = Array.isArray(value) ? value : [];
      const newValues = currentValues.includes(optionValue)
        ? currentValues.filter((v) => v !== optionValue)
        : [...currentValues, optionValue];
      console.log(
        `[Dropdown ${label}] Checkbox values changed from`,
        currentValues,
        "to",
        newValues
      );
      onChange(newValues);
    } else if (type === "radio" || type === "text") {
      // For radio and text, allow deselection by clicking the same option again
      const newValue = value === optionValue ? "" : optionValue;
      console.log(
        `[Dropdown ${label}] Value changed from`,
        value,
        "to",
        newValue
      );
      onChange(newValue);
    } else {
      console.log(`[Dropdown ${label}] Setting value to:`, optionValue);
      onChange(optionValue);
    }
  };

  const getSelectedLabel = () => {
    if (type === "checkbox" && Array.isArray(value) && value.length > 0) {
      return value.length === 1
        ? options.find((opt) => opt.value === value[0])?.label
        : `${value.length} selected`;
    } else if (value && type !== "checkbox") {
      return options.find((opt) => opt.value === value)?.label;
    }
    return label;
  };

  const isSelected = (optionValue) => {
    if (type === "checkbox") {
      return Array.isArray(value) && value.includes(optionValue);
    }
    return value === optionValue;
  };

  return (
    <div
      ref={dropdownRef}
      style={{ padding: "10px" }}
      className="w-full flex flex-col justify-between h-[161.61px] p-3 relative cursor-pointer bg-white "
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center"
      >
        <span className="text-gray-700">{getSelectedLabel()}</span>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>

      <div
        className={`transition-all duration-200 ease-in-out overflow-hidden ${
          isOpen ? "max-h-96 mt-3" : "max-h-0"
        }`}
      >
        {isOpen && (
          <div className="space-y-2">
            {options.map((opt, index) => (
              <div
                style={{ padding: "2px 0" }}
                key={index}
                onClick={() => handleSelect(opt.value)}
                className="cursor-pointer hover:bg-gray-100 p-2  flex items-center gap-2"
              >
                {type === "checkbox" && (
                  <input
                    type="checkbox"
                    checked={isSelected(opt.value)}
                    onChange={() => {}}
                    className="pointer-events-none"
                  />
                )}
                {type === "radio" && (
                  <input
                    type="radio"
                    checked={isSelected(opt.value)}
                    onChange={() => {}}
                    className="pointer-events-none"
                  />
                )}
                <span>{opt.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DropDown;
