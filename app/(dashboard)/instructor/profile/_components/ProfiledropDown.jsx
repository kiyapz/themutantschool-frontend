"use client";
import Link from "next/link";
import { useContext, useEffect, useRef, useState } from "react";
import { InstructorContext } from "../../_components/context/InstructorContex";
import UserProfileImage from "./UserProfileImage";

export default function ProfiledropDown() {
  const {
    setprofiledisplay,
    setopenSmallScreenProfileDropDown,
    setopenlargeProfileDropdown,
    handleLogout,
    userUpdatedValue,
  } = useContext(InstructorContext);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{ padding: "15px" }}
      className="absolute top-full mt-2 right-0 bg-[#2B2B2B] flex flex-col gap-1 w-full rounded-md shadow-lg z-50 overflow-hidden py-2"
    >
      <div className="flex flex-col items-center gap-1 p-2">
        <div className="w-[82px] h-[82px] rounded-full mb-2">
          {" "}
          <UserProfileImage />
        </div>
        <p className="font-[700] leading-[40px] text-[13px]">
          @<span> {userUpdatedValue.username}</span>{" "}
        </p>
      </div>

      {/* Divider */}
      <div className="w-full h-[1px] bg-[#404040]" />

      <ul className="text-sm flex flex-col gap-1 text-white">
        {/* My Profile */}
        <li
          onClick={() => {
            setOpen(false);
            setprofiledisplay("Personal Information");
            setopenSmallScreenProfileDropDown(false);
            setopenlargeProfileDropdown(false);
          }}
        >
          <Link
            style={{ padding: "3px" }}
            href="/instructor/profile"
            className="block px-4 py-2 text-[#9F9F9F] hover:bg-[#3A3A3A]"
          >
            My Profile
          </Link>
        </li>

        {/* Account Settings with nested menu */}
        <li
          style={{ padding: "3px" }}
          onClick={() => {
            setprofiledisplay("Account Settings");
            setSettingsOpen(!settingsOpen);
          }}
          className="px-4 py-2 text-[#9F9F9F] hover:bg-[#3A3A3A] cursor-pointer flex justify-between items-center"
        >
          Account Settings
          <span
            className={`transform transition-transform duration-200 ${
              settingsOpen ? "rotate-90" : ""
            }`}
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
                setopenSmallScreenProfileDropDown(false);
                setopenlargeProfileDropdown(false);
              }}
            >
              <Link
                style={{ padding: "3px" }}
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
                setopenSmallScreenProfileDropDown(false);
                setopenlargeProfileDropdown(false);
              }}
            >
              <Link
                style={{ padding: "3px" }}
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
          style={{ padding: "3px" }}
          onClick={() => {
            setOpen(false);
            handleLogout();
          }}
          className="px-4 py-2 text-[#9F9F9F] hover:bg-[#3A3A3A] cursor-pointer"
        >
          Sign Out
        </li>
      </ul>
    </div>
  );
}
