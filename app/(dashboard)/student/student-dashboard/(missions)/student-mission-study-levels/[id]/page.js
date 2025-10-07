"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import LevelsPath from "@/app/(dashboard)/student/component/LevelsPath";
import LoadingSpinner from "@/components/LoadingSpinner";
import { decodeStudentMissionId } from "@/lib/studentMissionUtils";

export default function MissionPage() {
  const { id: encodedId } = useParams();
  const [missionId, setMissionId] = useState("");
  const [mission, setMission] = useState([]);
  const [missionData, setMissionData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Decode the mission ID from the slug
  useEffect(() => {
    if (!encodedId) return;

    try {
      console.log("Original slug/ID:", encodedId);

      // Try to decode the ID
      const decodedId = decodeStudentMissionId(encodedId);

      console.log("Decoded ID:", decodedId);

      if (
        decodedId &&
        decodedId.length === 24 &&
        /^[0-9a-f]{24}$/.test(decodedId)
      ) {
        // Valid MongoDB ID
        console.log("Valid MongoDB ID detected:", decodedId);
        setMissionId(decodedId);
        localStorage.setItem("currentMissionId", decodedId);
      } else if (encodedId.length === 24 && /^[0-9a-f]{24}$/.test(encodedId)) {
        // The encoded ID is already a valid MongoDB ID
        console.log("Original ID is a valid MongoDB ID:", encodedId);
        setMissionId(encodedId);
        localStorage.setItem("currentMissionId", encodedId);
      } else {
        console.error("Could not extract a valid MongoDB ID from:", encodedId);
        // Try to find a MongoDB ID pattern in the string as fallback
        const match = encodedId.match(/[0-9a-f]{24}/);
        if (match) {
          const extractedId = match[0];
          console.log("Extracted possible MongoDB ID:", extractedId);
          setMissionId(extractedId);
          localStorage.setItem("currentMissionId", extractedId);
        } else {
          // Last resort: use the raw encoded ID and let the API handle it
          console.log("Using raw ID as fallback:", encodedId);
          setMissionId(encodedId);
          localStorage.setItem("currentMissionId", encodedId);
        }
      }
    } catch (error) {
      console.error("Error processing mission ID:", error);
      // Fallback to using the raw ID
      setMissionId(encodedId);
      localStorage.setItem("currentMissionId", encodedId);
    }
  }, [encodedId]);

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
