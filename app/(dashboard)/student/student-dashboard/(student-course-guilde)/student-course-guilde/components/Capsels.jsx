"use client";

import { useContext, useEffect, useState } from "react";
import LoadingBar from "./LodingBar";

import MissionVideo from "./MissionVideos";
import LevelQuiz from "./LevelQuiz";
import { CourseGuideContext } from "./course-guild-contex/Contex";
import { StudentContext } from "@/app/(dashboard)/student/component/Context/StudentContext";

export default function Capsels({id}) {
  const [changeStages, setChangeStages] = useState(1);
const [missionsCapsels, setMissionsCapsels] = useState([]);
const { currentCapsule, setCurrentCapsule } = useContext(StudentContext);
  const {
    showVideo,
    setShowVideo,
    showVideoLevels,
    setShowVideoLevels,
    capselIndex,
    
  } = useContext(CourseGuideContext);

console.log(capselIndex, "capselIndexcapselIndexcapselIndex");


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
          <div className="w-full h-[82vh]  flexcenter bg-[#0A0A0A] p-[10px]">
            <div className="max-w-[1261px] mx-auto w-full h-full flex flex-col">
              {/* Loading Bar - Fixed height */}
              <div className="h-[60px] w-full flex items-center">
                <LoadingBar width={"w-[10%]"} />
              </div>

              {/* Content - Takes remaining space */}
              <div className="flex-1 flex flex-col justify-center overflow-y-auto">
                <p className="font-[700] text-[20px] sm:text-[25px] sm:leading-[43px] mb-6">
                  After successfully completing this module, you will be able
                  to:
                </p>
                <div className="pl-5">
                  <ul className="list-disc pl-5 space-y-2">
                    <li className="text-[16px] sm:text-[20px] leading-[30px] font-[400]">
                      Understand the basics of web development
                    </li>
                    <li className="text-[16px] sm:text-[20px] leading-[30px] font-[400]">
                      Create a simple web page using HTML and CSS
                    </li>
                    <li className="text-[16px] sm:text-[20px] leading-[30px] font-[400]">
                      Implement basic JavaScript functionality
                    </li>
                    <li className="text-[16px] sm:text-[20px] leading-[30px] font-[400]">
                      Understand responsive web design principles
                    </li>
                    <li className="text-[16px] sm:text-[20px] leading-[30px] font-[400]">
                      Work with modern development tools
                    </li>
                    <li className="text-[16px] sm:text-[20px] leading-[30px] font-[400]">
                      Debug and troubleshoot common issues
                    </li>
                    <li className="text-[16px] sm:text-[20px] leading-[30px] font-[400]">
                      Apply best practices in coding
                    </li>
                    <li className="text-[16px] sm:text-[20px] leading-[30px] font-[400]">
                      Build interactive user interfaces
                    </li>
                    <li className="text-[16px] sm:text-[20px] leading-[30px] font-[400]">
                      Deploy applications to production
                    </li>
                  </ul>
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
                <LoadingBar width={"w-[20%]"} />
              </div>

              
              <div className="flex-1 flex items-center justify-center min-h-0">
                <div className="w-full h-full max-h-[calc(100vh-160px)] flex items-center justify-center">
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
                    <div className="h-[60px] w-full flex items-center">
                      <LoadingBar width={"w-[40%]"} />
                    </div>

                    {/* Video - Takes remaining space with fixed aspect ratio */}
                    <div className="flex-1 flex items-center justify-center min-h-0">
                      <div className="w-full  h-full max-h-[calc(100vh-160px)] flex items-center justify-center">
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
                        className="bg-[#840B94] cursor-pointer p-2 h-[71px] w-[140px] sm:w-[200px] font-[700] text-[18px] sm:text-[28px] leading-[100%] text-white rounded-[10px]"
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
            <div className="max-w-[1261px] w-full h-[85vh]  flex flex-col items-end justify-between">
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
