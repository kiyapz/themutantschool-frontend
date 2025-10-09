import ProtectedRoute from "../_components/ProtectedRoutes";
import NavBar from "./_components/NavBar";
import Sidebar from "./_components/Sidebar";

export const metadata = {
  title: "Mutant School | Instructor Dashboard",
  description:
    "Access the Mutant School portal to manage your classes, assignments, and student progress.",
};

export default function RootLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={["instructor"]}>
      <div className="flex min-h-screen w-full">
        {/* Sidebar  */}
        <div className="hidden sm:block">
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-screen sm:h-screen">
          {/* Page Content */}
          <main className="flex-1 px   overflow-auto scrollbar-hide  py    p-4">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
