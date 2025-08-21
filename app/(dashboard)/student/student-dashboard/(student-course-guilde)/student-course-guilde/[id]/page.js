'use client';
import axios from 'axios';
import { useParams } from "next/navigation";
import { useEffect } from "react";
import Capsels from '../components/Capsels';
import MissionVideo from '../components/MissionVideos';
import LevelQuiz from '../components/LevelQuiz';

export default function page(params) {
      const { id: id} = useParams();

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

          const allMissions = response.data.data;

          localStorage.setItem(
            "missionsCapsels",
            JSON.stringify(allMissions.capsules)
          );
          console.log("Fetched Capsels nnnnnnnnnn", response.data.data);
        } catch (error) {
          console.log(
            "Error fetching missions:",
            error.response?.data || error.message
          );
        } finally {
        //   setLoading(false);
        }
      };

      fetchMissionData();
    }, [id]);

    //  if (loading) return <div className="p-4">Loading mission...</div>;
    return (
      <div>
        <Capsels id={id} />
        
      </div>
    );
}