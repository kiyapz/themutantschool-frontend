"use client";
import Link from "next/link";
import { StudentContext } from "../Context/StudentContext";
import { useContext } from "react";

export default function Sidebtn({ text, link, icon: Icon }) {
  const { menuOpen, setMenuOpen } = useContext(StudentContext);
  return (
    <Link href={`${link} `} className="">
      <div
        onClick={() => setMenuOpen(false)}
        className="flex items-center cursor-pointer gap-8 transition-colors duration-200"
        style={{
          color: "var(--sidebar-linkcolor)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "var(--sidebar-hovercolor)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "var(--sidebar-linkcolor)";
        }}
      >
        <div className="h-[22.25px] w-[22.25px] flexcenter">
          {Icon && <Icon size={18} className="text-current" />}
        </div>
        <p className=" font-[500] text-[21px] leading-[40px] ">{text}</p>
      </div>
    </Link>
  );
}
