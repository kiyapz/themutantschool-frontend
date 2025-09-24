"use client";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { InstructorContext } from "../../../_components/context/InstructorContex";
import UserProfileImage from "../../../profile/_components/UserProfileImage";

export default function PreviewandLaunch() {
 
  const { userUpdatedValue, setActiveTab } = useContext(InstructorContext);
  const [activeTab, setActiveTabs] = useState("Mission Overview");
  const [levels, setLevels] = useState([]);
  const [missionById,setmissionById] = useState([])
  console.log("Thumbnail URL:", missionById?.thumbnail?.url);


  const router = useRouter();

  const getMissionByID = async () => {
    console.log("Fetching mission by ID...");

    try {
      const storedMissionId = localStorage.getItem("missionId");


      if (!storedMissionId) {
        console.log("No missionId found in localStorage");
     
        router.push("/instructor/missions/createnewmission");
        return;
      }

      const accessToken = localStorage.getItem("login-accessToken");

      if (!storedMissionId || !accessToken) {
        console.log("Missing missionId or accessToken in localStorage");
        return;
      }

      const response = await axios.get(
        `https://themutantschool-backend.onrender.com/api/mission/${storedMissionId}`,

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log("new mission by Mission updated successfully:", response.data.data);
      
      setmissionById(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMissionByID();
  }, []);

   useEffect(() => {
     const missionId = localStorage.getItem("missionId");

     if (!missionId) {
       alert("No mission ID found. Redirecting to create new mission.");
       setActiveTab("Mission Details");

       router.push("/instructor/missions/createnewmission");
       return;
     }
   }, []);

  useEffect(() => {
    const fetchMissionLevels = async () => {
      const storedMissionId = localStorage.getItem("missionId");
      const accessToken = localStorage.getItem("login-accessToken");

      if (!storedMissionId || !accessToken) {
        console.log("Missing missionId or accessToken in localStorage");
        return;
      }

      console.log("Stored Mission ID:", storedMissionId);

      try {
        const res = await axios.get(
          `https://themutantschool-backend.onrender.com/api/mission-level/mission/${storedMissionId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log("Mission by id data retrieved successfully:", res.data.data);
        setLevels(res.data.data);
      } catch (error) {
        console.log("Error retrieving mission data:", error);
      }
    };

    fetchMissionLevels();
  }, []);

  const renderTabContent = () => {
    if (activeTab === "Mission Overview") {
      return (
        <div style={{ padding: "10px" }} className="flex flex-col gap-5">
          <p className="text-[#BFBFBF] font-[400] text-[14px] leading-[20px] ">
            {missionById.description}
          </p>

          <p className="text-[#BFBFBF] font-[400] text-[14px] leading-[20px] ">
            What you'll Learn:
          </p>
          <ul
            style={{ paddingLeft: "8px" }}
            className="text-[#BFBFBF] list-disc font-[400] flex flex-col gap-1 text-[14px] leading-[20px] "
          >
            <li>HTML fundamentals and semantic markup</li>
            <li>CSS styling, layouts, and responsive design</li>
            <li>JavaScript programming and DOM manipulation</li>
            <li>Modern web development best practices</li>
          </ul>

          <p className="text-[#BFBFBF] font-[400] text-[14px] leading-[20px] ">
            Your journey to becoming a web sorcerer starts here!
          </p>
        </div>
      );
    } else if (activeTab === "Missions Levels") {
      return (
        <div className="flex flex-col gap-5">
          {levels.map((level, index) => (
            <Link
              href={`/instructor/missions/createnewmission/missionlevels/${level._id}`}
              key={level._id}
            >
              <div
                style={{ padding: "20px" }}
                key={index}
                className={`rounded-[12px] px-4 py-5 ${
                  level.locked ? "bg-[#1D1D1D]" : "bg-[#232D3A]"
                } text-white flex flex-col gap-3`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-8 rounded-full bg-[#BDE75D] text-black flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-[600] text-[16px]">{level?.title}</p>
                      <p className="text-[13px] text-gray-400">
                        {level.estimatedTime} •{" "}
                        {Array.isArray(level?.capsules)
                          ? level.capsules.length
                          : 0}{" "}
                        Power Capsules
                      </p>
                    </div>
                  </div>

                  <div>
                    {level?.locked ? (
                      <span className="text-gray-400 text-lg">🔒</span>
                    ) : (
                      <span className="text-gray-400 text-lg">›</span>
                    )}
                  </div>
                </div>

                <p className="text-sm text-gray-300">{level.summary}</p>

                <div className="flex gap-6 text-xs text-gray-400 mt-2">
                  <p>
                    📦{" "}
                    {Array.isArray(level?.capsules) ? level.capsules.length : 0}{" "}
                    Capsules
                  </p>
                  <p>
                    ❓{" "}
                    {Array.isArray(level?.quiz?.questions)
                      ? level.quiz.questions.length
                      : 0}{" "}
                    Quiz Questions
                  </p>
                  <p>🎥 {level?.estimatedTime}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      );
    }
  };

  const tabs = ["Mission Overview", "Missions Levels"];

  return (
    <div className="w-full h-full p-5">
      <div
        style={{
          backgroundImage: `url(${missionById?.thumbnail?.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
         
        }}
        className="h-[343.54px] bg-cover bg-center w-full bg-[var(--purpel-btncolor)] rounded-[15px] mb-8"
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div
          style={{ padding: "30px" }}
          className="xl:col-span-2 flex flex-col gap-4"
        >
          {/* Tabs */}
          <div className="flex gap-2 border-b border-[#333] pb-2">
            {tabs.map((tab) => (
              <button
                style={{ padding: "15px" }}
                key={tab}
                onClick={() => setActiveTabs(tab)}
                className={`text-sm sm:text-base font-medium pb-1 ${
                  activeTab === tab
                    ? "border-b-2 border-[#BDE75D] text-[10px] sm:text-[17px] text-[#BDE75D]"
                    : "text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div style={{ padding: "10px" }} className="pt-4">
            {renderTabContent()}
          </div>
        </div>

        <div
          style={{ padding: "15px" }}
          className="bg-[var(--black-bg)] rounded-[12px] p-5"
        >
          <p
            style={{ marginBottom: "20px" }}
            className="text-[24px] font-[600] text-[var(--sidebar-hovercolor)] mb-4"
          >
            Mission {userUpdatedValue.role}
          </p>

          <div
            style={{ marginBottom: "10px" }}
            className="flex items-center gap-4 mb-3"
          >
            <div className="h-[40px] border border-[var(--sidebar-hovercolor)] w-[40px] rounded-full bg-gray-500">
              <UserProfileImage />
            </div>
            <div>
              <p className="font-medium">
                {" "}
                {userUpdatedValue.firstName}
                <span>{userUpdatedValue.lastName}</span>
              </p>
              <p className="text-sm text-gray-400">
                {" "}
                {userUpdatedValue.Headline}
              </p>
            </div>
          </div>

          <p
            style={{ marginBottom: "10px" }}
            className="text-sm text-gray-300 mb-4 leading-[22px]"
          >
            {userUpdatedValue.bio}
          </p>

          <div className="flex items-center justify-between">
            <p className="font-medium text-sm text-white">Rating:</p>
            <p className="text-[var(--sidebar-hovercolor)] font-bold text-sm">
              4.5
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
