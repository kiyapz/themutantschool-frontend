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
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [isDraggingVideo, setIsDraggingVideo] = useState(false);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  useEffect(() => {
    if (capsule) {
      setEditTitle(capsule.title || "");
      setEditDescription(capsule.description || "");
      setSelectedImage(null);
      setSelectedVideo(null);
      setError("");
    }
  }, [capsule]);

  const handleImageSelect = (file) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (JPEG, PNG, etc.)");
      return;
    }
    setSelectedImage(file);
    setError("");
  };

  const handleImageInputChange = (e) => {
    const file = e.target.files[0];
    if (file) handleImageSelect(file);
  };

  const handleBrowseImageClick = () => {
    imageInputRef.current?.click();
  };

  const handleVideoSelect = (file) => {
    if (!file.type.startsWith("video/")) {
      setError("Please select a video file");
      return;
    }
    // Check file size (100MB limit)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      setError(
        `Video file is too large (${(file.size / 1024 / 1024).toFixed(
          2
        )}MB). Maximum allowed size is 100MB.`
      );
      return;
    }
    setSelectedVideo(file);
    setError("");
  };

  const handleVideoInputChange = (e) => {
    const file = e.target.files[0];
    if (file) handleVideoSelect(file);
  };

  const handleBrowseVideoClick = () => {
    videoInputRef.current?.click();
  };

  const handleSave = async () => {
    setError("");

    if (!editTitle.trim()) {
      setError("Please enter a title for the capsule");
      return;
    }

    setIsUpdating(true);

    try {
      const updateData = {
        title: editTitle.trim(),
        description: editDescription.trim(),
      };

      // Add video file if selected
      if (selectedVideo) {
        updateData.videoFile = selectedVideo;
      }

      // Add image file if selected
      if (selectedImage) {
        updateData.imageFile = selectedImage;
      }

      console.log("=== CAPSULE EDIT MODAL DEBUG ===");
      console.log("Edit title:", editTitle);
      console.log("Edit description:", editDescription);
      console.log("Selected video:", selectedVideo);
      console.log("Selected image:", selectedImage);
      console.log("Update data:", updateData);

      const success = await onSave(updateData);

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
    setSelectedImage(null);
    setSelectedVideo(null);
    onClose();
  };

  if (!isOpen || !capsule) return null;

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center z-50 bg-[rgba(0,0,0,0.9)] overflow-y-auto py-4 hide-scrollbar"
    >
      <div
        className="max-w-[600px] w-full mx-4 bg-[#101010] flex flex-col gap-2 rounded-lg p-6 max-h-[90vh] overflow-y-auto hide-scrollbar"
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

        {/* Current Video Info */}
        {capsule?.videoUrl && (
          <div className="bg-[#1C1C1C] p-3 rounded-[8px] border border-[#3C3C3C]">
            <p className="text-[#8C8C8C] text-[12px] mb-1">Current Video:</p>
            <p className="text-[#CCCCCC] text-[13px] truncate">
              {capsule.videoUrl.url ? "Video uploaded ✓" : "No video"}
            </p>
          </div>
        )}

        {/* Video Upload Section */}
        <div className="flex flex-col gap-3">
          <label className="text-[#8C8C8C] font-[600] text-[13px] sm:text-[15px] leading-[40px]">
            Video Upload (Optional - Update existing video)
          </label>

          <div
            className={`w-full h-[200px] flexcenter flex-col rounded-[12px] bg-[#131313] border-2 border-dashed transition-all duration-200 ${
              isDraggingVideo
                ? "border-[#19569C] bg-[#19569C]/10"
                : "border-[#404040] hover:border-[#19569C]/50"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDraggingVideo(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDraggingVideo(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setIsDraggingVideo(false);
              const files = e.dataTransfer.files;
              if (files.length > 0) {
                handleVideoSelect(files[0]);
              }
            }}
          >
            {!selectedVideo ? (
              <>
                <p className="text-center mb-4">
                  <FaVideo
                    size={60}
                    title="Video Icon"
                    className="text-[#8C8C8C]"
                  />
                </p>
                <p className="font-[400] text-[14px] leading-[20px] text-center">
                  Drag and drop a video, or{" "}
                  <span
                    className="text-[#19569C] cursor-pointer hover:underline"
                    onClick={handleBrowseVideoClick}
                  >
                    Browse
                  </span>
                </p>
                <p className="text-[#787878] text-[12px] mt-2">
                  MP4 (max 100MB)
                </p>
              </>
            ) : (
              <div className="text-center">
                <p className="text-[#19569C] font-[600] text-[14px] mb-2">
                  {selectedVideo.name}
                </p>
                <p className="text-[#787878] text-[12px] mb-4">
                  Video selected (
                  {(selectedVideo.size / 1024 / 1024).toFixed(2)} MB)
                </p>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="text-[#FF6363] hover:text-red-500 text-[12px] underline"
                >
                  Remove video
                </button>
              </div>
            )}
          </div>

          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            onChange={handleVideoInputChange}
            className="hidden"
          />
        </div>

        {/* Image Upload Section */}
        <div className="flex flex-col gap-3">
          <label className="text-[#8C8C8C] font-[600] text-[13px] sm:text-[15px] leading-[40px]">
            Image Attachment (Optional)
          </label>

          <div
            className={`w-full h-[200px] flexcenter flex-col rounded-[12px] bg-[#131313] border-2 border-dashed transition-all duration-200 ${
              isDraggingImage
                ? "border-[#19569C] bg-[#19569C]/10"
                : "border-[#404040] hover:border-[#19569C]/50"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDraggingImage(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDraggingImage(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setIsDraggingImage(false);
              const files = e.dataTransfer.files;
              if (files.length > 0) {
                handleImageSelect(files[0]);
              }
            }}
          >
            {!selectedImage ? (
              <>
                <p className="text-center mb-4">
                  <FaImage
                    size={60}
                    title="Image Icon"
                    className="text-[#8C8C8C]"
                  />
                </p>
                <p className="font-[400] text-[14px] leading-[20px] text-center">
                  Drag and drop an image, or{" "}
                  <span
                    className="text-[#19569C] cursor-pointer hover:underline"
                    onClick={handleBrowseImageClick}
                  >
                    Browse
                  </span>
                </p>
                <p className="text-[#787878] text-[12px] mt-2">
                  JPEG, PNG (Maximum 1400px × 1600px)
                </p>
              </>
            ) : (
              <div className="text-center">
                <p className="text-[#19569C] font-[600] text-[14px] mb-2">
                  {selectedImage.name}
                </p>
                <p className="text-[#787878] text-[12px] mb-4">
                  Image selected successfully
                </p>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="text-[#FF6363] hover:text-red-500 text-[12px] underline"
                >
                  Remove image
                </button>
              </div>
            )}
          </div>

          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageInputChange}
            className="hidden"
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
  const [capsuleUploadError, setCapsuleUploadError] = useState(null);

  const [toast, setToast] = useState(null);

  const [capsuleTitle, setCapsuleTitle] = useState("");
  const [capsuleDescription, setCapsuleDescription] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [order, setOder] = useState();
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("idle");
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

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

  const handleImageSelect = (file) => {
    if (!file.type.startsWith("image/")) {
      showToast("Please select an image file (JPEG, PNG, etc.)", "error");
      return;
    }
    setSelectedImage(file);
    showToast("Image file selected successfully", "success");
  };

  const handleImageInputChange = (e) => {
    const file = e.target.files[0];
    if (file) handleImageSelect(file);
  };

  const handleBrowseImageClick = () => {
    imageInputRef.current?.click();
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

        // API returns { success: true, message: "Capsule deleted successfully." }
        if (response.status === 200 && (response.data?.success === true || response.data?.status === "success")) {
          showToast(response.data?.message || "Capsule deleted successfully!", "success");
          getAllLevel();
        } else {
          throw new Error(response.data?.message || "Delete failed");
        }
      }
    } catch (error) {
      console.error("Delete failed:", error);
      
      if (error.response) {
        const errorMsg =
          error.response.data?.message ||
          error.response.data?.error ||
          `Server error: ${error.response.status}`;
        showToast(errorMsg, "error");
      } else if (error.request) {
        showToast("Network error. Please check your connection.", "error");
      } else {
        showToast(error.message || "Failed to delete. Please try again.", "error");
      }
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
    console.log("Viewing capsule:", capsule);
    setVideoPreviewModal({ isOpen: true, capsule });
  };

  // Fixed handleUpdateCapsule function to always use multipart/form-data per API spec
  const handleUpdateCapsule = async (capsuleId, updatedData) => {
    const accessToken = localStorage.getItem("login-accessToken");
    if (!accessToken) {
      showToast("Please login first", "error");
      return false;
    }

    console.log("=== CAPSULE UPDATE DEBUG ===");
    console.log("Updating capsule with ID:", capsuleId);
    console.log("Update data being sent:", updatedData);
    console.log("Has videoFile:", !!updatedData.videoFile);
    console.log("Has imageFile:", !!updatedData.imageFile);

    try {
      // Always use FormData per API specification (multipart/form-data is required)
      const formData = new FormData();
      
      // Add title if provided
      if (updatedData.title) {
        formData.append("title", updatedData.title);
      }

      // Add description if provided
      if (updatedData.description !== undefined) {
        formData.append("description", updatedData.description);
      }

      // Add order if provided
      if (updatedData.order !== undefined) {
        formData.append("order", updatedData.order.toString());
      }

      // Add duration if provided
      if (updatedData.duration !== undefined) {
        formData.append("duration", updatedData.duration.toString());
      }

      // Add isPreview if provided (must be string "true" or "false" per API spec)
      if (updatedData.isPreview !== undefined) {
        formData.append("isPreview", updatedData.isPreview ? "true" : "false");
      }

      // Add video file if provided (replaces old video)
      if (updatedData.videoFile) {
        formData.append("video", updatedData.videoFile);
      }

      // Add attachments if provided (replaces ALL old attachments)
      if (updatedData.imageFile) {
        formData.append("attachments", updatedData.imageFile);
      }

      // If multiple attachments are provided as an array
      if (updatedData.attachments && Array.isArray(updatedData.attachments)) {
        updatedData.attachments.forEach((file) => {
          formData.append("attachments", file);
        });
      }

      const response = await axios.put(
        `https://themutantschool-backend.onrender.com/api/mission-capsule/${capsuleId}/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log("Server response:", response.status, response.data);

      // Check for success response (API returns { success: true, ... })
      if (response.status === 200 || response.status === 201) {
        const isSuccess = response.data?.success === true || response.data?.status === "success";
        if (isSuccess) {
          console.log("✅ Capsule update successful!");
          showToast("Capsule updated successfully!", "success");
          await getAllLevel();
          return true;
        } else {
          throw new Error(response.data?.message || "Update failed");
        }
      } else {
        console.log("❌ Unexpected response status:", response.status);
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to update capsule:", error);

      if (error.response) {
        console.error("Error response:", error.response.data);
        const errorMsg =
          error.response.data?.message ||
          error.response.data?.error ||
          `Server error: ${error.response.status}`;
        showToast(errorMsg, "error");
      } else if (error.request) {
        showToast("Network error. Please check your connection.", "error");
      } else {
        showToast(error.message || "Failed to update capsule. Please try again.", "error");
      }

      throw error;
    }
  };

  const handleAddCapsuleClick = (levelId, order, currentCapsuleCount) => {
    // Check if level already has 5 capsules
    if (currentCapsuleCount >= 5) {
      showToast("Maximum of 5 capsules per level reached", "error");
      return;
    }

    setLeveld(levelId);
    setOder(order);
    console.log("Adding capsule to levelId:", levelId);
    setCapsuleUploadError(null); // Clear any previous errors
    setOpenAddModel(true);
  };

  const handleAddCapsule = async () => {
    setIsAddingCapsule(true);
    setCapsuleUploadError(null); // Clear any previous errors

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

    // Check file size (100MB limit as per UI)
    const maxSize = 100 * 1024 * 1024; // 100MB in bytes
    if (selectedFile.size > maxSize) {
      showToast(
        `Video file is too large (${(selectedFile.size / 1024 / 1024).toFixed(
          2
        )}MB). Maximum allowed size is 100MB.`,
        "error"
      );
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
      console.log("📤 Starting capsule upload...");
      console.log(
        "Video file size:",
        (selectedFile.size / 1024 / 1024).toFixed(2),
        "MB"
      );
      console.log("Video file type:", selectedFile.type);
      if (selectedImage) {
        console.log(
          "Image file size:",
          (selectedImage.size / 1024 / 1024).toFixed(2),
          "MB"
        );
      }

      const formData = new FormData();
      formData.append("title", capsuleTitle);
      formData.append("description", capsuleDescription);
      formData.append("video", selectedFile);
      formData.append("order", order);
      formData.append("duration", "90 seconds");
      formData.append("isPreview", true);

      // Add image if selected
      if (selectedImage) {
        formData.append("attachments", selectedImage);
      }

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
        console.log("✅ Capsule uploaded successfully!");
        const responseData = await res.json();
        console.log("Response data:", responseData);
        showToast("Capsule uploaded successfully!", "success");
        setOpenAddModel(false);
        setCapsuleTitle("");
        setCapsuleDescription("");
        setSelectedFile(null);
        setSelectedImage(null);
        await getAllLevel();
      } else {
        console.error(`❌ Upload failed with status: ${res.status}`);
        let errorMessage = `Server error (${res.status})`;
        let errorDetails = null;

        try {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            errorDetails = await res.json();
            console.error("📋 Backend error response (JSON):", errorDetails);

            // Try to extract meaningful error message
            errorMessage =
              errorDetails.message ||
              errorDetails.error ||
              errorDetails.msg ||
              (errorDetails.errors && errorDetails.errors[0]?.msg) ||
              errorMessage;
          } else {
            const textError = await res.text();
            console.error("📋 Backend error response (Text):", textError);
            if (textError) {
              errorMessage = textError.substring(0, 200); // Limit error text length
            }
          }
        } catch (parseError) {
          console.error("⚠️ Could not parse error response:", parseError);
        }

        // Add common error hints based on status code
        if (res.status === 500) {
          console.error("🔧 Troubleshooting tips for 500 error:");
          console.error("1. Try a smaller video file (< 30MB)");
          console.error("2. Try re-encoding the video with standard settings");
          console.error("3. Check if backend server is running properly");
          console.error("4. Check backend server logs for the actual error");

          errorMessage = `Server Error: ${errorMessage}

Try these solutions:
• Use a smaller video file (< 30MB recommended)
• Re-encode your video with standard H.264 codec
• Wait a few minutes and try again
• Contact support if the issue persists`;
        } else if (res.status === 413) {
          errorMessage =
            "File is too large for the server to process. Try a smaller file (< 50MB).";
        } else if (res.status === 401) {
          errorMessage = "Authentication failed. Please login again.";
        } else if (res.status === 403) {
          errorMessage = "You don't have permission to upload capsules.";
        }

        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("💥 Capsule upload failed:", error);
      console.error("📊 Error details:", {
        message: error.message,
        name: error.name,
        levelId,
        title: capsuleTitle,
        videoSize: selectedFile
          ? (selectedFile.size / 1024 / 1024).toFixed(2) + " MB"
          : "N/A",
        videoType: selectedFile?.type || "N/A",
        hasImage: !!selectedImage,
      });

      // Show user-friendly error message
      const errorMsg =
        error.message || "Capsule upload failed. Please try again.";
      setCapsuleUploadError(errorMsg); // Set error state for display in modal
      showToast("Upload failed. See details below.", "error");
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
      // Find the highest order among existing levels and add 1
      const maxOrder =
        levels.length > 0
          ? Math.max(...levels.map((level) => level.order || 0))
          : 0;
      const levelOrder = maxOrder + 1;
      console.log(
        "Creating level with order:",
        levelOrder,
        "Current levels count:",
        levels.length,
        "Max existing order:",
        maxOrder
      );

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
          order: levelOrder,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `Error ${res.status}`);

      console.log("Level created successfully, server response:", data);
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
      const levelsData = response.data.data || [];
      console.log("Fetched levels after update:", levelsData);

      // Fetch capsules for each level
      const levelsWithCapsules = await Promise.all(
        levelsData.map(async (level) => {
          try {
            // Fetch capsules for this level
            const capsulesResponse = await axios.get(
              `https://themutantschool-backend.onrender.com/api/mission-capsule/level/${level._id}?page=1&limit=100`,
              { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            
            // Extract capsules from response
            const capsules = capsulesResponse.data?.data?.capsules || capsulesResponse.data?.data || [];
            
            console.log(`Fetched ${capsules.length} capsules for level ${level._id}:`, capsules);
            
            return {
              ...level,
              capsules: capsules,
            };
          } catch (capsuleError) {
            console.error(`Failed to fetch capsules for level ${level._id}:`, capsuleError);
            // Return level without capsules if fetch fails
            return {
              ...level,
              capsules: level.capsules || [],
            };
          }
        })
      );

      setLevels(levelsWithCapsules);

      // Debug order values
      if (levelsWithCapsules && levelsWithCapsules.length > 0) {
        levelsWithCapsules.forEach((level, index) => {
          console.log(
            `Level ${index + 1}: order = ${level.order}, title = "${
              level.title
            }", capsules = ${level.capsules?.length || 0}`
          );
        });
      }

      // Log specific capsule data for debugging
      if (levelsWithCapsules && levelsWithCapsules.length > 0) {
        levelsWithCapsules.forEach((level, levelIndex) => {
          if (level.capsules && level.capsules.length > 0) {
            level.capsules.forEach((capsule, capsuleIndex) => {
              console.log(`Level ${levelIndex}, Capsule ${capsuleIndex}:`, {
                id: capsule._id,
                title: capsule.title,
                description: capsule.description,
              });
            });
          } else {
            console.log(`Level ${levelIndex} has no capsules`);
          }
        });
      }
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
      router.push("/instructor/missions");
      return;
    }

    if (!missionId) {
      alert("No mission ID found. Redirecting to create new mission.");
      setActiveTab("Mission Details");
      router.push("/instructor/missions/createnewmission");
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
        onSave={async (updatedData) => {
          console.log("=== CAPSULE MODAL ONSAVE DEBUG ===");
          console.log("Saving capsule with data:", updatedData);
          console.log("Current modal state:", capsuleEditModal);
          console.log("Capsule ID:", capsuleEditModal.capsule?._id);

          try {
            const result = await handleUpdateCapsule(
              capsuleEditModal.capsule._id,
              updatedData
            );
            console.log("Update result:", result);
            return result;
          } catch (error) {
            console.error("Error in onSave:", error);
            return false;
          }
        }}
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
                key={level._id || level.id || index}
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
                  <div className="flex flex-col gap-3">
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
                          handleAddCapsuleClick(
                            level._id,
                            (level.capsules?.length || 0) + 1,
                            level.capsules?.length || 0
                          )
                        }
                        disabled={(level.capsules?.length || 0) >= 5}
                        className={`flex-1 h-[59.76px] sm:text-[21px] sm:leading-[40px] rounded-[12px] border border-dashed px-4 text-[12px] sm:text-[16px] font-medium transition-colors ${
                          (level.capsules?.length || 0) >= 5
                            ? "border-[#444444] text-[#666666] cursor-not-allowed opacity-50"
                            : "border-[#696969] text-[#CCCCCC] text-white hover:bg-[#1a1a1a] cursor-pointer"
                        }`}
                        title={
                          (level.capsules?.length || 0) >= 5
                            ? "Maximum of 5 capsules reached"
                            : "Add a new power capsule"
                        }
                      >
                        + Add Power Capsule
                        {level.capsules?.length > 0 &&
                          ` (${level.capsules.length}/5)`}
                      </button>
                      <button
                        style={{ padding: "0px  10px" }}
                        onClick={() => handleAddQuize(`${index}`, level._id)}
                        className="h-[59.76px] bg-[#6B479C]  rounded-[12px] text-white px-5 text-[12px] sm:text-[21px] font-bold hover:bg-[#1a1a1a] transition-transform transform hover:scale-105 flex items-center justify-center whitespace-nowrap cursor-pointer"
                      >
                        Add Quiz
                      </button>
                    </div>
                  </div>
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
                onClick={() => {
                  setOpenAddModel(false);
                  setCapsuleUploadError(null);
                }}
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

              <div className="flex flex-col gap-3">
                <label
                  htmlFor="bio"
                  className="text-[#8C8C8C] font-[600] text-[13px] sm:text-[15px] leading-[40px]"
                >
                  Image Attachments (Optional)
                </label>

                <div
                  className={`w-full h-[301.65px] flexcenter flex-col rounded-[22px] bg-[#131313] border-2 border-dashed transition-all duration-200 ${
                    isDraggingImage
                      ? "border-[#19569C] bg-[#19569C]/10"
                      : "border-[#404040] hover:border-[#19569C]/50"
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingImage(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setIsDraggingImage(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingImage(false);
                    const files = e.dataTransfer.files;
                    if (files.length > 0) {
                      handleImageSelect(files[0]);
                    }
                  }}
                >
                  {!selectedImage ? (
                    <>
                      <p className="text-center">
                        <FaImage
                          size={90}
                          title="Photo/Image Icon"
                          className="text-[#8C8C8C]"
                        />
                      </p>
                      <p className="font-[400] text-[17px] leading-[40px]">
                        Drag and drop Images, or{" "}
                        <span
                          className="text-[#19569C] cursor-pointer hover:underline"
                          onClick={handleBrowseImageClick}
                        >
                          Browse
                        </span>
                      </p>
                      <p className="text-[#787878] text-[13px]">
                        JPEG, PNG (Maximum 1400px * 1600px)
                      </p>
                    </>
                  ) : (
                    <div className="text-center">
                      <p className="text-[#19569C] font-[600] text-[16px] mb-2">
                        {selectedImage.name}
                      </p>
                      <p className="text-[#787878] text-[13px] mb-4">
                        Image selected successfully
                      </p>
                      <button
                        onClick={() => setSelectedImage(null)}
                        className="text-[#FF6363] hover:text-red-500 text-[12px] underline"
                      >
                        Remove image
                      </button>
                    </div>
                  )}
                </div>

                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageInputChange}
                  className="hidden"
                />
              </div>
            </div>

            <div>
              <ToggleButton label="Enable PublicPreview" />
            </div>

            {/* Upload Status Message */}
            {isAddingCapsule && (
              <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <LoadingSpinner />
                  <div>
                    <p className="text-blue-400 font-semibold">
                      Uploading capsule...
                    </p>
                    <p className="text-blue-300 text-sm">
                      This may take a while on slow networks. Please wait.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Display */}
            {capsuleUploadError && !isAddingCapsule && (
              <div className="bg-red-900/30 border-2 border-red-500/70 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="text-red-500 text-xl font-bold mt-1">⚠️</div>
                  <div className="flex-1">
                    <p className="text-red-400 font-semibold mb-2">
                      Upload Failed
                    </p>
                    <pre className="text-red-300 text-sm whitespace-pre-wrap font-sans">
                      {capsuleUploadError}
                    </pre>
                  </div>
                  <button
                    onClick={() => setCapsuleUploadError(null)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <FaTimes size={16} />
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={handleAddCapsule}
                disabled={isAddingCapsule}
                className="text-[16px] leading-[40px] font-[300] cursor-pointer rounded-[10px] bg-[#604196] w-[169.37px] hover:bg-[#704da6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isAddingCapsule ? (
                  <>
                    <LoadingSpinner />
                    <span>Uploading...</span>
                  </>
                ) : (
                  "Save"
                )}
              </button>

              <button
                onClick={() => {
                  setOpenAddModel(false);
                  setCapsuleUploadError(null);
                }}
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

        /* Hide scrollbar but keep scrolling functionality */
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}
