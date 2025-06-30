'use client';

import { useState, useRef, useEffect, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { InstructorContext } from "./context/InstructorContex";

export default function InstructorDropdown() {
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const dropdownRef = useRef();
  const { profiledisplay, setprofiledisplay } = useContext(InstructorContext);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
        setSettingsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative w-[253.29px]" ref={dropdownRef}>
      {/* Trigger Button */}
      <div
        style={{ padding: '15px' }}
        onClick={() => setOpen(!open)}
        className="cursor-pointer flex items-center xl:justify-between gap-2 w-full rounded-[12px] bg-[#1A1A1A] px-4 py-2"
      >
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
              className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
            />
          </div>
        </div>
      </div>

      {/* Dropdown Menu */}
      {open && (
        <div
          style={{ padding: '15px' }}
          className="absolute top-full mt-2 right-0 bg-[#2B2B2B] flex flex-col gap-3 w-full rounded-md shadow-lg z-50 overflow-hidden py-2"
        >
          <div className="flex flex-col items-center gap-1 p-2">
            <div className="w-[82px] h-[82px] rounded-full bg-pink-200 mb-2"></div>
            <p className="font-[700] leading-[40px] text-[13px]">@Etienoekanem</p>
          </div>

          {/* Divider */}
          <div className="w-full h-[1px] bg-[#404040]" />

          <ul className="text-sm flex flex-col gap-3 text-white">

            {/* My Profile */}
            <li
              onClick={() => {
                setOpen(false);
                setprofiledisplay("Personal Information");
              }}
            >
              <Link
                href="/instructor/profile"
                className="block px-4 py-2 text-[#9F9F9F] hover:bg-[#3A3A3A]"
              >
                My Profile
              </Link>
            </li>

            {/* Account Settings with nested menu */}
            <li
              onClick={() => {
                setprofiledisplay("Account Settings");
                setSettingsOpen(!settingsOpen);
              }}
              className="px-4 py-2 text-[#9F9F9F] hover:bg-[#3A3A3A] cursor-pointer flex justify-between items-center"
            >
              Account Settings
              <span
                className={`transform transition-transform duration-200 ${settingsOpen ? "rotate-90" : ""}`}
              >
                &gt;
              </span>
            </li>

            {/* Nested Settings */}
            {settingsOpen && (
              <ul className="ml-6 text-sm text-[#888888]">
                <li
                  onClick={() => {
                    setOpen(false);
                    setSettingsOpen(false);
                    setprofiledisplay("Notifications");
                  }}
                >
                  <Link
                    href="/instructor/profile/notification"
                    className="block px-4 py-2 hover:bg-[#444]"
                  >
                    Notifications
                  </Link>
                </li>

                <li
                  onClick={() => {
                    setOpen(false);
                    setSettingsOpen(false);
                    setprofiledisplay("Security Settings");
                  }}
                >
                  <Link
                    href="/instructor/profile/profilesetting"
                    className="block px-4 py-2 hover:bg-[#444]"
                  >
                    Security Settings
                  </Link>
                </li>
              </ul>
            )}

            {/* Divider */}
            <div className="w-full h-[1px] bg-[#404040]" />

            {/* Sign Out */}
            <li
              onClick={() => setOpen(false)}
              className="px-4 py-2 text-[#9F9F9F] hover:bg-[#3A3A3A] cursor-pointer"
            >
              Sign Out
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
