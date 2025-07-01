'use client'

import Image from "next/image";
import {  useContext, useState } from "react";
import Sidebar from "./Sidebar";
import Link from "next/link";
import InstructorDropdown from "./InstructorDropdown";
import ProfiledropDown from "../profile/_components/ProfiledropDown";
import { InstructorContext } from "./context/InstructorContex";


export default function NavBar({ onMenuClick }) {
    const {openSmallScreenProfileDropDown,setopenSmallScreenProfileDropDown} = useContext(InstructorContext);
  
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

         <InstructorDropdown />
        </div>
      </div>

      {/* Mobile NavBar */}
      <div 
        style={{paddingLeft:'10px',paddingRight:'10px'}} 
        className="sm:hidden z-50 fixed top-0 left-0 w-full h-[79.88px] bg-black border-b border-gray-800 backdrop-blur-sm flex items-center justify-between px-4"
      >
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
           {/* <Link href='/instructor/profile'>  */}
           <div onClick={()=>setopenSmallScreenProfileDropDown(!openSmallScreenProfileDropDown)} className="w-[35px] h-[35px] bg-pink-200 rounded-full cursor-pointer"></div> 
           {/* </Link> */}
          </div>
        </div>
      </div>

      {/* Add padding to body content on mobile to account for fixed navbar */}
      <div className="sm:hidden h-[79.88px]" />

      {isMobileMenuOpen && (
        <div className="fixed top-0 left-0 z-40 w-full h-full bg-[rgba(0,0,0,0.8)]">
          <div className="w-fit bg-black">
            <Sidebar />
          </div>
        </div>
      )}

      {openSmallScreenProfileDropDown && (
        <div className="w-screen fixed top-0 left-0 z-40 h-screen bg-[rgba(0,0,0,0.9)]">
          <div className="w-[325.89px] h-full fixed right-0 top-20 bg-[#2B2B2B] z-40">
            
            <div className="relative w-full h-fit ">
            <ProfiledropDown />
            </div>
         
          </div>
        </div>
      )}
    </div>
  );
}