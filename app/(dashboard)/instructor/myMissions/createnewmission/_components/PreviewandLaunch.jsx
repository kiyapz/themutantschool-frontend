import { useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { FaPlay } from "react-icons/fa";
import { MdOutlineQuiz } from "react-icons/md";
import { FaClipboardList } from "react-icons/fa";
import Actionbtn from "./Actionbtn";
import Analitiesbtn from "./Analitiesbtn";

export default function PreviewandLaunch() {
  const [activeTab, setActiveTab] = useState("Mission Overview");

  const renderTabContent = () => {
    if (activeTab === "Mission Overview") {
      return (
        <div style={{padding:'10px'}} className="flex flex-col gap-5">
          <p>
            Welcome to the ultimate web development journey! This comprehensive mission will take you from complete beginner to confident web developer.
            You'll learn the core technologies that power the modern web: HTML for structure, CSS for styling, and JavaScript for interactivity. By the end of this mission, you'll have built several real-world projects and gained the skills needed to create your own websites.
          </p>

          <p>What you’ll Learn:</p>
          <ul>
            <li>HTML fundamentals and semantic markup</li>
            <li>CSS styling, layouts, and responsive design</li>
            <li>JavaScript programming and DOM manipulation</li>
            <li>Modern web development best practices</li>
          </ul>

          <p className="">Your journey to becoming a web sorcerer starts here!</p>
        </div>
      );
    } else if (activeTab === "Missions Levels") {
      const levels = [
        {
          level: 1,
          title: "HTML Genesis",
          duration: "1.5 hours",
          capsules: 4,
          quizzes: 10,
          time: "90 minutes",
          locked: false,
        },
        {
          level: 1,
          title: "CSS Evolution",
          duration: "2.5 hours",
          capsules: 5,
          quizzes: 10,
          time: "150 minutes",
          locked: true,
        },
        {
          level: 1,
          title: "HTML Genesis",
          duration: "2 hours",
          capsules: 3,
          quizzes: 10,
          time: "120 minutes",
          locked: true,
        },
      ];

      return (
        <div className="flex flex-col gap-5">
          {levels.map((level, index) => (
            <div
            style={{padding:'20px'}}
              key={index}
              className={`rounded-[12px] px-4 py-5 ${
                level.locked ? "bg-[#1D1D1D]" : "bg-[#232D3A]"
              } text-white flex flex-col gap-3`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="h-8 w-8 rounded-full bg-[#BDE75D] text-black flex items-center justify-center text-sm font-bold">
                    {level.level}
                  </div>
                  <div>
                    <p className="font-[600] text-[16px]">{level.title}</p>
                    <p className="text-[13px] text-gray-400">
                      {level.duration} • {level.capsules} Power Capsules
                    </p>
                  </div>
                </div>

                <div>
                  {level.locked ? (
                    <span className="text-gray-400 text-lg">🔒</span>
                  ) : (
                    <span className="text-gray-400 text-lg">›</span>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-300">
                Master HTML fundamentals, tags, and document structure. Build your first web page.
              </p>

              <div className="flex gap-6 text-xs text-gray-400 mt-2">
                <p>📦 {level.capsules} Capsules</p>
                <p>❓ {level.quizzes} Quiz Questions</p>
                <p>🎥 {level.time}</p>
              </div>
            </div>
          ))}
        </div>
      );
    }
  };

  const tabs = ["Mission Overview", "Missions Levels"];

  return (
    <div className="w-full h-full p-5">
      {/* Mission banner */}
      <div className="h-[343.54px] w-full bg-[var(--purpel-btncolor)] rounded-[15px] mb-8" />

      {/* Main content grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left side (2 columns) */}
        <div style={{ padding: "30px" }} className="xl:col-span-2 flex flex-col gap-4">
          {/* Tabs */}
          <div className="flex gap-5 border-b border-[#333] pb-2">
            {tabs.map((tab) => (
              <button
              style={{padding:'15px'}}
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-sm sm:text-base font-medium pb-1 ${
                  activeTab === tab
                    ? "border-b-2 border-[#BDE75D] text-[#BDE75D]"
                    : "text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ padding: "10px" }} className="pt-4">
            {renderTabContent()}
          </div>
        </div>

        {/* Right side (Instructor Info) */}
        <div
          style={{ padding: "15px" }}
          className="bg-[var(--black-bg)] rounded-[12px] p-5"
        >
          <p style={{marginBottom:'20px'}} className="text-[24px] font-[600] text-[var(--sidebar-hovercolor)] mb-4">
            Mission Instructor
          </p>

          <div style={{marginBottom:'10px'}} className="flex items-center gap-4 mb-3">
            <div className="h-[40px] border border-[var(--sidebar-hovercolor)] w-[40px] rounded-full bg-gray-500" />
            <div>
              <p className="font-medium">Etieno Ekanem</p>
              <p className="text-sm text-gray-400">Product Designer || Tutor</p>
            </div>
          </div>

          <p style={{marginBottom:'10px'}} className="text-sm text-gray-300 mb-4 leading-[22px]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...
          </p>

          <div className="flex items-center justify-between">
            <p className="font-medium text-sm text-white">Rating:</p>
            <p className="text-[var(--sidebar-hovercolor)] font-bold text-sm">4.5</p>
          </div>
        </div>
      </div>
    </div>
  );
}
