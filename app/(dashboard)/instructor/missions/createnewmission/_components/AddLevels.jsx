"use client";


import { useContext, useEffect, useRef, useState } from "react";
import Addlevelbtn from "./Addlevelbtn";
import {
  FaVideo,
  FaImage,
  FaEye,
  FaEdit,
  FaTrash,
  FaTimes,
} from "react-icons/fa";
import ToggleButton from "../../../profile/notification/_components/ToggleButton";
import axios from "axios";
import { InstructorContext } from "../../../_components/context/InstructorContex";
import QuizCreator from "./AddQuize";
import { useRouter } from "next/navigation";
import profilebase from "../../../profile/_components/profilebase";

import FinalQuizGenerator from "./AddFinalQuize";

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

// Confirmation Modal Component
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center z-50 bg-[rgba(0,0,0,0.9)]">
      <div
        style={{ padding: "20px" }}
        className="max-w-[500px] w-full mx-4 bg-[#101010] rounded-lg p-6"
      >
        <h3 className="text-[20px] font-[600] mb-4">{title}</h3>
        <p className="text-[#9C9C9C] mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            style={{ padding: "10px" }}
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-[#9C9C9C] hover:text-white transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            style={{ padding: "10px" }}
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <LoadingSpinner />
                <span>Deleting...</span>
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Video Preview Modal Component
const VideoPreviewModal = ({ isOpen, onClose, capsule }) => {
  if (!isOpen || !capsule) return null;

  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center z-50 bg-[rgba(0,0,0,0.9)]">
      <div
        style={{ padding: "20px" }}
        className="max-w-[800px] w-full mx-4 bg-[#101010] rounded-lg p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[20px] font-[600]">{capsule.title}</h3>
          <button
            onClick={onClose}
            className="text-[#9C9C9C] hover:text-white transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {capsule.videoUrl ? (
          <video
            controls
            className="w-full max-h-[400px] rounded-lg"
            src={capsule.videoUrl.url}
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="w-full h-[300px] bg-[#1C1C1C] rounded-lg flex items-center justify-center">
            <p className="text-[#9C9C9C]">No video available</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Level Edit Modal Component
const LevelEditModal = ({ isOpen, onClose, level, onSave }) => {
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editEstimatedTime, setEditEstimatedTime] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (level) {
      setEditTitle(level.title || "");
      setEditDescription(level.description || "");
      setEditEstimatedTime(level.estimatedTime || "");
      setError("");
    }
  }, [level]);

  const handleSave = async () => {
    setError("");

    if (!editTitle.trim()) {
      setError("Please enter a title for the level");
      return;
    }

    setIsUpdating(true);
    try {
      const success = await onSave({
        title: editTitle.trim(),
        description: editDescription.trim(),
        estimatedTime: editEstimatedTime.trim(),
      });

      if (success !== false) {
        onClose();
      }
    } catch (error) {
      console.error("Failed to update level:", error);
      setError("Failed to update level. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClose = () => {
    setError("");
    setEditTitle("");
    setEditDescription("");
    setEditEstimatedTime("");
    onClose();
  };

  if (!isOpen || !level) return null;

  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center z-50 bg-[rgba(0,0,0,0.9)]">
      <div
        style={{ padding: "10px" }}
        className="max-w-[600px] w-full mx-4 bg-[#101010] rounded-lg p-6 flex flex-col gap-2"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[20px] font-[600]">Edit Level</h3>
          <button
            style={{ padding: "10px" }}
            onClick={handleClose}
            className="text-[#9C9C9C] hover:text-white transition-colors"
            disabled={isUpdating}
          >
            <FaTimes size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-600/20 border border-red-600/50 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <Addlevelbtn
            value={editTitle}
            onchange={(e) => setEditTitle(e.target.value)}
            placeholder="Level Title"
            disabled={isUpdating}
          />
          <Addlevelbtn
            value={editEstimatedTime}
            onchange={(e) => setEditEstimatedTime(e.target.value)}
            placeholder="Estimated Time"
            disabled={isUpdating}
          />
          <Addlevelbtn
            value={editDescription}
            onchange={(e) => setEditDescription(e.target.value)}
            placeholder="Summary"
            disabled={isUpdating}
          />
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <button
            style={{ padding: "10px" }}
            onClick={handleClose}
            disabled={isUpdating}
            className="px-4 py-2 text-[#9C9C9C] hover:text-white transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            style={{ padding: "10px" }}
            onClick={handleSave}
            disabled={isUpdating || !editTitle.trim()}
            className="px-4 py-2 bg-[#604196] hover:bg-[#704da6] rounded-lg disabled:opacity-50 flex items-center gap-2"
          >
            {isUpdating ? (
              <>
                <LoadingSpinner />
                <span>Saving...</span>
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Fixed Capsule Edit Modal Component
const CapsuleEditModal = ({ isOpen, onClose, capsule, onSave }) => {
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (capsule) {
      setEditTitle(capsule.title || "");
      setEditDescription(capsule.description || "");
      setError("");
    }
  }, [capsule]);

  const handleSave = async () => {
    setError("");

    if (!editTitle.trim()) {
      setError("Please enter a title for the capsule");
      return;
    }

    setIsUpdating(true);

    try {
      const success = await onSave({
        title: editTitle.trim(),
        description: editDescription.trim(),
      });

      if (success !== false) {
        onClose();
      }
    } catch (error) {
      console.error("Failed to update capsule:", error);
      setError("Failed to update capsule. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClose = () => {
    setError("");
    setEditTitle("");
    setEditDescription("");
    onClose();
  };

  if (!isOpen || !capsule) return null;

  return (
    <div
      style={{ padding: "10px" }}
      className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center z-50 bg-[rgba(0,0,0,0.9)]"
    >
      <div
        style={{ padding: "10px" }}
        className="max-w-[600px] w-full mx-4 bg-[#101010] flex flex-col gap-2 rounded-lg p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[20px] font-[600]">Edit Capsule</h3>
          <button
            style={{ padding: "10px" }}
            onClick={handleClose}
            className="text-[#9C9C9C] hover:text-white transition-colors"
            disabled={isUpdating}
          >
            <FaTimes size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-600/20 border border-red-600/50 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <Addlevelbtn
            value={editTitle}
            onchange={(e) => setEditTitle(e.target.value)}
            placeholder="Capsule Title"
            disabled={isUpdating}
          />
          <Addlevelbtn
            value={editDescription}
            onchange={(e) => setEditDescription(e.target.value)}
            placeholder="Summary (Optional)"
            disabled={isUpdating}
          />
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <button
            style={{ padding: "10px" }}
            onClick={handleClose}
            disabled={isUpdating}
            className="px-4 py-2 text-[#9C9C9C] hover:text-white transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            style={{ padding: "10px" }}
            onClick={handleSave}
            disabled={isUpdating || !editTitle.trim()}
            className="px-4 py-2 bg-[#604196] hover:bg-[#704da6] rounded-lg disabled:opacity-50 flex items-center gap-2"
          >
            {isUpdating ? (
              <>
                <LoadingSpinner />
                <span>Saving...</span>
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

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

  // Modal states
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: null,
    item: null,
    levelIndex: null,
    capsuleIndex: null,
  });
  const [videoPreviewModal, setVideoPreviewModal] = useState({
    isOpen: false,
    capsule: null,
  });
  const [levelEditModal, setLevelEditModal] = useState({
    isOpen: false,
    level: null,
  });
  const [capsuleEditModal, setCapsuleEditModal] = useState({
    isOpen: false,
    capsule: null,
    levelIndex: null,
    capsuleIndex: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);

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

  // Level CRUD operations
  const handleEditLevel = (level) => {
    setLevelEditModal({ isOpen: true, level });
  };

  const handleDeleteLevel = (level) => {
    setConfirmModal({
      isOpen: true,
      type: "level",
      item: level,
      levelIndex: null,
      capsuleIndex: null,
    });
  };

  const handleUpdateLevel = async (levelId, updatedData) => {
    const accessToken = localStorage.getItem("login-accessToken");
    if (!accessToken) {
      showToast("Please login first", "error");
      return false;
    }

    try {
      const response = await axios.put(
        `https://themutantschool-backend.onrender.com/api/mission-level/${levelId}`,
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        showToast("Level updated successfully!", "success");
        await getAllLevel();
        return true;
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to update level:", error);

      if (error.response) {
        const errorMsg =
          error.response.data?.message ||
          `Server error: ${error.response.status}`;
        showToast(errorMsg, "error");
      } else if (error.request) {
        showToast("Network error. Please check your connection.", "error");
      } else {
        showToast("Failed to update level. Please try again.", "error");
      }

      throw error;
    }
  };

  const handleConfirmDelete = async () => {
    if (!confirmModal.item) return;

    setIsDeleting(true);
    const accessToken = localStorage.getItem("login-accessToken");

    try {
      if (confirmModal.type === "level") {
        const response = await axios.delete(
          `https://themutantschool-backend.onrender.com/api/mission-level/${confirmModal.item._id}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (response.status === 200) {
          showToast("Level deleted successfully!", "success");
          getAllLevel();
        }
      } else if (confirmModal.type === "capsule") {
        const response = await axios.delete(
          `https://themutantschool-backend.onrender.com/api/mission-capsule/${confirmModal.item._id}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (response.status === 200) {
          showToast("Capsule deleted successfully!", "success");
          getAllLevel();
        }
      }
    } catch (error) {
      console.error("Delete failed:", error);
      showToast("Failed to delete. Please try again.", "error");
    } finally {
      setIsDeleting(false);
      setConfirmModal({
        isOpen: false,
        type: null,
        item: null,
        levelIndex: null,
        capsuleIndex: null,
      });
    }
  };

  // Fixed Capsule CRUD operations
 const handleEditCapsule = (capsule, levelIndex, capsuleIndex) => {
   console.log(
     "Opening edit modal for capsule:",
     capsule.title,
     "at indices:",
     {
       levelIndex,
       capsuleIndex,
     }
   );

   setCapsuleEditModal({
     isOpen: true,
     capsule,
     levelIndex,
     capsuleIndex,
   });
 };

 // REPLACE the JSX for CapsuleEditModal with this:
 <CapsuleEditModal
   isOpen={capsuleEditModal.isOpen}
   onClose={() =>
     setCapsuleEditModal({
       isOpen: false,
       capsule: null,
       levelIndex: null,
       capsuleIndex: null,
     })
   }
   capsule={capsuleEditModal.capsule}
   onSave={async (updatedData) => {
     console.log("Saving capsule with data:", updatedData);
     console.log("Current modal state:", capsuleEditModal);

     try {
       const result = await handleUpdateCapsule(
         capsuleEditModal.capsule._id,
         updatedData
       );
       return result;
     } catch (error) {
       console.error("Error in onSave:", error);
       return false;
     }
   }}
 />;

 // DEBUGGING: Add this console.log in your levels.map to verify data structure
 {
   levels.map((level, index) => {
     console.log(
       `Level ${index}:`,
       level.title,
       "Capsules:",
       level.capsules?.length
     );
     return (
       <div
         key={level._id}
         className="w-full bg-[#0F0F0F] px-[30px] py-[20px] rounded-lg flex flex-col gap-3"
       >
         {/* ... rest of your level JSX ... */}

         {level.capsules?.map((capsule, i) => {
           console.log(`Capsule ${i}:`, capsule.title); // Add this for debugging
           return (
             <div
               style={{ padding: "0px 10px" }}
               key={capsule._id || i}
               className="w-full flex items-center justify-between h-[73.64px] rounded-[12px] bg-[#1C1C1C] px-4"
             >
               <div className="flex items-center gap-2">
                 <p className="text-[#737373] sm:text-[25px] sm:leading-[40px] text-[10px] leading-[150%] font-[300]">
                   {`Capsule ${i + 1}:`}
                 </p>
                 <p className="text-[#CCCCCC] sm:text-[25px] sm:leading-[40px] font-[400] text-[10px] leading-[150%]">
                   {capsule.title}
                 </p>
               </div>
               <div className="flex items-center gap-2">
                 <FaEdit
                   className="cursor-pointer text-[#747474] hover:text-[#BDE75D] transition-colors"
                   onClick={() => handleEditCapsule(capsule, index, i)}
                   title="Edit Capsule"
                 />
                 <FaTrash
                   className="cursor-pointer text-[#FF6363] hover:text-red-500 transition-colors"
                   onClick={() => handleDeleteCapsule(capsule, index, i)}
                   title="Delete Capsule"
                 />
                 <FaEye
                   className="cursor-pointer hover:text-blue-500 transition-colors"
                   onClick={() => handleViewCapsule(capsule)}
                   title="View Capsule"
                 />
               </div>
             </div>
           );
         })}
       </div>
     );
   });
 }
  const handleDeleteCapsule = (capsule, levelIndex, capsuleIndex) => {
    setConfirmModal({
      isOpen: true,
      type: "capsule",
      item: capsule,
      levelIndex,
      capsuleIndex,
    });
  };

  const handleViewCapsule = (capsule) => {
    setVideoPreviewModal({ isOpen: true, capsule });
  };

  // Fixed handleUpdateCapsule function with local state update
 const handleUpdateCapsule = async (capsuleId, updatedData) => {
   const accessToken = localStorage.getItem("login-accessToken");
   if (!accessToken) {
     showToast("Please login first", "error");
     return false;
   }

   try {
     let response;

     // Check if there's a video file to upload
     if (updatedData.videoFile) {
       // Use FormData for file upload
       const formData = new FormData();
       formData.append("title", updatedData.title);
       formData.append("description", updatedData.description);
       formData.append("video", updatedData.videoFile);

       response = await axios.put(
         `https://themutantschool-backend.onrender.com/api/mission-capsule/${capsuleId}`,
         formData,
         {
           headers: {
             "Content-Type": "multipart/form-data",
             Authorization: `Bearer ${accessToken}`,
           },
         }
       );
     } else {
       // Use JSON for text-only updates
       response = await axios.put(
         `https://themutantschool-backend.onrender.com/api/mission-capsule/${capsuleId}`,
         {
           title: updatedData.title,
           description: updatedData.description,
         },
         {
           headers: {
             "Content-Type": "application/json",
             Authorization: `Bearer ${accessToken}`,
           },
         }
       );
     }

     if (response.status === 200 || response.status === 201) {
       showToast("Capsule updated successfully!", "success");

       // Update local state immediately for better UX
       const { levelIndex, capsuleIndex } = capsuleEditModal;

       console.log(
         "Updating capsule at levelIndex:",
         levelIndex,
         "capsuleIndex:",
         capsuleIndex
       );
       console.log("Response data:", response.data);

       if (
         levelIndex !== null &&
         capsuleIndex !== null &&
         levelIndex >= 0 &&
         capsuleIndex >= 0
       ) {
         setLevels((prevLevels) => {
           const newLevels = [...prevLevels];

           // Check if the indices are valid
           if (
             newLevels[levelIndex] &&
             newLevels[levelIndex].capsules &&
             newLevels[levelIndex].capsules[capsuleIndex]
           ) {
             // Update the capsule data
             newLevels[levelIndex].capsules[capsuleIndex] = {
               ...newLevels[levelIndex].capsules[capsuleIndex],
               title: updatedData.title,
               description: updatedData.description,
               // Try different response data structures
               ...(response.data?.videoUrl && {
                 videoUrl: response.data.videoUrl,
               }),
               ...(response.data?.data?.videoUrl && {
                 videoUrl: response.data.data.videoUrl,
               }),
             };

             console.log(
               "Updated capsule locally:",
               newLevels[levelIndex].capsules[capsuleIndex]
             );
           } else {
             console.warn("Invalid indices for capsule update:", {
               levelIndex,
               capsuleIndex,
               levels: newLevels.length,
               capsules: newLevels[levelIndex]?.capsules?.length,
             });
           }

           return newLevels;
         });
       } else {
         console.warn("Invalid modal indices:", { levelIndex, capsuleIndex });
       }

       // Always refresh from server to ensure data consistency
       await getAllLevel();
       return true;
     } else {
       throw new Error(`Unexpected response status: ${response.status}`);
     }
   } catch (error) {
     console.error("Failed to update capsule:", error);

     if (error.response) {
       console.error("Error response:", error.response.data);
       const errorMsg =
         error.response.data?.message ||
         `Server error: ${error.response.status}`;
       showToast(errorMsg, "error");
     } else if (error.request) {
       showToast("Network error. Please check your connection.", "error");
     } else {
       showToast("Failed to update capsule. Please try again.", "error");
     }

     throw error;
   }
 };


  const handleAddCapsuleClick = (levelId, order) => {
    setLeveld(levelId);
    setOder(order);
    console.log("Adding capsule to levelId:", levelId);
    setOpenAddModel(true);
  };

  const handleAddCapsule = async () => {
    setIsAddingCapsule(true);

    console.log("Adding capsule with levelId:", levelId);

    if (!levelId) {
      showToast("Level ID is required to add a capsule", "error");
      setIsAddingCapsule(false);
      return;
    }

    if (!capsuleTitle.trim()) {
      showToast("Please enter a capsule title", "error");
      setIsAddingCapsule(false);
      return;
    }

    if (!selectedFile) {
      showToast("Please select a video file", "error");
      setIsAddingCapsule(false);
      return;
    }

    const accessToken = localStorage.getItem("login-accessToken");
    if (!accessToken) {
      showToast("Please login first to add a capsule", "error");
      setIsAddingCapsule(false);
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
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );

      if (res.ok) {
        console.log("Capsule uploaded successfully:", res);
        showToast("Capsule uploaded successfully!", "success");
        setOpenAddModel(false);
        setCapsuleTitle("");
        setCapsuleDescription("");
        setSelectedFile(null);
        await getAllLevel();
      } else {
        const errorData = await res.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${res.status}`
        );
      }
    } catch (error) {
      console.log("Capsule upload failed:", error.message);
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

  const handleAddQuize = async (index, id) => {
    const missionId = localStorage.getItem("missionId");
    setmessionId(missionId);
    setLevel("AddQuize");
    setLeveld(id);
    setcapselId(index);
    console.log(id, " capsule id for quiz");
  };

  return (
    <>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() =>
          setConfirmModal({
            isOpen: false,
            type: null,
            item: null,
            levelIndex: null,
            capsuleIndex: null,
          })
        }
        onConfirm={handleConfirmDelete}
        title={`Delete ${confirmModal.type === "level" ? "Level" : "Capsule"}`}
        message={`Are you sure you want to delete this ${confirmModal.type}? This action cannot be undone.`}
        isLoading={isDeleting}
      />

      {/* Video Preview Modal */}
      <VideoPreviewModal
        isOpen={videoPreviewModal.isOpen}
        onClose={() => setVideoPreviewModal({ isOpen: false, capsule: null })}
        capsule={videoPreviewModal.capsule}
      />

      {/* Level Edit Modal */}
      <LevelEditModal
        isOpen={levelEditModal.isOpen}
        onClose={() => setLevelEditModal({ isOpen: false, level: null })}
        level={levelEditModal.level}
        onSave={(updatedData) =>
          handleUpdateLevel(levelEditModal.level._id, updatedData)
        }
      />

      {/* Capsule Edit Modal */}
      <CapsuleEditModal
        isOpen={capsuleEditModal.isOpen}
        onClose={() =>
          setCapsuleEditModal({
            isOpen: false,
            capsule: null,
            levelIndex: null,
            capsuleIndex: null,
          })
        }
        capsule={capsuleEditModal.capsule}
        onSave={(updatedData) =>
          handleUpdateCapsule(capsuleEditModal.capsule._id, updatedData)
        }
      />

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

                  {!level?.isNew && (
                    <div className="flex items-center gap-2">
                      <FaEdit
                        className="cursor-pointer text-[#747474] hover:text-[#BDE75D] transition-colors"
                        onClick={() => handleEditLevel(level)}
                        title="Edit Level"
                      />
                      <FaTrash
                        className="cursor-pointer text-[#FF6363] hover:text-red-500 transition-colors"
                        onClick={() => handleDeleteLevel(level)}
                        title="Delete Level"
                      />
                    </div>
                  )}
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
                        key={capsule._id || i}
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
                          <FaEdit
                            className="cursor-pointer text-[#747474] hover:text-[#BDE75D] transition-colors"
                            onClick={() => handleEditCapsule(capsule, index, i)}
                            title="Edit Capsule"
                          />
                          <FaTrash
                            className="cursor-pointer text-[#FF6363] hover:text-red-500 transition-colors"
                            onClick={() =>
                              handleDeleteCapsule(capsule, index, i)
                            }
                            title="Delete Capsule"
                          />
                          <FaEye
                            className="cursor-pointer hover:text-blue-500 transition-colors"
                            onClick={() => handleViewCapsule(capsule)}
                            title="View Capsule"
                          />
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

          {/* Add Final Quize */}

          <div
            onClick={() => setLevel("AddFinalQuize")}
            className="w-full h-[154.5px] sm:h-[247.06px] flexcenter flex-col border border-dashed border-[#703D71] gap-2 sm:gap-5 rounded-[22px] bg-[#131313] mt-10 cursor-pointer hover:bg-[#1a1a1a] transition-colors"
          >
            <p className="font-[600] text-[21px] sm:text-[40px] text-[#703D71] bg-[#221326] h-[30px] w-[30px] sm:h-[60px] sm:w-[60px] flexcenter rounded-full">
              +
            </p>
            {/* <p className="font-[600] text-[12px] sm:text-[21px]">
              Add New Level
            </p> */}
            <p className="font-[200] text-[12px] sm:text-[19px] text-[#9C9C9C]">
              Create final Quiz
            </p>
          </div>
        </div>
      )}

      {Level === "AddQuize" && <QuizCreator />}
      {Level === "AddFinalQuize" && <FinalQuizGenerator />}

      {openAddModel && (
        <div className="fixed top-0 left-0 w-screen h-screen overflow-auto flex justify-center z-40 bg-[rgba(0,0,0,0.9)]">
          <div
            style={{ padding: "30px" }}
            className="max-w-[800px] flex flex-col gap-5 w-full h-fit bg-[#101010] rounded-lg"
          >
            <div className="flex justify-between items-center">
              <p className="text-[25px] leading-[40px] font-[700]">
                Add Power Capsule
              </p>
              <button
                onClick={() => setOpenAddModel(false)}
                className="text-[#9C9C9C] hover:text-white transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

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

            <div className="w-full grid  ">
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
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const files = e.dataTransfer.files;
                    if (files.length > 0) {
                      handleFileSelect(files[0]);
                    }
                  }}
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
                      <button
                        onClick={() => setSelectedFile(null)}
                        className="text-[#FF6363] hover:text-red-500 text-[12px] underline"
                      >
                        Remove file
                      </button>
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

              {/* <div className="flex flex-col gap-3">
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
              </div> */}
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
