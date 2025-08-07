import { useContext, useState } from "react";
import { FaClipboardList, FaPlay } from "react-icons/fa";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { MdOutlineQuiz } from "react-icons/md";
import Actionbtn from "../createnewmission/_components/Actionbtn";
import Analitiesbtn from "../createnewmission/_components/Analitiesbtn";
import Link from "next/link";
import { InstructorContext } from "../../_components/context/InstructorContex";

const getIconComponent = (iconType) => {
  switch (iconType) {
    case "clipboard":
      return <FaClipboardList />;
    case "play":
      return <FaPlay />;
    case "quiz":
      return <MdOutlineQuiz />;
    default:
      return <FaClipboardList />;
  }
};

const LessonItem = ({ lesson }) => (
  <div
    className="flex items-center gap-3 border-[0.5px] border-[#535353] bg-[#352e2b] rounded-[8px]"
    style={{ padding: "16px" }}
  >
    <div className="text-lg">{getIconComponent(lesson.icon)}</div>
    <div className="flex-1">
      <p className="text-[16px] font-[700] leading-[24px]">{lesson.title}</p>
      <p className="text-[#838383] text-[12px] font-[300] capitalize">
        {lesson.type} · {lesson.duration}
      </p>
    </div>
  </div>
);

const ChapterSection = ({ chapter }) => (
  <div
    className="flex flex-col gap-5 rounded-[15px] border border-[#535353]"
    style={{ margin: "0 30px" }}
  >
    <div
      className="w-full border-b border-[#535353]"
      style={{ padding: "16px" }}
    >
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div style={{ paddingLeft: "48px" }}>
          <p className="text-[18px] font-[700] leading-[40px]">
            {chapter.title}
          </p>
          <p className="text-[#838383] text-[12px] font-[300]">
            {chapter.lessons} Lessons / {chapter.duration}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Actionbtn
            icon={<FiEdit />}
            style="text-[#002BFF] border-[#002BFF] border"
            text="Edit"
          />
          <Actionbtn
            icon={<FiTrash2 />}
            style="text-[#FF0000] border-[#FF0000] border"
            text="Delete"
          />
          <Actionbtn
            style="bg-[#5E36A5] border-0"
            text={chapter.status === "published" ? "Published" : "Publish"}
          />
        </div>
      </div>
    </div>

    <div className="flex flex-col gap-4" style={{ padding: "24px" }}>
      {chapter.lessons_detail?.map((lesson) => (
        <LessonItem key={lesson.id} lesson={lesson} />
      ))}

      <button className="w-full h-[60px] rounded-[12px] border border-dashed border-[#696969] text-white hover:border-[#5E36A5] transition-colors">
        + Add Lesson
      </button>
    </div>
  </div>
);

const QuickActionCard = ({ action }) => (
  <div
    className="bg-[#0F0F0F] h-[145px] rounded-[12px] flex items-center gap-4"
    style={{ padding: "20px" }}
  >
    <div
      className={`h-[72px] w-[72px] rounded-[10px] ${action.bgColor} ${action.textColor} flex items-center justify-center text-xl font-bold`}
    >
      {action.icon}
    </div>
    <div className="flex-1">
      <p
        className="text-[20px] font-[700] leading-[28px]"
        style={{ marginBottom: "4px" }}
      >
        {action.title}
      </p>
      <p className="text-[12px] font-[300] leading-[18px] text-[#838383]">
        {action.description}
      </p>
    </div>
  </div>
);

const TabNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    "Curriculum",
    "Students",
    "Resources",
    "Interactions",
    "Settings",
  ];

  return (
    <div className="border-b border-[#535353]" style={{ padding: "24px 32px" }}>
      <ul className="flex items-center gap-8 flex-wrap">
        {tabs.map((tab) => (
          <li
            key={tab}
            className={`cursor-pointer transition-colors ${
              activeTab === tab
                ? "text-white font-medium border-b-2 border-[#5E36A5]"
                : "text-[#838383] hover:text-white"
            }`}
            style={{ paddingBottom: "8px" }}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </li>
        ))}
      </ul>
    </div>
  );
};

