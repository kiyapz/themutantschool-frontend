"use client";
import LoadingSpinner from "@/app/(dashboard)/student/(missions)/missions/components/LoadingSpinner";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "@/lib/api";

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${BASE_URL}/user-profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        console.log("Dashboard API Response:", data);

        if (response.ok && data.success) {
          // Transform the API response data to match leaderboard format
          if (data.data && Array.isArray(data.data)) {
            // Filter only students
            const students = data.data.filter(
              (user) => user.role === "student"
            );

            console.log(`Total students found: ${students.length}`);

            // Sort by XP in descending order (highest first)
            const sortedStudents = students.sort((a, b) => {
              const xpA = a.xp || 0;
              const xpB = b.xp || 0;
              return xpB - xpA; // Descending order: highest XP first
            });

            // Slice the best 10 students (top 10 with highest XP)
            const top10Students = sortedStudents.slice(0, 10);

            console.log(
              `Top 10 students by XP:`,
              top10Students.map((s) => ({
                name: `${s.firstName} ${s.lastName}`,
                xp: s.xp,
              }))
            );

            // Transform to leaderboard format
            const transformedData = top10Students.map((student, index) => {
              const fullName =
                `${student.firstName || ""} ${student.lastName || ""}`.trim() ||
                "Unknown";
              const username = student.username
                ? `@${student.username}`
                : student.email || "@unknown";

              return {
                id: student._id || student.id || index + 1,
                name: fullName,
                username: username,
                xp: student.xp || 0,
                rank: index + 1,
              };
            });

            setLeaderboardData(transformedData);
          } else {
            // Fallback to default data if API structure is different
            setLeaderboardData([
              {
                id: 1,
                name: "Etieno Ekanem",
                username: "@Etienoekanem",
                xp: 700,
                rank: 1,
              },
              {
                id: 2,
                name: "Sophia Turner",
                username: "@Sophiaturn220",
                xp: 700,
                rank: 2,
              },
            ]);
          }
        } else {
          // Use default data if API fails or not authenticated
          setLeaderboardData([
            {
              id: 1,
              name: "Etieno Ekanem",
              username: "@Etienoekanem",
              xp: 700,
              rank: 1,
            },
            {
              id: 2,
              name: "Sophia Turner",
              username: "@Sophiaturn220",
              xp: 700,
              rank: 2,
            },
            {
              id: 3,
              name: "Sophia Turner",
              username: "@Sophiaturn220",
              xp: 700,
              rank: 3,
            },
            {
              id: 4,
              name: "Sophia Turner",
              username: "@Sophiaturn220",
              xp: 700,
              rank: 4,
            },
            {
              id: 5,
              name: "Sophia Turner",
              username: "@Sophiaturn220",
              xp: 700,
              rank: 5,
            },
            {
              id: 6,
              name: "Sophia Turner",
              username: "@Sophiaturn220",
              xp: 700,
              rank: 6,
            },
            {
              id: 7,
              name: "Sophia Turner",
              username: "@Sophiaturn220",
              xp: 700,
              rank: 7,
            },
          ]);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message);
        // Use default data on error
        setLeaderboardData([
          {
            id: 1,
            name: "Etieno Ekanem",
            username: "@Etienoekanem",
            xp: 700,
            rank: 1,
          },
          {
            id: 2,
            name: "Sophia Turner",
            username: "@Sophiaturn220",
            xp: 700,
            rank: 2,
          },
          {
            id: 3,
            name: "Sophia Turner",
            username: "@Sophiaturn220",
            xp: 700,
            rank: 3,
          },
          {
            id: 4,
            name: "Sophia Turner",
            username: "@Sophiaturn220",
            xp: 700,
            rank: 4,
          },
          {
            id: 5,
            name: "Sophia Turner",
            username: "@Sophiaturn220",
            xp: 700,
            rank: 5,
          },
          {
            id: 6,
            name: "Sophia Turner",
            username: "@Sophiaturn220",
            xp: 700,
            rank: 6,
          },
          {
            id: 7,
            name: "Sophia Turner",
            username: "@Sophiaturn220",
            xp: 700,
            rank: 7,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-pink-300 to-purple-300";
      case 2:
        return "bg-gradient-to-r from-orange-200 to-yellow-200";
      case 3:
        return "bg-gradient-to-r from-blue-200 to-indigo-200";
      case 4:
        return "bg-gradient-to-r from-green-200 to-emerald-200";
      case 5:
        return "bg-gradient-to-r from-teal-200 to-cyan-200";
      case 6:
        return "bg-gradient-to-r from-amber-200 to-yellow-200";
      case 7:
        return "bg-gradient-to-r from-rose-200 to-pink-200";
      case 8:
        return "bg-gradient-to-r from-violet-200 to-purple-200";
      case 9:
        return "bg-gradient-to-r from-sky-200 to-blue-200";
      case 10:
        return "bg-gradient-to-r from-indigo-200 to-blue-200";
      default:
        return "bg-gradient-to-r from-gray-200 to-gray-300";
    }
  };

  const getTextColor = (rank) => {
    // Ensure good contrast for all ranks
    if (rank <= 3) {
      return "text-gray-800"; // Darker text for top 3
    } else {
      return "text-gray-700"; // Slightly lighter but still readable for ranks 4-10
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="text-center">
          {/* <div className="text-[#4E1D9C] text-xl">Loading leaderboard...</div> */}
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 w-full overflow-x-hidden">
      <div className="flexcenter flex-col gap-8 w-full max-w-full">
        <h1
          style={{ margin: "30px 0" }}
          className="sm:text-[37px] sm:leading-[31px] sm:font-[400] Xirod text-[#4E1D9C] text-center mb-4"
        >
          TOP 10 LEADERBOARD
        </h1>

        {error && (
          <div className="text-red-500 text-sm mb-4">
            Error: {error} (Using default data)
          </div>
        )}

        <div className="flex flex-col gap-4 max-w-[1564.35546875px] w-full px-2 sm:px-4">
          {leaderboardData.map((student) => (
            <div
              key={student.id}
              className={`${getRankColor(
                student.rank
              )} rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01] w-full overflow-hidden`}
            >
              <div className="flex items-center justify-between gap-2 sm:gap-4 flex-wrap sm:flex-nowrap">
                <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
                  <div
                    className={`${getTextColor(
                      student.rank
                    )} font-[400] text-xl sm:text-2xl md:text-[22px] min-w-[2.5rem] sm:min-w-[3rem] text-center flex-shrink-0`}
                  >
                    {student.rank}.
                  </div>

                  <div className="flex-1 min-w-0 overflow-hidden">
                    <h3
                      className={`${getTextColor(
                        student.rank
                      )} font-[700] text-sm md:text-[31px] leading-tight md:leading-[42px] truncate`}
                      title={student.name}
                    >
                      {student.name}
                    </h3>
                    <p
                      className={`${getTextColor(
                        student.rank
                      )} text-[#0C0C0C] md:text-[27px] text-sm leading-[14px] md:leading-[31px] truncate`}
                      title={student.username}
                    >
                      {student.username}
                    </p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="text-[#AA11BC] text-lg sm:text-[31px] leading-[31px] font-[700] whitespace-nowrap">
                    {student.xp} XP
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
