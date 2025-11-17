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

  // Fetch all missions with student stats
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

        const baseMissions = response.data.missions || [];
        const missionsWithStats = response.data.studentProgress?.missions || [];

        // Map missionId -> { totalStudents, students, engagementRate, avgScore }
        const statsMap = new Map();
        missionsWithStats.forEach((stat) => {
          statsMap.set(stat.missionId, {
            totalStudents: stat.totalStudents || 0,
            students: stat.students || [],
            engagementRate: stat.engagementRate || "0.0",
            avgScore: stat.avgScore || "0.0",
          });
        });

        // Merge stats into missions by _id
        const mergedMissions = baseMissions.map((mission) => {
          const stats = statsMap.get(mission._id) || {};
          return {
            ...mission,
            totalStudents: stats.totalStudents || 0,
            students: stats.students || [],
            engagementRate: stats.engagementRate,
            avgScore: stats.avgScore,
          };
        });

        setMission(mergedMissions);
      } catch (error) {
        console.log("Error fetching missions:", error);
      }
    }

    getAllMission();
  }, []);

  useEffect(() => {
    if (courses.length && decodedId) {
      const found = courses.find((c) => c._id === decodedId);
      console.log("Found course:", JSON.stringify(found, null, 2));
      setCourse(found);
    }
  }, [courses, decodedId]);

  if (!course) return <p className="text-white p-10">Loading course...</p>;

  return <MissionCourseOverview course={course} />;
}
