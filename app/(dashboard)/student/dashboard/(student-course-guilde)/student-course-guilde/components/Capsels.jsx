"use client";

import { useContext, useEffect, useRef, useState } from "react";
import LoadingBar from "./LodingBar"; // Corrected import path

import MissionVideo from "./MissionVideos";
import LevelQuiz from "./LevelQuiz";
import LearningOutcomes from "./LearningOutcomes";
import { CourseGuideContext } from "./course-guild-contex/Contex";
import { StudentContext } from "@/app/(dashboard)/student/component/Context/StudentContext";
import refreshAccessToken from "@/components/RefreshToken";
import axios from "axios";
import levelCompletionTracker from "@/lib/levelCompletionTracker";
import CompletionStatus from "./CompletionStatus";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Capsels({ id, capsuleId, startQuiz }) {
  const videoRef = useRef(null);
  const capsuleIdProcessedRef = useRef(false); // Track if we've already processed the URL capsuleId
  const [watchedDuration, setWatchedDuration] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [watchedVideosRefetchTrigger, setWatchedVideosRefetchTrigger] =
    useState(0); // Trigger for refetching watched videos
  const levelId = id; // Using the passed id as levelId for LearningOutcomes
  const [showSavedPositionNotification, setShowSavedPositionNotification] =
    useState(false);
  const [
    showRestoredPositionNotification,
    setShowRestoredPositionNotification,
  ] = useState(false);
  const [watchedVideosLoading, setWatchedVideosLoading] = useState(true);
  const [initialRoutingDone, setInitialRoutingDone] = useState(false);

  // Helper function to check if URL is a YouTube URL
  const isYoutubeUrl = (url) => {
    if (!url) return false;
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  // Helper function to convert YouTube URL to embed URL
  const getYoutubeEmbedUrl = (url) => {
    if (!url) return "";

    // If it's already an embed URL, return it
    if (url.includes("youtube.com/embed/")) {
      return url;
    }

    let videoId = "";

    // Extract video ID from different YouTube URL formats
    if (url.includes("youtube.com/watch")) {
      const urlParams = new URLSearchParams(url.split("?")[1]);
      videoId = urlParams.get("v");
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1].split("?")[0];
    } else if (url.includes("youtube.com/shorts/")) {
      videoId = url.split("youtube.com/shorts/")[1].split("?")[0];
    }

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }

    return url;
  };

  // Add loading state for progress updates
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);
  const [progressUpdateError, setProgressUpdateError] = useState(null);

  // Store the current level ID in localStorage
  useEffect(() => {
    if (id) {
      localStorage.setItem("currentLevelId", id);
      console.log("Stored current level ID in localStorage:", id);
    }
  }, [id]);

  const [changeStages, setChangeStages] = useState(1);
  const [missionsCapsels, setMissionsCapsels] = useState([]);
  const [missionDetails, setMissiondetail] = useState("");
  const [showAutoAdvanceNotification, setShowAutoAdvanceNotification] =
    useState(false);
  const [quizPerformance, setQuizPerformance] = useState(null);
  const [showPerformanceDetails, setShowPerformanceDetails] = useState(false);
  const [quizError, setQuizError] = useState(null);
  const [quizKey, setQuizKey] = useState(0);
  const [quizHistory, setQuizHistory] = useState([]);
  const [hasPassedCurrentLevelQuiz, setHasPassedCurrentLevelQuiz] =
    useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  console.log(missionDetails, "bbbbbbbbb");

  const handleReviewCapsules = () => {
    setQuizError(null);
    localStorage.removeItem("quizState");
    localStorage.removeItem("quizAlreadyTaken");
    setChangeStages(3); // Go back to video capsules stage
  };

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

  // This effect handles the initial routing logic when the component loads or the level changes.
  useEffect(() => {
    // Wait for capsules and watched video status to be loaded, and only run this logic once per level load.
    if (
      currentCapsule.length > 0 &&
      !watchedVideosLoading &&
      !initialRoutingDone
    ) {
      // If startQuiz parameter is present, always go to stage 3 (course guide) first
      if (startQuiz === "true") {
        // Set to the first capsule or last watched
        if (watchedVideos.length > 0) {
          setCapselIndex(
            Math.min(watchedVideos.length - 1, currentCapsule.length - 1)
          );
        } else {
          setCapselIndex(0);
        }
        setChangeStages(3);
      } else if (capsuleId) {
        // A specific capsule was requested in the URL.
        const targetIndex = currentCapsule.findIndex(
          (c) => c._id === capsuleId
        );
        if (targetIndex !== -1) {
          setCapselIndex(targetIndex);
          // If the user has watched any video in this level, go to the video player.
          if (watchedVideos.length > 0) {
            setChangeStages(3);
          } else {
            // Otherwise, start from the beginning.
            setChangeStages(1);
          }
        } else {
          // If the requested capsuleId doesn't exist in this level, start from the beginning.
          setChangeStages(1);
        }
      } else {
        // No specific capsule requested, so load progress from localStorage.
        const savedStage = localStorage.getItem(`courseStage_${id}`);
        const savedCapsuleIndex = localStorage.getItem(`capsuleIndex_${id}`);
        if (savedStage) {
          setChangeStages(parseInt(savedStage, 10));
        }
        if (savedCapsuleIndex) {
          setCapselIndex(parseInt(savedCapsuleIndex, 10));
        }
      }
      // Mark initial routing as complete to prevent it from running again on re-renders.
      setInitialRoutingDone(true);
    }
  }, [
    currentCapsule,
    watchedVideos,
    watchedVideosLoading,
    initialRoutingDone,
    capsuleId,
    startQuiz,
    id,
    setCapselIndex,
  ]);

  // Separate cleanup effect that only runs when level ID changes
  useEffect(() => {
    // Cleanup function to reset state when the level ID changes
    return () => {
      setChangeStages(1);
      if (setCapselIndex) {
        setCapselIndex(0);
      }
      setInitialRoutingDone(false); // Allow routing logic to run for the new level
    };
  }, [id, setCapselIndex]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(`courseStage_${id}`, changeStages.toString());
  }, [changeStages, id]);

  useEffect(() => {
    // Only save to localStorage after we've processed the initial state
    if (capselIndex !== undefined && capsuleIdProcessedRef.current) {
      localStorage.setItem(`capsuleIndex_${id}`, capselIndex.toString());
      console.log(`Saved capsule index ${capselIndex} to localStorage`);
    }
  }, [capselIndex, id]);

  const currentCapsuleId = currentCapsule[capselIndex]?._id;

  console.log("curentcapselID", currentCapsuleId);
  console.log(capselIndex, "capselIndexcapselIndexcapselIndex");

  useEffect(() => {
    setCurrentCapsuleTitle(currentCapsule[capselIndex]?.title || "Unknown");

    // Log video URL information for debugging
    const videoUrl = currentCapsule[capselIndex]?.videoUrl?.url;
    if (videoUrl) {
      console.log("Current video URL:", videoUrl);
      console.log("Is YouTube URL:", isYoutubeUrl(videoUrl));
      if (isYoutubeUrl(videoUrl)) {
        console.log("YouTube embed URL:", getYoutubeEmbedUrl(videoUrl));
      }
    }
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

      // Restore video position if it was saved previously
      if (currentCapsuleId) {
        const savedPosition = localStorage.getItem(
          `video_position_${currentCapsuleId}`
        );
        if (savedPosition) {
          const position = parseFloat(savedPosition);
          // Only restore if the position is valid and less than the video duration
          if (!isNaN(position) && position > 0 && position < video.duration) {
            console.log(`Restoring video position to ${position}s`);
            video.currentTime = position;

            // Show notification that position was restored
            setShowRestoredPositionNotification(true);
            setTimeout(() => {
              setShowRestoredPositionNotification(false);
            }, 4000);
          }
        }
      }
    } else {
      console.warn("Video metadata not fully loaded or duration is 0");
    }
  };

  // Function to handle auto-advance to next video
  const handleAutoAdvance = async () => {
    if (capselIndex < currentCapsule.length - 1) {
      // Wait a moment for the backend to process the completion
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setCapselIndex(capselIndex + 1);
      setShowAutoAdvanceNotification(true);
      // Hide notification after 3 seconds
      setTimeout(() => {
        setShowAutoAdvanceNotification(false);
      }, 3000);

      // Trigger refetch of watched videos after advancing
      setWatchedVideosRefetchTrigger((prev) => prev + 1);
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
    if (!currentCapsuleId) {
      console.error("No capsule ID available for progress update");
      setProgressUpdateError("No capsule ID available");
      return;
    }

    if (watchedDuration <= 0 || videoDuration <= 0) {
      console.warn("Invalid duration values for progress update", {
        watchedDuration,
        videoDuration,
        capsuleId: currentCapsuleId,
      });
      return;
    }

    setIsUpdatingProgress(true);
    setProgressUpdateError(null);

    try {
      // Get token from localStorage
      let accessToken = localStorage.getItem("login-accessToken");
      const refreshToken = localStorage.getItem("login-refreshToken");

      if (!accessToken) {
        throw new Error("No access token found");
      }

      console.log("Updating progress for capsule:", {
        capsuleId: currentCapsuleId,
        watchedDuration,
        videoDuration,
        currentCapsule: currentCapsule[capselIndex]?.title || "Unknown",
      });

      let response;
      try {
        // First attempt with current token
        response = await axios.put(
          `https://themutantschool-backend.onrender.com/api/mission-capsule/${currentCapsuleId}`,
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
      } catch (tokenError) {
        // If we get a 401 or 403, try refreshing the token
        if (
          (tokenError.response?.status === 401 ||
            tokenError.response?.status === 403) &&
          refreshToken
        ) {
          console.log("Token expired, attempting to refresh...");
          const newToken = await refreshAccessToken(refreshToken);

          if (newToken) {
            console.log("Token refreshed successfully, retrying request");
            accessToken = newToken;

            // Retry with new token
            response = await axios.put(
              `https://themutantschool-backend.onrender.com/api/mission-capsule/${currentCapsuleId}`,
              {
                watchedDuration,
                videoDuration,
              },
              {
                headers: {
                  Authorization: `Bearer ${newToken}`,
                  "Content-Type": "application/json",
                },
              }
            );
          } else {
            throw new Error("Failed to refresh token");
          }
        } else {
          // If it's not a token error or refresh failed, rethrow
          throw tokenError;
        }
      }

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

      // Check for specific access restriction messages from the backend
      if (err.response?.status === 403 && err.response?.data?.message) {
        const errorMessage = err.response.data.message;
        // Show an alert with the actual message from the backend
        alert(`Access Restricted: ${errorMessage}`);
        setProgressUpdateError(errorMessage);

        // Redirect back to previous page if it's a prerequisite error about quiz
        if (errorMessage.includes("pass the quiz")) {
          setTimeout(() => {
            window.history.back();
          }, 2000);
        }
      } else if (err.response?.status === 401 || err.response?.status === 403) {
        setProgressUpdateError(
          "Authentication failed. Trying to refresh token..."
        );
        // Note: Token refresh is already handled in the try block above
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
        currentCapsuleId &&
        !isUpdatingProgress &&
        videoDuration > 0
      ) {
        updateCapsuleProgress();
      } else {
        console.log("Skipping progress update:", {
          hasWatchedDuration: watchedDuration > 0,
          hasCapsuleId: !!currentCapsuleId,
          isUpdating: isUpdatingProgress,
          hasVideoDuration: videoDuration > 0,
        });
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [watchedDuration, currentCapsuleId, isUpdatingProgress, videoDuration]);

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
    // Reset video loading state when stage changes
    setIsVideoLoading(true);
  }, [changeStages, setShowVideo]);

  // Calculate progress using the level completion tracker
  const totalCapsules = currentCapsule.length;
  const watchedCapsules = watchedVideos.length;
  const currentLevelId = localStorage.getItem("currentLevelId");

  const getStageProgress = () => {
    // Use the level completion tracker for accurate progress calculation
    const progress = levelCompletionTracker.calculateLevelProgress(
      currentLevelId,
      watchedCapsules,
      totalCapsules,
      changeStages
    );

    // If quiz has been passed (checked from quiz history API), always show 100% progress
    if (hasPassedCurrentLevelQuiz) {
      console.log("✅ PROGRESS BAR: Showing 100% - Quiz already passed");
      return {
        completed: totalCapsules + 1,
        total: totalCapsules + 1,
        isCompleted: true,
        isQuizPassed: true,
      };
    }

    // If level is completed, always show 100% progress
    if (progress.isCompleted && progress.isQuizPassed) {
      return {
        completed: progress.total,
        total: progress.total,
        isCompleted: true,
        isQuizPassed: true,
      };
    }

    // For non-completed levels, use stage-based calculation
    let completed = 0;
    const total = totalCapsules + 1; // Videos + quiz

    switch (changeStages) {
      case 1: // Learning outcomes
        completed = 0;
        break;
      case 2: // Intro video
        completed = Math.min(1, watchedCapsules);
        break;
      case 3: // Capsule videos
        completed = watchedCapsules;
        break;
      case 4: // Quiz stage
        completed = totalCapsules;
        break;
      case 5: // Quiz passed
        completed = totalCapsules + 1;
        break;
      case 6: // Quiz failed
        completed = totalCapsules;
        break;
      default:
        completed = watchedCapsules;
    }

    console.log("📊 PROGRESS BAR:", { completed, total, stage: changeStages });
    return {
      completed,
      total,
      isCompleted: progress.isCompleted,
      isQuizPassed: progress.isQuizPassed,
    };
  };

  const currentProgress = getStageProgress();

  // watched videos
  useEffect(() => {
    const fetchWachedVideo = async () => {
      setWatchedVideosLoading(true);
      const token = localStorage.getItem("login-accessToken");
      const missionId = localStorage.getItem("currentMissionId");
      const levelId = localStorage.getItem("currentLevelId");

      console.log("Fetching watched videos with:", {
        missionId,
        levelId,
        capsuleId: capsuleId || "Not specified",
      });

      if (!missionId || !levelId) {
        console.error("Missing required IDs for fetching watched videos:", {
          missionId: missionId || "Missing",
          levelId: levelId || "Missing",
        });
        return;
      }

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

        // If we have a specific capsuleId, check if it's in the watched list
        if (capsuleId) {
          const isWatched = response.data?.data?.completedCapsules?.some(
            (capsule) => capsule.capsule === capsuleId
          );
          console.log(
            `Current capsule (${capsuleId}) watched status:`,
            isWatched ? "Watched" : "Not watched"
          );
        }

        const completedCapsules = response.data?.data?.completedCapsules;

        // Prevent existing watchedVideos from being overwritten with empty array
        if (Array.isArray(completedCapsules) && completedCapsules.length > 0) {
          setWatchedVideos(completedCapsules);
          console.log(
            "Updated watchedVideos with",
            completedCapsules.length,
            "items"
          );
          console.log(
            `📊 QUIZ CHECK: Watched ${completedCapsules.length}/${currentCapsule.length} videos`
          );

          // Check if all videos are watched to help with debugging
          if (completedCapsules.length === currentCapsule.length) {
            console.log("✅ ALL VIDEOS WATCHED! Quiz should be enabled now.");
          }
        } else if (watchedDuration > 0 && currentCapsuleId) {
          // If we're currently watching a video, don't reset our progress
          console.log(
            "Empty completedCapsules received - keeping existing watched state"
          );
          // Don't update watchedVideos if we're actively watching
        } else {
          // Only set empty array if we're not actively watching a video
          setWatchedVideos([]);
        }
      } catch (error) {
        console.log(
          "Error fetching watched videos:",
          error.response?.data || error.message
        );

        if (error.response?.status === 404) {
          console.log(
            "No watch history found for this level/mission combination"
          );
          setWatchedVideos([]);
        }
      } finally {
        // setLoading(false);
        setWatchedVideosLoading(false);
      }
    };

    fetchWachedVideo();
  }, [capsuleId, watchedVideosRefetchTrigger, currentCapsule.length]); // Refetch when capsuleId changes or when manually triggered

  // Fetch quiz history and check if current level quiz is passed
  useEffect(() => {
    const fetchQuizHistory = async () => {
      try {
        const token = localStorage.getItem("login-accessToken");
        if (!token) return;

        const response = await axios.get(
          `https://themutantschool-backend.onrender.com/api/mission-submit-quiz/quiz-history?limit=100`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.status === "success") {
          const history = response.data.data || [];
          setQuizHistory(history);
          console.log("📊 QUIZ HISTORY FETCHED:", history);

          // Get current level's quiz ID and check if it has been passed
          const currentLevelId = localStorage.getItem("currentLevelId");
          if (currentLevelId) {
            // Check if user has passed the quiz for the current level by matching quizId
            // We need to get the quiz ID for the current level first
            const checkQuizPassed = async () => {
              try {
                const missionId = localStorage.getItem("currentMissionId");
                if (!missionId) return;

                const levelResponse = await axios.get(
                  `https://themutantschool-backend.onrender.com/api/mission-level/mission/${missionId}`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                      "Content-Type": "application/json",
                    },
                  }
                );

                const levels = levelResponse.data.data;
                const currentLevel = levels.find(
                  (level) => level._id === currentLevelId
                );

                if (currentLevel && currentLevel.quiz) {
                  const currentQuizId = currentLevel.quiz._id;
                  console.log("📊 CURRENT LEVEL QUIZ ID:", currentQuizId);

                  // Check if this quiz has been passed in the history
                  const passedQuiz = history.find(
                    (attempt) =>
                      attempt.quizId === currentQuizId &&
                      attempt.passed === true
                  );

                  if (passedQuiz) {
                    console.log(
                      "✅ USER HAS PASSED THIS LEVEL'S QUIZ:",
                      passedQuiz
                    );
                    setHasPassedCurrentLevelQuiz(true);
                  } else {
                    console.log("❌ USER HAS NOT PASSED THIS LEVEL'S QUIZ YET");
                    setHasPassedCurrentLevelQuiz(false);
                  }
                }
              } catch (error) {
                console.error("Error checking quiz status:", error);
              }
            };

            checkQuizPassed();
          }
        }
      } catch (error) {
        console.error("Error fetching quiz history:", error);
      }
    };

    fetchQuizHistory();
  }, [id, quizPerformance]); // Refetch when level ID changes or quiz is completed

  // get missions and mission details including video URL

  useEffect(() => {
    const missionId = localStorage.getItem("currentMissionId");
    const token = localStorage.getItem("login-accessToken");

    if (!missionId) return;

    const fetchMissionData = async () => {
      try {
        // First get mission level data
        const levelResponse = await axios.get(
          `https://themutantschool-backend.onrender.com/api/mission-level/mission/${missionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const missions = levelResponse.data.data;
        setMissiondetail(missions);

        // Then get the full mission data to access the video URL
        try {
          const missionResponse = await axios.get(
            `https://themutantschool-backend.onrender.com/api/mission/${missionId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          const missionData = missionResponse.data.data;
          console.log("Full mission data:", missionData);

          // Store mission video URL for case 2
          if (missionData && missionData.video && missionData.video.url) {
            console.log("Found mission video URL:", missionData.video.url);
            localStorage.setItem("missionVideoUrl", missionData.video.url);
          }
        } catch (missionError) {
          console.error("Error fetching mission details:", missionError);
        }
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
                <LoadingBar
                  completed={currentProgress.completed}
                  total={currentProgress.total}
                  isQuizPassed={hasPassedCurrentLevelQuiz}
                />
              </div>

              {/* Content - Takes remaining space */}
              <div
                style={{ marginLeft: "20px" }}
                className="flex-1 flex flex-col  overflow-y-auto"
              >
                <div className="pl-5">
                  <LearningOutcomes levelId={levelId} />
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
                <LoadingBar
                  completed={currentProgress.completed}
                  total={currentProgress.total}
                  isQuizPassed={hasPassedCurrentLevelQuiz}
                />
              </div>

              <div className="flex-1 flex items-center justify-center min-h-0 relative">
                {/* Video progress indicator */}
                <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-2 rounded-lg text-sm z-10">
                  Mission Introduction Video
                </div>
                {/* Auto-advance notification */}
                {showAutoAdvanceNotification && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-10 animate-pulse">
                    🎬 Moving to next video...
                  </div>
                )}
                {/* Loading spinner */}
                {isVideoLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
                    <LoadingSpinner size="xlarge" color="mutant" />
                  </div>
                )}
                <div className="w-full h-full max-h-[calc(100vh-160px)] flex items-center justify-center">
                  {(() => {
                    // Get the mission video URL from localStorage
                    const missionVideoUrl =
                      localStorage.getItem("missionVideoUrl");
                    console.log(
                      "Using mission video URL for case 2:",
                      missionVideoUrl
                    );

                    if (missionVideoUrl && isYoutubeUrl(missionVideoUrl)) {
                      return (
                        <iframe
                          className="w-full h-full max-h-full rounded-lg"
                          src={getYoutubeEmbedUrl(missionVideoUrl)}
                          title="Mission Introduction Video"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          onLoad={() => setIsVideoLoading(false)}
                        ></iframe>
                      );
                    } else if (missionVideoUrl) {
                      return (
                        <video
                          controls
                          className="w-full h-full max-h-full object-contain rounded-lg"
                          preload="metadata"
                          onLoadedData={() => setIsVideoLoading(false)}
                        >
                          <source src={missionVideoUrl} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      );
                    } else if (currentCapsule[capselIndex]?.videoUrl?.url) {
                      // Fallback to capsule video if no mission video is available
                      if (
                        isYoutubeUrl(currentCapsule[capselIndex]?.videoUrl?.url)
                      ) {
                        return (
                          <iframe
                            className="w-full h-full max-h-full rounded-lg"
                            src={getYoutubeEmbedUrl(
                              currentCapsule[capselIndex]?.videoUrl?.url
                            )}
                            title={
                              currentCapsule[capselIndex]?.title || "Video"
                            }
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            onLoad={() => setIsVideoLoading(false)}
                          ></iframe>
                        );
                      } else {
                        return (
                          <video
                            controls
                            className="w-full h-full max-h-full object-contain rounded-lg"
                            preload="metadata"
                            poster={
                              currentCapsule[capselIndex]?.thumbnailUrl ||
                              "/default-poster.jpg"
                            }
                            onLoadedData={() => setIsVideoLoading(false)}
                          >
                            <source
                              src={currentCapsule[capselIndex]?.videoUrl?.url}
                              type="video/mp4"
                            />
                            Your browser does not support the video tag.
                          </video>
                        );
                      }
                    } else {
                      setIsVideoLoading(false);
                      return (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No video available for this mission
                        </div>
                      );
                    }
                  })()}
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
              <div className="h-[40px] w-full flex items-center justify-between">
                <LoadingBar
                  completed={currentProgress.completed}
                  total={currentProgress.total}
                  isQuizPassed={hasPassedCurrentLevelQuiz}
                />
              </div>

              <div
                className="flex-1 flex items-center justify-center min-h-0 relative"
                style={{ height: "calc(100% - 140px)" }}
              >
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

                {/* Position saved notification */}
                {showSavedPositionNotification && (
                  <div className="absolute top-16 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-10 animate-pulse">
                    💾 Position saved - will resume from here next time
                  </div>
                )}

                {/* Position restored notification */}
                {showRestoredPositionNotification && (
                  <div className="absolute top-28 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-10 animate-pulse">
                    ⏱️ Resumed from your last position
                  </div>
                )}
                <div className="w-full h-full flex-1 flex items-center justify-center">
                  {currentCapsule[capselIndex]?.videoUrl?.url &&
                  isYoutubeUrl(currentCapsule[capselIndex]?.videoUrl?.url) ? (
                    <iframe
                      key={currentCapsule[capselIndex]?._id}
                      className="w-full h-full object-cover rounded-lg shadow-lg"
                      src={getYoutubeEmbedUrl(
                        currentCapsule[capselIndex]?.videoUrl?.url
                      )}
                      title={currentCapsule[capselIndex]?.title || "Video"}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      onLoad={async () => {
                        // YouTube videos can't use the same tracking methods
                        // Set a reasonable default duration for YouTube videos
                        setVideoDuration(300); // 5 minutes default
                        setWatchedDuration(300); // Mark as fully watched

                        // For YouTube videos, we need to immediately update progress
                        setTimeout(async () => {
                          await updateCapsuleProgress();
                          // After a short delay, check if we should advance to next video
                          setTimeout(async () => {
                            if (capselIndex < currentCapsule.length - 1) {
                              await handleAutoAdvance();
                            }
                          }, 2000);
                        }, 3000);
                      }}
                    ></iframe>
                  ) : (
                    <video
                      key={currentCapsule[capselIndex]?._id}
                      ref={videoRef}
                      controls
                      preload="metadata"
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleLoadedMetadata}
                      onPause={() => {
                        // Save current position when paused
                        if (videoRef.current) {
                          const currentTime = videoRef.current.currentTime;
                          localStorage.setItem(
                            `video_position_${currentCapsuleId}`,
                            currentTime.toString()
                          );
                          console.log(
                            `Video paused at ${currentTime}s - position saved`
                          );

                          // Show notification
                          setShowSavedPositionNotification(true);
                          setTimeout(() => {
                            setShowSavedPositionNotification(false);
                          }, 3000);

                          updateCapsuleProgress();

                          // Trigger refetch to update quiz button state
                          setTimeout(() => {
                            setWatchedVideosRefetchTrigger((prev) => prev + 1);
                          }, 1500);
                        }
                      }}
                      onEnded={async () => {
                        // Wait for progress update to complete before advancing
                        await updateCapsuleProgress();
                        await handleAutoAdvance();
                        // Clear saved position when video ends
                        localStorage.removeItem(
                          `video_position_${currentCapsuleId}`
                        );
                      }}
                      className="w-full h-full object-contain rounded-lg shadow-lg"
                    >
                      <source
                        src={currentCapsule[capselIndex]?.videoUrl?.url}
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>
                  )}
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

      case 4:
        return (
          <div
            style={{ padding: "10px" }}
            className="w-full   relative flex-1 h-fit flexcenter flex-col bg-[#0A0A0A]  "
          >
            <div className="max-w-[1261px] w-full h-[85vh]  flex flex-col items-end justify-between">
              <div className="h-10 w-full  ">
                <LoadingBar
                  completed={currentProgress.completed}
                  total={currentProgress.total}
                  isQuizPassed={hasPassedCurrentLevelQuiz}
                />
              </div>
              {/* text */}
              <div className="h-fit w-full flex flex-col justify-center">
                <LevelQuiz
                  key={quizKey}
                  onQuizComplete={(result) => {
                    setQuizPerformance(result);
                    if (result.error) {
                      setQuizError(result.error);
                    } else {
                      setQuizError(null); // Clear previous errors
                    }

                    // Track quiz completion using the level completion tracker
                    if (result.passed !== undefined) {
                      const currentLevelId =
                        localStorage.getItem("currentLevelId");
                      if (currentLevelId) {
                        // Use the level completion tracker to mark level completion
                        levelCompletionTracker.markLevelCompleted(
                          currentLevelId,
                          result.passed,
                          result.score || 0,
                          result.percentage || 0
                        );

                        // Also update the legacy localStorage for backward compatibility
                        const savedPassedQuizzes = JSON.parse(
                          localStorage.getItem("passedQuizzes") || "{}"
                        );
                        savedPassedQuizzes[currentLevelId] = result.passed;
                        localStorage.setItem(
                          "passedQuizzes",
                          JSON.stringify(savedPassedQuizzes)
                        );

                        console.log(
                          `Quiz completion tracked for level ${currentLevelId}: passed=${result.passed}`
                        );
                      }
                    }

                    if (result.passed) {
                      setChangeStages(5);
                    } else {
                      setChangeStages(6);
                    }
                  }}
                  onReview={() => setChangeStages(3)}
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="w-full h-[82vh] flexcenter bg-[#0A0A0A] p-4 sm:p-10">
            <div className="w-full max-w-2xl">
              <div className="text-center sm:text-left mb-8">
                <h2 className="text-[#822A8D] font-bold text-2xl sm:text-3xl mb-2">
                  Quiz Performance
                </h2>
                <p className="text-sm sm:text-base text-gray-400">
                  See how you scored, track your growth, and unlock new powers
                  with every quiz.
                </p>
              </div>
              <div className="bg-[#131313] p-6 sm:p-8 rounded-2xl text-center">
                <h3 className="text-5xl sm:text-6xl font-bold mb-4 text-green-400">
                  {quizPerformance?.percentage || "100"}%
                </h3>
                <p className="text-base sm:text-lg text-gray-300 max-w-md mx-auto">
                  Congratulations! You've successfully completed this level.
                  Your progress has been saved.
                </p>
                <div className="my-6 sm:my-8 border-t border-gray-700"></div>
                <button
                  onClick={() =>
                    setShowPerformanceDetails(!showPerformanceDetails)
                  }
                  className="flex items-center justify-center gap-2 cursor-pointer w-full text-gray-400 hover:text-white transition-colors py-2"
                >
                  <span>Performance Details</span>
                  <span
                    className={`transform transition-transform ${
                      showPerformanceDetails ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>
                {showPerformanceDetails && (
                  <div className="mt-4 space-y-3 text-sm sm:text-base text-left">
                    <div className="flex justify-between">
                      <p>Attempted Questions</p>
                      <p>
                        {quizPerformance?.total || 0}/
                        {quizPerformance?.total || 0}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p>Correct Answers</p>
                      <p>
                        {quizPerformance?.score || 0}/
                        {quizPerformance?.total || 0}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p>Duration</p>
                      <p>{quizPerformance?.duration || "0:00"}</p>
                    </div>
                  </div>
                )}
              </div>
              {quizError && (
                <div className="mt-4 bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg text-center">
                  {quizError}
                </div>
              )}

              {/* Completion Status */}
              <div className="mt-4">
                <CompletionStatus
                  levelId={localStorage.getItem("currentLevelId")}
                  showDetails={true}
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center mt-8 gap-4">
                <button
                  onClick={handleReviewCapsules}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Review Answers
                </button>
                <button
                  onClick={() => {
                    const missionId = localStorage.getItem("currentMissionId");
                    if (missionId) {
                      window.location.href = `/student/dashboard/student-mission-study-levels/${missionId}`;
                    } else {
                      window.location.href = "/student/dashboard";
                    }
                  }}
                  className="bg-[#840B94] hover:bg-[#6a0876] text-white font-bold px-8 py-3 rounded-lg transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="w-full h-[82vh] flexcenter bg-[#0A0A0A] p-4 sm:p-10">
            <div className="w-full max-w-2xl">
              <div className="text-center sm:text-left mb-8">
                <h2 className="text-[#822A8D] font-bold text-2xl sm:text-3xl mb-2">
                  Quiz Performance
                </h2>
                <p className="text-sm sm:text-base text-gray-400">
                  See how you scored, track your growth, and unlock new powers
                  with every quiz.
                </p>
              </div>
              <div className="bg-[#131313] p-6 sm:p-8 rounded-2xl text-center">
                <h3 className="text-5xl sm:text-6xl font-bold mb-4 text-red-500">
                  {quizPerformance?.percentage || 0}%
                </h3>
                <p className="text-base sm:text-lg text-gray-300 max-w-md mx-auto">
                  Don't worry, failure is part of the learning process. Review
                  the material and try the quiz again.
                </p>
                <div className="my-6 sm:my-8 border-t border-gray-700"></div>
                <button
                  onClick={() =>
                    setShowPerformanceDetails(!showPerformanceDetails)
                  }
                  className="flex items-center justify-center gap-2 cursor-pointer w-full text-gray-400 hover:text-white transition-colors py-2"
                >
                  <span>Performance Details</span>
                  <span
                    className={`transform transition-transform ${
                      showPerformanceDetails ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>
                {showPerformanceDetails && (
                  <div className="mt-4 space-y-3 text-sm sm:text-base text-left">
                    <div className="flex justify-between">
                      <p>Attempted Questions</p>
                      <p>
                        {quizPerformance?.total || 0}/
                        {quizPerformance?.total || 0}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p>Correct Answers</p>
                      <p>
                        {quizPerformance?.score || 0}/
                        {quizPerformance?.total || 0}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p>Duration</p>
                      <p>{quizPerformance?.duration || "0:00"}</p>
                    </div>
                  </div>
                )}
              </div>
              {quizError && (
                <div className="mt-4 bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg text-center">
                  {quizError}
                </div>
              )}
              <div className="flex flex-col sm:flex-row items-center justify-center mt-8 gap-4">
                <button
                  onClick={handleReviewCapsules}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Review Answers
                </button>
                <button
                  onClick={handleRetakeQuiz}
                  className="bg-[#840B94] hover:bg-[#6a0876] text-white font-bold px-8 py-3 rounded-lg transition-colors"
                  disabled={!!quizError}
                >
                  Retry Level
                </button>
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

  const handleRetakeQuiz = () => {
    // Clear quiz-related data from localStorage
    localStorage.removeItem("quizState");
    localStorage.removeItem("quizAlreadyTaken");
    setQuizError(null);
    setQuizKey((prevKey) => prevKey + 1); // Increment key to force remount
    // Go back to the quiz stage
    setChangeStages(4);
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
