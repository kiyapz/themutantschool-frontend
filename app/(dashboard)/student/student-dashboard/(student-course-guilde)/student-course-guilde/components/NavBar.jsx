'use client';
import { useContext, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { MdMenu } from "react-icons/md";
import { CourseGuideContext } from "./course-guild-contex/Contex";
import { FaTimes } from "react-icons/fa";
import { StudentContext } from "@/app/(dashboard)/student/component/Context/StudentContext";

export default function NavBar() {
    const { showVideo, setShowVideo } = useContext(CourseGuideContext);
    console.log(localStorage.getItem("USER"));

const { currentCapsuleTitle, setCurrentCapsuleTitle } = useContext(StudentContext);
  
  return (
    <div style={{padding:'20px '}} className="w-full flex items-center justify-between  text-white">
      <div className="flex items-center gap-3  lg:gap-20 ">
        <FaArrowLeft size={20} className="cursor-pointer" />
        <div>
          <p className=" font-[700] text-[10px] sm:text-[38px] leading-[100%] ">
            {currentCapsuleTitle}
          </p>
          {/* <p className=" font-[400] text-[10px] sm:text-[20px] leading-[100%] ">
            {" "}
            Video Capsule One: Instagram Marketing
          </p> */}
        </div>
      </div>
      <div
        onClick={() => setShowVideo(!showVideo)}
        className="cursor-pointer w-[44.25px] flexcenter  h-[31.25px]  "
      >
        {showVideo ? <FaTimes size={20} /> : <MdMenu size={20} />}
      </div>
    </div>
  );
}
