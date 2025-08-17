import Image from "next/image";
import SidePanelLayout from "../../component/SidePanelLayout";
import Link from "next/link";
import MissionCard from "./student-mission/components/MissionCard";

export default function page() {
  return (
    <div className="flex flex-col justify-between h-full">
      <MissionCard
        image={
          "https://files.ably.io/ghost/prod/2023/12/choosing-the-best-javascript-frameworks-for-your-next-project.png"
        }
        text1={" Web Development Mastery"}
        text2={"5 Capsules • 1 Quiz"}
        text3={"1 / 5"}
      />

      <div className="w-full">
        <p className="text-[#909090] px font-[800] text-[27px] leading-[60px] ">
          Let’s Get You Started
        </p>
        <div className="flex flex-col padding-left gap-5">
          <div>
            <SidePanelLayout
              text1={"Create your mutant account"}
              text2={"Welcome to Mutant School!"}
              text3={"+15 XP"}
              style={
                "text-[#25AF35] font-[700] text-[20px] xl:text-[30px] leading-[60px] "
              }
            />
          </div>

          <div>
            <SidePanelLayout
              text1={"Complete your first mission"}
              text2={"Pick a beginner-friendly course to start for 20XP"}
              text3={"Start now"}
              style={
                "text-[#AF2BC6] font-[700] xl:text-[17px] leading-[30px] bg-[#1F0D1F] "
              }
            />
          </div>

          <div>
            <SidePanelLayout
              text1={"Complete your profile"}
              text2={"Finish your profile setup to get 5XP"}
              text3={"Start now"}
              style={
                "text-[#2B61C6] font-[700] xl:text-[17px] leading-[30px] bg-[#0D141F] "
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
