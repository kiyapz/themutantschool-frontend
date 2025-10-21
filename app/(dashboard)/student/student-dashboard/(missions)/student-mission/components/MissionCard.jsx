"use client";
import { imageConfigDefault } from "next/dist/shared/lib/image-config";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MissionCard({
  text1,
  text2,
  text3,
  image = "/images/students-images/Group (15).png",
  bg = "bg-gradient-to-r from-[#0E0E0E] to-[#0F060F]",
  missionId,
  isAvailable = false,
  instructor,
  levels,
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
  return (
    <div
      style={{ padding: "30px" }}
      className={`h-fit ${bg}  sm:h-[382.25px] w-full grid gap-5 sm:grid-cols-2 rounded-[20px] `}
    >
      <div className="flex flex-col gap-5 sm:gap-0 justify-between order-2 sm:order-1">
        <div>
          <p
            className="font-[800] text-[21px] xl:text-[38px] leading-[39px]"
            style={{ color: "var(--text-light-2)" }}
          >
            {text1}
          </p>

          {/* Instructor Info */}
          {instructor && (
            <div className="flex items-center gap-2 mb-2">
              <p
                className="font-[500] text-[12px] xl:text-[16px] leading-[18px]"
                style={{ color: "var(--text)" }}
              >
                Instructor:{" "}
                {instructor.name ||
                  instructor.firstName + " " + instructor.lastName ||
                  "Unknown"}
              </p>
            </div>
          )}

          {/* Short Description */}
          {shortDescription && (
            <p
              className="font-[400] text-[11px] xl:text-[14px] leading-[16px] mb-2"
              style={{ color: "var(--text)" }}
            >
              {shortDescription}
            </p>
          )}

          {/* Category and Rating */}
          <div className="flex items-center justify-between mb-2">
            {category && (
              <p
                className="font-[500] text-[10px] xl:text-[12px] leading-[14px] px-2 py-1 rounded-[5px] border"
                style={{ color: "var(--text)", borderColor: "var(--gray-400)" }}
              >
                {category}
              </p>
            )}
            {averageRating && (
              <p
                className="font-[600] text-[10px] xl:text-[12px] leading-[14px] flex items-center gap-1"
                style={{ color: "var(--warning)" }}
              >
                ⭐ {averageRating}
              </p>
            )}
          </div>

          {/* Levels and Duration */}
          <div className="flex items-center gap-4 mb-2">
            {levels && (
              <p
                className="font-[500] text-[12px] xl:text-[16px] leading-[18px]"
                style={{ color: "var(--text)" }}
              >
                {levels.length} Levels
              </p>
            )}
            {text2 && (
              <p
                className="font-[500] text-[12px] xl:text-[16px] leading-[18px]"
                style={{ color: "var(--text)" }}
              >
                Duration: {text2}
              </p>
            )}
          </div>

          {/* Difficulty */}
          {difficulty && (
            <p
              className="font-[500] text-[11px] xl:text-[14px] leading-[16px] mb-2"
              style={{ color: "var(--text)" }}
            >
              Difficulty: {difficulty}
            </p>
          )}

          {/* Price and Payment Status */}
          <div className="flex items-center justify-between mb-2">
            <p
              className="font-[700] text-[14px] xl:text-[18px] leading-[20px]"
              style={{ color: "var(--primary)" }}
            >
              {isFree ? "Free" : `$${price}`}
            </p>
            {paymentStatus && (
              <p
                className={`font-[600] text-[10px] xl:text-[12px] leading-[14px] px-2 py-1 rounded-[5px] ${
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

          {/* Enrollment Date */}
          {enrolledAt && (
            <p
              className="font-[400] text-[10px] xl:text-[12px] leading-[14px] mb-2"
              style={{ color: "var(--text)" }}
            >
              Enrolled: {new Date(enrolledAt).toLocaleDateString()}
            </p>
          )}
        </div>

        <div className="w-full flex items-center">
          <div className="flex items-center w-full">
            <span className="w-[50%]">
              <div
                className="w-full rounded-[5px] h-[5px] bg-gray-600"
                style={{ backgroundColor: "var(--gray-600)" }}
              >
                <div
                  className="rounded-[5px] h-[5px] transition-all duration-300"
                  style={{
                    backgroundColor: "var(--warning)",
                    width: `${progressPercentage || 0}%`,
                  }}
                ></div>
              </div>
            </span>
            <span
              className="font-[700] text-[11px] leading-[20px] ml-2"
              style={{ color: "var(--text)" }}
            >
              {progress?.length || 0}/{levels?.length || 0} Levels
            </span>
          </div>
          <div>
            <Image
              src={"/images/students-images/Group (16).png"}
              width={30.72}
              height={29.59}
              alt="star"
            />
          </div>
        </div>

        <div>
          {isAvailable ? (
            <Link href={`/mission/${missionId}`}>
              <button className=" w-full  xl:w-[234.64px] h-[56.4px] cursor-pointer studentbtn2 rounded-[30px] ">
                Explore Missions
              </button>
            </Link>
          ) : (
            <Link
              href={`/student/student-dashboard/student-mission-study-levels/${text1
                .toLowerCase()
                .replace(/[^\w\s-]/g, "")
                .replace(/\s+/g, "-")
                .substring(0, 50)}`}
              onClick={() => {
                localStorage.setItem("studyMissionId", missionId);
              }}
            >
              <button className=" w-full  xl:w-[234.64px] h-[56.4px] cursor-pointer studentbtn2 rounded-[30px] ">
                Continue Mission
              </button>
            </Link>
          )}
        </div>
      </div>

      <div
        style={{
          backgroundImage: `url(${
            image || "/images/students-images/Group (15).png"
          })`,
        }}
        className="bg-center bg-cover h-[20vh] order-1 w-full sm:h-full rounded-[10px]"
      ></div>
    </div>
  );
}
