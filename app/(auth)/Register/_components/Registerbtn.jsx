'use client'

import { Globlaxcontex } from "@/context/Globlaxcontex";
import { useContext } from "react";

export default function Registerbtn({type,text}) {
    const { setRegisterStep ,handleContinue,disablebtn,} = useContext(Globlaxcontex);
    
    return (
        <button onClick={handleContinue} disabled={disablebtn} type={type}  className={`w-full h-[57px]  transition-all ease-in  cursor-pointer rounded-[10px] text-[18px] font-[700] leading-[57px] ${disablebtn ? 'bg-[#404040]' : "btn "} `}>
            {text}
        </button>
    );
}



