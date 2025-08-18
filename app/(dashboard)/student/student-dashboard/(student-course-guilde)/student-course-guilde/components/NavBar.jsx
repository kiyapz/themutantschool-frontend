'use client';
import { useContext } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { MdMenu } from "react-icons/md";
import { CourseGuideContext } from "./course-guild-contex/Contex";
import { FaTimes } from "react-icons/fa";

export default function NavBar() {
    const { showVideo, setShowVideo } = useContext(CourseGuideContext);
  return (
    <div
    
      className="w-full flex items-center justify-between p-4 text-white"
    >
      <div className="flex items-center gap-3  lg:gap-20 ">
        <FaArrowLeft size={20} className="cursor-pointer" />
        <div>
          <p className=" font-[700] text-[10px] sm:text-[38px] leading-[100%] ">
            Social Media Marketing
          </p>
          <p className=" font-[400] text-[10px] sm:text-[20px] leading-[100%] ">
            {" "}
            Video Capsule One: Instagram Marketing
          </p>
        </div>
      </div>
      <div
        onClick={() => setShowVideo(!showVideo)}
        className="cursor-pointer w-[44.25px] h-[31.25px]  "
      >
        {showVideo ? <FaTimes size={20} /> : <MdMenu size={20} />}
      </div>
    </div>
  );
}
