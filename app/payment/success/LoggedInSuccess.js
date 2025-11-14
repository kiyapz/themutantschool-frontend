"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LoggedInSuccess() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("USER");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-6 sm:py-8">
      <div className="max-w-3xl w-full text-center">
        <div className="mb-4 sm:mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-full bg-gradient-to-br from-[#844CDC] to-[#6a3ab0] flex items-center justify-center shadow-lg">
            <svg
              className="w-10 h-10 sm:w-12 sm:h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="font-[400] text-[28px] sm:text-[38px] md:text-[45px] leading-[36px] sm:leading-[46px] md:leading-[55px] Xirod text-[#844CDC] mb-2 sm:mb-3 px-2">
            PAYMENT SUCCESSFUL!
          </h1>
          <p className="text-[var(--text)] text-[15px] sm:text-[17px] md:text-[18px] leading-[24px] sm:leading-[26px] md:leading-[28px] font-[400] max-w-xl mx-auto px-2">
            Your mission access has been granted.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
          <Link
            href={
              user?.role === "student"
                ? "/student/dashboard"
                : "/instructor/dashboard"
            }
            className="w-full sm:w-auto px-6 sm:px-8 sm:min-w-[200px] h-[54px] sm:h-[60px] flex items-center justify-center btn font-[700] text-[16px] sm:text-[18px] rounded-[10px] hover:opacity-90 active:opacity-80 transition-opacity"
          >
            {user?.role === "student"
              ? "Go to Student Dashboard"
              : "Go to Instructor Dashboard"}
          </Link>
          <Link
            href="/missions"
            className="w-full sm:w-auto px-6 sm:px-8 sm:min-w-[200px] h-[54px] sm:h-[60px] flex items-center justify-center bg-[var(--accent)] text-[var(--background)] font-[700] text-[16px] sm:text-[18px] rounded-[10px] hover:opacity-90 active:opacity-80 transition-opacity border border-[#844CDC]/30"
          >
            Explore More Missions
          </Link>
        </div>
      </div>
    </div>
  );
}
