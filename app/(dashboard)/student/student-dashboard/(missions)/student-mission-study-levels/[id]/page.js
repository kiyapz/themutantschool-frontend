"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import LevelsPath from "@/app/(dashboard)/student/component/LevelsPath";

export default function MissionPage() {
  const { id: missionId } = useParams();
  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!missionId) return;

//     const fetchMissionData = async () => {
//       const token = localStorage.getItem("login-accessToken");

//       try {
//         const response = await axios.get(
//           `https://themutantschool-backend.onrender.com/api/student/breakdown`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         const allMissions = response.data.data;

      
        

//         const matchedMission = allMissions.find(
//           (mission) => mission.missionId === missionId

          
          
//         );

//         console.log("Matched Mission:", matchedMission);

//         setMission(matchedMission || null);
//       } catch (error) {
//         console.error(
//           "Error fetching missions:",
//           error.response?.data || error.message
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMissionData();
//   }, [missionId]);
useEffect(() => {
  if (!missionId) return;
localStorage.setItem("currentMissionId", missionId);
  const fetchMissionData = async () => {
    const token = localStorage.getItem("login-accessToken");

    try {
      const response = await axios.get(
        `https://themutantschool-backend.onrender.com/api/mission-level/mission/${missionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const allMissions = response.data.data;

      console.log("Fetched Mission Data everything:----------", response.data.data);

    //   const matchedMission = allMissions.find(
    //     (mission) => mission.mission === missionId
    //   );

    //   console.log("Matched Mission:", matchedMission);

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


  if (loading) return <div className="p-4">Loading mission...</div>;

  return (
    <div className="flex flex-col gap-[100px]">
      <div className="w-full flexcenter h-fit">
        <LevelsPath level={mission} />
      </div>
    </div>
  );
}
