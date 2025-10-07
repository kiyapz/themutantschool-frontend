"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import LoadingSpinner from "@/components/LoadingSpinner";
import "./learning-outcomes.css";

export default function LearningOutcomes({ levelId }) {
  const [missionData, setMissionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!levelId) {
      console.warn("LearningOutcomes: No levelId provided");
      setError("No level ID provided");
      setLoading(false);
      return;
    }

    console.log("LearningOutcomes: Starting fetch with levelId:", levelId);

    const fetchMissionData = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("login-accessToken");
        if (!token) {
          setError("Authentication required");
          setLoading(false);
          return;
        }

        // Check if levelId looks like a mission ID instead of a level ID
        const isMissionId = /^[0-9a-f]{24}$/.test(levelId);
        if (isMissionId) {
          console.log(
            "LearningOutcomes: levelId looks like a mission ID, trying direct mission fetch"
          );
          try {
            // Try direct mission fetch first
            const directMissionResponse = await axios.get(
              `https://themutantschool-backend.onrender.com/api/mission/${levelId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                timeout: 10000,
              }
            );

            console.log(
              "Direct mission fetch response:",
              directMissionResponse.data
            );
            if (directMissionResponse.data?.data) {
              setMissionData(directMissionResponse.data.data);
              setLoading(false);
              return;
            }
          } catch (directError) {
            console.log(
              "Direct mission fetch failed, falling back to level fetch:",
              directError.message
            );
          }
        }

        // First, get the level data to find the mission ID
        const levelResponse = await axios.get(
          `https://themutantschool-backend.onrender.com/api/mission-capsule/level/${levelId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            timeout: 10000,
          }
        );

        console.log("Level API response:", levelResponse.data);
        const levelData = levelResponse.data.data;
        console.log("Level data structure:", levelData);

        // Check for mission ID in different possible locations in the API response
        let missionId;
        if (levelData?.mission && typeof levelData.mission === "string") {
          missionId = levelData.mission;
        } else if (levelData?.mission?._id) {
          missionId = levelData.mission._id;
        } else if (levelData?.missionId) {
          missionId = levelData.missionId;
        } else {
          // Try to get mission ID from localStorage as a fallback
          const currentMissionId = localStorage.getItem("currentMissionId");
          if (currentMissionId && /^[0-9a-f]{24}$/.test(currentMissionId)) {
            console.log(
              "Using mission ID from localStorage as fallback:",
              currentMissionId
            );
            missionId = currentMissionId;
          } else {
            console.error(
              "Could not find mission ID in level data:",
              levelData
            );
            setError("Could not find mission information in the level data");
            setLoading(false);
            return;
          }
        }

        console.log("Found mission ID:", missionId);

        // Now fetch the full mission data to get learning outcomes
        const missionResponse = await axios.get(
          `https://themutantschool-backend.onrender.com/api/mission/${missionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            timeout: 10000,
          }
        );

        console.log("Mission API response:", missionResponse.data);
        const missionData = missionResponse.data.data;
        console.log("Mission data structure:", missionData);

        if (!missionData) {
          console.error("Mission data is empty or undefined");
          setError("Failed to retrieve mission data");
          setLoading(false);
          return;
        }

        // Check if learning outcomes exist
        if (
          !missionData.learningOutcomes ||
          !Array.isArray(missionData.learningOutcomes)
        ) {
          console.log(
            "No learning outcomes found in mission data or not in expected format"
          );
        } else {
          console.log("Found learning outcomes:", missionData.learningOutcomes);
        }

        setMissionData(missionData);
      } catch (error) {
        console.error("Error fetching mission data:", error);
        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to load mission data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMissionData();
  }, [levelId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-6">
        <LoadingSpinner size="medium" color="mutant" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
        <div className="mt-2 text-sm">
          <p>Please check the browser console for more details.</p>
          <p className="mt-1">Level ID: {levelId || "Not provided"}</p>
        </div>
      </div>
    );
  }

  // Check if we have learning outcomes to display
  const learningOutcomes = missionData?.learningOutcomes || [];

  if (!missionData || learningOutcomes.length === 0) {
    return (
      <div className=" rounded-lg p-6 my-4">
        <h2 className="text-xl font-bold text-white mb-4">Learning Outcomes</h2>
        <p className="text-gray-300">
          No learning outcomes have been defined for this mission.
        </p>
        <div className="mt-4 text-xs text-gray-500">
          <p>Mission title: {missionData?.title || "Unknown"}</p>
          <p>Mission ID: {missionData?._id || "Unknown"}</p>
          <p>Level ID: {levelId || "Unknown"}</p>
        </div>
      </div>
    );
  }

  // Filter out duplicates and invalid entries
  const filteredOutcomes = Array.from(new Set(learningOutcomes))
    .filter(
      (outcome) =>
        outcome && typeof outcome === "string" && outcome.trim().length > 0
    )
    .filter(
      (outcome) =>
        !outcome.includes("youtube.com/shorts") &&
        !outcome.includes("youtube.com/shor")
    );

  return (
    <div className=" rounded-lg p-6 my-4">
      <h2 className="text-xl font-bold text-white mb-4">
        After successfully completing this module, you will be able to:
      </h2>

      {filteredOutcomes.length > 0 ? (
        <>
          <ul className="space-y-2 mb-2">
            {filteredOutcomes.slice(0, 5).map((outcome, index) => (
              <li key={index} className="flex items-start">
                <span className="text-white mr-2 flex-shrink-0">•</span>
                <span className="text-gray-200 break-words">{outcome}</span>
              </li>
            ))}
          </ul>

          {filteredOutcomes.length > 5 && (
            <div
              className="max-h-[200px] overflow-y-auto pr-2 custom-scrollbar mt-2"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#8B5CF6 #374151",
                WebkitOverflowScrolling: "touch",
              }}
            >
              <ul className="space-y-2">
                {filteredOutcomes.slice(5).map((outcome, index) => (
                  <li key={index + 5} className="flex items-start">
                    <span className="text-purple-500 mr-2 flex-shrink-0">
                      •
                    </span>
                    <span className="text-gray-200 break-words">{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <p className="text-gray-400">No valid learning outcomes found.</p>
      )}
    </div>
  );
}
