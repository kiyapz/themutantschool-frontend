

import CourseGuideProvider from "./components/course-guild-contex/Contex";
import MissionVideo from "./components/MissionVideos";
import NavBar from "./components/NavBar";




export const metadata = {
  title: "Mutant School | Students Dashboard Course Guide",
  description:
    "Access the Mutant School portal to manage your classes, assignments, and student progress.",
};

export default function RootLayout({ children }) {
  
  return (
    <CourseGuideProvider>
      <div className="max-w-[1800px]  flexcenter flex-col  min-h-screen w-full mx-auto">
        <div className="h-fit bg-[#840B94] w-full">
          <NavBar />
        </div>

        <div className=" px w-full  max-w-[1800px]   py  flexcenter h-[90vh]  ">
          <main className="overflow-auto w-full scrollbar-hide h-full    p-4">
            {children}
          </main>
          <div className="">
            <MissionVideo />
          </div>
        </div>
      </div>
    </CourseGuideProvider>
  );
}
