"use client";
import Image from "next/image";
import { CourseGuideContext } from "./course-guild-contex/Contex";
import { use, useContext, useEffect, useMemo, useState } from "react";
import { FaPlay, FaPause, FaLock, FaLockOpen } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";
import { StudentContext } from "@/app/(dashboard)/student/component/Context/StudentContext";
import axios from "axios";

export default function MissionVideo({ id, onQuizStateChange }) {
  const { showVideo, setShowVideo, capselIndex, setCapselIndex } =
    useContext(CourseGuideContext);

  const {
    currentCapsule = [], // defensively default to []
    setCurrentCapsule,
    watchedVideos, // <- your fetched array: [{capsuleId, ...}]
    setWatchedVideos,
    showQuiz,
    setShowQuiz,
  } = useContext(StudentContext);

  console.log(currentCapsule, "currentCapsule in MissionVideos.jsx");

  const [missionsCapsels, setMissionsCapsels] = useState([]);
  const [loading, setLoading] = useState(false);

  // Build a quick lookup for watched capsule IDs
  const watchedSet = useMemo(() => {
    // supports either array of objects or deep .data.watchedCapsules
    const raw = Array.isArray(watchedVideos)
      ? watchedVideos
      : watchedVideos?.data?.watchedCapsules ?? [];
    return new Set(raw.map((w) => w.capsule));
  }, [watchedVideos]);

  // Simple helper
  const isVideoWatched = (capsuleId) => watchedSet.has(capsuleId);

  // Get the total count of watched videos
  const watchedCount = useMemo(() => {
    const raw = Array.isArray(watchedVideos)
      ? watchedVideos
      : watchedVideos?.data?.watchedCapsules ?? [];
    return raw.length;
  }, [watchedVideos]);

  // Enable rule:
  // - Always enable index 0
  // - Enable the current video being watched (capselIndex)
  // - Enable up to watchedCount+1 (so if 2 videos are watched, enable indices 0, 1, 2, 3)
  const isVideoEnabled = (index) => {
    if (index === 0) return true;
    if (index === capselIndex) return true; // Always enable the current video
    return index <= watchedCount;
  };

  // Quiz should be enabled when all capsules are watched
  const isQuizEnabled = useMemo(() => {
    if (!currentCapsule || currentCapsule.length === 0) return false;
    return watchedCount === currentCapsule.length;
  }, [watchedCount, currentCapsule.length]);

  // Effect to notify parent component when quiz state changes
  useEffect(() => {
    if (onQuizStateChange) {
      onQuizStateChange(showQuiz);
    }
  }, [showQuiz, onQuizStateChange]);

  const handleVideoClick = (index) => {
    if (isVideoEnabled(index)) {
      setShowVideo(false);
      setCapselIndex(index);
    }
  };

  useEffect(() => {
    if (isQuizEnabled) {
      setShowQuiz(true);
      console.log(
        "Quiz enabled! All videos watched:",
        watchedCount,
        "/",
        currentCapsule.length
      );
    } else {
      setShowQuiz(false);
      console.log(
        "Quiz not enabled yet. Videos watched:",
        watchedCount,
        "/",
        currentCapsule.length
      );
    }
  }, [isQuizEnabled, setShowQuiz, watchedCount, currentCapsule.length]);

  const handleStartQuiz = () => {
    if (isQuizEnabled) {
      setShowQuiz(true);
      console.log("Starting quiz...");
    }
  };

  return (
    <div>
      {showVideo && (
        <div
          className={`fixed top-0 left-0 px py w-full h-full z-50 bg-black lg:relative lg:opacity-100 lg:w-[300px] xl:w-[400px] lg:h-[90vh] overflow-auto scrollbar-hide h-[90vh] lg:z-0`}
        >
          <div className="flex items-center justify-between lg:block">
            <p
              style={{ margin: " 15px 0px" }}
              className="text-[#BDE75D] font-[600] sm:text-[19px] sm:leading-[100%] sm:text-center "
            >
              Mutation Process
            </p>

            <p
              onClick={() => setShowVideo(false)}
              className="cursor-pointer lg:hidden"
            >
              <FaTimes />
            </p>
          </div>

          <div className=" h-fit grid  gap-4 ">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-white">Loading watched videos...</p>
              </div>
            ) : (
              currentCapsule.map((el, i) => {
                const isEnabled = isVideoEnabled(i);
                const isWatched = isVideoWatched(el.id);

                return (
                  <div
                    key={el.id ?? i}
                    onClick={() => handleVideoClick(i)}
                    style={{ padding: "0 30px", opacity: isEnabled ? 1 : 0.5 }}
                    className={`flex rounded-[20px] bg-[#380C39] items-center justify-between h-[100px] ${
                      isEnabled
                        ? "cursor-pointer hover:bg-[#4a1a4b]"
                        : "cursor-not-allowed"
                    } `}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <p
                        className={
                          isEnabled ? "text-[#BDE75D]" : "text-gray-500"
                        }
                      >
                        {isEnabled ? <FaPlay /> : <FaPause />}
                      </p>
                      <div>
                        <p
                          className={isEnabled ? "text-white" : "text-gray-500"}
                        >
                          {el.title}
                        </p>
                        <p
                          className={
                            isEnabled ? "text-gray-300" : "text-gray-600"
                          }
                        >
                          {el.id}
                        </p>
                      </div>
                    </div>

                    <div
                      className={isEnabled ? "text-[#BDE75D]" : "text-gray-500"}
                    >
                      {isEnabled ? <FaLockOpen /> : <FaLock />}
                    </div>
                  </div>
                );
              })
            )}

            {/* <button
              className={`font-[600] max-h-[200px] sm:text-[39px] sm:leading-[57px] w-full rounded-[20px] ${
                isQuizEnabled
                  ? "bg-[#BDE75D] text-black cursor-pointer hover:bg-[#a8d151]"
                  : "bg-[#380C39] text-gray-500 cursor-not-allowed"
              }`}
              disabled={!isQuizEnabled}
              style={{ opacity: isQuizEnabled ? 1 : 0.5 }}
              onClick={handleStartQuiz}
            >
              Start Quiz
            </button> */}
          </div>
        </div>
      )}
    </div>
  );
}
