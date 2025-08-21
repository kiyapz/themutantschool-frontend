"use client";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LevelsPath({ level }) {
  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quizbtn, setQuizbtn] = useState(false);
  const [levelState, setLevelState] = useState({
    container: null,
    level: null,
    id: null,
  });

  console.log("Levels Path:", levelState.id);

  const positions = [
    { top: "0px", left: "50%" },
    { top: "90px", left: "20%" },
    { top: "240px", left: "15%" },
    { top: "360px", left: "25%" },
    { top: "480px", left: "40%" },
    { top: "600px", left: "55%" },
  ];

  useEffect(() => {
    const fetchMissionData = async () => {
      const token = localStorage.getItem("login-accessToken");

      try {
        const response = await axios.get(
          `https://themutantschool-backend.onrender.com/api/mission-capsule/level/${levelState.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const allMissions = response.data.data;
        console.log("Fetched Capsels nnnnnnnnnn", response.data.data);
      } catch (error) {
        console.log(
          "Error fetching missions:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMissionData();
  }, [levelState.id]);

  if (loading) return <div className="p-4">Loading mission...</div>;

  return (
    <div className="h-fit flex flex-col gap-15 max-w-[800px] w-full ">
      {level.map((currentlevel, containerIndex) => (
        <div key={containerIndex}>
          <div className="relative  w-full  flex flex-col gap-3 h-[1100px] sm:h-[1050px] bg-black">
            <div>
              <div
                style={{ padding: "30px" }}
                className="h-fit bg-gradient-to-r from-[#231926] to-[#5D1D49] sm:h-[233.1px] w-full  grid gap-5 sm:grid-cols-2 "
              >
                <div className="flex flex-col gap-5 sm:gap-0 justify-between order-2 sm:order-1">
                  <div className="flex flex-col gap-10">
                    <div>
                      <p className="font-[800] text-[21px] xl:text-[38px] leading-[39px] ">
                        {currentlevel.title}
                      </p>
                      <p className="font-[400] text-[15px] xl:text-[18px] leading-[18px] ">
                        {currentlevel.summary}
                      </p>
                    </div>

                    <p className="font-[300] text-[15px] xl:text-[23px] leading-[20px] ">
                      {currentlevel.capsules.length} Capsules • 1 Quiz
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    backgroundImage: `url(${
                      // missionData.thumbnail?.url ||
                      "/images/students-images/Group (15).png"
                    })`,
                  }}
                  className="bg-center bg-cover h-[20vh] order-1 w-full sm:h-full"
                ></div>
              </div>
            </div>

            {/* Label before levels */}
            <p
              style={{ margin: "10px 0px" }}
              className="font-[900] text-[35px] text-[#434343] leading-[20px] text-center"
            >
              Level {containerIndex + 1}
            </p>

            {/* Fixed: Access capsule properties correctly */}
            {currentlevel.capsules &&
              currentlevel.capsules.map((capsule, levelIndex) => (
                <Link
                  href={`/student/student-dashboard/student-course-guilde/${currentlevel._id}`}
                  key={capsule._id || levelIndex}
                  className="relative"
                >
                  <div
                    style={{
                      top: positions[levelIndex]?.top || "0px",
                      left: positions[levelIndex]?.left || "50%",
                      transform: "translateX(-50%)",
                    }}
                    className="absolute h-fit "
                  >
                    {/* shadow layer */}
                    <div
                      className={`${
                        levelState.container === containerIndex &&
                        levelState.level === levelIndex
                          ? "bg-[#231926]"
                          : "bg-[#4f4f4e]"
                      } absolute w-full h-[15px] bottom-[-10px] rounded-b-lg`}
                    ></div>

                    <div
                      style={{ padding: "35px" }}
                      className={`${
                        levelState.container === containerIndex &&
                        levelState.level === levelIndex
                          ? "border border-[#5D5D5D] rounded-[20px] border-[7px]"
                          : ""
                      } absolute w-fit h-fit top-[-20px] left-[-18px]`}
                    ></div>

                    {/* capsule */}
                    <div
                      onClick={() =>
                        setLevelState({
                          container: containerIndex,
                          level: levelIndex,
                          id: currentlevel._id,
                        })
                      }
                      style={{ padding: "0 20px" }}
                      className={`${
                        levelState.container === containerIndex &&
                        levelState.level === levelIndex
                          ? "bg-[#840B94] text-white"
                          : "bg-[#9E9E9E] text-black"
                      } relative z-10 w-fit h-[37.91px] cursor-pointer flex items-center justify-center rounded-lg font-bold px-5`}
                    >
                      {` ${levelIndex + 1}`}
                    </div>
                  </div>
                </Link>
              ))}

            {/* quiz btn */}
            <div
              style={{
                bottom: 0,
                left: "55%",
                transform: "translateX(-50%)",
              }}
              className="absolute h-fit "
            >
              {/* shadow layer */}
              <div
                className={`${
                  quizbtn ? "bg-[#231926]" : "bg-[#4f4f4e]"
                } absolute w-full h-[15px] bottom-[-10px] rounded-b-lg`}
              ></div>

              <div
                style={{ padding: "35px" }}
                className={`${
                  quizbtn
                    ? "border border-[#5D5D5D] rounded-[20px] border-[7px] w-[90px]"
                    : ""
                } absolute w-fit h-fit top-[-20px] left-[-18px]`}
              ></div>

              {/* Quize */}
              <div
                onClick={() => setQuizbtn(true)}
                style={{ padding: "0 20px" }}
                className={`${
                  quizbtn
                    ? "bg-[#840B94] text-white"
                    : "bg-[#9E9E9E] text-black"
                } relative z-10 w-fit h-[37.91px] cursor-pointer flex items-center justify-center rounded-lg font-bold px-5`}
              >
                Quize
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
