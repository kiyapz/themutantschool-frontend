"use client";
import Image from "next/image";
import Changebtn from "./btn/Changebtn";

export default function LevelChallange() {
  return (
    <div
      style={{ padding: "20px 0" }}
      className="w-full h-full justify-between flex flex-col items-center"
    >
      <div>
        <div
          // style={{ padding: " 0 20px" }}
          className="flex items-center h-[10vh] justify-between w-full"
        >
          <div className="Xirod flex items-center gap-1 font-[400] xl:text-[18px] leading-[20px] ">
            <span>
              <Image
                src={"/images/students-images/Layer 2 (1).png"}
                width={25.76}
                height={32.24}
                alt="mutantrobot"
              />
            </span>
            <span>05</span>
          </div>
          <div className="Xirod font-[400] flex items-center gap-1 xl:text-[18px] leading-[20px] ">
            <span>
              <Image
                src={"/images/students-images/Group (17).png"}
                width={25.76}
                height={32.24}
                alt="mutantrobot"
              />
            </span>
            15xp
          </div>
          <div className="Xirod font-[400] flex items-center gap-1 xl:text-[18px] leading-[20px] ">
            <span>
              <Image
                src={"/images/students-images/Layer 3.png"}
                width={25.76}
                height={32.24}
                alt="mutantrobot"
              />
            </span>
            5
          </div>
        </div>

        <div className="flex flex-col gap-10">
          <div>
            <div>
              <Image
                src={"/images/students-images/Layer 2.png"}
                width={224.59}
                height={274.17}
                alt="mutant-robot"
              />
            </div>
            <p className="text-center Xirod text-[#FDDD3F] font-[500] text-[19px] leading-[40px]  ">
              Newbie
            </p>
          </div>

          <div className="w-full max-w-[363px]">
            <div className="w-full flex items-center justify-between">
              <p className="text-[#BF8BDB] font-[400] text-[14px] leading-[40px] ">
                XP Progress
              </p>
              <p className="text-[#505BAA] font-[800] text-[14px] leading-[40px]  ">
                15/100
              </p>
            </div>
            <div className="w-full h-[15px] bg-[#3b435c] rounded-[10px] z-20 relative ">
              <div className="w-[35px] h-[15px] rounded-full relative z-30 bg-[#2b70bb]  "></div>
            </div>
            <p className="text-center font-[400] text-[14px] text-[#957AA3] leading-[40px] ">
              85 XP to next level
            </p>
          </div>

          <Changebtn
            sm="sm:text-[7px]   xl:text-[10px]"
            text={"VIEW ACHIEVEMNETS"}
          />
        </div>
      </div>

      <div className="max-w-[296.89px]">
        <p className="font-[800] xl:text-[24px] text-center leading-[60px] text-[#EBB607] ">
          Unlock Hall of Mutants
        </p>
        <p className="font-[300] xl:text-[23px] leading-[30px] text-center ">
          Complete 2 missions to join the leaderboard
        </p>
      </div>
    </div>
  );
}
