"use client";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { InstructorContext } from "../../../_components/context/InstructorContex";
import UserProfileImage from "../../../profile/_components/UserProfileImage";
import { generateInstructorMissionLevelLink } from "@/lib/instructorIdUtils";

export default function PreviewandLaunch({ onValidationChange }) {
  const { userUpdatedValue, setActiveTab } = useContext(InstructorContext);
  const [activeTab, setActiveTabs] = useState("Mission Overview");
  const [levels, setLevels] = useState([]);
  const [missionById, setmissionById] = useState([]);
  const [validationStatus, setValidationStatus] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [imageError, setImageError] = useState(false);
  console.log("Thumbnail URL:", missionById?.thumbnail?.url);

  const router = useRouter();

  const getMissionByID = async () => {
    console.log("Fetching mission by ID...");

    try {
      const storedMissionId = localStorage.getItem("missionId");

      if (!storedMissionId) {
        console.log("No missionId found in localStorage");

        router.push("/instructor/missions/createnewmission");
        return;
      }

      const accessToken = localStorage.getItem("login-accessToken");

      if (!storedMissionId || !accessToken) {
        console.log("Missing missionId or accessToken in localStorage");
        return;
      }

      const response = await axios.get(
        `https://themutantschool-backend.onrender.com/api/mission/${storedMissionId}`,

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log(
        "new mission by Mission updated successfully:",
        response.data.data
      );

      setmissionById(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMissionByID();
  }, []);

  useEffect(() => {
    const missionId = localStorage.getItem("missionId");

    if (!missionId) {
      alert("No mission ID found. Redirecting to create new mission.");
      setActiveTab("Mission Details");

      router.push("/instructor/missions/createnewmission");
      return;
    }
  }, []);

  const validateMission = (levels, quizzes) => {
    // Check if mission has at least 1 level
    if (levels.length < 1) {
      return {
        isValid: false,
        message: `Mission must have at least 1 level. Currently has ${levels.length} level(s).`,
        details: "Please add at least one level before publishing.",
      };
    }

    // Check if each level has at least 1 capsule
    const invalidLevels = [];
    for (let i = 0; i < levels.length; i++) {
      const level = levels[i];
      const capsuleCount = Array.isArray(level.capsules)
        ? level.capsules.length
        : 0;

      if (capsuleCount < 1) {
        invalidLevels.push({
          levelNumber: i + 1,
          levelTitle: level.title || "Untitled",
          capsuleCount,
        });
      }
    }

    if (invalidLevels.length > 0) {
      return {
        isValid: false,
        message: "Some levels don't have any capsules:",
        details: invalidLevels
          .map(
            (level) =>
              `Level ${level.levelNumber} "${level.levelTitle}" has ${level.capsuleCount} capsule(s) (needs at least 1)`
          )
          .join(", "),
        invalidLevels,
      };
    }

    // Check if there's at least one quiz
    if (!quizzes || quizzes.length === 0) {
      return {
        isValid: false,
        message: "Mission must have at least one quiz before publishing.",
        details:
          "Please add quizzes to your levels before publishing the mission.",
      };
    }

    // Check if there's a final quiz (isFinal: true)
    const hasFinalQuiz = quizzes.some((quiz) => quiz.isFinal === true);
    if (!hasFinalQuiz) {
      return {
        isValid: false,
        message: "Mission must have a Final Quiz before publishing.",
        details:
          "Please generate a Final Quiz (Boss Level Quiz) before publishing. Go to Add Levels and click 'Create Final Quiz' at the bottom.",
      };
    }

    return {
      isValid: true,
      message: "Mission is ready for publishing!",
      details: `All ${levels.length} level(s) have at least 1 capsule each, and Final Quiz is created.`,
    };
  };

  useEffect(() => {
    const fetchMissionData = async () => {
      const storedMissionId = localStorage.getItem("missionId");
      const accessToken = localStorage.getItem("login-accessToken");

      if (!storedMissionId || !accessToken) {
        console.log("Missing missionId or accessToken in localStorage");
        return;
      }

      console.log("Stored Mission ID:", storedMissionId);

      try {
        // Fetch mission levels
        const levelsRes = await axios.get(
          `https://themutantschool-backend.onrender.com/api/mission-level/mission/${storedMissionId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log(
          "Mission levels retrieved successfully:",
          levelsRes.data.data
        );
        const fetchedLevels = levelsRes.data.data || [];
        
        // Fetch capsules for each level
        const levelsWithCapsules = await Promise.all(
          fetchedLevels.map(async (level) => {
            try {
              // Fetch capsules for this level
              const capsulesResponse = await axios.get(
                `https://themutantschool-backend.onrender.com/api/mission-capsule/level/${level._id}?page=1&limit=100`,
                {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                  },
                }
              );
              
              // Extract capsules from response
              const capsules = capsulesResponse.data?.data?.capsules || capsulesResponse.data?.data || [];
              
              console.log(`Fetched ${capsules.length} capsules for level ${level._id}:`, capsules);
              
              return {
                ...level,
                capsules: capsules,
              };
            } catch (capsuleError) {
              console.error(`Failed to fetch capsules for level ${level._id}:`, capsuleError);
              // Return level without capsules if fetch fails
              return {
                ...level,
                capsules: level.capsules || [],
              };
            }
          })
        );
        
        setLevels(levelsWithCapsules);

        // Fetch mission quizzes
        const quizzesRes = await axios.get(
          `https://themutantschool-backend.onrender.com/api/mission-quiz/${storedMissionId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log(
          "Mission quizzes retrieved successfully:",
          quizzesRes.data.data
        );
        const fetchedQuizzes = quizzesRes.data?.data || [];
        setQuizzes(fetchedQuizzes);

        // Validate the mission with both levels (with capsules) and quizzes
        const validation = validateMission(levelsWithCapsules, fetchedQuizzes);
        console.log("Validation result:", validation);
        console.log(
          "Has final quiz:",
          fetchedQuizzes.some((quiz) => quiz.isFinal === true)
        );
        console.log("All quizzes:", fetchedQuizzes);
        setValidationStatus(validation);
        // Notify parent component of validation status change
        if (onValidationChange) {
          onValidationChange(validation);
        }
      } catch (error) {
        console.log("Error retrieving mission data:", error);
      }
    };

    fetchMissionData();
  }, []);

  const renderTabContent = () => {
    if (activeTab === "Mission Overview") {
      return (
        <div style={{ padding: "10px" }} className="flex flex-col gap-5">
          <p className="text-[#BFBFBF] font-[400] text-[14px] leading-[20px] ">
            {missionById.description}
          </p>

          <p className="text-[#BFBFBF] font-[400] text-[14px] leading-[20px] ">
            What you'll Learn:
          </p>
          <ul
            style={{ paddingLeft: "8px" }}
            className="text-[#BFBFBF] list-disc font-[400] flex flex-col gap-1 text-[14px] leading-[20px] "
          >
            {missionById.learningOutcomes &&
            missionById.learningOutcomes.length > 0 ? (
              missionById.learningOutcomes.map((outcome, index) => (
                <li key={index}>{outcome}</li>
              ))
            ) : (
              <li>No learning outcomes specified</li>
            )}
          </ul>

          <p className="text-[#BFBFBF] font-[400] text-[14px] leading-[20px] ">
            Your journey to becoming a web sorcerer starts here!
          </p>
        </div>
      );
    } else if (activeTab === "Missions Levels") {
      return (
        <div className="flex flex-col gap-5">
          {levels.map((level, index) => (
            <Link
              href={generateInstructorMissionLevelLink(level._id, level.title)}
              key={level._id}
            >
              <div
                style={{ padding: "20px" }}
                key={index}
                className={`rounded-[12px] px-4 py-5 ${
                  level.locked ? "bg-[#1D1D1D]" : "bg-[#232D3A]"
                } text-white flex flex-col gap-3`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-8 rounded-full bg-[#BDE75D] text-black flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-[600] text-[16px]">{level?.title}</p>
                      <p className="text-[13px] text-gray-400">
                        {level.estimatedTime} •{" "}
                        {Array.isArray(level?.capsules)
                          ? level.capsules.length
                          : 0}{" "}
                        Power Capsules
                      </p>
                    </div>
                  </div>

                  <div>
                    {level?.locked ? (
                      <span className="text-gray-400 text-lg">🔒</span>
                    ) : (
                      <span className="text-gray-400 text-lg">›</span>
                    )}
                  </div>
                </div>

                <p className="text-sm text-gray-300">{level.summary}</p>

                <div className="flex gap-6 text-xs text-gray-400 mt-2">
                  <p>
                    📦{" "}
                    {Array.isArray(level?.capsules) ? level.capsules.length : 0}{" "}
                    Capsules
                  </p>
                  <p>
                    ❓{" "}
                    {Array.isArray(level?.quiz?.questions)
                      ? level.quiz.questions.length
                      : 0}{" "}
                    Quiz Questions
                  </p>
                  <p>🎥 {level?.estimatedTime}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      );
    }
  };

  const tabs = ["Mission Overview", "Missions Levels"];

  return (
    <div className="w-full h-full p-5">
      {/* Validation Status - Moved to Top - HIGHLY VISIBLE */}
      {validationStatus && (
        <div
          className={`mb-6 p-6 rounded-lg border-2 ${
            validationStatus.isValid
              ? "bg-green-900/30 border-green-500"
              : "bg-red-900/30 border-red-500"
          } animate-pulse`}
          style={{
            animation: !validationStatus.isValid
              ? "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
              : "none",
          }}
        >
          <div className="flex items-start gap-4">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                validationStatus.isValid ? "bg-green-500" : "bg-red-500"
              }`}
            >
              <span className="text-white font-bold text-lg">
                {validationStatus.isValid ? "✓" : "✗"}
              </span>
            </div>
            <div className="flex-1">
              <h4
                className={`font-bold text-xl mb-2 ${
                  validationStatus.isValid ? "text-green-300" : "text-red-300"
                }`}
              >
                {validationStatus.message}
              </h4>
              <p
                className={`text-base leading-relaxed ${
                  validationStatus.isValid ? "text-green-200" : "text-red-200"
                }`}
              >
                {validationStatus.details}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="h-[343.54px] w-full rounded-[15px] mb-8 overflow-hidden relative bg-gradient-to-r from-purple-600 to-indigo-600">
        {missionById?.thumbnail?.url ? (
          <img
            src={missionById.thumbnail.url}
            alt={missionById?.title || "Mission Thumbnail"}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error("Image failed to load:", missionById.thumbnail.url);
              setImageError(true);
              e.target.style.display = "none";
            }}
            onLoad={() => {
              console.log("Image loaded successfully");
              setImageError(false);
            }}
          />
        ) : null}

        {/* Fallback overlay when no image or image fails to load */}
        {(!missionById?.thumbnail?.url || imageError) && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <svg
                className="w-24 h-24 mx-auto mb-4 opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-lg font-semibold">Mission Thumbnail</p>
              <p className="text-sm opacity-75 mt-2">
                {imageError
                  ? "Failed to load thumbnail"
                  : "No thumbnail uploaded"}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div
          style={{ padding: "30px" }}
          className="xl:col-span-2 flex flex-col gap-4"
        >
          {/* Tabs */}
          <div className="flex gap-2 border-b border-[#333] pb-2">
            {tabs.map((tab) => (
              <button
                style={{ padding: "15px" }}
                key={tab}
                onClick={() => setActiveTabs(tab)}
                className={`text-sm sm:text-base font-medium pb-1 ${
                  activeTab === tab
                    ? "border-b-2 border-[#BDE75D] text-[10px] sm:text-[17px] text-[#BDE75D]"
                    : "text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div style={{ padding: "10px" }} className="pt-4">
            {renderTabContent()}
          </div>
        </div>

        <div
          style={{ padding: "15px" }}
          className="bg-[var(--black-bg)] rounded-[12px] p-5"
        >
          <p
            style={{ marginBottom: "20px" }}
            className="text-[24px] font-[600] text-[var(--sidebar-hovercolor)] mb-4"
          >
            Mission {userUpdatedValue.role}
          </p>

          <div
            style={{ marginBottom: "10px" }}
            className="flex items-center gap-4 mb-3"
          >
            <div className="h-[50px] w-[50px] rounded-full border-2 border-[var(--sidebar-hovercolor)] overflow-hidden relative bg-gray-700">
              {userUpdatedValue?.url ? (
                <img
                  src={userUpdatedValue.url}
                  alt={`${userUpdatedValue.firstName} ${userUpdatedValue.lastName}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">
                  {userUpdatedValue?.firstName?.charAt(0) || "U"}
                </div>
              )}
            </div>
            <div>
              <p className="font-medium text-white">
                {userUpdatedValue.firstName || "Instructor"}
                {userUpdatedValue.lastName && (
                  <span> {userUpdatedValue.lastName}</span>
                )}
              </p>
              <p className="text-sm text-gray-400">
                {userUpdatedValue.headline ||
                  userUpdatedValue.Headline ||
                  "Instructor"}
              </p>
            </div>
          </div>

          <p
            style={{ marginBottom: "10px" }}
            className="text-sm text-gray-300 mb-4 leading-[22px]"
          >
            {userUpdatedValue.bio}
          </p>

          <div className="flex items-center justify-between">
            <p className="font-medium text-sm text-white">Rating:</p>
            <p className="text-[var(--sidebar-hovercolor)] font-bold text-sm">
              {missionById.rating || missionById.analytics?.rating || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
