'use client';
import Image from "next/image";
import { CourseGuideContext } from "./course-guild-contex/Contex";
import { useContext } from "react";
import { FaPlay, FaPause, FaLock, FaLockOpen } from "react-icons/fa";

export default function MissionVideo() {
    const { showVideo } = useContext(CourseGuideContext);

    const couser = [
      {
        id: 1,
        title: "Mutation Process",
        video: "https://www.youtube.com/watch?v=example1",
      },
      {
        id: 2,
        title: "Advanced Mutation Techniques",
        video: "https://www.youtube.com/watch?v=example2",
      },
      {
        id: 3,
        title: "Mutation in Real-World Applications",
        video: "https://www.youtube.com/watch?v=example3",
      },
      {
        id: 4,
        title: "Advanced Mutation Techniques",
        video: "https://www.youtube.com/watch?v=example2",
      },
      {
        id: 5,
        title: "Mutation in Real-World Applications",
        video: "https://www.youtube.com/watch?v=example3",
      },
    ];
    return (
      <div>
        {showVideo && (
          <div className={`w-[300px] xl:w-[400px] h-[90vh]`}>
            <p className="text-[#BDE75D] font-[600] sm:text-[39px] sm:leading-[57px] text-center ">
              Mutation Process
            </p>
            <div className="grid grid-cols-1 h-[80vh]   gap-4 ">
              {couser.map((el, i) => (
                <div
                  key={i}
                  style={{ padding: "0 30px" }}
                  className="flex   rounded-[20px] bg-[#380C39] items-center justify-between "
                >
                  <div className="flex items-center justify-center gap-2">
                    <p>
                      <FaPlay />
                    </p>
                    <div>
                      <p>{el.title}</p>
                      <p>{el.id}</p>
                    </div>
                  </div>

                  <div>
                    <FaLock />
                  </div>
                </div>
              ))}
              <button className="bg-[#380C39] text-black font-[600] sm:text-[39px] sm:leading-[57px] w-full  rounded-[20px] ">
                Start Quiz
              </button>
            </div>
          </div>
        )}
      </div>
    );
}