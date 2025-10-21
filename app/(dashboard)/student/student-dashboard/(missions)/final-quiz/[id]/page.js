"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "@/components/LoadingSpinner";
import LevelQuiz from "@/app/(dashboard)/student/student-dashboard/(student-course-guilde)/student-course-guilde/components/LevelQuiz";

export default function FinalQuizPage() {
  const { id: slug } = useParams();
  const router = useRouter();
  const [missionId, setMissionId] = useState("");
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizPerformance, setQuizPerformance] = useState(null);

  // Get mission ID from localStorage
  useEffect(() => {
    const storedMissionId =
      localStorage.getItem("finalQuizMissionId") ||
      localStorage.getItem("currentMissionId");

    if (storedMissionId) {
      console.log(
        "Final quiz - Mission ID from localStorage:",
        storedMissionId
      );
      setMissionId(storedMissionId);
    } else {
      console.error("No mission ID found in localStorage");
      setError(
        "Mission ID not found. Please navigate from the mission levels page."
      );
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (!missionId) return;

    const fetchFinalQuiz = async () => {
      const token = localStorage.getItem("login-accessToken");

      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }

      try {
        console.log("🔍 FETCHING FINAL QUIZ for mission:", missionId);

        const response = await axios.get(
          `https://themutantschool-backend.onrender.com/api/mission-quiz/final/${missionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("📊 FINAL QUIZ DATA:", response.data);

        if (response.data && response.data.data) {
          setQuizData(response.data.data);
        } else {
          setError("No final quiz found for this mission");
        }
      } catch (error) {
        console.error("Error fetching final quiz:", error);
        setError(
          error.response?.data?.message ||
            "Failed to load final quiz. Please make sure all level quizzes are completed."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFinalQuiz();
  }, [missionId]);

  const handleQuizComplete = (result) => {
    setQuizPerformance(result);
    console.log("📊 FINAL QUIZ COMPLETED:", result);
  };

  const handleBackToMission = () => {
    // Get mission title from quizData if available, or use slug from URL
    const missionTitle = quizData?.mission?.title || slug;
    const cleanSlug =
      typeof missionTitle === "string"
        ? missionTitle
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .substring(0, 50)
        : slug;

    router.push(
      `/student/student-dashboard/student-mission-study-levels/${cleanSlug}`
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0A0A0A]">
        <LoadingSpinner size="xlarge" color="mutant" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#0A0A0A] p-4">
        <div className="max-w-md w-full bg-[#131313] border border-red-900 rounded-lg p-8 text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={handleBackToMission}
            className="bg-[#840B94] hover:bg-[#6a0876] text-white font-bold px-6 py-3 rounded-lg transition-colors"
          >
            Back to Mission
          </button>
        </div>
      </div>
    );
  }

  if (quizPerformance) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A0A0A] p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-[#131313] border border-[#840B94] rounded-lg p-8 text-center">
            <h2 className="text-[#822A8D] font-bold text-3xl mb-4">
              🎉 Final Quiz Complete!
            </h2>
            <div
              className={`text-6xl font-bold mb-4 ${
                quizPerformance.passed ? "text-green-500" : "text-red-500"
              }`}
            >
              {quizPerformance.percentage}%
            </div>
            <p className="text-gray-300 text-lg mb-6">
              {quizPerformance.passed
                ? "Congratulations! You've completed the final quiz and finished this mission!"
                : "Don't give up! Review the material and try again."}
            </p>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-400">
                <span>Score:</span>
                <span className="text-white">
                  {quizPerformance.score}/{quizPerformance.total}
                </span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Duration:</span>
                <span className="text-white">
                  {quizPerformance.duration || "N/A"}
                </span>
              </div>
            </div>
            <button
              onClick={handleBackToMission}
              className="bg-[#840B94] hover:bg-[#6a0876] text-white font-bold px-8 py-3 rounded-lg transition-colors"
            >
              Back to Mission
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Final Quiz</h1>
          <p className="text-gray-400">
            This is the final challenge to complete this mission
          </p>
        </div>

        {/* Quiz Component */}
        {quizData && (
          <div className="bg-[#131313] border border-[#840B94] rounded-lg p-6">
            <LevelQuiz
              finalQuizData={quizData}
              isFinalQuiz={true}
              onQuizComplete={handleQuizComplete}
              onReview={handleBackToMission}
            />
          </div>
        )}
      </div>
    </div>
  );
}
