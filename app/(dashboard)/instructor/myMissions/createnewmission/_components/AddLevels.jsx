"use client";

import { useContext, useEffect, useRef, useState } from "react";
import Addlevelbtn from "./Addlevelbtn";
import { FaVideo, FaImage, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import ToggleButton from "../../../profile/notification/_components/ToggleButton";
import axios from "axios";
// import AddQuize from "./AddQuize";
import { InstructorContext } from "../../../_components/context/InstructorContex";
import QuizCreator from "./AddQuize";
import { useRouter } from "next/navigation";
import profilebase from "../../../profile/_components/profilebase";

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      style={{ padding: "5px" }}
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out ${
        type === "success"
          ? "bg-green-600"
          : type === "error"
          ? "bg-red-600"
          : "bg-blue-600"
      } text-white min-w-[300px] animate-slide-in`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-4 text-white hover:text-gray-200 font-bold"
        >
          ×
        </button>
      </div>
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
);

export default function AddLevels() {

    const router = useRouter();
  const {
    capselId,
    setcapselId,
    levelId,
    setLeveld,
    missionId,
    setmessionId,
    Level,
    setLevel,
    setActiveTab,
    setMission,
    courses,
  } = useContext(InstructorContext);

  const [openAddModel, setOpenAddModel] = useState(false);
  const [title, settitle] = useState("");
  const [description, setdescription] = useState("");
  const [estimatedTime, setestimatedTime] = useState("30 mins");
  const [levels, setLevels] = useState([]);

  const [isAddingLevel, setIsAddingLevel] = useState(false);
  const [isAddingCapsule, setIsAddingCapsule] = useState(false);
  const [isLoadingLevels, setIsLoadingLevels] = useState(false);

  const [toast, setToast] = useState(null);

  const [capsuleTitle, setCapsuleTitle] = useState("");
  const [capsuleDescription, setCapsuleDescription] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);
  const [order, setOder] = useState();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("idle");
  const fileInputRef = useRef(null);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  const handleFileSelect = (file) => {
    if (!file.type.startsWith("video/")) {
      showToast("Please select a video file", "error");
      return;
    }
    setSelectedFile(file);
    showToast("Video file selected successfully", "success");
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFileSelect(file);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  // seen
  const handleAddCapsuleClick = (levelId, order) => {
    setLeveld(levelId);
    setOder(order);
    console.log("Adding capsule to levelId:", levelId);
    setOpenAddModel(true);
  };

  const handleAddCapsule = async () => {
    setIsAddingCapsule(true);

    console.log("Adding capsule with levelId:", levelId);

    console.log("Adding capsule with levelId:", levelId);
    if (!levelId) {
      showToast("Level ID is required to add a capsule", "error");
      return;
    }

    if (!capsuleTitle.trim()) {
      showToast("Please enter a capsule title", "error");
      return;
    }

    if (!selectedFile) {
      showToast("Please select a video file", "error");
      return;
    }

    const accessToken = localStorage.getItem("login-accessToken");
    if (!accessToken) {
      showToast("Please login first to add a capsule", "error");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", capsuleTitle);
      formData.append("description", capsuleDescription);
      formData.append("video", selectedFile);
      formData.append("order", order);
      formData.append("duration", "90 seconds");
      formData.append("isPreview", true);

      const res = await fetch(
        `https://themutantschool-backend.onrender.com/api/mission-capsule/create/${levelId}`,
        {
          method: "POST",
          headers: {
            contentType: "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );

      console.log(accessToken, " access token used for capsule upload");

      console.log("Capsule upload response:", res);

      console.log("Capsule uploaded successfully:", res);
      showToast("Capsule uploaded successfully!", "success");
      setIsAddingCapsule(false);
      setOpenAddModel(false);

      setCapsuleTitle("");
      setCapsuleDescription("");
      setSelectedFile(null);
      getAllLevel();
    } catch (error) {
      console.log(
        "Capsule upload failed:",
        error.response?.data || error.message
      );
      showToast("Capsule upload failed. Please try again.", "error");
    } finally {
      setIsAddingCapsule(false);
    }
  };

  // seen
  const AddMissionLevel = async () => {
    if (!title.trim()) {
      showToast("Please enter a title for the level", "error");
      return;
    }
    if (!description.trim()) {
      showToast("Please enter a description for the level", "error");
      return;
    }

    setIsAddingLevel(true);
    setUploadStatus("uploading");

    const accessToken = localStorage.getItem("login-accessToken");
    const missionId = localStorage.getItem("missionId");
    if (!accessToken || !missionId) {
      showToast("Missing access token or mission ID", "error");
      setUploadStatus("error");
      setIsAddingLevel(false);
      return;
    }

    try {
      const apiUrl = `https://themutantschool-backend.onrender.com/api/mission-level/${missionId}/create`;
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          title,
          description,
          estimatedTime,
          order: levels.length + 1,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `Error ${res.status}`);

      setUploadStatus("success");
      showToast("Level created successfully!", "success");
      settitle("");
      setdescription("");
      getAllLevel();
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("error");
      showToast(`Upload failed: ${error.message}`, "error");
    } finally {
      setIsAddingLevel(false);
    }
  };

  const getAllLevel = async () => {
    const accessToken = localStorage.getItem("login-accessToken");
    const missionId = localStorage.getItem("missionId");

    setIsLoadingLevels(true);

    try {
      const response = await axios.get(
        `https://themutantschool-backend.onrender.com/api/mission-level/mission/${missionId}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setLevels(response.data.data || []);
      console.log("Fetched levels:", response.data.data);
    } catch (error) {
      console.error("Failed to fetch levels:", error);
      showToast("Failed to fetch levels", "error");
    } finally {
      setIsLoadingLevels(false);
    }
  };

    useEffect(() => {
      console.log("use effect for fetching missions");

      const storedUser = localStorage.getItem("USER");
      const parsedUser = JSON.parse(storedUser);
      const id = parsedUser._id;

      async function getAllMission() {
        try {
          const response = await profilebase.get(`instructor/report/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                "login-accessToken"
              )}`,
            },
          });

          if (response.status === 401) {
            console.log("Unauthorized access. Please log in again.");

            const refreshToken = localStorage.getItem("login-refreshToken");
            // make a reques to get new token
            const getToken = await profilebase.post(
              "auth/refresh-token",
              { refreshToken },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(
                    "login-accessToken"
                  )}`,
                },
              }
            );

            if (getToken.status === 200) {
              localStorage.setItem(
                "login-accessToken",
                getToken.data.accessToken
              );
              console.log("Access token refreshed successfully.");

              return getAllMission();
            }
          }

          console.log("fetched mission response", response.data.missions);
          setMission(response.data.missions);
        } catch (error) {
          console.log("Error fetching missions:", error);
        }
      }
      getAllMission();
    }, []);

  useEffect(() => {
    const missionId = localStorage.getItem("missionId");

    if (courses.length > 0 && !missionId) {
      alert(" Redirecting to choose a mission.");
      router.push("/instructor/myMissions");
      return;
    }

    if (!missionId) {
      alert("No mission ID found. Redirecting to create new mission.");
      setActiveTab("Mission Details");

      router.push("/instructor/myMissions/createnewmission");
    return;
    }
  }, []);

  useEffect(() => {
    getAllLevel();
  }, []);

  const handleAddLevel = () => {
    const newId = levels.length + 1000;

    if (levels.length >= 5) {
      showToast("You can only add up to 5 levels", "error");
      return;
    }

    setLevels([
      ...levels,
      {
        id: newId,
        title: "",
        description: "",
        capsules: [],
        isNew: true,
      },
    ]);

    showToast("New level added", "success");
  };

  // Add Quize

  const handleAddQuize = async (index, id) => {
    const missionId = localStorage.getItem("missionId");
    setmessionId(missionId);
    setLevel("AddQuize");

    setLeveld(id);
    setcapselId(index);

    console.log(id, " capsule id for quiz");

    //  try {
    //    const response = await fetch(
    //      "https://themutantschool-backend.onrender.com/api/mission-submit-quiz/submit-quiz",
    //      {
    //        method: "POST",
    //        headers: {
    //          "Content-Type": "application/json",
    //          Authorization: `Bearer ${accessToken}`,
    //        },
    //        body: JSON.stringify(payload),
    //      }
    //    );

    //    const result = await response.json();

    //    if (!response.ok) {
    //      console.error("Quiz submission failed:", result);
    //      alert("Failed to submit quiz: " + (result.message || "Unknown error"));
    //    } else {
    //      console.log("Quiz submitted successfully:", result);
    //      alert("Quiz submitted successfully!");
    //    }
    //  } catch (error) {
    //    console.error("Submission error:", error);
    //    alert("Something went wrong. Please try again.");
    //  }
  };

  return (
    <>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      )}

      {Level === "AddLevel" && (
        <div
          onClick={() => setLevel("SetAddLevel")}
          className="w-full h-[154.5px] sm:h-[247.06px] flexcenter flex-col border border-dashed border-[#703D71] gap-2 sm:gap-5 rounded-[22px] bg-[#131313] mt-10 cursor-pointer hover:bg-[#1a1a1a] transition-colors"
        >
          <p className="font-[600] text-[21px] sm:text-[40px] text-[#703D71] bg-[#221326] h-[30px] w-[30px] sm:h-[60px] sm:w-[60px] flexcenter rounded-full">
            +
          </p>
          <p className="font-[600] text-[12px] sm:text-[21px]">Add New Level</p>
          <p className="font-[200] text-[12px] sm:text-[19px] text-[#9C9C9C]">
            Create another learning module ({levels.length}/5 remaining)
          </p>
        </div>
      )}

      {Level === "SetAddLevel" && (
        <div className="flex flex-col gap-10 p-4">
          {isLoadingLevels ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner />
              <span className="ml-2 text-[#9C9C9C]">Loading levels...</span>
            </div>
          ) : (
            levels.map((level, index) => (
              <div
                key={level._id}
                className="w-full bg-[#0F0F0F] px-[30px] py-[20px] rounded-lg flex flex-col gap-3"
              >
                <div className="flex justify-between w-full items-center">
                  <div className="text-[#BDE75D] font-[600] flex items-center gap-2 text-[15px] sm:text-[25px]">
                    <span className="w-[50px] h-[50px] flexcenter text-[25px] rounded-full bg-[#BDE75D] text-black">
                      {index + 1}
                    </span>
                    <span> {`Level ${index + 1}`}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <FaEdit className="cursor-pointer text-[#747474] hover:text-[#BDE75D] transition-colors" />
                    <FaTrash className="cursor-pointer text-[#FF6363] hover:text-red-500 transition-colors" />
                  </div>
                </div>

                {level?.isNew ? (
                  <>
                    <div className="grid grid-cols-2 gap-5 mt-4">
                      <Addlevelbtn
                        value={title}
                        onchange={(e) => settitle(e.target.value)}
                        placeholder="Level Title"
                      />
                      <Addlevelbtn
                        value={estimatedTime}
                        onchange={(e) => setestimatedTime(e.target.value)}
                        placeholder="Estimated Time"
                      />
                    </div>
                    <Addlevelbtn
                      value={description}
                      onchange={(e) => setdescription(e.target.value)}
                      placeholder="Summary"
                    />

                    <button
                      onClick={AddMissionLevel}
                      disabled={isAddingLevel}
                      className="w-full h-[59.76px] rounded-[12px] border text-[#CCCCCC] border-dashed border-[#696969] text-white py-[15px] hover:bg-[#1a1a1a] text-[12px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isAddingLevel ? (
                        <>
                          <LoadingSpinner />
                          <span>Saving Level...</span>
                        </>
                      ) : (
                        "+ Save Level"
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    <p className="font-[600] text-[13px] sm:text-[25px] sm:leading-[40px] leading-[150%] ">
                      {level.title}
                    </p>
                    {level.capsules?.map((capsule, i) => (
                      <div
                        style={{ padding: "0px  10px" }}
                        key={i}
                        className="w-full flex items-center justify-between h-[73.64px] rounded-[12px] bg-[#1C1C1C] px-4"
                      >
                        <div className="flex items-center gap-2">
                          <p className="text-[#737373] sm:text-[25px] sm:leading-[40px]  text-[10px] leading-[150%] font-[300] ">{`Capsule ${
                            i + 1
                          }:`}</p>
                          <p className="text-[#CCCCCC] sm:text-[25px] sm:leading-[40px]  font-[400] text-[10px]leading-[150%] ">
                            {capsule.title}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaEdit className="cursor-pointer text-[#747474] hover:text-[#BDE75D] transition-colors" />
                          <FaTrash className="cursor-pointer text-[#FF6363] hover:text-red-500 transition-colors" />
                          <FaEye className="cursor-pointer hover:text-blue-500 transition-colors" />
                        </div>
                      </div>
                    ))}
                    <div className="flex gap-2 sm:gap-4 mt-4 items-center">
                      <button
                        style={{ padding: "0px  10px" }}
                        onClick={() =>
                          handleAddCapsuleClick(level._id, level.order)
                        }
                        className="flex-1 h-[59.76px] sm:text-[21px] sm:leading-[40px]  text-[#CCCCCC] rounded-[12px] border border-dashed border-[#696969] text-white px-4 text-[12px] sm:text-[16px] font-medium hover:bg-[#1a1a1a] transition-colors cursor-pointer"
                      >
                        + Add Power Capsule
                      </button>
                      <button
                        style={{ padding: "0px  10px" }}
                        onClick={() => handleAddQuize(`${index}`, level._id)}
                        className="h-[59.76px] bg-[#6B479C]  rounded-[12px] text-white px-5 text-[12px] sm:text-[21px] font-bold hover:bg-[#1a1a1a] transition-transform transform hover:scale-105 flex items-center justify-center whitespace-nowrap cursor-pointer"
                      >
                        Add Quiz
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}

          <div
            onClick={handleAddLevel}
            className="w-full h-[154.5px] sm:h-[247.06px] flexcenter flex-col border border-dashed border-[#703D71] gap-2 sm:gap-5 rounded-[22px] bg-[#131313] cursor-pointer hover:bg-[#1a1a1a] transition-colors"
          >
            <p className="font-[600] text-[21px] sm:text-[40px] text-[#703D71] bg-[#221326] h-[30px] w-[30px] sm:h-[60px] sm:w-[60px] flexcenter rounded-full">
              +
            </p>
            <p className="font-[600] text-[12px] sm:text-[21px]">
              Add New Level
            </p>
            <p className="font-[200] text-[12px] sm:text-[19px] text-[#9C9C9C]">
              Create another learning module ({levels.length}/5 remaining)
            </p>
          </div>
        </div>
      )}

      {Level === "AddQuize" && <QuizCreator />}

      {openAddModel && (
        <div className="fixed top-0 left-0 w-screen h-screen overflow-auto flex justify-center z-40 bg-[rgba(0,0,0,0.9)]">
          <div
            style={{ padding: "30px" }}
            className="max-w-[800px] flex flex-col gap-5 w-full h-fit bg-[#101010] rounded-lg"
          >
            <p className="text-[25px] leading-[40px] font-[700]">
              Add Power Capsule
            </p>

            <div className="flex flex-col gap-5">
              <Addlevelbtn
                value={capsuleTitle}
                onchange={(e) => setCapsuleTitle(e.target.value)}
                placeholder="Capsule Title"
              />
              <Addlevelbtn
                onchange={(e) => setCapsuleDescription(e.target.value)}
                value={capsuleDescription}
                placeholder="Summary (Optional)"
              />
            </div>

            <div className="w-full grid gap-5 xl:grid-cols-2">
              <div className="flex flex-col gap-3">
                <label
                  htmlFor="bio"
                  className="text-[#8C8C8C] font-[600] text-[13px] sm:text-[15px] leading-[40px]"
                >
                  Video Upload
                </label>

                <div
                  className={`w-full h-[301.65px] flexcenter flex-col rounded-[22px] bg-[#131313] border-2 border-dashed transition-all duration-200 ${
                    isDragging
                      ? "border-[#19569C] bg-[#19569C]/10"
                      : "border-[#404040] hover:border-[#19569C]/50"
                  }`}
                >
                  {!selectedFile ? (
                    <>
                      <p className="text-center mb-4">
                        <FaVideo
                          size={90}
                          title="Video Icon"
                          className="text-[#8C8C8C]"
                        />
                      </p>
                      <p className="font-[400] text-[17px] leading-[40px] text-center">
                        Drag and drop a video, or{" "}
                        <span
                          className="text-[#19569C] cursor-pointer hover:underline"
                          onClick={handleBrowseClick}
                        >
                          Browse
                        </span>
                      </p>
                      <p className="text-[#787878] text-[13px]">
                        MP4 (4:3, 60 seconds, max 100MB)
                      </p>
                    </>
                  ) : (
                    <div className="text-center">
                      <p className="text-[#19569C] font-[600] text-[16px] mb-2">
                        {selectedFile.name}
                      </p>
                      <p className="text-[#787878] text-[13px] mb-4">
                        File selected successfully
                      </p>
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>

              <div className="flex flex-col gap-3">
                <label
                  htmlFor="bio"
                  className="text-[#8C8C8C] font-[600] text-[13px] sm:text-[15px] leading-[40px]"
                >
                  Attachments
                </label>

                <div className="w-full h-[301.65px] flexcenter flex-col rounded-[22px] bg-[#131313] border-2 border-dashed border-[#404040] hover:border-[#19569C]/50 transition-all duration-200">
                  <p className="text-center">
                    <FaImage
                      size={90}
                      title="Photo/Image Icon"
                      className="text-[#8C8C8C]"
                    />
                  </p>
                  <p className="font-[400] text-[17px] leading-[40px]">
                    Drag and drop Images, or{" "}
                    <span className="text-[#19569C] cursor-pointer hover:underline">
                      Browse
                    </span>
                  </p>
                  <p className="text-[#787878] text-[13px]">
                    JPEG, PNG (Maximum 1400px * 1600px)
                  </p>
                </div>
              </div>
            </div>

            <div>
              <ToggleButton label="Enable PublicPreview" />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleAddCapsule}
                disabled={isAddingCapsule}
                className="text-[16px] leading-[40px] font-[300] cursor-pointer rounded-[10px] bg-[#604196] w-[169.37px] hover:bg-[#704da6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isAddingCapsule ? (
                  <>
                    <LoadingSpinner />
                    <span>Saving...</span>
                  </>
                ) : (
                  "Save"
                )}
              </button>

              <button
                onClick={() => setOpenAddModel(false)}
                disabled={isAddingCapsule}
                className="text-[16px] leading-[40px] font-[300] cursor-pointer hover:text-[#9C9C9C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
