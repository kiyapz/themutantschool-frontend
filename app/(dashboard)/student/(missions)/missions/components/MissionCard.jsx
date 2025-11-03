"use client";
import { imageConfigDefault } from "next/dist/shared/lib/image-config";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MissionCard({
  text1,
  text3,
  image = "/images/students-images/Group (15).png",
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
  const displayTotalLevels = totalLevels || levels?.length || 0;

  return (
    <div
      className={`h-fit ${bg} sm:h-[382.25px] w-full grid gap-5 sm:grid-cols-2 rounded-[20px] p-4 sm:p-6 md:p-8`}
    >
      <div className="flex flex-col gap-4 sm:gap-5 md:gap-0 justify-between order-2 sm:order-1">
        <div>
          <p
            className="font-[800] text-[16px] sm:text-[18px] md:text-[21px] xl:text-[28px] leading-[24px] sm:leading-[28px] xl:leading-[34px] mb-2"
            style={{ color: "var(--text-light-2)" }}
          >
            {text1}
          </p>

          {/* Difficulty - Only show if not default "Beginner" */}
          {difficulty && difficulty !== "Beginner" && (
            <p
              className="font-[500] text-[10px] sm:text-[11px] xl:text-[14px] leading-[15px] sm:leading-[16px] mb-2"
              style={{ color: "var(--text)" }}
            >
              Difficulty: {difficulty}
            </p>
          )}

          {/* Price and Payment Status */}
          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
            <p
              className="font-[700] text-[14px] sm:text-[16px] xl:text-[20px] leading-[18px] sm:leading-[20px]"
              style={{ color: "var(--primary)" }}
            >
              {isFree ? "Free" : price ? `$${price}` : "Price not set"}
            </p>
            {paymentStatus && (
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

        <div className="flex flex-col gap-3">
          {/* Progress Bar and Levels */}
          {isLoadingProgress ? (
            <div className="w-full flex items-center gap-2 animate-pulse bg-black rounded-[8px] px-3 py-1.5">
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
            <div className="w-full flex items-center gap-2 bg-black rounded-[8px] px-3 py-1.5">
              <div className="flex items-center flex-1">
                <span className="flex-1 max-w-[60%] sm:max-w-[50%]">
                  <div
                    className="w-full rounded-[5px] h-[5px] bg-gray-600"
                    style={{ backgroundColor: "var(--gray-600)" }}
                  >
                    <div
                      className="rounded-[5px] h-[5px] transition-all duration-300"
                      style={{
                        backgroundColor: "var(--warning)",
                        width: `${actualProgress}%`,
                      }}
                    ></div>
                  </div>
                </span>
                {(progress?.length || 0) > 0 && (
                  <span
                    className="font-[700] text-[10px] sm:text-[11px] leading-[18px] sm:leading-[20px] ml-2 whitespace-nowrap"
                    style={{ color: "var(--text)" }}
                  >
                    {progress?.length || 0}/{displayTotalLevels || "?"} Levels
                  </span>
                )}
              </div>
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

          <div>
            {isAvailable ? (
              <Link
                href={`/mission/${text1
                  .toLowerCase()
                  .replace(/[^\w\s-]/g, "")
                  .replace(/\s+/g, "-")
                  .replace(/-+/g, "-")}`}
              >
                <button className="w-full xl:w-[234.64px] h-[48px] sm:h-[56.4px] cursor-pointer studentbtn2 rounded-[30px] text-[14px] sm:text-[16px]">
                  Explore Missions
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
                <button className="w-full xl:w-[234.64px] h-[48px] sm:h-[56.4px] cursor-pointer studentbtn2 rounded-[30px] text-[14px] sm:text-[16px]">
                  Continue Mission
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div
        style={{
          backgroundImage: `url(${
            image || "/images/students-images/Group (15).png"
          })`,
        }}
        className="bg-center bg-cover h-[180px] sm:h-[20vh] order-1 w-full sm:order-2 sm:h-full rounded-[10px]"
      ></div>
    </div>
  );
}
