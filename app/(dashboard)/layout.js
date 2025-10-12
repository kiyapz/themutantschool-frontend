"use client";
import { usePathname } from "next/navigation";
import InstructorNavBar from "./instructor/_components/NavBar";
// import StudentNavBar from "./student/student-dashboard/(student-course-guilde)/student-course-guilde/components/NavBar";
import CourseGuideProvider from "./student/student-dashboard/(student-course-guilde)/student-course-guilde/components/course-guild-contex/Contex"; // Corrected import
import { StudentProvider } from "./student/component/Context/StudentContext.jsx";
import InstructorContextProvider from "./instructor/_components/context/InstructorContex.js";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  // Determine which NavBar to show based on the current path
  const isInstructor = pathname.startsWith("/instructor");
  const isStudent = pathname.startsWith("/student");

  let NavBar = null;
  if (isInstructor) {
    // NavBar = InstructorNavBar;
  }
  // Student NavBar is handled by its specific page layout, so we no longer render it here.
  // else if (isStudent) {
  //   NavBar = StudentNavBar;
  // }

  return (
    <InstructorContextProvider>
      <StudentProvider>
        <CourseGuideProvider>
          {NavBar && <NavBar />}
          <main>{children}</main>
        </CourseGuideProvider>
      </StudentProvider>
    </InstructorContextProvider>
  );
}
