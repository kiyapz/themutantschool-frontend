"use client";
import Image from "next/image";
import Sidebtn from "./btn/Sidebtn";
import { useContext } from "react";
import { StudentContext } from "./Context/StudentContext";
import {
  AiOutlineHome,
  AiOutlineFlag,
  AiOutlineHistory,
  AiOutlineUser,
  AiOutlineTrophy,
  AiOutlineSetting,
} from "react-icons/ai";

export default function Sidebar() {
  const { menuOpen, setMenuOpen } = useContext(StudentContext);
  return (
    <div
      style={{ paddingLeft: "20px" }}
      className="w-full flex flex-col justify-between   h-full "
    >
      <div className="flexcenter flex-col">
        <div style={{ marginTop: "20px" }} className="h-[10vh]   ">
          <p
            className="font-[400] Xirod text-[29px] leading-[40px] text-center"
            style={{ color: "var(--mutant-color)" }}
          >
            Mutant
          </p>
        </div>

        <div className="flex flex-col   gap-5">
          <Sidebtn
            link={"/student/student-dashboard"}
            text={"Home"}
            icon={AiOutlineHome}
          />
          <Sidebtn
            link={"/student/student-dashboard/student-mission"}
            text={"My Missions"}
            icon={AiOutlineFlag}
          />

          <Sidebtn
            link={"/student/student-dashboard/mutation-history"}
            text={"Mutation History"}
            icon={AiOutlineHistory}
          />
          <Sidebtn
            link={"/student/student-dashboard/student-profile"}
            text={"Mutation Profile"}
            icon={AiOutlineUser}
          />
          <Sidebtn
            link={"/student/student-dashboard/student-achievements"}
            text={"Achievements"}
            icon={AiOutlineTrophy}
          />
          <Sidebtn
            link={"/student/student-dashboard/mutation-student-setting"}
            text={"Settings"}
            icon={AiOutlineSetting}
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
