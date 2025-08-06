"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import MissionCourseOverview from "../_components/MissionCourseOverview";
import profilebase from "../../profile/_components/profilebase";


export default function Page() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [courses, setMission] = useState([]);

  // Fetch all missions
  useEffect(() => {
    const storedUser = localStorage.getItem("USER");
    if (!storedUser) return;
    const parsedUser = JSON.parse(storedUser);
    const userId = parsedUser._id;

    async function getAllMission() {
      try {
        const response = await profilebase.get(`instructor/report/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "login-accessToken"
            )}`,
          },
        });

        console.log("fetched mission response", response.data.missions);
        setMission(response.data.missions);
      } catch (error) {
        console.log("Error fetching missions:", error);
      }
    }

    getAllMission();
  }, []);

 
  useEffect(() => {
    if (courses.length && id) {
      const found = courses.find((c) => c._id === id);
      setCourse(found);
    }
  }, [courses, id]);

  if (!course) return <p className="text-white p-10">Loading course...</p>;

  return <MissionCourseOverview course={course} />;
}
