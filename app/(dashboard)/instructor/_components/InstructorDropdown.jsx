"use client";

import { useState, useRef, useEffect, useContext } from "react";
import Image from "next/image";

import ProfiledropDown from "../profile/_components/ProfiledropDown";
import { InstructorContext } from "./context/InstructorContex";
import InstructorProfileImage from "./InstructorProfileImage";

export default function InstructorDropdown() {
  const {
    openlargeProfileDropdown,
    setopenlargeProfileDropdown,
    user,
    userUpdatedValue,
  } = useContext(InstructorContext);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const dropdownRef = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setopenlargeProfileDropdown(false);
        setSettingsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative w-[200px] sm:w-[220px] md:w-[240px] lg:w-[253.29px]" ref={dropdownRef}>
      <div
        style={{ padding: "10px" }}
        className="cursor-pointer flex items-center xl:justify-between gap-2 w-full rounded-[12px] bg-[#1A1A1A] px-2 sm:px-3 md:px-4 py-1.5 sm:py-2"
        onClick={() => setopenlargeProfileDropdown(!openlargeProfileDropdown)}
      >
        <div className="w-[35px] h-[35px] sm:w-[40px] sm:h-[40px] md:w-[45px] md:h-[45px] lg:w-[47px] lg:h-[47px] rounded-full flex-shrink-0">
          <InstructorProfileImage />
        </div>

        <div className="flex items-center xl:justify-between gap-1.5 sm:gap-2 md:gap-3 xl:gap-5 min-w-0 flex-1">
          <div className="min-w-0 flex-1">
            <p className="text-[#308672] font-medium text-[11px] sm:text-[12px] md:text-[13px] leading-[16px] sm:leading-[18px] md:leading-[20px] truncate">
              {userUpdatedValue?.role || "Instructor"}
            </p>
            <p className="text-[#D2D2D2] font-bold text-[13px] sm:text-[14px] md:text-[15px] leading-[18px] sm:leading-[20px] truncate">
              {userUpdatedValue?.firstName || "User"}
              {userUpdatedValue?.displayFullName &&
              userUpdatedValue?.lastName ? (
                <span> {userUpdatedValue.lastName}</span>
              ) : null}
            </p>
          </div>
          <div className="flex-shrink-0">
            <Image
              src="/images/sidebaricons/Frame (4).png"
              alt="dropdown"
              width={16}
              height={16}
              className={`transition-transform duration-300 w-3 h-3 sm:w-4 sm:h-4 ${
                openlargeProfileDropdown ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>
      </div>

      {/* Dropdown Menu */}
      {openlargeProfileDropdown && (
        <div className="absolute top-full right-0 mt-2 w-full bg-[#1A1A1A] rounded-lg shadow-lg z-50">
          <ProfiledropDown />
        </div>
      )}
    </div>
  );
}
