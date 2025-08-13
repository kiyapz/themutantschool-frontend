'use client'
import Link from "next/link";
import { StudentContext } from "../Context/StudentContext";
import { useContext } from "react";

export default function Sidebtn({text, link}) {
   const { menuOpen, setMenuOpen } = useContext(StudentContext);
    return (
      <Link href={`${link} `}>
        <div
          onClick={() => setMenuOpen(false)}
          className="flex items-center cursor-pointer gap-3"
        >
          <div className="h-[22.25px] w-[22.25px] bg-[#D9D9D9] "></div>
          <p className="text-[#9B9B9B] font-[500] text-[21px] leading-[40px] ">
            {text}
          </p>
        </div>
      </Link>
    );
}