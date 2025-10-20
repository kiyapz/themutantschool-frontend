"use client";

import { useState } from "react";
import Sidebar from "./_components/Sidebar";
import Navbar from "./_components/Navbar";
import ProtectedRoute from "../_components/ProtectedRoutes";

export default function AffiliateLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedRoute allowedRoles={["affiliate"]}>
      <div
        className="min-h-screen text-white"
        style={{ backgroundColor: "#0A0A0A" }}
      >
        {/* Top Navigation Bar */}
        <Navbar setSidebarOpen={setSidebarOpen} />

        <div className="flex">
          {/* Sidebar */}
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          {/* Main Content */}
          <div className="flex-1 p-4 sm:p-6 ml-0 lg:ml-64 pt-24 bg-black lg:pt-20">
            {children}
          </div>
        </div>
      </div>
     </ProtectedRoute> 
  );
}
