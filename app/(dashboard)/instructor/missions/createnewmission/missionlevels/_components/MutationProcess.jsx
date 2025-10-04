import { FaPause, FaLock, FaListUl } from "react-icons/fa";

export default function MutationProcess({ missionStatus = "draft" }) {
   
  const totalSteps = 5;
  
  // Calculate current step based on mission status
  const getCurrentStep = () => {
    switch (missionStatus?.toLowerCase()) {
      case "draft":
        return 1; // 30% progress
      case "pending review":
      case "pending_review":
        return 3; // 70% progress
      case "published":
        return 5; // 100% progress
      default:
        return 1; // Default to draft
    }
  };
  
  const currentStep = getCurrentStep();
  
  // Calculate progress percentage
  const getProgressPercentage = () => {
    switch (missionStatus?.toLowerCase()) {
      case "draft":
        return 30;
      case "pending review":
      case "pending_review":
        return 70;
      case "published":
        return 100;
      default:
        return 30;
    }
  };
  
  const progressPercentage = getProgressPercentage();
  
  const steps = [
    {
      title: "HTML Tags 101",
      duration: "1hr 30min",
      active: true,
      locked: false,
    },
    {
      title: "Quiz 1",
      duration: "10 Questions",
      icon: <FaListUl />,
      locked: true,
    },
    { title: "CSS Evolution", duration: "2hr 30min", locked: true },
    {
      title: "Quiz 1",
      duration: "10 Questions",
      icon: <FaListUl />,
      locked: true,
    },
  ];

  return (
    <div className="w-full  text-white flex flex-col gap-10 px-4 py-6">
      {/* Title and Status */}
      <div className="flex justify-between items-center">
        <h2 className="text-[22px] font-semibold leading-[57px] text-[#BABABA]">
          Mutation Process
        </h2>
        <div className="text-right">
          <div className="text-[#BDE75D] font-[600] text-[18px]">
            {progressPercentage}% Complete
          </div>
          <div className="text-[#818181] text-[14px] capitalize">
            Status: {missionStatus || "Draft"}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#2F2F2F] rounded-[20px] h-[10px] relative overflow-hidden">
        <div
          className="bg-[#A259FF] h-full rounded-[20px] transition-all duration-500 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {/* Lessons List */}

      <div className="flex flex-col gap-4">
        <p className="text-[27px] leading-[57px] font-[600] text-[var(--sidebar-hovercolor)] ">
          Mutation Process
        </p>
        {steps.map((step, index) => (
          <div
            style={{ padding: "20px" }}
            key={index}
            className={`flex items-center justify-between px-4 py-4 rounded-xl ${
              step.locked
                ? "bg-[#1e1e1e] text-gray-500"
                : "bg-gradient-to-r from-purple-500 to-purple-400 text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              {!step.locked ? (
                <FaPause className="text-lg" />
              ) : step.icon ? (
                step.icon
              ) : (
                <FaLock />
              )}
              <div>
                <p className="font-semibold">{step.title}</p>
                <p className="text-sm">{step.duration}</p>
              </div>
            </div>
            {step.locked && <FaLock className="text-xl" />}
          </div>
        ))}
      </div>
    </div>
  );
}
