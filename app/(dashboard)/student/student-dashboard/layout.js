import { StudentProvider } from "../component/Context/StudentContext";
import LevelChallange from "../component/LevelChallange";
import Navbar from "../component/Navbar";
import Sidebar from "../component/Sidebar";


export const metadata = {
  title: "Mutant School | Students Dashboard",
  description:
    "Access the Mutant School portal to manage your classes, assignments, and student progress.",
};

export default function RootLayout({ children }) {
  return (
    <StudentProvider>
      <div className="flex min-h-screen w-full">
        {/* Sidebar  */}
        <div className="hidden sm:block">
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-screen sm:h-screen">
          {/* Navbar  */}
          <div>
            <Navbar />
          </div>
          {/* Page Content */}

          <div className="flex-1 px   py  grid h-[90vh]  ">
            <main className="overflow-auto scrollbar-hide h-full col-span-2   p-4">
              {children}
            </main>
          </div>
        </div>

        <div className="hidden lg:block">
          <LevelChallange />
        </div>
      </div>
    </StudentProvider>
  );
}
