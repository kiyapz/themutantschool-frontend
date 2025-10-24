import { FaPause, FaLock, FaListUl, FaVideo, FaTrophy } from "react-icons/fa";

export default function MutationProcess({ missionStatus = "draft", levels = [], missionData = null }) {
  
  // Calculate progress percentage
  const getProgressPercentage = () => {
    if (!levels || levels.length === 0) {
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
    }

    // Calculate based on actual content
    let totalItems = 0;
    let completedItems = 0;

    levels.forEach(level => {
      // Count capsules
      if (level.capsules && level.capsules.length > 0) {
        totalItems += level.capsules.length;
      }
      // Count level quiz if it has one
      if (level.quiz || level.hasQuiz) {
        totalItems += 1;
      }
    });

    // Count final quiz
    if (missionData?.finalQuiz || missionData?.hasFinalQuiz) {
      totalItems += 1;
    }

    // For now, if published, consider items complete
    if (missionStatus?.toLowerCase() === "published" && totalItems > 0) {
      completedItems = totalItems;
    }

    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 30;
  };
  
  const progressPercentage = getProgressPercentage();

  // Build steps dynamically from levels data
  const buildSteps = () => {
    const steps = [];

    if (!levels || levels.length === 0) {
      // Fallback to empty state
      return [];
    }

    // Sort levels by order
    const sortedLevels = [...levels].sort((a, b) => (a.order || 0) - (b.order || 0));

    sortedLevels.forEach((level, levelIndex) => {
      // Add capsules for this level
      if (level.capsules && level.capsules.length > 0) {
        level.capsules.forEach((capsule, capsuleIndex) => {
          steps.push({
            type: 'capsule',
            title: capsule.title || `Capsule ${capsuleIndex + 1}`,
            duration: capsule.duration || 'N/A',
            levelOrder: level.order || levelIndex + 1,
            levelTitle: level.title || `Level ${levelIndex + 1}`,
            locked: missionStatus?.toLowerCase() !== "published",
            icon: <FaVideo />,
          });
        });
      }

      // Add quiz for this level if it exists
      // Check if level has quiz data (could be level.quiz object or level.hasQuiz boolean)
      const hasQuiz = level.quiz && (level.quiz._id || level.quiz.questions);
      if (hasQuiz) {
        const questionCount = level.quiz?.questions?.length || level.quiz?.questionCount || 10;
        steps.push({
          type: 'quiz',
          title: level.quiz?.title || `Quiz ${level.order || levelIndex + 1}`,
          duration: `${questionCount} Questions`,
          levelOrder: level.order || levelIndex + 1,
          levelTitle: level.title || `Level ${levelIndex + 1}`,
          locked: missionStatus?.toLowerCase() !== "published",
          icon: <FaListUl />,
        });
      }
    });

    // Add final boss quiz
    // Check various possible structures for final quiz
    const hasFinalQuiz = missionData?.finalQuiz && 
                        (missionData.finalQuiz._id || 
                         missionData.finalQuiz.questions ||
                         missionData.finalQuiz.isFinal);
    
    if (hasFinalQuiz) {
      const questionCount = missionData.finalQuiz?.questions?.length || 
                           missionData.finalQuiz?.questionCount || 
                           10;
      steps.push({
        type: 'final-quiz',
        title: missionData.finalQuiz?.title || 'Final Boss Quiz',
        duration: `${questionCount} Questions`,
        locked: missionStatus?.toLowerCase() !== "published",
        icon: <FaTrophy />,
      });
    }

    return steps;
  };

  const steps = buildSteps();

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
        {steps.length === 0 ? (
          <div className="bg-[#1e1e1e] text-gray-400 px-4 py-6 rounded-xl text-center">
            <p className="text-sm">No levels or content added yet</p>
            <p className="text-xs mt-2">Add levels and capsules to see them here</p>
          </div>
        ) : (
          steps.map((step, index) => {
            // Determine background color based on type
            let bgClass = "";
            let textClass = "text-white";
            
            if (step.locked) {
              bgClass = "bg-[#1e1e1e]";
              textClass = "text-gray-500";
            } else {
              switch (step.type) {
                case 'capsule':
                  // Purple gradient for capsules
                  bgClass = "bg-gradient-to-r from-purple-500 to-purple-400";
                  break;
                case 'quiz':
                  // Blue gradient for quizzes
                  bgClass = "bg-gradient-to-r from-blue-500 to-blue-400";
                  break;
                case 'final-quiz':
                  // Gold gradient for final boss quiz
                  bgClass = "bg-gradient-to-r from-yellow-500 to-orange-500";
                  break;
                default:
                  bgClass = "bg-gradient-to-r from-purple-500 to-purple-400";
              }
            }

            return (
              <div
                style={{ padding: "20px" }}
                key={index}
                className={`flex items-center justify-between px-4 py-4 rounded-xl ${bgClass} ${textClass}`}
              >
                <div className="flex items-center gap-3">
                  {!step.locked ? (
                    step.icon || <FaPause className="text-lg" />
                  ) : (
                    step.icon || <FaLock />
                  )}
                  <div>
                    <p className="font-semibold">{step.title}</p>
                    <p className="text-sm opacity-90">{step.duration}</p>
                    {step.levelOrder && (
                      <p className="text-xs opacity-75 mt-1">Level {step.levelOrder}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {step.type === 'final-quiz' && !step.locked && (
                    <FaTrophy className="text-yellow-300" />
                  )}
                  {step.locked && <FaLock className="text-xl" />}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
