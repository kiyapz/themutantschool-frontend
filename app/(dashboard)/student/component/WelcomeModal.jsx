"use client";
import { useEffect, useState } from "react";

export default function WelcomeModal({ onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const [showElements, setShowElements] = useState({
    overlay: false,
    modal: false,
    title: false,
    xp: false,
    button: false,
  });

  useEffect(() => {
    // Staggered animation sequence for modal entrance
    const timers = [
      setTimeout(() => setShowElements((prev) => ({ ...prev, overlay: true })), 100),
      setTimeout(() => setShowElements((prev) => ({ ...prev, modal: true })), 200),
      setTimeout(() => setShowElements((prev) => ({ ...prev, title: true })), 500),
      setTimeout(() => setShowElements((prev) => ({ ...prev, xp: true })), 800),
      setTimeout(() => setShowElements((prev) => ({ ...prev, button: true })), 1100),
    ];

    setIsVisible(true);

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, []);

  const handleClose = () => {
    setShowElements({
      overlay: false,
      modal: false,
      title: false,
      xp: false,
      button: false,
    });
    
    // Wait for animations to complete before closing
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        showElements.overlay ? "bg-black/70 backdrop-blur-sm" : "bg-black/0"
      }`}
      onClick={handleClose}
    >
      <div
        className={`relative max-w-[560px] w-full bg-[#1A1A1A] rounded-[30px] p-12 sm:p-14 shadow-2xl transition-all duration-500 ease-out ${
          showElements.modal
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-[30px]"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center gap-7 relative z-10">
          {/* Title */}
          <div
            className={`text-center transition-all duration-500 ease-out ${
              showElements.title
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-[20px]"
            }`}
          >
            <h1 className="text-white text-[36px] sm:text-[44px] font-[700] leading-[1.2] mb-3">
              Congratulations!
            </h1>
            <p className="text-gray-400 font-[500] text-[17px] sm:text-[19px]">
              You&apos;ve Earned
            </p>
          </div>

          {/* XP Display */}
          <div
            className={`flex flex-col items-center gap-4 transition-all duration-700 ease-out ${
              showElements.xp
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-75 translate-y-[20px]"
            }`}
          >
            <div className="flex items-baseline gap-2">
              <span className="text-[#25AF35] font-[800] text-[48px] sm:text-[52px] leading-[1]">
                +15
              </span>
              <span className="text-[#2B61C6] font-[700] text-[36px] sm:text-[42px] leading-[1]">
                XP
              </span>
            </div>
            
            <p className="text-gray-400 font-[500] text-[15px] sm:text-[17px] text-center">
              For Joining The Mutant School
            </p>
          </div>

          {/* Continue Button */}
          <button
            onClick={handleClose}
            className={`mt-4 px-12 py-4 bg-gradient-to-r from-[#894999] to-[#E8823A] hover:from-[#9B5AAB] hover:to-[#F09347] rounded-[30px] font-[700] text-[17px] sm:text-[19px] text-white transition-all duration-300 shadow-lg hover:shadow-[#894999]/50 hover:scale-105 active:scale-95 ${
              showElements.button
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-[20px]"
            }`}
          >
            Go To Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}



