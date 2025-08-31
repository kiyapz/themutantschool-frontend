"use client";
import Image from "next/image";
import SidePanelLayout from "../../component/SidePanelLayout";
import Link from "next/link";
import MissionCard from "./student-mission/components/MissionCard";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Page() {
  const [missionPurchases, setMissionPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  const missioncard = [
    {
      bg: "bg-gradient-to-r from-[#0E0E0E] to-[#0F060F]",
    },
    {
      bg: "bg-gradient-to-r from-[#231926] to-[#194034]",
    },
    {
      bg: "bg-gradient-to-r from-[#0E0E0E] to-[#0F060F]",
    },
    {
      bg: "bg-gradient-to-r from-[#231926] to-[#5D1D49]",
    },
  ];

  useEffect(() => {
    const fetchStudentBreakdown = async () => {
      try {
        const token = localStorage.getItem("login-accessToken");

        const response = await axios.get(
          "https://themutantschool-backend.onrender.com/api/student/breakdown",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const missionsWithBg = response.data.data.map((mission, index) => ({
          ...mission,
          bg: missioncard[index % missioncard.length].bg,
        }));

        setMissionPurchases(missionsWithBg);
        console.log("Mission Purchases:", missionsWithBg);
      } catch (error) {
        console.error(
          "Error fetching student breakdown:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStudentBreakdown();
  }, [missioncard]);

  // Get the mission at index 0
  const firstMission = missionPurchases[0];

  return (
    <div className="flex flex-col justify-between h-full">
      {/* Show loading state or the first mission */}
      {loading ? (
        <div className="text-center text-gray-500">Loading mission...</div>
      ) : firstMission ? (
        <MissionCard
          image={
            firstMission.thumbnail?.url ||
            "https://files.ably.io/ghost/prod/2023/12/choosing-the-best-javascript-frameworks-for-your-next-project.png"
          }
          text1={firstMission.missionTitle || "Web Development Mastery"}
          text2={`${firstMission.progress?.length || 0} Capsules • 1 Quiz`}
          text3={`${firstMission.progressPercentage || 0}%`}
          className={firstMission.bg}
          missionId={firstMission.missionId}
        />
      ) : (
        <div className="text-center text-gray-500">No missions available</div>
      )}

      <div className="w-full">
        <p className="text-[#909090] px font-[800] text-[27px] leading-[60px] ">
          Let's Get You Started
        </p>
        <div className="flex flex-col padding-left gap-5">
          <div>
            <SidePanelLayout
              text1={"Create your mutant account"}
              text2={"Welcome to Mutant School!"}
              text3={"+15 XP"}
              style={
                "text-[#25AF35] font-[700] text-[20px] xl:text-[30px] leading-[60px] "
              }
            />
          </div>

          <div>
            <SidePanelLayout
              text1={"Complete your first mission"}
              text2={"Pick a beginner-friendly course to start for 20XP"}
              text3={"Start now"}
              style={
                "text-[#AF2BC6] font-[700] xl:text-[17px] leading-[30px] bg-[#1F0D1F] "
              }
            />
          </div>

          <div>
            <SidePanelLayout
              text1={"Complete your profile"}
              text2={"Finish your profile setup to get 5XP"}
              text3={"Start now"}
              style={
                "text-[#2B61C6] font-[700] xl:text-[17px] leading-[30px] bg-[#0D141F] "
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
