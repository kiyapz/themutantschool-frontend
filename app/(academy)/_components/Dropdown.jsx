'use client';

import { useState, useRef, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { AcademyGloblaxcontex } from './academycontext/AcademyContext';

const institutionOptions = [
  'University',
  'College',
  'Training Center',
  'Bootcamp',
  'Online Academy',
  
];

export default function InstuteTypeDropdown() {
  const [open, setOpen] = useState(false);
  const {instituteType, setSelectedinstituteType} = useContext(AcademyGloblaxcontex)
  const dropdownRef = useRef();

  

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    setSelectedinstituteType(option);
    setOpen(false);
  };

  return (
    <div className="relative w-full h-[70.31px] bg-transparent sm:h-[75.16px]" ref={dropdownRef}>
      <div
        className="px h-[75.16px] rounded-[10px] bg-[var(--btn-bg-color)] flex items-center justify-between text-[#4B4B4B]     cursor-pointer "
        onClick={() => setOpen(!open)}
      >
        <span className="text-[16px] sm:text-[18px] leading-[40px]  ">
          {instituteType || 'Select Institution Type'}
        </span>
        <ChevronDown className={`transition-transform ${open ? 'rotate-180' : 'rotate-0'}`} />
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="absolute z-10 mt-2 w-full bg-white text-black px py rounded-[10px] border shadow-lg"
          >
            {institutionOptions.map((option, index) => (
              <div
              style={{padding:'3px'}}
                key={index}
                className={`px-4 py-3 hover:bg-gray-100 text-[15px] cursor-pointer ${
                    instituteType === option ? 'font-bold text-[var(--secondary)]' : ''
                }`}
                onClick={() => handleSelect(option)}
              >
                {option}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
