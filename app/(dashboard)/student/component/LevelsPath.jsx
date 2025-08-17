"use client";
import Link from "next/link";
import { useState } from "react";

export default function LevelsPath() {
  const [levelState, setLevelState] = useState({
    container: null,
    level: null,
  });

  const positions = [
    { top: "0px", left: "50%" },
    { top: "120px", left: "20%" },
    { top: "240px", left: "15%" },
    { top: "360px", left: "25%" },
    { top: "480px", left: "40%" },
    { top: "600px", left: "55%" },
  ];

  const levels = ["1", "2", "3", "4", "5", "Quiz"];
  const levelscontainer = [
    "level 1",
    "level 2",
    "level 3",
    "level 4",
    "level 5",
  ];

  return (
    <div className="h-fit flex flex-col gap-15">
      {levelscontainer.map((currentlevel, containerIndex) => (
        <div key={containerIndex}>
          <div className="relative w-[391px] flex flex-col gap-3 h-[679px] bg-black">
            {/* Label before levels */}
            <p style={{margin:'0px 30px'}} className="absolute top-[-70px]  left-1/2 -translate-x-1/2  font-[900] text-[35px] text-[#434343] leading-[20px] ">
              {currentlevel}
            </p>

            {levels.map((label, levelIndex) => (
              <Link href={`/student/student-dashboard/student-course-guilde`} key={levelIndex}>
              <div
                key={levelIndex}
                style={{
                  top: positions[levelIndex].top,
                  left: positions[levelIndex].left,
                  transform: "translateX(-50%)",
                }}
                className="absolute"
              >
                {/* shadow layer */}
                <div
                  className={`${
                    levelState.container === containerIndex &&
                    levelState.level === levelIndex
                      ? "bg-[#231926]"
                      : "bg-[#4f4f4e]"
                  } absolute w-full h-[15px] bottom-[-10px] rounded-b-lg`}
                ></div>

                <div
                  style={{ padding: "35px" }}
                  className={`${
                    levelState.container === containerIndex &&
                    levelState.level === levelIndex
                      ? "border border-[#5D5D5D] rounded-[20px] border-[7px]"
                      : ""
                  } absolute w-fit h-fit top-[-20px] left-[-18px]`}
                ></div>

                {/* capsule */}
                <div
                  onClick={() =>
                    setLevelState({
                      container: containerIndex,
                      level: levelIndex,
                    })
                  }
                  style={{ padding: "0 20px" }}
                  className={`${
                    levelState.container === containerIndex &&
                    levelState.level === levelIndex
                      ? "bg-[#840B94] text-white"
                      : "bg-[#9E9E9E] text-black"
                  } relative z-10 w-fit h-[37.91px] cursor-pointer flex items-center justify-center rounded-lg font-bold px-5`}
                >
                  {label}
                </div>
              </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
