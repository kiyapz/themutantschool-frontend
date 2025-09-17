"use client";
import axios from "axios";
import MissionCard from "./components/MissionCard";
import { useEffect, useState } from "react";
import Link from "next/link";

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

export default function Page() {
  const [missionPurchases, setMissionPurchases] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ loading state

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
        <div className="flex items-center justify-center py-8">
          <div className="text-center" style={{ color: "var(--text)" }}>
            <div
              className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-2"
              style={{ borderColor: "var(--success)" }}
            ></div>
            Loading mission...
          </div>
        </div>
      ) : missionPurchases.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="text-lg mb-2" style={{ color: "var(--text)" }}>
              No recent mission recorded.
            </div>
            <Link
              href="/missions"
              className="underline transition-colors"
              style={{
                color: "var(--primary)",
              }}
              onMouseEnter={(e) =>
                (e.target.style.color = "var(--primary-light)")
              }
              onMouseLeave={(e) => (e.target.style.color = "var(--primary)")}
            >
              Buy a mission now
            </Link>
          </div>
        </div>
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
