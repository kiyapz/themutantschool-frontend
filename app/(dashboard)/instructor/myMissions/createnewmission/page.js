'use client'
import { useState } from "react";
import MissionDetails from "./_components/MissionDetails";
import AddLevels from "./_components/AddLevels";
import PreviewandLaunch from "./_components/PreviewandLaunch";

export default function Createnewmission() {
     const [activeTab, setActiveTab] = useState("Mission Details");
    return (
        <div className="flex  flex-col gap-3 ">
            

            {activeTab === "Add Levels" ? <p className="font-[600] text-[#BDE75D] text-[42px] leading-[40px] ">Mission Levels</p>  : <p className="font-[600] text-[42px] leading-[40px] ">Create New Mission</p> }

            <div>

            <div>
        <ul className="flex items-center gap-3">
          {[{text:"Mission Details",level:'1'}, {text:"Add Levels",level:'2'},{ text:"Preview and Launch",level:'3'}].map((tab) => (
            <li
              key={tab.level}
            
              onClick={() => setActiveTab(tab.text)}
              className={`cursor-pointer px-4 text-[12px] flex items-center gap-1 sm:text-[15px] py-2 font-semibold relative
                ${activeTab === tab.text ? "text-[#BDE75D] " : "text-[#6D6D6D]"}
                hover:text-[#BDE75D] transition-colors duration-200
              `}
            >
                <span className={`${activeTab === tab.text ? "text-[var(--background)] bg-[#BDE75D] " : "text-[var(--background)] bg-[#6D6D6D]"}   h-[20px] w-[20px]  flexcenter text-[10px] font-[600] rounded-full`}>{tab.level}</span>
              {tab.text}
              
            </li>
          ))}
        </ul>
      </div>

            </div>
       



            <div>

            {activeTab === "Mission Details" && <div><MissionDetails /></div>  }
            {activeTab === "Add Levels" && <div><AddLevels /></div>  }
            {activeTab === "Preview and Launch" && <div><PreviewandLaunch /></div>  }

            </div>
        </div>
    )
}