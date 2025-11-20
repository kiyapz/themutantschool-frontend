"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChartBarIcon,
  UserIcon,
  UserGroupIcon,
  ClockIcon,
  TrophyIcon,
  CreditCardIcon,
  CogIcon,
  LifebuoyIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const pathname = usePathname();

  const navigationItems = [
    { name: "Dashboard", icon: ChartBarIcon, href: "/affiliate" },
    { name: "Profile", icon: UserIcon, href: "/affiliate/profile" },
    {
      name: "Conversion History",
      icon: ClockIcon,
      href: "/affiliate/conversion-history",
    },
    { name: "Leaderboard", icon: TrophyIcon, href: "/affiliate/leaderboard" },
    { name: "Payments", icon: CreditCardIcon, href: "/affiliate/payments" },
    { name: "Users", icon: UserGroupIcon, href: "/affiliate/users" },
    { name: "Settings", icon: CogIcon, href: "/affiliate/settings" },
    { name: "Support", icon: LifebuoyIcon, href: "/affiliate/support" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`w-64 fixed left-0 top-0 bottom-0 overflow-y-auto z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
        style={{ backgroundColor: "#000000" }}
      >
        <div className="p-6 flex justify-between items-center">
          <div className="text-2xl font-bold text-[#7343B3] Xirod">MUTANT</div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-gray-300"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="px-6 pt-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            CORE NAVIGATION
          </h3>
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                    isActive ? "text-purple-400" : "text-gray-400"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}
