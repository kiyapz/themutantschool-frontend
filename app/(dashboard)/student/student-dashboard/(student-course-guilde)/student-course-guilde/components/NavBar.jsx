'use client';
import { useContext } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { MdMenu } from "react-icons/md";
import { CourseGuideContext } from "./course-guild-contex/Contex";

export default function NavBar() {
    const { showVideo, setShowVideo } = useContext(CourseGuideContext);
  return (
    <div className="w-full flex items-center justify-between p-4 text-white">
      <div className="flex items-center gap-2 ">
        <FaArrowLeft className="cursor-pointer" />
        <div>
          <p className=" font-[700] text-[10px] sm:text-[44px] leading-[100%] ">
            Social Media Marketing
          </p>
          <p className=" font-[400] text-[10px] sm:text-[24px] leading-[100%] ">
            {" "}
            Video Capsule One: Instagram Marketing
          </p>
        </div>
      </div>
      <div onClick={() => setShowVideo(!showVideo)} className="cursor-pointer">
        {showVideo ? "x" : <MdMenu />}
      </div>
    </div>
  );
}
