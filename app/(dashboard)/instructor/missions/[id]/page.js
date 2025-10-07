"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import MissionCourseOverview from "../_components/MissionCourseOverview";
import profilebase from "../../profile/_components/profilebase";
import { decodeInstructorId } from "@/lib/instructorIdUtils";

export default function Page() {
  const { id: encodedId } = useParams();
  const [decodedId, setDecodedId] = useState(null);
  const [course, setCourse] = useState(null);
  const [courses, setMission] = useState([]);

  // Decode the ID when the component mounts
  useEffect(() => {
    try {
      // First try to decode it as an encoded ID
      const decoded = decodeInstructorId(encodedId);
      console.log("Decoded ID:", decoded);
      setDecodedId(decoded);
    } catch (error) {
      // If decoding fails, assume it's already a raw ID
      console.error("Error decoding ID:", error);
      setDecodedId(encodedId);
    }
  }, [encodedId]);

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
    if (courses.length && decodedId) {
      const found = courses.find((c) => c._id === decodedId);
      setCourse(found);
    }
  }, [courses, decodedId]);

  if (!course) return <p className="text-white p-10">Loading course...</p>;

  return <MissionCourseOverview course={course} />;
}
