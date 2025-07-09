'use client'
import { useState } from "react";
import MissionDetails from "./_components/MissionDetails";
import AddLevels from "./_components/AddLevels";
import PreviewandLaunch from "./_components/PreviewandLaunch";
import { FiEdit, FiTrash2 } from "react-icons/fi";

export default function Createnewmission() {
     const [activeTab, setActiveTab] = useState("Mission Details");
     const [buttonAction,setbuttonAction] = useState('Publish')
       const actions = [
         { text: "Delete", icon: <FiTrash2 /> },
         { text: "Edit", icon: <FiEdit /> },
         { text: "Publish", icon: null },
       ];
    return (
        <div className="flex  flex-col gap-3 ">
            

<div className="w-full h-fit flex flex-col sm:flex-row items-center gap-5 justify-between ">

  <div>
            {activeTab === "Add Levels" ? (
  <p className="font-[600] text-[#BDE75D] text-[42px] leading-[40px]">Mission Levels</p>
) : activeTab === "Preview and Launch" ? (
  <p className="font-[600] text-[42px] leading-[40px] text-white "> {`< Mission Previewn`}</p>
) : (
  <p className="font-[600] text-[#BDE75D] text-[42px] leading-[40px]">Create New Mission</p>
)}

</div>


<div>
  {activeTab === "Preview and Launch" ?  <div className="flex gap-3 mt-4">
          {actions.map((el, idx) => (
            <button
            style={{padding:'15px'}}
            onClick={()=>setbuttonAction(el.text)}
              key={idx}
              className={`flex items-center gap-2 px-4 py-2 rounded-[10px] text-white font-medium ${
                buttonAction ==  el.text ? "bg-[#604196]" : "bg-[#292929]"
              }`}
            >
              {el.icon}
              {el.text}
            </button>
          ))}
        </div>   :<button style={{padding:'15px',}} className="bg-[var(--purpel-btncolor)] rounded-[10px] ">Preview Mission</button>  }
</div>

</div>


{activeTab == "Preview and Launch"  ? <p className="text-[#616161] font-[600] text-[13px] leading-[40px] ">Review your mission before publishing</p> :  <div>

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

</div>  }

            
       



            <div>

            {activeTab === "Mission Details" && <div><MissionDetails /></div>  }
            {activeTab === "Add Levels" && <div><AddLevels /></div>  }
            {activeTab === "Preview and Launch" && <div><PreviewandLaunch /></div>  }

            </div>
        </div>
    )
}