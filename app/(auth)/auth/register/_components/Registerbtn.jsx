"use client";

import { Globlaxcontex } from "@/context/Globlaxcontex";
import Image from "next/image";
import { useContext } from "react";

export default function Registerbtn({ type, text }) {
  const { setRegisterStep, handleContinue, disablebtn } =
    useContext(Globlaxcontex);

  return (
    <button
      onClick={handleContinue}
      disabled={disablebtn}
      type={type}
      className={`w-full h-[60.5px] sm:h-[57px] flex gap-2 items-center justify-center transition-all ease-in cursor-pointer rounded-[10px] text-[18px] font-[700] ${
        disablebtn ? "bg-[#404040]" : "btn"
      }`}
    >
      {text}
      <Image
        src="/images/Arrowright.png"
        alt="arrow-right"
        width={20}
        height={20}
        className="sm:hidden"
      />
    </button>
  );
}
