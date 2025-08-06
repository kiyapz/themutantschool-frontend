import { FaPause, FaLock, FaListUl } from "react-icons/fa";

export default function MutationProcess() {
   
  const totalSteps = 5;
  const currentStep = 1;
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
      {/* Title */}
      <h2 className="text-[22px] font-semibold leading-[57px] text-[#BABABA]">
        Mutation Process
      </h2>

      {/* Progress Bar */}
      <div className="flex items-center rounded-[20px] justify-between w-full h-fit bg-[#2F2F2F] ">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`h-[10px] w-[10px] bg-gray-700 relative  z-10 rounded-full `}
          >
            <div
              className={`absolute top-0 left-0 z-20 ${
                index < currentStep
                  ? "bg-[#A259FF] h-full w-[80px] rounded-[20px]  "
                  : "w-0"
              }`}
            ></div>
          </div>
        ))}
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
