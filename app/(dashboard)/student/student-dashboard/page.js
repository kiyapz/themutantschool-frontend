import Image from "next/image";
import SidePanelLayout from "../component/SidePanelLayout";
import Link from "next/link";

export default function page() {
  return (
    <div className="flex flex-col justify-between h-full">
      <div
        style={{ padding: "30px" }}
        className="h-fit sm:h-[362.25px] w-full grid gap-5 sm:grid-cols-2 "
      >
        <div className="flex flex-col gap-5 sm:gap-0 justify-between order-2 sm:order-1">
          <div>
            <p className="font-[800] text-[21px] sm:text-[38px] leading-[39px] ">
              Web Development Mastery
            </p>
            <p className="font-[500] text-[15px] sm:text-[23px] leading-[20px] ">
              5 Levels
            </p>
          </div>

          <div className="w-full grid grid-cols-3  items-center">
            <span className="w-full  ">
              <p className="w-[50%] bg-[#F9D336] rounded-[5px] h-[5px]"></p>
            </span>
            <span className="text-[#AFAFAF] font-[700]  text-[11px] leading-[20px] ">
              1 / 5
            </span>
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
            <Link href="/student/student-dashboard/student-mission-study-levels">
              <button className=" w-full  sm:w-[234.64px] h-[56.4px] cursor-pointer studentbtn2 rounded-[30px] ">
                Continue Mission
              </button>
            </Link>
          </div>
        </div>

        <div
          style={{
            backgroundImage: `url("/images/students-images/Group (15).png")`,
          }}
          className="  bg-center bg-cover h-[20vh] order-1 w-full sm:h-full"
        ></div>
      </div>

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
