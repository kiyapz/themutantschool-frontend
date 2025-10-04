"use client";

import { useContext, useEffect, useRef, useState } from "react";
import LoadingBar from "./LodingBar";

import MissionVideo from "./MissionVideos";
import LevelQuiz from "./LevelQuiz";
import { CourseGuideContext } from "./course-guild-contex/Contex";
import { StudentContext } from "@/app/(dashboard)/student/component/Context/StudentContext";
import axios from "axios";

export default function Capsels({ id }) {
  const videoRef = useRef(null);
  const [watchedDuration, setWatchedDuration] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);

  // Add loading state for progress updates
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);
  const [progressUpdateError, setProgressUpdateError] = useState(null);

  const [changeStages, setChangeStages] = useState(1);
  const [missionsCapsels, setMissionsCapsels] = useState([]);
  const [missionDetails, setMissiondetail] = useState("");
  const [showAutoAdvanceNotification, setShowAutoAdvanceNotification] =
    useState(false);
  console.log(missionDetails, "bbbbbbbbb");

  const {
    currentCapsule,
    setCurrentCapsule,
    watchedVideos,
    setWatchedVideos,
    setCurrentCapsuleTitle,
    showQuiz,
  } = useContext(StudentContext);

  console.log("watchedVideoswatchedVideos", watchedVideos);

  const {
    showVideo,
    setShowVideo,
    showVideoLevels,
    setShowVideoLevels,
    capselIndex,
    setCapselIndex,
  } = useContext(CourseGuideContext);

  // Load saved state from localStorage on component mount
  useEffect(() => {
    const savedStage = localStorage.getItem(`courseStage_${id}`);
    const savedCapsuleIndex = localStorage.getItem(`capsuleIndex_${id}`);

    if (savedStage) {
      setChangeStages(parseInt(savedStage));
    }

    if (savedCapsuleIndex && setCapselIndex) {
      setCapselIndex(parseInt(savedCapsuleIndex));
    }
  }, [id, setCapselIndex]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(`courseStage_${id}`, changeStages.toString());
  }, [changeStages, id]);

  useEffect(() => {
    if (capselIndex !== undefined) {
      localStorage.setItem(`capsuleIndex_${id}`, capselIndex.toString());
    }
  }, [capselIndex, id]);

  const capsuleId = currentCapsule[capselIndex]?._id;

  console.log("curentcapselID", capsuleId);
  console.log(capselIndex, "capselIndexcapselIndexcapselIndex");

  useEffect(() => {
    setCurrentCapsuleTitle(currentCapsule[capselIndex]?.title || "Unknown");
  }, [currentCapsule, capselIndex]);

  // Handle time update
  const handleTimeUpdate = () => {
    const currentTime = videoRef.current.currentTime;
    setWatchedDuration(Math.floor(currentTime));
  };

  // Handle metadata load
  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (video && !isNaN(video.duration) && video.duration > 0) {
      setVideoDuration(Math.floor(video.duration));
    } else {
      console.warn("Video metadata not fully loaded or duration is 0");
    }
  };

  // Function to handle auto-advance to next video
  const handleAutoAdvance = () => {
    if (capselIndex < currentCapsule.length - 1) {
      setCapselIndex(capselIndex + 1);
      setShowAutoAdvanceNotification(true);
      // Hide notification after 3 seconds
      setTimeout(() => {
        setShowAutoAdvanceNotification(false);
      }, 3000);
    }
  };

  // Function to clear all saved states (useful for starting fresh)
  const clearSavedStates = () => {
    localStorage.removeItem(`courseStage_${id}`);
    localStorage.removeItem(`capsuleIndex_${id}`);
    localStorage.removeItem("quizState");
    localStorage.removeItem("quizAlreadyTaken");
    setChangeStages(1);
    if (setCapselIndex) {
      setCapselIndex(0);
    }
  };

  // Enhanced updateCapsuleProgress with loading state and validation
  const updateCapsuleProgress = async () => {
    // Validate required data before making request
    if (!capsuleId) {
      console.error("No capsule ID available for progress update");
      setProgressUpdateError("No capsule ID available");
      return;
    }

    if (watchedDuration <= 0 || videoDuration <= 0) {
      console.warn("Invalid duration values for progress update", {
        watchedDuration,
        videoDuration,
        capsuleId,
      });
      return;
    }

    setIsUpdatingProgress(true);
    setProgressUpdateError(null);

    try {
      // Get token from localStorage
      const accessToken = localStorage.getItem("login-accessToken");

      if (!accessToken) {
        throw new Error("No access token found");
      }

      console.log("Updating progress for capsule:", {
        capsuleId,
        watchedDuration,
        videoDuration,
        currentCapsule: currentCapsule[capselIndex]?.title || "Unknown",
      });

      // Make PUT request with Authorization header
      const response = await axios.put(
        `https://themutantschool-backend.onrender.com/api/mission-capsule/${capsuleId}`,
        {
          watchedDuration,
          videoDuration,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Progress update successful:", response.data);

      // Optional: Show success feedback to user
      if (response.data.success) {
        console.log(
          "✅ Progress updated successfully for:",
          currentCapsule[capselIndex]?.title
        );
      }
    } catch (err) {
      console.error("Error updating progress:", err);

      if (err.response?.status === 401) {
        setProgressUpdateError("Authentication failed. Please login again.");
      } else if (err.response?.status === 404) {
        setProgressUpdateError("Capsule not found.");
      } else if (err.response?.status >= 500) {
        setProgressUpdateError("Server error. Please try again later.");
      } else {
        setProgressUpdateError(
          "Failed to update progress. Please check your connection."
        );
      }

      console.log("Will retry progress update in next interval...");
    } finally {
      setIsUpdatingProgress(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        watchedDuration > 0 &&
        capsuleId &&
        !isUpdatingProgress &&
        videoDuration > 0
      ) {
        updateCapsuleProgress();
      } else {
        console.log("Skipping progress update:", {
          hasWatchedDuration: watchedDuration > 0,
          hasCapsuleId: !!capsuleId,
          isUpdating: isUpdatingProgress,
          hasVideoDuration: videoDuration > 0,
        });
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [watchedDuration, capsuleId, isUpdatingProgress, videoDuration]);

  useEffect(() => {
    const Capsels = localStorage.getItem("missionsCapsels");
    console.log("Capsels from localStorage:", Capsels);
    if (Capsels) {
      try {
        const parsedCapsels = JSON.parse(Capsels);
        console.log("Parsed Capsels:", parsedCapsels);
        setMissionsCapsels(parsedCapsels);
      } catch (e) {
        console.error("Failed to parse missionsCapsels from localStorage", e);
      }
    }
  }, []);

  useEffect(() => {
    if (changeStages === 3) {
      setShowVideo(true);
    } else {
      setShowVideo(false);
    }
  }, [changeStages, setShowVideo]);

  // watched videos
  useEffect(() => {
    const fetchWachedVideo = async () => {
      const token = localStorage.getItem("login-accessToken");
      const missionId = localStorage.getItem("currentMissionId");
      const levelId = localStorage.getItem("currentLevelId");

      try {
        const response = await axios.get(
          `https://themutantschool-backend.onrender.com/api/level-progress/${missionId}/levels/${levelId}/capsules/watched`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log(
          "Fetched Watched Video Data everything:----------",
          response.data
        );
        const watchedData = response.data?.data?.watchedCapsules;
        console.log("Fetched watched videos from server:", watchedData);
        // setWatchedVideos([{'jji':'jj'}]);
        setWatchedVideos(response.data.data.completedCapsules);
      } catch (error) {
        console.log(
          "Error fetching missions:",
          error.response?.data || error.message
        );
      } finally {
        // setLoading(false);
      }
    };

    fetchWachedVideo();
  }, [watchedDuration]);

  // get missions

  useEffect(() => {
    const missionId = localStorage.getItem("currentMissionId");
    const token = localStorage.getItem("login-accessToken");

    if (!missionId) return;

    const fetchMissionData = async () => {
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

        const missions = response.data.data;
        setMissiondetail(missions);
      } catch (error) {
        console.error("Error fetching mission data:", error);
      }
    };

    fetchMissionData();
  }, []);

  const courseGuide = () => {
    switch (changeStages) {
      case 1:
        return (
          <div
            style={{ padding: "15px" }}
            className="w-full h-[82vh]  flexcenter bg-[#0A0A0A] p-[10px]"
          >
            <div className="max-w-[1261px] mx-auto w-full h-full flex flex-col">
              {/* Loading Bar - Fixed height */}
              <div className="h-[60px] w-full flex items-center">
                <LoadingBar width={"w-[10%]"} />
              </div>

              {/* Content - Takes remaining space */}
              <div
                style={{ marginLeft: "20px" }}
                className="flex-1 flex flex-col  overflow-y-auto"
              >
                <p className="font-[700] text-[20px] sm:text-[20px] sm:leading-[20px] mb-6">
                  After successfully completing this module, you will be able
                  to:
                </p>
                <div className="pl-5">
                  <ul className="list-disc space-y-2">
                    <li className="pl-2 text-[10px] sm:text-[15px] leading-[20px] font-[400]">
                      {missionDetails[0]?.summary}
                    </li>
                  </ul>
                </div>
              </div>

              {/* Button - Fixed height */}
              <div className="h-[100px] flex items-center justify-end">
                <button
                  onClick={() => setChangeStages((prev) => prev + 1)}
                  className="bg-[#840B94] cursor-pointer p-2 h-[71px] w-[120px] sm:w-[177px] font-[700] text-[20px] sm:text-[31px] leading-[100%] text-white rounded-[10px]"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="w-full h-[82vh] flexcenter bg-[#0A0A0A] p-[10px]">
            <div className="max-w-[1261px] mx-auto w-full h-full flex flex-col">
              {/* Loading Bar - Fixed height */}
              <div className="h-[60px] w-full flex items-center">
                <LoadingBar width={"w-[20%]"} />
              </div>

              <div className="flex-1 flex items-center justify-center min-h-0 relative">
                {/* Video progress indicator */}
                <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-2 rounded-lg text-sm z-10">
                  Video {capselIndex + 1} of {currentCapsule.length}
                </div>
                {/* Auto-advance notification */}
                {showAutoAdvanceNotification && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-10 animate-pulse">
                    🎬 Moving to next video...
                  </div>
                )}
                <div className="w-full h-full max-h-[calc(100vh-160px)] flex items-center justify-center">
                  <video
                    controls
                    className="w-full h-full max-h-full object-contain rounded-lg"
                    preload="metadata"
                    poster={
                      currentCapsule[capselIndex]?.thumbnailUrl ||
                      "/default-poster.jpg"
                    }
                    onEnded={() => {
                      handleAutoAdvance();
                    }}
                  >
                    <source
                      src={currentCapsule[capselIndex]?.videoUrl?.url}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>

              {/* Buttons - Fixed height */}
              <div className="h-[100px] flex justify-between items-center">
                <button
                  onClick={() => setChangeStages((prev) => prev - 1)}
                  className="text-[#840B94] cursor-pointer p-2 h-[71px] w-[120px] sm:w-[177px] font-[700] text-[20px] sm:text-[31px] leading-[100%] rounded-[10px] border border-[#840B94]"
                >
                  Previous
                </button>

                <button
                  onClick={() => setChangeStages((prev) => prev + 1)}
                  className="bg-[#840B94] cursor-pointer p-2 h-[71px] w-[120px] sm:w-[177px] font-[700] text-[20px] sm:text-[31px] leading-[100%] text-white rounded-[10px]"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="w-full h-[82vh] flexcenter bg-[#0A0A0A] p-[10px]">
            <div className="max-w-[1261px] mx-auto w-full h-full flex flex-col">
              {/* Loading Bar - Fixed height */}
              <div className="h-[60px] w-full flex items-center justify-between">
                <LoadingBar width={"w-[40%]"} />
              </div>

              <div className="flex-1 flex items-center justify-center min-h-0 relative">
                {/* Video progress indicator */}
                <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-2 rounded-lg text-sm z-10">
                  Video {capselIndex + 1} of {currentCapsule.length}
                </div>
                {/* Auto-advance notification */}
                {showAutoAdvanceNotification && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-10 animate-pulse">
                    🎬 Moving to next video...
                  </div>
                )}
                <div className="w-full h-[300px] max-h-[calc(100vh-160px)] flex items-center justify-center">
                  <video
                    key={currentCapsule[capselIndex]?._id}
                    ref={videoRef}
                    controls
                    preload="metadata"
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={() => {
                      updateCapsuleProgress();
                      handleAutoAdvance();
                    }}
                    className="w-full h-full object-contain"
                  >
                    <source
                      src={currentCapsule[capselIndex]?.videoUrl?.url}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>

              {/* Buttons - Fixed height */}
              <div className="h-[100px] flex justify-between items-center">
                <button
                  onClick={() => setChangeStages((prev) => prev - 1)}
                  className="text-[#840B94] cursor-pointer p-2 h-[71px] w-[120px] sm:w-[177px] font-[700] text-[20px] sm:text-[31px] leading-[100%] rounded-[10px] border border-[#840B94]"
                >
                  Previous
                </button>

                <button
                  disabled={!showQuiz}
                  onClick={() => setChangeStages((prev) => prev + 1)}
                  className={`${
                    showQuiz
                      ? " cursor-pointer opacity-100  "
                      : "opacity-20 cursor-not-allowed "
                  }  p-2 h-[71px] w-[140px] bg-[#840B94] sm:w-[200px] font-[700] text-[18px] sm:text-[28px] leading-[100%] text-white rounded-[10px]`}
                >
                  Start Quiz
                </button>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div
            style={{ padding: "10px" }}
            className="w-full   relative flex-1 h-fit flexcenter flex-col bg-[#0A0A0A]  "
          >
            <div className="max-w-[1261px] w-full h-[85vh]  flex flex-col items-end justify-between">
              <div className="h-10 w-full  ">
                <LoadingBar width={"w-[70%]"} />
              </div>
              {/* text */}
              <div className="h-fit w-full flex flex-col justify-center">
                <LevelQuiz onQuizComplete={() => setChangeStages(4)} />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="w-full h-[82vh] flexcenter bg-[#0A0A0A] p-[10px]">
            <div className="max-w-[1261px] mx-auto w-full h-full flex flex-col">
              {/* Loading Bar - Fixed height */}
              <div className="h-[60px] w-full flex items-center justify-between">
                <LoadingBar width={"w-[100%]"} />
              </div>

              {/* Completion Content */}
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="text-6xl mb-6">🎉</div>
                <h2 className="text-[#822A8D] font-[700] text-[30px] sm:text-[40px] leading-[43px] mb-4">
                  Module Completed!
                </h2>
                <p className="text-white text-lg mb-8 max-w-2xl">
                  Congratulations! You have successfully completed this module.
                  You've gained valuable knowledge and skills that will help you
                  in your learning journey.
                </p>

                <div className="bg-[#131313] p-6 rounded-lg mb-8 max-w-md">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-400">Progress:</span>
                    <span className="text-green-400 font-bold">
                      100% Complete
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-400">Status:</span>
                    <span className="text-green-400 font-bold">✅ Passed</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">XP Earned:</span>
                    <span className="text-[#037B9D] font-bold">+25 XP</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      // Reset to beginning for retake
                      setChangeStages(1);
                      setCapselIndex(0);
                      localStorage.removeItem(`courseStage_${id}`);
                      localStorage.removeItem(`capsuleIndex_${id}`);
                    }}
                    className="bg-gray-600 hover:bg-gray-700 px-8 py-3 rounded-lg font-bold text-lg transition-colors"
                  >
                    Retake Module
                  </button>

                  <button
                    onClick={() => {
                      // Navigate back to course list or next module
                      window.history.back();
                    }}
                    className="bg-[#840B94] hover:bg-[#6a0876] px-8 py-3 rounded-lg font-bold text-lg transition-colors"
                  >
                    Continue Learning
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="w-full h-[82vh] flexcenter bg-[#0A0A0A] p-[10px]">
            <div className="text-white text-center">
              <h2 className="text-2xl mb-4">Module Complete!</h2>
              <p>You have finished this module successfully.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-full w-full max-w-[1800px]  mx-auto flex flex-col">
      {courseGuide()}
      {showVideoLevels && (
        <div className="w-screen z-30 h-full bg-[rgba(0,0,0,0.7)] fixed top-0 left-0 flex items-center justify-center">
          <div className="bg-[#840B94] flexcenter   w-full h-full ">
            <MissionVideo />
          </div>
        </div>
      )}
    </div>
  );
}
