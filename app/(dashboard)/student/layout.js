"use client";
import { useContext, useEffect } from "react";
import { usePathname } from "next/navigation";
import ProtectedRoute from "../_components/ProtectedRoutes";
import LevelChallange from "./component/LevelChallange";
import Navbar from "./component/Navbar";
import Sidebar from "./component/Sidebar";
import "./scrollbar.css";
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

  const isRootStudentRoute = pathname === "/student";

  useEffect(() => {
    if (typeof document === "undefined") return undefined;

    if (isRootStudentRoute) {
      document.body.classList.remove("dashboard-scroll-hidden");
      return () => {
        document.body.classList.remove("dashboard-scroll-hidden");
      };
    }

    document.body.classList.add("dashboard-scroll-hidden");
    return () => {
      document.body.classList.remove("dashboard-scroll-hidden");
    };
  }, [isRootStudentRoute]);

  const isCourseGuideRoute = pathname?.includes(
    "/dashboard/student-course-guilde"
  );

  const isDashboardRoute =
    pathname === "/student/dashboard" || pathname === "/student/dashboard/";

  const isAchievementsRoute = pathname?.includes("/student/achievements");
  const isProfileRoute = pathname?.includes("/student/profile");
  const isSettingsRoute = pathname?.includes("/student/settings");
  const isHistoryRoute = pathname?.includes("/student/history");
  const isQuizHistoryRoute = pathname?.includes("/student/quiz-history");
  const isMissionsRoute = pathname?.includes("/student/missions");

  if (isCourseGuideRoute || isRootStudentRoute) {
    return (
      <ProtectedRoute allowedRoles={["student"]}>{children}</ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <div className="flex h-screen w-full max-w-[1800px] mx-auto overflow-hidden">
        {/* Sidebar  */}
        <div className="hidden sm:block w-80 flex-shrink-0 h-full overflow-hidden">
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <div
          className={`w-full flex flex-col h-full ${
            showLevelCkallenge ? "flex-1" : "flex-1"
          }`}
        >
          {/* Navbar  */}
          <div className="w-full fixed top-0 left-0 right-0 z-10 bg-black sm:relative sm:w-auto">
            <Navbar />
          </div>
          {/* Page Content */}

          <div className="flex-1 px-4 sm:px-6 pt-[60px] sm:pt-0 py-4 sm:py-6 h-full overflow-hidden">
            <main className="h-full max-h-full w-full overflow-y-auto scrollbar-hidden">
              {children}
            </main>
          </div>
        </div>

        {showLevelCkallenge && (
          <div
            className={`${"hidden 2xl:flex 2xl:flex-col 2xl:w-[448.45px] 2xl:flex-shrink-0 h-full overflow-hidden"} self-start`}
          >
            <LevelChallange />
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
