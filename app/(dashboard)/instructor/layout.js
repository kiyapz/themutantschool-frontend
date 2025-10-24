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
      <div className="flex h-screen w-full overflow-hidden">
        {/* Sidebar  */}
        <div className="hidden sm:block w-[200px] md:w-[250px] lg:w-[260px] xl:w-[300px] flex-shrink-0 h-screen overflow-y-auto">
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <NavBar />
          {/* Page Content */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide p-2 sm:p-4">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
