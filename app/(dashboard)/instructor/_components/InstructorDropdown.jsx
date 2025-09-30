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
    <div className="relative w-[253.29px]" ref={dropdownRef}>
      <div
        style={{ padding: "15px" }}
        onClick={() => setopenlargeProfileDropdown(!openlargeProfileDropdown)}
        className="cursor-pointer flex items-center xl:justify-between gap-2 w-full rounded-[12px] bg-[#1A1A1A] px-4 py-2"
      >
        <div className="w-[47px] h-[47px] rounded-full">
          <InstructorProfileImage />
        </div>

        <div className="flex items-center xl:justify-between gap-2 xl:gap-5">
          <div>
            <p className="text-[#308672] font-medium text-[13px] leading-[20px]">
              {userUpdatedValue?.role || "Instructor"}
            </p>
            <p className="text-[#D2D2D2] font-bold text-[15px] leading-[20px]">
              {userUpdatedValue?.firstName || "User"}
              {userUpdatedValue?.displayFullName &&
              userUpdatedValue?.lastName ? (
                <span> {userUpdatedValue.lastName}</span>
              ) : null}
            </p>
          </div>
          <div>
            <Image
              src="/images/sidebaricons/Frame (4).png"
              alt="dropdown"
              width={16}
              height={16}
              className={`transition-transform duration-300 ${
                openlargeProfileDropdown ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>
      </div>

      {/* Dropdown Menu */}
      {openlargeProfileDropdown && (
        <div>
          <ProfiledropDown />
        </div>
      )}
    </div>
  );
}
