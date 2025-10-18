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
      <div className="flex min-h-screen w-full  max-w-[1800px] mx-auto">
        {/* Sidebar  */}
        <div className="hidden sm:block w-80">
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <div className="w-full max-w-4xl flex flex-col min-h-screen sm:h-screen">
          {/* Navbar  */}
          <div className=" fixed top-0  left-0 right-0 z-10 bg-black sm:relative">
            <Navbar />
          </div>
          {/* Page Content */}

          <div className="flex-1 px margin-btn-smallScreen   py  grid h-[90vh]  ">
            <main className="overflow-auto scrollbar-hide h-full col-span-2   p-4">
              {children}
            </main>
          </div>
        </div>

        <div className="">
          <LevelChallange />
        </div>
      </div>
    </StudentProvider>
  );
}
