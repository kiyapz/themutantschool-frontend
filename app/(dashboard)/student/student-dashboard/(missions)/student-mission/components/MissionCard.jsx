'use client';
import { imageConfigDefault } from "next/dist/shared/lib/image-config";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MissionCard({
  text1,
  text2,
  text3,
  image = "/images/students-images/Group (15).png",
  bg = "bg-gradient-to-r from-[#0E0E0E] to-[#0F060F]",
  missionId,
}) {
  const [level, setLevel] = useState(null);

  useEffect(() => {
    const getLevel = (text3) => {
      if (text3 < 35) return 1;
      if (text3 < 45) return 2;
      if (text3 < 55) return 3;
      if (text3 < 65) return 4;
      return 5;
    };

    const calculatedLevel = getLevel(text3);
    setLevel(calculatedLevel);
  }, [text3]);
  return (
    <div
      style={{ padding: "30px" }}
      className={`h-fit ${bg}  sm:h-[382.25px] w-full grid gap-5 sm:grid-cols-2 rounded-[20px] `}
    >
      <div className="flex flex-col gap-5 sm:gap-0 justify-between order-2 sm:order-1">
        <div>
          <p className="font-[800] text-[21px] xl:text-[38px] leading-[39px] ">
            {text1}
          </p>
          <p className="font-[500] text-[15px] xl:text-[23px] leading-[20px] ">
            {text2} Levels
          </p>
        </div>

        <div className="w-full  flex items-center">
          <div className="flex items-center  w-full">
            <span className="w-[50%]  ">
              <p className="w-[50%] bg-[#F9D336] rounded-[5px] h-[5px]"></p>
            </span>
            <span className="text-[#AFAFAF] font-[700]  text-[11px] leading-[20px] ">
              {level}/{text2}
            </span>
          </div>
          <div>
            <Image
              src={"/images/students-images/Group (16).png"}
              width={30.72}
              height={29.59}
              alt="star"
            />
          </div>
        </div>

        <div>
          <Link
            href={`/student/student-dashboard/student-mission-study-levels/${missionId}`}
          >
            <button className=" w-full  xl:w-[234.64px] h-[56.4px] cursor-pointer studentbtn2 rounded-[30px] ">
              Continue Mission
            </button>
          </Link>
        </div>
      </div>

      <div
        style={{
          backgroundImage: `url(${image})`,
        }}
        className="  bg-center bg-cover h-[20vh] order-1 w-full sm:h-full"
      ></div>
    </div>
  );
}
