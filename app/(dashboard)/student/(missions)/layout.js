"use client";
import { useContext } from "react";
import {
  StudentProvider,
  StudentContext,
} from "../component/Context/StudentContext";
import LevelChallange from "../component/LevelChallange";
import Navbar from "../component/Navbar";
import Sidebar from "../component/Sidebar";

export default function RootLayout({ children }) {
  return (
    <StudentProvider>
      <LayoutContent>{children}</LayoutContent>
    </StudentProvider>
  );
}

function LayoutContent({ children }) {
  const { showLevelCkallenge } = useContext(StudentContext);

  return (
    <div className="flex min-h-screen w-full max-w-[1800px] mx-auto overflow-x-hidden">
     

      {/* Main Content Area */}
      <div
        className={`w-full flex flex-col min-h-screen sm:h-screen ${
          showLevelCkallenge ? "sm:max-w-4xl" : "flex-1"
        }`}
      >
        {/* Navbar  */}
       
        {/* Page Content */}

        <div className="flex-1 px-4 sm:px-6 pt-[60px] sm:pt-0 py-4 sm:py-6 h-auto sm:h-[90vh]">
          <main className="overflow-auto scrollbar-hide h-full w-full">
            {children}
          </main>
        </div>
      </div>

      
    </div>
  );
}