const CurriculumContent = ({ course, handleAddLevelId }) => (
  <>
    <div
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      style={{ padding: "0 32px" }}
    >
      <h2 className="text-[24px] font-[600]">Course Curriculum</h2>
      <Link href={`/instructor/missions/createnewmission`}>
        <button
          onClick={() => handleAddLevelId(course._id)}
          className="bg-[#5E36A5] hover:bg-[#4A2D85] transition-colors rounded-[8px] text-white font-medium"
          style={{ padding: "8px 16px" }}
        >
          + Level
        </button>
      </Link>
    </div>

    <div className="space-y-6" style={{ paddingBottom: "24px" }}>
      {course.chapters?.map((chapter) => (
        <ChapterSection key={chapter.id} chapter={chapter} />
      ))}
    </div>
  </>
);

const StudentsContent = ({ course }) => (
  <div className="flex flex-col gap-6" style={{ padding: "0 32px 24px" }}>
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <h2 className="text-[24px] font-[600]">Students</h2>
      <button
        className="bg-[#5E36A5] hover:bg-[#4A2D85] transition-colors rounded-[8px] text-white font-medium"
        style={{ padding: "8px 16px" }}
      >
        + Add Student
      </button>
    </div>

    <div className="bg-[#0F0F0F] rounded-[12px] p-6">
      <div className="text-center text-[#838383]">
        <div className="text-4xl mb-4">👥</div>
        <p className="text-lg">Students management coming soon</p>
        <p className="text-sm mt-2">View and manage enrolled students</p>
      </div>
    </div>
  </div>
);

const ResourcesContent = ({ course }) => (
  <div className="flex flex-col gap-6" style={{ padding: "0 32px 24px" }}>
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <h2 className="text-[24px] font-[600]">Resources</h2>
      <button
        className="bg-[#5E36A5] hover:bg-[#4A2D85] transition-colors rounded-[8px] text-white font-medium"
        style={{ padding: "8px 16px" }}
      >
        + Add Resource
      </button>
    </div>

    <div className="bg-[#0F0F0F] rounded-[12px] p-6">
      <div className="text-center text-[#838383]">
        <div className="text-4xl mb-4">📁</div>
        <p className="text-lg">Course Resources</p>
        <p className="text-sm mt-2">Upload and manage course materials</p>
      </div>
    </div>
  </div>
);

const InteractionsContent = ({ course }) => (
  <div className="flex flex-col gap-6" style={{ padding: "0 32px 24px" }}>
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <h2 className="text-[24px] font-[600]">Interactions</h2>
      <button
        className="bg-[#5E36A5] hover:bg-[#4A2D85] transition-colors rounded-[8px] text-white font-medium"
        style={{ padding: "8px 16px" }}
      >
        View All
      </button>
    </div>

    <div className="bg-[#0F0F0F] rounded-[12px] p-6">
      <div className="text-center text-[#838383]">
        <div className="text-4xl mb-4">💬</div>
        <p className="text-lg">Student Interactions</p>
        <p className="text-sm mt-2">Monitor discussions and feedback</p>
      </div>
    </div>
  </div>
);

const SettingsContent = ({ course }) => (
  <div className="flex flex-col gap-6" style={{ padding: "0 32px 24px" }}>
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <h2 className="text-[24px] font-[600]">Settings</h2>
      <button
        className="bg-[#5E36A5] hover:bg-[#4A2D85] transition-colors rounded-[8px] text-white font-medium"
        style={{ padding: "8px 16px" }}
      >
        Save Changes
      </button>
    </div>

    <div className="bg-[#0F0F0F] rounded-[12px] p-6">
      <div className="text-center text-[#838383]">
        <div className="text-4xl mb-4">⚙️</div>
        <p className="text-lg">Course Settings</p>
        <p className="text-sm mt-2">Configure course preferences</p>
      </div>
    </div>
  </div>
);

const renderTabContent = (activeTab, course, handleAddLevelId) => {
  switch (activeTab) {
    case "Curriculum":
      return (
        <CurriculumContent
          course={course}
          handleAddLevelId={handleAddLevelId}
        />
      );
    case "Students":
      return <StudentsContent course={course} />;
    case "Resources":
      return <ResourcesContent course={course} />;
    case "Interactions":
      return <InteractionsContent course={course} />;
    case "Settings":
      return <SettingsContent course={course} />;
    default:
      return (
        <CurriculumContent
          course={course}
          handleAddLevelId={handleAddLevelId}
        />
      );
  }
};

