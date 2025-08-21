"use client";

import { useContext, useEffect, useState } from "react";
import LoadingBar from "./LodingBar";

import MissionVideo from "./MissionVideos";
import LevelQuiz from "./LevelQuiz";
import { CourseGuideContext } from "./course-guild-contex/Contex";

export default function Capsels({id}) {
  const [changeStages, setChangeStages] = useState(1);
const [missionsCapsels, setMissionsCapsels] = useState([]);
  const {
    showVideo,
    setShowVideo,
    showVideoLevels,
    setShowVideoLevels,
    capselIndex,
    
  } = useContext(CourseGuideContext);



           useEffect(() => {
             const Capsels = localStorage.getItem("missionsCapsels");
             console.log("Capsels from localStorage:", Capsels);
             if (Capsels) {
               try {
                 const parsedCapsels = JSON.parse(Capsels);
                 console.log("Parsed Capsels:", parsedCapsels);
                 setMissionsCapsels(parsedCapsels);
               } catch (e) {
                 console.error(
                   "Failed to parse missionsCapsels from localStorage",
                   e
                 );
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

  const courseGuide = () => {
    switch (changeStages) {
      case 1:
        return (
          <div
            style={{ padding: "10px" }}
            className="w-full    relative flex-1 h-[90vh] flexcenter flex-col bg-[#0A0A0A] m "
          >
            <div className="max-w-[1261px]  w-full h-full flex flex-col items-end justify-between">
              <div className="h-10 w-full  ">
                <LoadingBar width={"w-[10%]"} />
              </div>
              {/* text */}
              <div className="h-fit sm:h-[80%] w-full flex flex-col justify-center ">
                <p className="font-[700] sm:text-[25px] sm:leading-[43px] ">
                  After successfully completing this module, you will be able
                  to:
                </p>
                <div style={{ paddingLeft: "20px" }}>
                  <ul className="list-disc pl-5">
                    <li className="sm:text-[20px] leading-[30px] font-[400] ">
                      Understand the basics of web development
                    </li>
                    <li className="sm:text-[20px] leading-[30px] font-[400] ">
                      Create a simple web page using HTML and CSS
                    </li>
                    <li className="sm:text-[20px] leading-[30px] font-[400] ">
                      Implement basic JavaScript functionality
                    </li>
                    <li className="sm:text-[20px] leading-[30px] font-[400] ">
                      Understand the basics of web development
                    </li>
                    <li className="sm:text-[20px] leading-[30px] font-[400] ">
                      Create a simple web page using HTML and CSS
                    </li>
                    <li className="sm:text-[20px] leading-[30px] font-[400] ">
                      Implement basic JavaScript functionality
                    </li>
                    <li className="sm:text-[20px] leading-[30px] font-[400] ">
                      Understand the basics of web development
                    </li>
                    <li className="sm:text-[20px] leading-[30px] font-[400] ">
                      Create a simple web page using HTML and CSS
                    </li>
                    <li className="sm:text-[20px] leading-[30px] font-[400] ">
                      Implement basic JavaScript functionality
                    </li>
                  </ul>
                </div>
              </div>

              <button
                onClick={() => setChangeStages((prev) => prev + 1)}
                className="bg-[#840B94]  cursor-pointer  m-4 p-2 h-[71.03px] w-[177.14px] font-[700] text-[31px] leading-[100%] text-white rounded-[10px]  "
              >
                Next
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div
            style={{ padding: "10px" }}
            className="w-full max-w-[1800px]   relative flex-1 h-[90vh]  flexcenter flex-col bg-[#0A0A0A] m "
          >
            <div className="max-w-[1261px] w-full h-full flex flex-col items-end justify-between">
              <div className="h-10 w-full  ">
                <LoadingBar width={"w-[20%]"} />
              </div>
              {/* text */}
              <div className="h-[80%] w-full flex max-w-[1800px]  flex-col justify-center">
                <video
                  controls
                  className="w-full h-full object-contain"
                  preload="metadata"
                  poster={
                    missionsCapsels[0].thumbnailUrl || "/default-poster.jpg"
                  } // image URL here
                >
                  <source src={missionsCapsels[0].videoUrl.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>

              <div className=" flex justify-between items-center w-full h-[10%] px-4">
                <button
                  onClick={() => setChangeStages((prev) => prev - 1)}
                  className="text-[#840B94]  cursor-pointer  m-4 p-2 h-[71.03px] w-[100px] sm:w-[177.14px] font-[700] sm:text-[31px] leading-[100%]  rounded-[10px]  "
                >
                  Previous
                </button>

                <button
                  onClick={() => setChangeStages((prev) => prev + 1)}
                  className="bg-[#840B94]  cursor-pointer  m-4 p-2 h-[71.03px] w-[100px] sm:w-[177.14px] font-[700] sm:text-[31px] leading-[100%] text-white rounded-[10px]  "
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div
            style={{ padding: "10px" }}
            className="w-full   relative   flex-1 h-[90vh] flexcenter flex-col bg-[#0A0A0A] m "
          >
            <div className="max-w-[1261px] w-full h-full flex flex-col items-end justify-between">
              <div className="h-10 w-full flex items-center gap-4  ">
                <LoadingBar width={"w-[40%]"} />
              </div>
              {/* text */}
              <div className="h-[80%] w-full max-w-[1800px]  flexcenter">
                <video
                  controls
                  className="w-full h-full object-contain"
                  preload="metadata"
                  poster={
                    missionsCapsels[capselIndex].thumbnailUrl ||
                    "/default-poster.jpg"
                  } // image URL here
                >
                  <source
                    src={missionsCapsels[0].videoUrl.url}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </div>

              <div className=" flex justify-between items-center w-full h-[10%] px-4">
                <button
                  onClick={() => setChangeStages((prev) => prev - 1)}
                  className="text-[#840B94]  cursor-pointer  m-4 p-2 h-[71.03px] w-[100px] sm:w-[177.14px] font-[700] sm:text-[31px] leading-[100%]  rounded-[10px]  "
                >
                  Previous
                </button>

                <button
                  //   disabled
                  onClick={() => setChangeStages((prev) => prev + 1)}
                  className="bg-[#840B94]  cursor-pointer  m-4 p-2 h-[71.03px] w-[100px] sm:w-[177.14px] font-[700] sm:text-[31px] leading-[100%] text-white rounded-[10px]  "
                >
                  Start Quiz
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div
            style={{ padding: "10px" }}
            className="w-full   relative flex-1 h-fit flexcenter flex-col bg-[#0A0A0A]  "
          >
            <div className="max-w-[1261px] w-full h-full flex flex-col items-end justify-between">
              <div className="h-10 w-full  ">
                <LoadingBar width={"w-[70%]"} />
              </div>
              {/* text */}
              <div className="h-fit w-full flex flex-col justify-center">
                <LevelQuiz />
              </div>

              <div className=" flex justify-between items-center w-full h-[10%] px-4">
                <button
                  onClick={() => setChangeStages((prev) => prev - 1)}
                  className="text-[#840B94]  cursor-pointer  m-4 p-2 h-[71.03px] w-[100px] sm:w-[177.14px] font-[700] sm:text-[31px] leading-[100%]  rounded-[10px]  "
                >
                  Previous
                </button>

                <button
                  disabled
                  //   onClick={() => setChangeStages((prev) => prev + 1)}
                  className="bg-[#840B94]  cursor-pointer  m-4 p-2 h-[71.03px] w-[100px] sm:w-fit font-[700] sm:text-[31px] leading-[100%] text-white rounded-[10px]  "
                >
                  Submit Quiz
                </button>
              </div>
            </div>
          </div>
        );
    }
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
