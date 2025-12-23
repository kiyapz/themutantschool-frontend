"use client";

import Image from "next/image";
import { useContext, useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Link from "next/link";
import InstructorDropdown from "./InstructorDropdown";
import ProfiledropDown from "../profile/_components/ProfiledropDown";
import { InstructorContext } from "./context/InstructorContex";
import InstructorProfileImage from "./InstructorProfileImage";
import NotificationDropdown from "../../student/component/NotificationDropdown";
import { IoNotificationsOutline } from "react-icons/io5";
import api from "@/lib/api";

export default function NavBar({ onMenuClick }) {
  const {
    openSmallScreenProfileDropDown,
    setopenSmallScreenProfileDropDown,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
  } = useContext(InstructorContext);

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread notification count
  const fetchUnreadCount = async () => {
    try {
      const response = await api.get("/notification");
      const notifications = response.data?.data || response.data || [];
      const unread = notifications.filter((notif) => !notif.isRead).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Error fetching notification count:", error);
    }
  };

  useEffect(() => {
    // Fetch notification count on mount
    fetchUnreadCount();

    // Poll for new notifications every 30 seconds
    const notificationInterval = setInterval(fetchUnreadCount, 30000);

    return () => {
      clearInterval(notificationInterval);
    };
  }, []);

  const handleMenuClick = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (onMenuClick) {
      onMenuClick();
    }
  };

  return (
    <div>
      {/* Desktop NavBar */}
      <div className="hidden py sm:flex w-full h-[70px] sm:h-[80px] md:h-[90px] lg:h-[110px] xl:h-[125.36px] px items-center justify-between px-3 sm:px-4 md:px-5 lg:px-6">
        <p className="text-[12px] sm:text-[13px] md:text-[14px] lg:text-[16px] leading-[18px] sm:leading-[20px] md:leading-[22px] lg:leading-[24px] Xirod text-[var(--sidebar-linkcolor)]">
          Mission Control
        </p>

        <div className="flex items-center relative">
          <div className="flex items-center gap-2 md:gap-3 lg:gap-4 xl:gap-5">
            {/* Notification Icon - Desktop Only */}
            <div
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="relative cursor-pointer pr-2 sm:pr-3 md:pr-4 transition-transform duration-300 hover:scale-110 flex-shrink-0"
            >
            <IoNotificationsOutline
              size={16}
              className="text-[var(--sidebar-linkcolor)] sm:w-[18px] sm:h-[18px] md:w-5 md:h-5"
            />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-[9px] sm:text-[10px] font-bold">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </div>

           
          </div>

          {/* Notification Dropdown for Desktop Only */}
          <div className="hidden sm:block">
            <NotificationDropdown
              isOpen={notificationOpen}
              onClose={() => setNotificationOpen(false)}
              onNotificationUpdate={(count) => setUnreadCount(count)}
            />
          </div>

          <InstructorDropdown />
        </div>
      </div>

      {/* Mobile NavBar */}
      <div
        style={{ paddingLeft: "5px", paddingRight: "5px" }}
        className="sm:hidden z-50 fixed top-0 left-0 w-full h-[60px] bg-black border-b border-gray-800 backdrop-blur-sm flex items-center justify-between px-3 sm:px-4"
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleMenuClick}
            className="flex relative z-50 flex-col gap-1 cursor-pointer p-1.5 sm:p-2"
            aria-label="Toggle menu"
          >
            <span
              className={`w-5 h-0.5 bg-[var(--sidebar-linkcolor)] transition-transform duration-300 ${
                isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
              }`}
            ></span>
            <span
              className={`w-5 h-0.5 bg-[var(--sidebar-linkcolor)] transition-opacity duration-300 ${
                isMobileMenuOpen ? "opacity-0" : ""
              }`}
            ></span>
            <span
              className={`w-5 h-0.5 bg-[var(--sidebar-linkcolor)] transition-transform duration-300 ${
                isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
              }`}
            ></span>
          </button>

          <p className="text-[16px] sm:text-[18px] text-[var(--mutant-color)] font-[600] leading-[150%]">
            Dashboard
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 relative">
          {/* Notification Icon for Mobile */}
          <div
            onClick={() => setNotificationOpen(!notificationOpen)}
            className="relative cursor-pointer transition-transform duration-300 hover:scale-110 flex-shrink-0"
          >
            <IoNotificationsOutline
              size={20}
              className="text-[var(--sidebar-linkcolor)]"
            />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-[9px] sm:text-[10px] font-bold">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </div>

          {/* Notification Dropdown for Mobile - only render on mobile */}
          <div className="sm:hidden absolute top-full right-0 mt-2 z-50">
            <NotificationDropdown
              isOpen={notificationOpen}
              onClose={() => setNotificationOpen(false)}
              onNotificationUpdate={(count) => setUnreadCount(count)}
            />
          </div>

          <div className="relative h-[40px] sm:h-[50px] flex items-center justify-center px-2 sm:px-3 w-[50px] sm:w-[60px] rounded-[12px] bg-[#1A1A1A]">
            <div
              onClick={() =>
                setopenSmallScreenProfileDropDown(
                  !openSmallScreenProfileDropDown
                )
              }
              className="w-[30px] h-[30px] sm:w-[35px] sm:h-[35px] rounded-full cursor-pointer"
            >
              <InstructorProfileImage />
            </div>
            {openSmallScreenProfileDropDown && (
              <div className="absolute top-full right-0 mt-2 w-[325.89px] bg-[#1A1A1A] z-40 rounded-lg shadow-lg">
                <ProfiledropDown />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="sm:hidden h-[60px]" />

      {isMobileMenuOpen && (
        <div className="fixed top-0 left-0 z-40 w-full h-full bg-[rgba(0,0,0,0.8)]">
          <div className="w-fit bg-black">
            <Sidebar />
          </div>
        </div>
      )}
    </div>
  );
}
