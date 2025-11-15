
import { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";

const CustomDropdown = ({ text, width, items, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSelect = (item) => {
    onChange({ target: { value: item.label } });
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`${width} relative`} ref={dropdownRef}>
      <label
        style={{ display: "block", marginBottom: "8px" }}
        className="text-[#8C8C8C] font-[600] text-[13px] sm:text-[15px] leading-[40px]"
      >
        {text}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-[6px] bg-[#1F1F1F] outline-none px-4 py-3 text-white w-full flex justify-between items-center"
        style={{ padding: "10px 16px" }}
      >
        <span className={value ? "text-white" : "text-gray-400"}>
          {value || placeholder || `Select ${text}`}
        </span>
        <FaChevronDown
          className={`w-4 h-4 transition-transform text-gray-400 ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-[#1F1F1F] rounded-[6px] shadow-lg border border-gray-700">
          <ul className="py-1">
            {items.map((item, index) => (
              <li
                key={index}
                onClick={() => handleSelect(item)}
                className="px-4 py-2 text-white hover:bg-[#2a2a2a] cursor-pointer"
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
