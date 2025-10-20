"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  BellIcon,
  ChatBubbleLeftRightIcon,
  ChevronDownIcon,
  Bars3Icon,
  UserIcon,
  CreditCardIcon,
  CogIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

export default function Navbar({ setSidebarOpen }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] =
    useState(false);
  const profileDropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setIsProfileDropdownOpen(false);
      }
      if (
        notificationDropdownRef.current &&
        !notificationDropdownRef.current.contains(event.target)
      ) {
        setIsNotificationDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getPageTitle = () => {
    if (pathname.includes("/profile")) return "USER PROFILE";
    if (pathname.includes("/conversion-history")) return "CONVERSION HISTORY";
    if (pathname.includes("/leaderboard")) return "LEADERBOARD";
    if (pathname.includes("/payments")) return "PAYMENTS";
    if (pathname.includes("/settings")) return "AFFILIATES";
    if (pathname.includes("/support")) return "SUPPORT";
    return "AFFILIATE DASHBOARD";
  };

  const profileMenuItems = [
    {
      name: "Personal Information",
      href: "/affiliate/profile/personal-information",
      icon: UserIcon,
    },
    {
      name: "Payment Information",
      href: "/affiliate/profile/payment-information",
      icon: CreditCardIcon,
    },
    {
      name: "Security Settings",
      href: "/affiliate/profile/security-settings",
      icon: ShieldCheckIcon,
    },
    {
      name: "Notifications",
      href: "/affiliate/profile/notifications",
      icon: BellIcon,
    },
    {
      name: "Settings",
      href: "/affiliate/settings",
      icon: CogIcon,
    },
  ];

  const notifications = [
    {
      id: 1,
      message: "New referral earned $50",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: 2,
      message: "Payment processed successfully",
      time: "1 day ago",
      unread: true,
    },
    {
      id: 3,
      message: "Weekly report available",
      time: "3 days ago",
      unread: false,
    },
  ];

  return (
    <div
      className="px-4 sm:px-6 py-4 flex justify-between items-center fixed top-0 left-0 lg:left-64 right-0 z-50"
      style={{ backgroundColor: "#000000" }}
    >
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden text-white hover:text-gray-300 p-1"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
        <h1 className="text-lg sm:text-xl Xirod font-semibold truncate">
          {getPageTitle()}
        </h1>
      </div>
      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Notifications Dropdown */}
        <div className="relative" ref={notificationDropdownRef}>
          <button
            onClick={() =>
              setIsNotificationDropdownOpen(!isNotificationDropdownOpen)
            }
            className="relative p-1 rounded-lg transition-all duration-200"
            style={{ color: "#9B9B9B" }}
            onMouseEnter={(e) => {
              e.target.style.color = "#FFFFFF";
              e.target.style.backgroundColor = "#1A1A1A";
            }}
            onMouseLeave={(e) => {
              e.target.style.color = "#9B9B9B";
              e.target.style.backgroundColor = "transparent";
            }}
          >
            <BellIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            {notifications.filter((n) => n.unread).length > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                {notifications.filter((n) => n.unread).length}
              </span>
            )}
          </button>

          {isNotificationDropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-80 rounded-lg shadow-lg border z-50"
              style={{ backgroundColor: "#0F0F0F", borderColor: "#1A1A1A" }}
            >
              <div className="p-4 border-b" style={{ borderColor: "#1A1A1A" }}>
                <h3 className="text-sm font-medium text-white">
                  Notifications
                </h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b cursor-pointer transition-all duration-200 ${
                      notification.unread ? "opacity-100" : "opacity-70"
                    }`}
                    style={{
                      borderColor: "#1A1A1A",
                      backgroundColor: notification.unread
                        ? "#0C0C0C"
                        : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#1A1A1A";
                      e.target.style.transform = "translateX(4px)";
                      e.target.style.borderLeft = "3px solid #7343B3";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = notification.unread
                        ? "#0C0C0C"
                        : "transparent";
                      e.target.style.transform = "translateX(0px)";
                      e.target.style.borderLeft = "3px solid transparent";
                    }}
                  >
                    <p className="text-sm text-white">{notification.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {notification.time}
                    </p>
                  </div>
                ))}
              </div>
              <div className="p-2">
                <Link
                  href="/affiliate/profile/notifications"
                  className="block text-center text-sm py-2 transition-all duration-200 rounded-lg mx-2"
                  style={{ color: "#7343B3" }}
                  onMouseEnter={(e) => {
                    e.target.style.color = "#FFFFFF";
                    e.target.style.backgroundColor = "#7343B3";
                    e.target.style.transform = "scale(1.02)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "#7343B3";
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.transform = "scale(1)";
                  }}
                  onClick={() => setIsNotificationDropdownOpen(false)}
                >
                  View All Notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        <button
          className="p-1 rounded-lg transition-all duration-200"
          style={{ color: "#9B9B9B" }}
          onMouseEnter={(e) => {
            e.target.style.color = "#FFFFFF";
            e.target.style.backgroundColor = "#1A1A1A";
          }}
          onMouseLeave={(e) => {
            e.target.style.color = "#9B9B9B";
            e.target.style.backgroundColor = "transparent";
          }}
        >
          <ChatBubbleLeftRightIcon className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileDropdownRef}>
          <button
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            className="hidden md:flex items-center space-x-2 rounded-lg px-2 py-1 transition-all duration-200"
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#1A1A1A";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
            }}
          >
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">E</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs text-gray-400">Affiliate</span>
              <span className="text-sm font-medium text-white">
                Etieno Ekanem
              </span>
            </div>
            <ChevronDownIcon className="h-4 w-4 text-gray-400" />
          </button>

          {isProfileDropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-64 rounded-lg shadow-lg border z-50"
              style={{ backgroundColor: "#0F0F0F", borderColor: "#1A1A1A" }}
            >
              <div className="p-4 border-b" style={{ borderColor: "#1A1A1A" }}>
                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#7343B3" }}
                  >
                    <span className="text-sm font-medium">E</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      Etieno Ekanem
                    </p>
                    <p className="text-xs text-gray-400">Affiliate</p>
                  </div>
                </div>
              </div>
              <div className="py-2">
                {profileMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center space-x-3 px-4 py-3 text-sm transition-colors ${
                        isActive ? "opacity-100" : "opacity-70"
                      }`}
                      style={{
                        color: isActive ? "#7343B3" : "#E5E5E5",
                        backgroundColor: isActive ? "#0C0C0C" : "transparent",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.target.style.color = "#FFFFFF";
                          e.target.style.backgroundColor = "#1A1A1A";
                          e.target.style.transform = "translateX(4px)";
                          e.target.style.borderLeft = "3px solid #7343B3";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.target.style.color = "#E5E5E5";
                          e.target.style.backgroundColor = "transparent";
                          e.target.style.transform = "translateX(0px)";
                          e.target.style.borderLeft = "3px solid transparent";
                        }
                      }}
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div
          className="hidden lg:block p-2 rounded-lg"
          style={{ backgroundColor: "#2A2A2A" }}
        >
          <span className="text-sm font-mono">&lt;/&gt;</span>
        </div>
      </div>
    </div>
  );
}
