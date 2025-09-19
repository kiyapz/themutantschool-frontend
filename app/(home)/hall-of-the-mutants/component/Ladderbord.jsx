import React from "react";

const Leaderboard = () => {
  // JSON data based on your Figma design
  const leaderboardData = [
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
  ];

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-pink-300 to-purple-300";
      case 2:
        return "bg-gradient-to-r from-orange-200 to-yellow-200";
      case 3:
        return "bg-gradient-to-r from-blue-200 to-indigo-200";
      default:
        return "bg-gradient-to-r from-gray-200 to-gray-300";
    }
  };

  const getTextColor = (rank) => {
    return rank <= 3 ? "text-gray-800" : "text-gray-700";
  };

  return (
    <div className="min-h-screen  p-4">
      <div className="  flexcenter flex-col gap-8 w-full">
        <h1
          style={{ margin: "30px 0" }}
          className="sm:text-[37px] sm:leading-[31px] sm:font-[400] Xirod text-[#4E1D9C] text-center mb-4"
        >
          TOP 10 LEADERBOARD
        </h1>

        <div className=" flex flex-col gap-4 max-w-[1564.35546875px] w-full">
          {leaderboardData.map((student) => (
            <div
              style={{ padding: "20px 30px" }}
              key={student.id}
              className={`${getRankColor(
                student.rank
              )} rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] `}
            >
              <div className="flex items-center justify-between ">
                <div className="flex items-center space-x-4">
                  <div
                    className={`${getTextColor(
                      student.rank
                    )} font-[400] text-2xl md:text-[22px] min-w-[3rem] text-center`}
                  >
                    {student.rank}.
                  </div>

                  <div className="flex-1">
                    <h3
                      className={`${getTextColor(
                        student.rank
                      )} font-[700] text-sm md:text-[31px] leading-tight md:leading-[42px]`}
                    >
                      {student.name}
                    </h3>
                    <p
                      className={`${getTextColor(
                        student.rank
                      )}  text-[#0C0C0C] md:text-[27px] text-sm leading-[14px] md:leading-[31px]`}
                    >
                      {student.username}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[#AA11BC] sm:text-[31px] leading-[31px] font-[700] ">
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
