'use client'
import { useContext, useEffect } from "react";
import LevelsPath from "../../component/LevelsPath";
import { StudentContext } from "../../component/Context/StudentContext";

export default function Page() {
  const { setViewStudentName } = useContext(StudentContext);
   useEffect(() => {
     setViewStudentName(false);
   }, [setViewStudentName]);
  return (
    <div className="flex flex-col gap-[100px]">
      <div
        style={{ padding: "30px" }}
        className="h-fit  bg-gradient-to-r from-[#231926] to-[#5D1D49] sm:h-[233.1px] w-full grid gap-5 sm:grid-cols-2 "
      >
        <div className="flex flex-col gap-5 sm:gap-0 justify-between order-2 sm:order-1">
          <div className="flex flex-col gap-10">
            <p className="font-[800] text-[21px] xl:text-[38px] leading-[39px] ">
              Web Development Mastery
            </p>
            <p className="font-[300] text-[15px] xl:text-[23px] leading-[20px] ">
              5 Capsules • 1 Quiz
            </p>
          </div>
        </div>

        <div
          style={{
            backgroundImage: `url("/images/students-images/Group (15).png")`,
          }}
          className="  bg-center bg-cover h-[20vh] order-1 w-full sm:h-full"
        ></div>
      </div>

      

      <div className="w-full flexcenter h-fit  ">
        <LevelsPath />
      </div>
    </div>
  );
}
