"use client";
import { useContext, useState } from "react";
import MissionDetails from "./_components/MissionDetails";
import AddLevels from "./_components/AddLevels";
import PreviewandLaunch from "./_components/PreviewandLaunch";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Link from "next/link";
import { FaLessThan } from "react-icons/fa";
import { InstructorContext } from "../../_components/context/InstructorContex";
import { HiArrowNarrowLeft } from "react-icons/hi";


export default function Createnewmission() {
  const { activeTab, setActiveTab, quiztitle, Level, setLevel } =
    useContext(InstructorContext);


    const handleActionClick = (actionText) => {
  setbuttonAction(actionText);
  
  // Call specific functions based on action
  switch (actionText) {
    case "Edit":
      handleEditMission(); // or handleEditLevel(item) if editing a level
      break;
    case "Delete":
      setShowDeleteModal(true); // or handleDeleteLevel(levelId) if deleting a level
      break;
    case "Publish":
      handlePublishMission(); // Add your publish function
      break;
    default:
      break;
  }
};

  
 


  const [buttonAction, setbuttonAction] = useState("Publish");
  const actions = [
    { text: "Delete", icon: <FiTrash2 /> },
    { text: "Edit", icon: <FiEdit /> },
    { text: "Publish", icon: null },
  ];

 const editMission =async ()=> {

try {
  const storedMissionId = localStorage.getItem("missionId");
  const accessToken = localStorage.getItem("login-accessToken");

  if (!storedMissionId || !accessToken) {
    console.log("Missing missionId or accessToken in localStorage");
    return;
  }

 

  const response = await axios.put(
    `https://themutantschool-backend.onrender.com/api/mission/${storedMissionId}`,
    updatedMissionData,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  console.log("Mission updated successfully:", response.data);



  
} catch (error) {
  console.error("Error editing mission:", error);
  
}


 }


   

  return (
    <div className="flex  flex-col gap-3 ">
      <div className="w-full h-fit flex flex-col sm:flex-row sm:items-center sm:gap-5 sm:justify-between ">
        <div>
          {activeTab === "Add Levels" ? (
            <>
              {Level === "AddQuize" ? (
                <div className="flex items-center gap-1 text-[25px]">
                  <Link href="/instructor/myMissions/createnewmission">
                    <span
                      onClick={() => setLevel("AddLevel")}
                      className="cursor-pointer"
                    >
                      <HiArrowNarrowLeft />
                    </span>
                  </Link>
                  <p style={{marginTop:'10px'}} className="font-[600] text-[33px] leading-[40px] ">
                    Final Quiz: {quiztitle}
                  </p>
                </div>
              ) : (
                <p className="font-[600] text-[#BDE75D] text-[18px] sm:text-[42px] leading-[150%] sm:leading-[40px]">
                  Mission Levels
                </p>
              )}
            </>
          ) : activeTab === "Preview and Launch" ? (
            <p className=" font-[600] text-[20px] sm:text-[25px] xl:text-[42px] flex items-center gap-1 leading-[40px] text-white ">
              <Link href="/instructor/myMissions/createnewmission">
                <span
                  className="cursor-pointer"
                  onClick={() => setActiveTab("Add Levels")}
                >
                  <FaLessThan />
                </span>
              </Link>
              {`Mission Preview`}
            </p>
          ) : (
            <p className="font-[600]  text-[#BDE75D] text-[18px] sm:text-[42px] leading-[150%] sm:leading-[40px]">
              Create New Mission
            </p>
          )}
        </div>

        <div>
          {activeTab === "Preview and Launch" ? (
            <div className="hidden  sm:flex gap-3 mt-4">
              {actions.map((el, idx) => (
                <button
                  style={{ padding: "15px" }}
                  onClick={() => setbuttonAction(el.text)}
                  key={idx}
                  className={`flex items-center gap-2 px-4 py-2 rounded-[10px] text-white font-[600] ${
                    buttonAction == el.text ? "bg-[#604196]" : "bg-[#292929]"
                  }`}
                >
                  {el.icon}
                  {el.text}
                </button>
              ))}
            </div>
          ) : (
            <Link href={`/instructor/myMissions/`}>
              <button
                style={{ padding: "15px" }}
                className="hidden sm:block  bg-[var(--purpel-btncolor)] rounded-[10px] "
              >
                Preview Mission
              </button>
            </Link>
          )}
        </div>
      </div>

      {activeTab == "Preview and Launch" ? (
        <p className="text-[#616161] font-[600] text-[13px] leading-[40px] ">
          Review your mission before publishing
        </p>
      ) : (
        <div>
          <div>
            <ul className="flex items-center gap-3">
              {[
                { text: "Mission Details", level: "1" },
                { text: "Add Levels", level: "2" },
                { text: "Preview and Launch", level: "3" },
              ].map((tab) => (
                <li
                  key={tab.level}
                  onClick={() => setActiveTab(tab.text)}
                  className={`cursor-pointer px-4 text-[10px] flex items-center gap-1 sm:text-[15px] py-2 font-semibold relative
                     ${
                       activeTab === tab.text
                         ? "text-[#BDE75D] "
                         : "text-[#6D6D6D]"
                     }
                             hover:text-[#BDE75D] transition-colors duration-200`}
                >
                  <span
                    className={`${
                      activeTab === tab.text
                        ? "text-[var(--background)] bg-[#BDE75D] "
                        : "text-[var(--background)] bg-[#6D6D6D]"
                    }   h-[20px] w-[20px]  flexcenter text-[10px] font-[600] rounded-full`}
                  >
                    {tab.level}
                  </span>
                  {tab.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div>
        {activeTab === "Mission Details" && (
          <div>
            <MissionDetails />
          </div>
        )}
        {activeTab === "Add Levels" && (
          <div>
            <AddLevels />
          </div>
        )}
        {activeTab === "Preview and Launch" && (
          <div>
            <PreviewandLaunch />
          </div>
        )}
      </div>
    </div>
  );
}
