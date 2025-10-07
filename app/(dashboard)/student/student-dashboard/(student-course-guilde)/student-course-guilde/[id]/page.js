"use client";
import axios from "axios";
import { useParams, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import Capsels from "../components/Capsels";
import MissionVideo from "../components/MissionVideos";
import LevelQuiz from "../components/LevelQuiz";
import LearningOutcomes from "../components/LearningOutcomes";
import { StudentContext } from "@/app/(dashboard)/student/component/Context/StudentContext";
import { decodeCourseGuideId } from "@/lib/studentMissionUtils";

export default function Page() {
  // Get the encoded ID from URL params
  const { id: encodedId } = useParams();
  const searchParams = useSearchParams();
  const capsuleId = searchParams.get("capsuleId");

  const [levelId, setLevelId] = useState("");
  const { currentCapsule, setCurrentCapsule } = useContext(StudentContext);

  // Decode the level ID from the slug
  useEffect(() => {
    if (!encodedId) return;

    try {
      console.log("Original slug/ID:", encodedId);

      // Try to decode the ID
      const decodedId = decodeCourseGuideId(encodedId);

      console.log("Decoded ID:", decodedId);

      if (
        decodedId &&
        decodedId.length === 24 &&
        /^[0-9a-f]{24}$/.test(decodedId)
      ) {
        // Valid MongoDB ID
        console.log("Valid MongoDB ID detected:", decodedId);
        setLevelId(decodedId);
      } else if (encodedId.length === 24 && /^[0-9a-f]{24}$/.test(encodedId)) {
        // The encoded ID is already a valid MongoDB ID
        console.log("Original ID is a valid MongoDB ID:", encodedId);
        setLevelId(encodedId);
      } else {
        console.error("Could not extract a valid MongoDB ID from:", encodedId);
        // Try to find a MongoDB ID pattern in the string as fallback
        const match = encodedId.match(/[0-9a-f]{24}/);
        if (match) {
          const extractedId = match[0];
          console.log("Extracted possible MongoDB ID:", extractedId);
          setLevelId(extractedId);
        } else {
          // Last resort: use the raw encoded ID and let the API handle it
          console.log("Using raw ID as fallback:", encodedId);
          setLevelId(encodedId);
        }
      }
    } catch (error) {
      console.error("Error processing level ID:", error);
      // Fallback to using the raw ID
      setLevelId(encodedId);
    }
  }, [encodedId]);

  console.log("Current capsule data:", currentCapsule);

  useEffect(() => {
    if (!levelId) {
      console.warn("No level ID available yet, skipping data fetch");
      return;
    }
    console.log("Fetching mission data for level ID:", levelId);
    // Log the ID to make sure it's in the correct format
    console.log("Level ID format check:", {
      id: levelId,
      length: levelId.length,
      isValidMongoId: /^[0-9a-f]{24}$/.test(levelId),
    });

    const fetchMissionData = async () => {
      const token = localStorage.getItem("login-accessToken");

      if (!token) {
        console.error("No authentication token found");
        return;
      }

      try {
        console.log(
          `Making API request to /api/mission-capsule/level/${levelId}`
        );
        const response = await axios.get(
          `https://themutantschool-backend.onrender.com/api/mission-capsule/level/${levelId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            timeout: 15000, // 15 second timeout
          }
        );

        const allCapsels = response.data.data;
        setCurrentCapsule(allCapsels.capsules);

        console.log("Capsels", allCapsels.capsules);
      } catch (error) {
        console.log("Error fetching mission capsules:");
        console.log("Error details:", error.response?.data || error.message);

        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error("Error status:", error.response.status);
          console.error("Error data:", error.response.data);

          if (error.response.status === 401) {
            console.error("Authentication error - token may be invalid");
          } else if (error.response.status === 500) {
            console.error("Server error - check level ID format");
          }
        } else if (error.request) {
          // The request was made but no response was received
          console.error("No response received:", error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error setting up request:", error.message);
        }
      } finally {
        //   setLoading(false);
      }
    };

    fetchMissionData();
  }, [levelId, setCurrentCapsule]);

  //  if (loading) return <div className="p-4">Loading mission...</div>;
  return (
    <div className="space-y-6">
      <Capsels id={levelId} capsuleId={capsuleId} />
    </div>
  );
}
