'use client'

import Image from "next/image";
import { useState } from "react";
import Sidebar from "./Sidebar";

export default function NavBar({ onMenuClick }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMenuClick = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (onMenuClick) {
      onMenuClick();
    }
  };

  return (
    <div >
      {/* Desktop NavBar */}
      <div className="hidden py sm:flex w-full h-[125.36px]  px items-center justify-between px-6">
        <p className="text-[16px] sm:text-[18px] leading-[40px] Xirod text-[var(--sidebar-linkcolor)]">
          Mission Control
        </p>
        
        <div className="flex items-center gap-4 xl:gap-8">
          <div className="flex items-center gap-2 xl:gap-5">
            <Image 
              src="/images/sidebaricons/Vector (12).png" 
              alt="notification"
              width={15.7} 
              height={17} 
            />
            <Image 
              src="/images/sidebaricons/Group 273.png" 
              alt="settings"
              width={15.7} 
              height={17} 
            />
          </div>

          <div className=" px flex items-center xl:justify-between gap-2 py  w-[253.29px] rounded-[12px] bg-[#1A1A1A]">
            <div className="w-[47px] h-[47px] bg-pink-200 rounded-full"></div>

            <div className="flex items-center xl:justify-between gap-2 xl:gap-5">
              <div>
                <p className="text-[#308672] font-medium text-[13px] leading-[20px]">
                  Instructor
                </p>
                <p className="text-[#D2D2D2] font-bold leading-[20px]">
                  Etieno Ekanem
                </p>
              </div>
              <div>
                <Image 
                  src="/images/sidebaricons/Frame (4).png" 
                  alt="dropdown"
                  width={16} 
                  height={16} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile NavBar */}
      <div className="sm:hidden w-full h-[79.88px] px flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={handleMenuClick}
            className="flex relative z-50 flex-col gap-1 cursor-pointer p-2"
            aria-label="Toggle menu"
          >
            <span className={`w-5 h-0.5 bg-[var(--sidebar-linkcolor)] transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
            <span className={`w-5 h-0.5 bg-[var(--sidebar-linkcolor)] transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-5 h-0.5 bg-[var(--sidebar-linkcolor)] transition-transform duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
          </button>
          
          <p className="text-[22px] text-[var(--mutant-color)] font-[600] leading-[150%]  ">
            Dashboard
          </p>
        </div>
        
        <div className="flex items-center">
          <div className="h-[50px] flex items-center justify-center px-3 w-[60px] rounded-[12px] bg-[#1A1A1A]">
            <div className="w-[35px] h-[35px] bg-pink-200 rounded-full"></div>
          </div>
        </div>
      </div>


      {isMobileMenuOpen && <div className="fixed top-0 left-0 z-10 bg-[rgba(0,0,0,0.8)] ">
        <div className="w-fit bg-black">
        <Sidebar />
        </div>
        </div>}
    </div>
  );
}