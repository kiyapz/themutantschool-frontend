"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import LevelsPath from "@/app/(dashboard)/student/component/LevelsPath";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function MissionPage() {
  const { id: slug } = useParams();
  const [missionId, setMissionId] = useState("");
  const [mission, setMission] = useState([]);
  const [missionData, setMissionData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get mission ID from localStorage
  useEffect(() => {
    const storedMissionId =
      localStorage.getItem("studyMissionId") ||
      localStorage.getItem("currentMissionId");

    if (storedMissionId) {
      console.log(
        "Study Mission - Mission ID from localStorage:",
        storedMissionId
      );
      setMissionId(storedMissionId);
      localStorage.setItem("currentMissionId", storedMissionId);
    } else {
      console.error("No mission ID found in localStorage");
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (!missionId) return;
    const fetchMissionData = async () => {
      const token = localStorage.getItem("login-accessToken");

      try {
        const response = await axios.get(
          `https://themutantschool-backend.onrender.com/api/mission/${missionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const allMissions = response.data.data.levels;
        console.log(
          "Fetched Mission Data everything:----------",
          response.data.data
        );

        // Save full mission data including title
        setMissionData(response.data.data);
        setMission(allMissions);
      } catch (error) {
        console.log(
          "Error fetching missions:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMissionData();
  }, [missionId]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <LoadingSpinner size="large" color="mutant" />
      </div>
    );

  return (
    <div className="flex flex-col gap-[50px]">
      <div className="w-full flexcenter h-fit">
        <LevelsPath
          level={mission}
          missionTitle={missionData?.title || "Mission"}
          missionData={missionData}
        />
      </div>
    </div>
  );
}
