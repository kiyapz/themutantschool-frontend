"use client";

import { useEffect, useRef, useState } from "react";
import Addlevelbtn from "./Addlevelbtn";
import { FaVideo, FaImage, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import ToggleButton from "../../../profile/notification/_components/ToggleButton";
import axios from "axios";


const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
    style={{padding: "5px"}}
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

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
);

export default function AddLevels() {
  const [Level, setLevel] = useState("AddLevel");
  const [openAddModel, setOpenAddModel] = useState(false);
  const [title, settitle] = useState("");
  const [description, setdescription] = useState("");
  const [estimatedTime, setestimatedTime] = useState("30 mins");
  const [levels, setLevels] = useState([]);
  const [levelId, setLeveld] = useState("");

  // Loading states
  const [isAddingLevel, setIsAddingLevel] = useState(false);
  const [isAddingCapsule, setIsAddingCapsule] = useState(false);
  const [isLoadingLevels, setIsLoadingLevels] = useState(false);

  // Toast state
  const [toast, setToast] = useState(null);

  // add capsule
  const [capsuleTitle, setCapsuleTitle] = useState("");
  const [capsuleDescription, setCapsuleDescription] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("idle");
  const fileInputRef = useRef(null);

  // Toast helper function
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

  const handleAddCapsuleClick = (levelId) => {
    setLeveld(levelId);
    console.log("Adding capsule to levelId:", levelId);
    setOpenAddModel(true);
  };

  const handleAddCapsel = async () => {
    console.log("Adding capsule with levelId:", levelId);

    if (!capsuleTitle.trim()) {
      showToast("Please enter a capsule title", "error");
      return;
    }

    if (!selectedFile) {
      showToast("Please select a video file", "error");
      return;
    }

    setIsAddingCapsule(true);

    try {
      const formData = new FormData();
      formData.append("title", capsuleTitle);
      formData.append("description", capsuleDescription);
      formData.append("video", selectedFile);

      const res = await axios.post(
        `https://themutantschool-backend.onrender.com/api/mission-capsule/create/${levelId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem(
              "login-accessToken"
            )}`,
          },
        }
      );

      console.log("Capsule uploaded successfully:", res.data);
      showToast("Capsule uploaded successfully!", "success");
      setOpenAddModel(false);
      setCapsuleTitle("");
      setCapsuleDescription("");
      setSelectedFile(null);
      // Refresh levels after adding capsule
      getAllLevel();
    } catch (error) {
      console.error("Capsule upload failed:", error);
      showToast("Capsule upload failed. Please try again.", "error");
    } finally {
      setIsAddingCapsule(false);
    }
  };

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
        body: JSON.stringify({ title, description, estimatedTime, order: 1 }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `Error ${res.status}`);

      setUploadStatus("success");
      showToast("Level created successfully!", "success");
      settitle("");
      setdescription("");
      // Refresh levels after adding
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

  return (
    <>
      {/* Toast Notification */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      )}

      {Level === "AddLevel" && (
        <div
          onClick={() => setLevel("SetAddLevel")}
          className="w-full h-[247.06px] flexcenter flex-col border border-dashed border-[#703D71] gap-5 rounded-[22px] bg-[#131313] mt-10 cursor-pointer hover:bg-[#1a1a1a] transition-colors"
        >
          <p className="font-[600] text-[21px] sm:text-[40px] text-[#703D71] bg-[#221326] h-[30px] w-[30px] sm:h-[60px] sm:w-[60px] flexcenter rounded-full">
            +
          </p>
          <p className="font-[600] text-[12px] sm:text-[21px]">Add New Level</p>
          <p className="font-[200] text-[12px] sm:text-[19px] text-[#9C9C9C]">
            Create another learning module (5/5 remaining)
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
                <div className="text-[#BDE75D] font-[600] flex items-center gap-2 text-[15px] sm:text-[25px]">
                  <span className="w-[50px] h-[50px] flexcenter text-[25px] rounded-full bg-[#BDE75D] text-black">
                    {index + 1}
                  </span>
                  <span>{level.title || `Level ${index + 1}`}</span>
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
                      className="w-full h-[59.76px] rounded-[12px] border border-dashed border-[#696969] text-white py-[15px] hover:bg-[#1a1a1a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                    <p className="font-[600] text-[20px]">{level.title}</p>
                    {level.capsules?.map((capsule, i) => (
                      <div
                        key={i}
                        className="w-full flex items-center justify-between h-[73.64px] rounded-[12px] bg-[#1C1C1C] px-4"
                      >
                        <div className="flex items-center gap-2">
                          <p>{`Capsule ${i + 1}:`}</p>
                          <p>{capsule.title}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaEdit className="cursor-pointer hover:text-[#BDE75D] transition-colors" />
                          <FaTrash className="cursor-pointer hover:text-red-500 transition-colors" />
                          <FaEye className="cursor-pointer hover:text-blue-500 transition-colors" />
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={() => handleAddCapsuleClick(level._id)}
                      className="w-full h-[59.76px] rounded-[12px] border border-dashed border-[#696969] text-white py-[15px] mt-3 hover:bg-[#1a1a1a] transition-colors"
                    >
                      + Add Capsule
                    </button>
                  </>
                )}
              </div>
            ))
          )}

          <div
            onClick={handleAddLevel}
            className="w-full h-[247.06px] flexcenter flex-col border border-dashed border-[#703D71] gap-5 rounded-[22px] bg-[#131313] cursor-pointer hover:bg-[#1a1a1a] transition-colors"
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
                onClick={() => handleAddCapsel(levelId)}
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