export default function MissionCourseOverview({ course }) {
  const [activeTab, setActiveTab] = useState("Curriculum");
  const { setActiveTab: setContextActiveTab } = useContext(InstructorContext);

  const handleAddLevelId = (courseId) => {
    console.log("Adding level to course:", courseId);
    setContextActiveTab("Add Levels");
    localStorage.removeItem("missionId");
    localStorage.setItem("missionId", courseId);
  };

  return (
    <div className="flex flex-col w-full sm:max-w-[1200px] mx-auto gap-10">
      <div className="grid xl:grid-cols-3 gap-8">
        {/* Fixed the background image positioning */}
        <div
          style={{
            backgroundImage: course.thumbnail?.url
              ? `url(${course.thumbnail.url})`
              : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          className="border border-[#6D4879] w-full h-[200px] sm:h-[300px] xl:h-full rounded-[13px] bg-gradient-to-br from-[#2D1B3D] to-[#1A0F21] z-0"
        ></div>

        <div
          style={{ padding: "16px" }}
          className="xl:col-span-2 flex flex-col gap-2 sm:gap-8 relative z-10"
        >
          <div className="flex flex-col sm:gap-1">
            <h1 className="font-[600] text-[28px] xl:text-[33px] leading-[40px] sm:text-center xl:text-left">
              {course.title}
            </h1>

            <div className=" items-center gap-4 flex-wrap hidden sm:flex">
              <button
                className={`rounded-[4px] text-[10px] text-black font-[600] ${
                  course.status === "Published"
                    ? "bg-[#7BBD25]"
                    : "bg-[#7343B3]"
                }`}
                style={{ padding: "8px 16px" }}
              >
                {course.status}
              </button>
              <p className="text-[#728C51] font-[600] text-[12px]">
                Created: {course.createdAt} / Last updated: {course.updatedAt}
              </p>
            </div>
          </div>

          <div className="max-h-[200px] overflow-y-auto font-[300] text-[16px] leading-[28px] text-[#878787] sm:text-[#E5E5E5]">
            {course.description}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-6 xl:grid-cols-3">
        <Analitiesbtn
          text1="Total Enrollment"
          text2={course.analytics?.enrollments || "0"}
          text3="+2 from last month"
          text4={"Recruits"}
        />
        <div className="hidden xl:block">
          <Analitiesbtn
            text1="Completion Rate"
            text2={course.analytics?.completionRate || "0%"}
            text3="+5% from last month"
          />
        </div>
        <Analitiesbtn
          text1="Student Rating"
          text2={course.analytics?.rating || "0.0"}
          text3="+0.2 from last month"
          text4={"Rating"}
        />
      </div>

      <div className=" hidden sm:flex flex-col gap-6 rounded-[20px] border border-[#535353] bg-[#111111]">
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {renderTabContent(activeTab, course, handleAddLevelId)}
      </div>

      <div className="hidden sm:block">
        {activeTab === "Curriculum" && (
          <div className="grid xl:grid-cols-3 gap-6 hidden sm:block">
            {course.quickActions?.map((action) => (
              <QuickActionCard key={action.id} action={action} />
            ))}
          </div>
        )}
      </div>

      {/* Mobile view - Fixed positioning and visibility issues */}
      <div className="flex flex-col gap-5 sm:hidden relative z-10">
        <div>
          <div className="flex justify-between items-center mb-4 w-full text-[#767E8F] text-[10px] font-[400] leading-[20px] ">
            <p>Mission Progress</p>
            <p>{course.isPublished ? "100%" : "50%"}</p>
          </div>
          <div className="w-full max-w-md">
            <div className="w-full bg-[#000000] rounded-full h-[8px] overflow-hidden">
              <div
                className="h-full bg-[#4F3457] transition-all duration-200"
                style={{ width: course.isPublished ? "100%" : "50%" }}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button className="h-[62.74px] w-full font-[500] text-[14px] leading-[40px] bg-[#604196] rounded-[10px] cursor-pointer ">
            Edit Mission
          </button>
          <Link href={`/instructor/missions/createnewmission`}>
            <button
              onClick={() => handleAddLevelId(course._id)}
              className="h-[62.74px] w-full font-[500] text-[14px] leading-[40px] bg-[#604196] rounded-[10px] cursor-pointer "
            >
              + Level
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}