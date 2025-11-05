"use client";
import { useContext } from "react";
import { usePathname } from "next/navigation";
import ProtectedRoute from "../_components/ProtectedRoutes";
import LevelChallange from "./component/LevelChallange";
import Navbar from "./component/Navbar";
import Sidebar from "./component/Sidebar";
import {
  StudentContext,
  StudentProvider,
} from "./component/Context/StudentContext";

export default function RootLayout({ children }) {
  return (
    <StudentProvider>
      <LayoutContent>{children}</LayoutContent>
    </StudentProvider>
  );
}

function LayoutContent({ children }) {
  const { showLevelCkallenge } = useContext(StudentContext);
  const pathname = usePathname();

  const isCourseGuideRoute = pathname?.includes(
    "/dashboard/student-course-guilde"
  );

  const isRootStudentRoute = pathname === "/student";

  const isDashboardRoute =
    pathname === "/student/dashboard" || pathname === "/student/dashboard/";

  if (isCourseGuideRoute || isRootStudentRoute) {
    return (
      <ProtectedRoute allowedRoles={["student"]}>{children}</ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <div className="flex min-h-screen w-full max-w-[1800px]    mx-auto overflow-x-hidden">
        {/* Sidebar  */}
        <div className="hidden sm:block w-80 flex-shrink-0">
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <div
          className={`w-full flex flex-col min-h-screen sm:h-screen ${
            showLevelCkallenge ? "flex-1" : "flex-1"
          }`}
        >
          {/* Navbar  */}
          <div className="w-full fixed top-0 left-0 right-0 z-10 bg-black sm:relative sm:w-auto">
            <Navbar />
          </div>
          {/* Page Content */}

          <div className="flex-1 px-4 sm:px-6 pt-[60px] sm:pt-0 py-4 sm:py-6 h-auto sm:h-[90vh]">
            <main className="overflow-auto scrollbar-hide h-full w-full">
              {children}
            </main>
          </div>
        </div>

        {showLevelCkallenge && (
          <div
            className={`flex flex-col self-start ${
              isDashboardRoute
                ? "hidden xl:flex xl:w-[448.45px] xl:flex-shrink-0"
                : "hidden lg:flex lg:w-[448.45px] lg:flex-shrink-0"
            }`}
          >
            <LevelChallange />
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
