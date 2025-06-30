import ProtectedRoute from "../_components/ProtectedRoutes";
import InstructorContextProvider from "./_components/context/InstructorContex";
import NavBar from "./_components/NavBar";
import Sidebar from "./_components/Sidebar";

export const metadata = {
  title: "mutant school",
  description: "Student dashboard",
};

export default function RootLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={["instructor"]}>
      <InstructorContextProvider>
      <div className="flex min-h-screen w-full">
        {/* Sidebar  */}
        <div className="hidden sm:block">
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-screen sm:h-screen">
          {/* Navbar  */}
          <div>
          <NavBar />
           </div>
          {/* Page Content */}
          <main className="flex-1 px   overflow-auto scrollbar-hide  py    p-4">
            {children}
          </main>
        </div>
      </div>
      </InstructorContextProvider>
    </ProtectedRoute>
  );
}
