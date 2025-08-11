'use client'
import { useContext } from "react";
import { StudentContext } from "./Context/StudentContext";
import { FaArrowLeft } from "react-icons/fa";


export default function Navbar(params) {
    const { viewStudentName, } = useContext(StudentContext);
    return (
      <div
        style={{ paddingLeft: "30px" }}
        className="h-[10vh] flex  items-center"
      >
        <div>
          {viewStudentName ? (
            <p className="text-[#919191] font-[300] text-[48px] leading-[40px]">
              Hello Mutant Etieno
            </p>
          ) : (
            <div className="flex gap-2">
              <div className="cursor-pointer"><FaArrowLeft size={30} /></div>
              <div>
                <p className="font-[500] text-[20px] lg:text-[38px]  lg:leading-[39px] ">Digital Marketing</p>
                <p className="font-[500] text-[20px] lg:text-[23px]  lg:leading-[20px] ">5 Levels</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
}