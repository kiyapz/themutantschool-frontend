"use client";
import axios from "axios";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import Capsels from "../components/Capsels";
import MissionVideo from "../components/MissionVideos";
import LevelQuiz from "../components/LevelQuiz";
import { StudentContext } from "@/app/(dashboard)/student/component/Context/StudentContext";

export default function Page() {
  // this is the current level id
  const { id: id } = useParams();
  console.log("Current Level ID:", id);
  // const [] = useState([]);
  const { currentCapsule, setCurrentCapsule } = useContext(StudentContext);

  console.log(currentCapsule, "currentCapsulellllllllllllllllllllllllll");
  useEffect(() => {
    if (!id) return;
    const fetchMissionData = async () => {
      const token = localStorage.getItem("login-accessToken");

      try {
        const response = await axios.get(
          `https://themutantschool-backend.onrender.com/api/mission-capsule/level/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const allCapsels = response.data.data;
        setCurrentCapsule(allCapsels.capsules);

        console.log("Capsels", allCapsels.capsules);
      } catch (error) {
        console.log("Error fetching missions capsels nnnnnnnnnnnnnnnn:");
        console.log(
          "Error fetching missions nnnnnnnnnnnnnnnn:",
          error.response?.data || error.message
        );
      } finally {
        //   setLoading(false);
      }
    };

    fetchMissionData();
  }, [id, setCurrentCapsule]);

  //  if (loading) return <div className="p-4">Loading mission...</div>;
  return (
    <div>
      <Capsels id={id} />
    </div>
  );
}
