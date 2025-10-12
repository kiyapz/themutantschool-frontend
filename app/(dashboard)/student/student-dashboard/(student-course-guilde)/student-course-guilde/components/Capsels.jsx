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

export default function Capsels({ id, capsuleId }) {
  const videoRef = useRef(null);
  const [watchedDuration, setWatchedDuration] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const levelId = id; // Using the passed id as levelId for LearningOutcomes
  const [showSavedPositionNotification, setShowSavedPositionNotification] =
    useState(false);
  const [
    showRestoredPositionNotification,
    setShowRestoredPositionNotification,
  ] = useState(false);

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

  // Load saved state from localStorage on component mount and handle capsuleId from URL
  useEffect(() => {
    const savedStage = localStorage.getItem(`courseStage_${id}`);
    const savedCapsuleIndex = localStorage.getItem(`capsuleIndex_${id}`);

    // First check if we have a specific capsuleId from URL
    if (capsuleId && currentCapsule && currentCapsule.length > 0) {
      console.log("CapsuleId provided in URL:", capsuleId);

      // Find the index of the capsule with matching ID
      const targetIndex = currentCapsule.findIndex(
        (capsule) => capsule._id === capsuleId
      );

      if (targetIndex !== -1) {
        console.log("Found matching capsule at index:", targetIndex);
        setCapselIndex(targetIndex);

        // Check if this specific capsule has been watched
        const isTargetCapsuleWatched =
          watchedVideos &&
          Array.isArray(watchedVideos) &&
          watchedVideos.some((watched) => watched.capsule === capsuleId);

        // If this specific capsule has been watched, go to video stage
        if (isTargetCapsuleWatched) {
          console.log(
            "This specific capsule has been watched, going to video stage"
          );
          setChangeStages(3); // Navigate to the video viewing stage
        }
        // If user has watched at least the first video but not this one, go to video stage
        else if (watchedVideos && watchedVideos.length > 0) {
          console.log(
            "User has watched some videos, navigating to video stage"
          );
          setChangeStages(3); // Navigate to the video viewing stage
        } else {
          // Otherwise start from the beginning
          console.log(
            "No watched videos found, starting from learning outcomes"
          );
          setChangeStages(1);
        }

        // Save these values to localStorage
        localStorage.setItem(`capsuleIndex_${id}`, targetIndex.toString());
        return; // Skip the rest of the function
      } else {
        console.log("Capsule ID not found in current capsules");
      }
    }

    // If no capsuleId provided or not found, use saved state
    if (savedStage) {
      setChangeStages(parseInt(savedStage));
    }

    if (savedCapsuleIndex && setCapselIndex) {
      setCapselIndex(parseInt(savedCapsuleIndex));
    }

    // Cleanup function to reset state when the level ID changes
    return () => {
      setChangeStages(1);
      if (setCapselIndex) {
        setCapselIndex(0);
      }
    };
  }, [id, setCapselIndex, capsuleId, currentCapsule, watchedVideos]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(`courseStage_${id}`, changeStages.toString());
  }, [changeStages, id]);

  useEffect(() => {
    if (capselIndex !== undefined) {
      localStorage.setItem(`capsuleIndex_${id}`, capselIndex.toString());
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
  }, [changeStages, setShowVideo]);

  // Calculate progress
  const totalCapsules = currentCapsule.length;
  const watchedCapsules = watchedVideos.length;

  const getStageProgress = () => {
    // This function maps the overall progress to the four specific stages
    const progressRatio =
      totalCapsules > 0 ? watchedCapsules / totalCapsules : 0;

    if (changeStages === 1)
      return { completed: 0, total: totalCapsules > 0 ? totalCapsules + 1 : 1 }; // Learning outcomes + Quiz
    if (changeStages === 2)
      return {
        completed: Math.min(1, watchedCapsules),
        total: totalCapsules + 1,
      }; // Intro video + Quiz
    if (changeStages === 3)
      return { completed: watchedCapsules, total: totalCapsules + 1 }; // Capsule videos + Quiz
    if (changeStages === 4)
      return { completed: totalCapsules, total: totalCapsules + 1 }; // At the quiz stage
    if (changeStages === 5)
      return { completed: totalCapsules + 1, total: totalCapsules + 1 }; // Completion stage (Quiz passed)

    return { completed: watchedCapsules, total: totalCapsules + 1 };
  };

  const currentProgress = getStageProgress();

  // watched videos
  useEffect(() => {
    const fetchWachedVideo = async () => {
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

        // setWatchedVideos([{'jji':'jj'}]);
        const completedCapsules = response.data?.data?.completedCapsules;

        // Prevent existing watchedVideos from being overwritten with empty array
        if (Array.isArray(completedCapsules) && completedCapsules.length > 0) {
          setWatchedVideos(completedCapsules);
          console.log(
            "Updated watchedVideos with",
            completedCapsules.length,
            "items"
          );
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
      }
    };

    fetchWachedVideo();
  }, [watchedDuration, capsuleId]);

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
                        ></iframe>
                      );
                    } else if (missionVideoUrl) {
                      return (
                        <video
                          controls
                          className="w-full h-full max-h-full object-contain rounded-lg"
                          preload="metadata"
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
                      onLoad={() => {
                        // YouTube videos can't use the same tracking methods
                        // Set a reasonable default duration for YouTube videos
                        setVideoDuration(300); // 5 minutes default
                        setWatchedDuration(300); // Mark as fully watched

                        // For YouTube videos, we need to immediately update progress
                        setTimeout(() => {
                          updateCapsuleProgress();
                          // After a short delay, check if we should advance to next video
                          setTimeout(() => {
                            if (capselIndex < currentCapsule.length - 1) {
                              handleAutoAdvance();
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
                        }
                      }}
                      onEnded={() => {
                        updateCapsuleProgress();
                        handleAutoAdvance();
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
                />
              </div>
              {/* text */}
              <div className="h-fit w-full flex flex-col justify-center">
                <LevelQuiz
                  onQuizComplete={(passed) => {
                    if (passed) {
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
          <div className="w-full h-[82vh] flexcenter bg-[#0A0A0A] p-[10px]">
            <div className="max-w-[1261px] mx-auto w-full h-full flex flex-col">
              {/* Loading Bar - Fixed height */}
              <div className="h-[60px] w-full flex items-center justify-between">
                <LoadingBar
                  completed={currentProgress.completed}
                  total={currentProgress.total}
                />
              </div>

              {/* Completion Content */}
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-24 w-24 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-[#822A8D] font-[700] text-[30px] sm:text-[40px] leading-[43px] mb-4">
                  Module Completed!
                </h2>
                <p className="text-white text-lg mb-8 max-w-2xl">
                  Congratulations! You have successfully completed this module.
                  You've gained valuable knowledge and skills that will help you
                  in your learning journey.
                </p>

                <div className="flex gap-4">
                  <button
                    onClick={handleRetakeQuiz}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                  >
                    Retake Quiz
                  </button>
                  {/* You can add another button here, e.g., for "Next Module" */}
                </div>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="w-full h-[82vh] flexcenter bg-[#0A0A0A] p-[10px]">
            <div className="max-w-[1261px] mx-auto w-full h-full flex flex-col">
              {/* Loading Bar - Fixed height */}
              <div className="h-[60px] w-full flex items-center justify-between">
                <LoadingBar
                  completed={currentProgress.completed}
                  total={currentProgress.total}
                />
              </div>

              {/* Failure Content */}
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-24 w-24 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-[#822A8D] font-[700] text-[30px] sm:text-[40px] leading-[43px] mb-4">
                  Module Failed
                </h2>
                <p className="text-white text-lg mb-8 max-w-2xl">
                  Don't worry, failure is part of the learning process. Review
                  the material and try the quiz again.
                </p>

                <div className="flex gap-4">
                  <button
                    onClick={handleRetakeQuiz}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                  >
                    Retake Quiz
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

  const handleRetakeQuiz = () => {
    // Clear quiz-related data from localStorage
    localStorage.removeItem("quizState");
    localStorage.removeItem("quizAlreadyTaken");

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
