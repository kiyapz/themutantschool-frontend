import { StudentProvider } from "../../component/Context/StudentContext";
import LevelChallange from "../../component/LevelChallange";
import Navbar from "../../component/Navbar";
import Sidebar from "../../component/Sidebar";

export const metadata = {
  title: "Mutant School | Students Dashboard",
  description:
    "Access the Mutant School portal to manage your classes, assignments, and student progress.",
};

export default function RootLayout({ children }) {
  return (
    <StudentProvider>
      <div className="flex min-h-screen w-full max-w-[1800px] mx-auto overflow-x-hidden">
        {/* Sidebar  */}
        <div className="hidden sm:block w-80 flex-shrink-0">
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <div className="w-full sm:max-w-4xl flex flex-col min-h-screen sm:h-screen">
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

        <div className="hidden lg:block flex-shrink-0">
          <LevelChallange />
        </div>
      </div>
    </StudentProvider>
  );
}
