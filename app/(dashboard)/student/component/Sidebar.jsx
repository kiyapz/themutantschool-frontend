"use client";
import Image from "next/image";
import Sidebtn from "./btn/Sidebtn";
import { useContext } from "react";
import { StudentContext } from "./Context/StudentContext";

export default function Sidebar() {
  const { menuOpen, setMenuOpen } = useContext(StudentContext);
  return (
    <div
      style={{ paddingLeft: "20px" }}
      className="xl:w-[246.56px] flex flex-col justify-between     h-full "
    >
      <div>
        <div className="h-[10vh] w-full flexcenter ">
          <p className="text-[#7343B3] font-[400] Xirod text-[29px] leading-[40px] ">
            Mutant
          </p>
        </div>

        <div className="flex flex-col gap-5">
          <Sidebtn link={"/student/student-dashboard"} text={"Home"} />
          <Sidebtn
            link={"/student/student-dashboard/student-mission"}
            text={"My Missions"}
          />

          <Sidebtn
            link={"/student/student-dashboard/mutation-history"}
            text={"Mutation History"}
          />
          <Sidebtn
            link={"/student/student-dashboard/student-profile"}
            text={"Mutation Profile"}
          />
          <Sidebtn
            link={"/student/student-dashboard/student-achievements"}
            text={"Achievements"}
          />
          <Sidebtn
            link={"/student/student-dashboard/mutation-student-setting"}
            text={"Settings"}
          />
        </div>
      </div>
      <div>
        <Image
          src={"/images/students-images/readingrobot.png"}
          width={211.6}
          height={211.6}
          alt="mutantrobot"
        />
      </div>
    </div>
  );
}
