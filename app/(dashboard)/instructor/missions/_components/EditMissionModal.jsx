"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import api from "../../../../../lib/api";

const EditMissionModal = ({ mission, isOpen, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState("details");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    shortDescription: "",
    category: "",
    skillLevel: "",
    Language: "",
    estimatedDuration: "",
    certificateAvailable: true,
    price: "",
    bio: "",
    tags: [],
    learningOutcomes: [],
    video: "",
    thumbnail: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mission && isOpen) {
      console.log("Mission data for edit:", mission);

      // Handle video field which could be a string or an object
      let videoValue = "";
      if (mission.video) {
        console.log("Video data type:", typeof mission.video);
        console.log("Video data:", mission.video);

        if (typeof mission.video === "object" && mission.video.url) {
          // If it's an object with URL, use the URL
          videoValue = mission.video.url;
          console.log("Using video URL from object:", videoValue);
        } else if (typeof mission.video === "string") {
          // If it's a string, use it directly
          videoValue = mission.video;
          console.log("Using video string directly:", videoValue);
        } else {
          // Try to parse it if it's a stringified JSON
          try {
            const parsedVideo = JSON.parse(mission.video);
            if (parsedVideo && parsedVideo.url) {
              videoValue = parsedVideo.url;
              console.log("Parsed video URL from JSON string:", videoValue);
            }
          } catch (e) {
            console.log("Video is not a valid JSON string");
          }
        }
      }

      // Ensure learningOutcomes is always an array
      const learningOutcomes = Array.isArray(mission.learningOutcomes)
        ? mission.learningOutcomes
        : [];

      // If no learning outcomes, provide at least one empty field
      if (learningOutcomes.length === 0) {
        learningOutcomes.push("");
      }

      setFormData({
        title: mission.title || "",
        description: mission.description || "",
        shortDescription: mission.shortDescription || "",
        category: mission.category || "",
        skillLevel: mission.skillLevel || "",
        Language: mission.Language || "English (uk)",
        estimatedDuration: mission.estimatedDuration
          ? mission.estimatedDuration
              .toString()
              .replace(/\s*hours?/gi, "")
              .trim()
          : "",
        certificateAvailable: mission.certificateAvailable !== false,
        price: mission.price || "",
        bio: mission.bio || "",
        tags: mission.tags || [],
        learningOutcomes: learningOutcomes,
        video: videoValue,
      });
    }
  }, [mission, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setFormData((prev) => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return {
        ...prev,
        [field]: newArray,
      };
    });
  };

  const addArrayItem = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData((prev) => {
      const newArray = [...prev[field]];
      newArray.splice(index, 1);
      return {
        ...prev,
        [field]: newArray,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const accessToken = localStorage.getItem("login-accessToken");

      if (!accessToken) {
        alert("Please login first to edit mission");
        return;
      }

      const missionId = mission?._id || localStorage.getItem("missionId");

      if (!missionId) {
        alert("Mission ID not found. Please try again.");
        setLoading(false);
        return;
      }

      console.log("Using mission ID for update:", missionId);

      // Create a FormData object for the update
      const updateFormData = new FormData();

      // Add basic text fields
      updateFormData.append("title", formData.title.trim());
      updateFormData.append(
        "shortDescription",
        formData.shortDescription.trim()
      );
      updateFormData.append("description", formData.description.trim());
      updateFormData.append("category", formData.category);
      updateFormData.append("skillLevel", formData.skillLevel);
      updateFormData.append("Language", formData.Language);
      // Handle estimated duration - ensure it's a valid number
      const duration = parseFloat(formData.estimatedDuration) || 0;
      updateFormData.append("estimatedDuration", duration + " hours");
      updateFormData.append(
        "certificateAvailable",
        formData.certificateAvailable
      );
      updateFormData.append("price", parseFloat(formData.price) || 0);
      updateFormData.append("bio", formData.bio.trim());

      // Add tags as array elements
      const filteredTags = formData.tags.filter((tag) => tag.trim() !== "");
      filteredTags.forEach((tag, index) => {
        updateFormData.append(`tags[${index}]`, tag.trim());
      });

      // Add learning outcomes as array elements
      // First, filter out any empty outcomes
      const filteredOutcomes = formData.learningOutcomes.filter(
        (outcome) => outcome.trim() !== ""
      );

      console.log("Filtered learning outcomes:", filteredOutcomes);

      // If we have outcomes, add them to the form data
      if (filteredOutcomes.length > 0) {
        filteredOutcomes.forEach((outcome, index) => {
          updateFormData.append(`learningOutcomes[${index}]`, outcome.trim());
        });
      } else {
        // If all outcomes were removed, send an empty array
        updateFormData.append("learningOutcomes", JSON.stringify([]));
      }

      // Handle video URL properly
      if (formData.video && formData.video.trim()) {
        const videoUrl = formData.video.trim();
        console.log("Processing video URL:", videoUrl);

        // Check if it's a YouTube or other embed URL
        if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
          // For YouTube videos, use the embed format
          const videoObject = {
            url: videoUrl,
            type: "embed",
          };
          console.log("Creating video object for YouTube:", videoObject);
          updateFormData.append("video", JSON.stringify(videoObject));
        } else {
          // For direct video URLs
          console.log("Using direct video URL:", videoUrl);
          updateFormData.append("video", videoUrl);
        }
      } else {
        // If video URL is empty, explicitly set it to empty string
        console.log("No video URL provided");
        updateFormData.append("video", "");
      }

      // Handle thumbnail upload
      if (formData.thumbnail) {
        console.log(
          "Adding new thumbnail to form data:",
          formData.thumbnail.name
        );
        updateFormData.append("thumbnail", formData.thumbnail);
      }

      console.log("Updating mission with FormData");
      console.log("Using mission ID from localStorage:", missionId);

      // Log FormData contents for debugging
      for (let [key, value] of updateFormData.entries()) {
        console.log(`${key}:`, value);
      }

      // Use axios directly for more control over the request
      const response = await axios({
        method: "put",
        url: `https://themutantschool-backend.onrender.com/api/mission/${missionId}`,
        data: updateFormData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          // Let axios set the Content-Type header for FormData
        },
        // Add timeout and additional options
        timeout: 15000,
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      });

      console.log("Mission updated successfully:", response);

      // Extract the updated mission data from the response
      const updatedMission = response.data?.data || response.data;
      console.log("Updated mission data:", updatedMission);

      alert("Mission updated successfully!");

      if (onSuccess) {
        // Pass the updated mission data to the success handler
        onSuccess(updatedMission);
      }

      // Force page reload to show updated data
      if (typeof window !== "undefined") {
        // Add a short delay before reloading to allow the alert to be seen
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }

      onClose();
    } catch (error) {
      console.error("Error updating mission:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response,
        request: error.request,
        config: error.config,
      });

      // Handle different types of errors
      if (error.response) {
        // Server responded with an error status code
        console.error("Server response error:", error.response.data);
        console.error("Status code:", error.response.status);

        if (error.response.status === 401) {
          alert("Authentication failed. Please login again.");
        } else if (error.response.status === 403) {
          alert("You do not have permission to edit this mission.");
        } else if (error.response.status === 404) {
          alert("Mission not found.");
        } else {
          // Try to extract a meaningful error message
          const errorMessage =
            error.response.data?.message ||
            error.response.data?.error ||
            `Server error (${error.response.status})`;
          alert(`Error updating mission: ${errorMessage}`);
        }
      } else if (error.request) {
        // Request was made but no response received
        console.error("No response received:", error.request);
        alert(
          "No response from server. Please check your internet connection and try again."
        );
      } else {
        // Error in setting up the request
        console.error("Request setup error:", error.message);
        alert(`Error updating mission: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#121212] rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Update Mission</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          {/* Status Badge */}
          <div className="flex justify-end mb-6">
            <span
              className={`px-3 py-1 text-xs rounded-full ${
                mission?.status === "Published"
                  ? "bg-green-900/50 text-green-400"
                  : mission?.status === "Draft"
                  ? "bg-yellow-900/50 text-yellow-400"
                  : mission?.status === "Pending Review"
                  ? "bg-blue-900/50 text-blue-400"
                  : "bg-gray-900/50 text-gray-400"
              }`}
            >
              {mission?.status || "Draft"}
            </span>
          </div>

          {/* Tabs navigation */}
          <div className="flex border-b border-[#333] mb-6">
            <button
              onClick={() => setActiveTab("details")}
              className={`px-6 py-3 font-medium ${
                activeTab === "details"
                  ? "text-white border-b-2 border-purple-500"
                  : "text-gray-400"
              }`}
            >
              Mission Details
            </button>
            <button
              onClick={() => setActiveTab("learning")}
              className={`px-6 py-3 font-medium ${
                activeTab === "learning"
                  ? "text-white border-b-2 border-purple-500"
                  : "text-gray-400"
              }`}
            >
              Learning Outcome
            </button>
            <button
              onClick={() => setActiveTab("config")}
              className={`px-6 py-3 font-medium ${
                activeTab === "config"
                  ? "text-white border-b-2 border-purple-500"
                  : "text-gray-400"
              }`}
            >
              Mission Configuration
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mission Details Tab */}
            {activeTab === "details" && (
              <div className="space-y-6">
                {/* Mission Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Mission Title
                  </label>
                  <input
                    type="text"
                    value={formData.title || ""}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333] rounded-md text-white focus:outline-none focus:border-[#604196]"
                    placeholder="Enter mission title"
                    required
                  />
                </div>

                {/* Short Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Short Description
                  </label>
                  <input
                    type="text"
                    value={formData.shortDescription || ""}
                    onChange={(e) =>
                      handleInputChange("shortDescription", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333] rounded-md text-white focus:outline-none focus:border-[#604196]"
                    placeholder="Brief description that appears on mission cards"
                  />
                </div>

                {/* Full Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Description
                  </label>
                  <textarea
                    value={formData.description || ""}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    rows={4}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333] rounded-md text-white focus:outline-none focus:border-[#604196]"
                    placeholder="Detailed mission description"
                    required
                  />
                </div>

                {/* Hidden Bio field - we keep it in the form data but don't show it */}
                <input
                  type="hidden"
                  value={formData.bio || ""}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                />
              </div>
            )}

            {/* Learning Outcome Tab */}
            {activeTab === "learning" && (
              <div className="space-y-6">
                {/* Category and Skill Level */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category || ""}
                      onChange={(e) =>
                        handleInputChange("category", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333] rounded-md text-white focus:outline-none focus:border-[#604196]"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Technology">Technology</option>
                      <option value="Education">Education</option>
                      <option value="Health">Health</option>
                      <option value="Environment">Environment</option>
                      <option value="Social">Social</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Skill Level
                    </label>
                    <select
                      value={formData.skillLevel || ""}
                      onChange={(e) =>
                        handleInputChange("skillLevel", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333] rounded-md text-white focus:outline-none focus:border-[#604196]"
                      required
                    >
                      <option value="">Select Level</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                </div>

                {/* Price and Duration */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Price (USD)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price || ""}
                      onChange={(e) =>
                        handleInputChange("price", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333] rounded-md text-white focus:outline-none focus:border-[#604196]"
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Estimated Duration (hours)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={formData.estimatedDuration || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Only allow positive numbers
                        if (
                          value === "" ||
                          (!isNaN(value) && parseFloat(value) >= 0)
                        ) {
                          handleInputChange("estimatedDuration", value);
                        }
                      }}
                      className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333] rounded-md text-white focus:outline-none focus:border-[#604196]"
                      placeholder="Duration in hours"
                      required
                    />
                  </div>
                </div>

                {/* Certificate Available */}
                <div className="flex items-center mt-4">
                  <input
                    type="checkbox"
                    id="certificateAvailable"
                    checked={formData.certificateAvailable}
                    onChange={(e) =>
                      handleInputChange(
                        "certificateAvailable",
                        e.target.checked
                      )
                    }
                    className="mr-2 h-4 w-4 text-[#604196] bg-[#1A1A1A] border-[#333] rounded focus:ring-[#604196]"
                  />
                  <label
                    htmlFor="certificateAvailable"
                    className="text-gray-300 text-sm"
                  >
                    Certificate Available Upon Completion
                  </label>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={formData.tags?.join(", ") || ""}
                    onChange={(e) => {
                      const tagsArray = e.target.value
                        .split(",")
                        .map((tag) => tag.trim());
                      handleInputChange("tags", tagsArray);
                    }}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333] rounded-md text-white focus:outline-none focus:border-[#604196]"
                    placeholder="python, coding, beginner (comma separated)"
                  />
                </div>
              </div>
            )}

            {/* Mission Configuration Tab */}
            {activeTab === "config" && (
              <div className="space-y-6">
                {/* Video URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Video URL
                  </label>
                  <input
                    type="url"
                    value={formData.video?.url || formData.video || ""}
                    onChange={(e) => {
                      const videoUrl = e.target.value;
                      handleInputChange("video", videoUrl);
                    }}
                    placeholder="YouTube or direct video URL"
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333] rounded-md text-white focus:outline-none focus:border-[#604196]"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    For YouTube videos, paste the regular watch URL (e.g.,
                    https://www.youtube.com/watch?v=xxxxx)
                  </p>
                </div>

                {/* Thumbnail Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Thumbnail Image
                  </label>
                  <div className="flex items-center space-x-4">
                    {mission?.thumbnail?.url && (
                      <div className="w-24 h-24 bg-[#1A1A1A] rounded-md overflow-hidden">
                        <img
                          src={mission.thumbnail.url}
                          alt="Current thumbnail"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 mb-2">
                        Current thumbnail will be preserved unless you upload a
                        new one
                      </p>
                      <label className="cursor-pointer bg-[#1A1A1A] border border-[#333] rounded-md px-4 py-2 text-sm text-gray-300 hover:bg-[#252525]">
                        <span>Choose New Thumbnail</span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              console.log(
                                "New thumbnail selected:",
                                e.target.files[0].name
                              );
                              setFormData((prev) => ({
                                ...prev,
                                thumbnail: e.target.files[0],
                              }));
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Learning Outcomes */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Learning Outcomes
                  </label>
                  <p className="text-xs text-gray-400 mb-3">
                    List what students will learn from this mission (appears in
                    "What You'll Learn" section)
                  </p>
                  <div className="space-y-2">
                    {formData.learningOutcomes?.map((outcome, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={outcome}
                          onChange={(e) =>
                            handleArrayChange(
                              "learningOutcomes",
                              index,
                              e.target.value
                            )
                          }
                          placeholder={`Learning outcome ${index + 1}`}
                          className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333] rounded-md text-white focus:outline-none focus:border-[#604196]"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            removeArrayItem("learningOutcomes", index)
                          }
                          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-md flex-shrink-0"
                          title="Remove this outcome"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayItem("learningOutcomes")}
                      className="text-[#604196] hover:text-[#7052a8] text-sm font-medium flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Add Learning Outcome
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 text-white bg-transparent border border-[#333] rounded-md py-3 px-6 hover:bg-[#1A1A1A] font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 text-white rounded-md py-3 px-6 font-medium ${
                  loading
                    ? "bg-[#604196] opacity-70"
                    : "bg-[#604196] hover:bg-[#7052a8]"
                } transition-colors flex items-center justify-center`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Updating Mission...
                  </>
                ) : (
                  "Update Mission"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditMissionModal;
