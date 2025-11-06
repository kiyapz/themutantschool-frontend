"use client";
import { imageConfigDefault } from "next/dist/shared/lib/image-config";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MissionCard({
  text1,
  text3,
  image = "/images/students-images/Group (18).png",
  bg = "bg-gradient-to-r from-[#0E0E0E] to-[#0F060F]",
  missionId,
  isAvailable = false,
  instructor,
  levels,
  totalLevels,
  shortDescription,
  price,
  isFree,
  category,
  averageRating,
  difficulty,
  progress,
  progressPercentage,
  paymentStatus,
  paymentInfo,
  enrolledAt,
  showLevelsInsteadOfPrice = false,
  isDashboardView = false,
}) {
  const [level, setLevel] = useState(null);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);

  useEffect(() => {
    const getLevel = (text3) => {
      if (text3 < 35) return 1;
      if (text3 < 45) return 2;
      if (text3 < 55) return 3;
      if (text3 < 65) return 4;
      return 5;
    };

    const calculatedLevel = getLevel(text3);
    setLevel(calculatedLevel);
  }, [text3]);

  useEffect(() => {
    // Simulate loading state for progress data
    const timer = setTimeout(() => {
      setIsLoadingProgress(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [progress, progressPercentage]);

  // Calculate actual progress percentage based on completed levels
  const calculateProgress = () => {
    const completedLevels = progress?.length || 0;
    const total = totalLevels || levels?.length || 0;
    if (total === 0) return 0;
    const calculatedPercentage = (completedLevels / total) * 100;
    return Math.min(
      Math.max(calculatedPercentage, completedLevels > 0 ? 5 : 0),
      100
    );
  };

  const actualProgress = calculateProgress();
  const barProgress = isAvailable ? 100 : actualProgress;
  const displayTotalLevels = totalLevels || levels?.length || 0;

  return (
    <div
      className={`${bg} ${
        isDashboardView
          ? "h-fit min-h-[400px] sm:min-h-[420px] xl:min-h-[450px]"
          : "h-fit sm:h-[382.25px]"
      } w-full grid grid-cols-1 ${
        isDashboardView ? "2xl:grid-cols-2" : "lg:grid-cols-2"
      } gap-4 sm:gap-6 xl:gap-8 rounded-[20px] ${
        isDashboardView
          ? "p-4 sm:p-6 md:p-8 xl:p-8 2xl:p-10"
          : "p-4 sm:p-6 md:p-8"
      }`}
    >
      <div
        className={`flex flex-col ${
          isDashboardView
            ? "justify-between h-full"
            : "gap-5 sm:gap-6 md:gap-0 justify-between"
        } order-2 ${isDashboardView ? "2xl:order-1" : "lg:order-1"} w-full`}
      >
        <div className={isDashboardView ? "flex-1 flex flex-col" : ""}>
          <p
            className={`font-[800] text-[16px] sm:text-[18px] md:text-[19px] lg:text-[22px] xl:text-[28px] 2xl:text-[38px] leading-[24px] sm:leading-[26px] md:leading-[28px] lg:leading-[30px] xl:leading-[34px] 2xl:leading-[34px] ${
              isDashboardView ? "mb-4 sm:mb-5 xl:mb-6" : "mb-4"
            }`}
            style={{ color: "var(--text-light-2)" }}
          >
            {isDashboardView ? "Explore our collections of missions" : text1}
          </p>

          {/* Difficulty - Only show if not default "Beginner" and not dashboard view */}
          {!isDashboardView && difficulty && difficulty !== "Beginner" && (
            <p
              className="font-[500] text-[10px] sm:text-[11px] xl:text-[14px] leading-[15px] sm:leading-[16px] mb-4"
              style={{ color: "var(--text)" }}
            >
              Difficulty: {difficulty}
            </p>
          )}

          {/* Price or Levels */}
          <div
            className={`flex items-center justify-between ${
              isDashboardView ? "mb-4 sm:mb-5 xl:mb-6" : "mb-4"
            } flex-wrap gap-2`}
          >
            {isDashboardView ? (
              <p
                className="font-[700] text-[14px] sm:text-[16px] xl:text-[17px] leading-[18px] sm:leading-[25px]"
                style={{ color: "var(--text)" }}
              >
                Complete Missions and become a certified Mutant
              </p>
            ) : showLevelsInsteadOfPrice ? (
              <p
                className="font-[700] text-[14px] sm:text-[16px] xl:text-[20px] leading-[18px] sm:leading-[20px]"
                // style={{ color: "var(--text)" }}
              >
                {/* {displayTotalLevels || 0} Levels */}
              </p>
            ) : (
              <p
                className="font-[700] text-[14px] sm:text-[16px] xl:text-[20px] leading-[18px] sm:leading-[20px]"
                style={{ color: "var(--primary)" }}
              >
                {isFree ? "Free" : price ? `$${price}` : "Price not set"}
              </p>
            )}
            {!isDashboardView && !showLevelsInsteadOfPrice && paymentStatus && (
              <p
                className={`font-[600] text-[9px] sm:text-[10px] xl:text-[12px] leading-[12px] sm:leading-[14px] px-2 py-1 rounded-[5px] ${
                  paymentStatus === "completed"
                    ? "bg-green-100 text-green-800"
                    : paymentStatus === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {paymentStatus.toUpperCase()}
              </p>
            )}
          </div>
        </div>

        <div className={`flex flex-col ${isDashboardView ? "" : "gap-5"}`}>
          {/* Progress Bar and Levels - Only show if not dashboard view */}
          {!isDashboardView && (
            <>
              {isLoadingProgress ? (
                <div className="w-full flex items-center gap-2 animate-pulse bg-black rounded-[8px] px-4 py-2">
                  <div className="flex items-center flex-1">
                    <span className="flex-1 max-w-[60%] sm:max-w-[50%]">
                      <div className="w-full rounded-[5px] h-[5px] bg-gray-700"></div>
                    </span>
                    <span className="ml-2">
                      <div className="h-4 w-20 bg-gray-700 rounded"></div>
                    </span>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px] bg-gray-700 rounded-full"></div>
                  </div>
                </div>
              ) : (
                <div className="w-full flex items-center justify-between bg-black rounded-[8px] px-4 py-2">
                  <span className="flex-1 max-w-[60%] sm:max-w-[50%]">
                    <div
                      className="w-full rounded-[5px] h-[5px] bg-gray-600 relative"
                      style={{ backgroundColor: "var(--gray-600)" }}
                    >
                      <div
                        className="rounded-[5px] h-[5px] transition-all duration-300"
                        style={{
                          backgroundColor: "var(--warning)",
                          width: `${barProgress}%`,
                        }}
                      ></div>
                      {/* Centered overlay text showing X/5 */}
                      <div
                        className="absolute inset-0 flex items-center justify-center font-[700] text-[10px] sm:text-[11px] leading-[18px] sm:leading-[20px] pointer-events-none"
                        style={{ color: "var(--text)" }}
                      >
                        {progress?.length || 0}/5
                      </div>
                    </div>
                  </span>
                  <span
                    className="font-[700] text-[10px] sm:text-[11px] leading-[18px] sm:leading-[20px] mx-4 sm:mx-5 whitespace-nowrap"
                    style={{ color: "var(--text)" }}
                  >
                    {displayTotalLevels || 0}
                  </span>
                  <div className="flex-shrink-0">
                    <Image
                      src={"/images/students-images/Group (16).png"}
                      width={14}
                      height={14}
                      className="sm:w-[16px] sm:h-[16px]"
                      alt="star"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          <div>
            {isAvailable ? (
              <Link
                href={
                  isDashboardView
                    ? "/missions"
                    : `/mission/${text1
                        .toLowerCase()
                        .replace(/[^\w\s-]/g, "")
                        .replace(/\s+/g, "-")
                        .replace(/-+/g, "-")}`
                }
              >
                <button
                  className={`w-full xl:w-[234.64px] h-[48px] sm:h-[56.4px] cursor-pointer rounded-[30px] text-[14px] sm:text-[16px] ${
                    isDashboardView ? "" : "studentbtn2"
                  }`}
                  style={isDashboardView ? { backgroundColor: "#2A2A2A" } : {}}
                >
                  {isDashboardView ? "Explore Missions" : "Continue Mission"}
                </button>
              </Link>
            ) : (
              <Link
                href={`/student/student-mission-study-levels/${text1
                  .toLowerCase()
                  .replace(/[^\w\s-]/g, "")
                  .replace(/\s+/g, "-")
                  .substring(0, 50)}`}
                onClick={() => {
                  localStorage.setItem("studyMissionId", missionId);
                }}
              >
                <button
                  className={`w-full xl:w-[234.64px] h-[48px] sm:h-[56.4px] cursor-pointer rounded-[30px] text-[14px] sm:text-[16px] ${
                    isDashboardView ? "" : "studentbtn2"
                  }`}
                  style={isDashboardView ? { backgroundColor: "#2A2A2A" } : {}}
                >
                  {isDashboardView ? "Explore Missions" : "Continue Mission"}
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div
        className={`bg-center bg-cover flexcenter h-[200px] sm:h-[220px] xl:h-[240px] ${
          isDashboardView ? "2xl:h-full 2xl:order-2" : "lg:order-2"
        } order-1 w-full rounded-[15px] md:rounded-[20px] overflow-hidden ${
          isDashboardView ? "items-center justify-center" : ""
        }`}
      >
        {isDashboardView && (
          <Image
            src={"/images/students-images/Group (18).png"}
            width={259.2}
            height={207.86}
            alt="mutant-robot"
            className="w-[90px] h-auto sm:w-[180px] xl:w-[259px] rounded-[15px] md:rounded-[20px]"
            priority
            loading="eager"
          />
        )}
      </div>
    </div>
  );
}
