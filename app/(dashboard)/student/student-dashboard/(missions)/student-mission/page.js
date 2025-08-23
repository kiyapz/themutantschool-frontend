"use client";
import axios from "axios";
import MissionCard from "./components/MissionCard";
import { useEffect, useState } from "react";

export default function Page() {
  const [missionPurchases, setMissionPurchases] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ loading state

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
  }, []);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          {/* ✅ Replace this with your spinner component if you have one */}
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
        </div>
      ) : missionPurchases.length === 0 ? (
        <p>No Available Mission</p>
      ) : (
        <div className="flex flex-col gap-5">
          {missionPurchases.map((item) => (
            <MissionCard
              key={item.missionId}
              missionId={item.missionId}
              image={item.thumbnail.url}
              text1={item.missionTitle}
              text2={item.progress.length}
              text3={item.progressPercentage}
              bg={item.bg}
            />
          ))}
        </div>
      )}
    </>
  );
}
