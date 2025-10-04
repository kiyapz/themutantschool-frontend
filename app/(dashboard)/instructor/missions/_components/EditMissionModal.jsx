"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import api from "../../../../../lib/api";

const EditMissionModal = ({ mission, isOpen, onClose, onSuccess }) => {
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
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mission && isOpen) {
      setFormData({
        title: mission.title || "",
        description: mission.description || "",
        shortDescription: mission.shortDescription || "",
        category: mission.category || "",
        skillLevel: mission.skillLevel || "",
        Language: mission.Language || "English (uk)",
        estimatedDuration: mission.estimatedDuration || "",
        certificateAvailable: mission.certificateAvailable !== false,
        price: mission.price || "",
        bio: mission.bio || "",
        tags: mission.tags || [],
        learningOutcomes: mission.learningOutcomes || [],
        video: mission.video || "",
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
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayItem = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
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

      const missionId = localStorage.getItem("missionId");

      if (!missionId) {
        alert("Mission ID not found in localStorage");
        return;
      }

      // Prepare data as JSON - the backend seems to prefer this over FormData
      const updateData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        shortDescription: formData.shortDescription.trim(),
        category: formData.category,
        skillLevel: formData.skillLevel,
        Language: formData.Language,
        // Convert estimatedDuration to a number - remove "hours" if present
        estimatedDuration: parseInt(formData.estimatedDuration) || 0,
        certificateAvailable: formData.certificateAvailable,
        // Convert price to a number
        price: parseFloat(formData.price) || 0,
        bio: formData.bio.trim(),
        tags: formData.tags.filter((tag) => tag.trim() !== ""),
        learningOutcomes: formData.learningOutcomes.filter(
          (outcome) => outcome.trim() !== ""
        ),
        video: formData.video.trim(),
      };

      console.log("Updating mission with JSON data:", updateData);
      console.log("Using mission ID from localStorage:", missionId);

      const response = await api.put(`/mission/${missionId}`, updateData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("Mission updated successfully:", response);
      alert("Mission updated successfully!");

      if (onSuccess) {
        onSuccess(response.data);
      }

      onClose();
    } catch (error) {
      console.log("Error updating mission:", error);

      if (error.response?.status === 401) {
        alert("Authentication failed. Please login again.");
      } else if (error.response?.status === 403) {
        alert("You do not have permission to edit this mission.");
      } else if (error.response?.status === 404) {
        alert("Mission not found.");
      } else {
        alert(
          `Error updating mission: ${
            error.response?.data?.message || error.message
          }`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0F0F0F] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Edit Mission</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Mission Title
              </label>
              <input
                style={{ padding: "5px 10px" }}
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="w-full px-3 py-2 bg-[#1F1F1F] border border-gray-600 rounded-md text-white focus:outline-none focus:border-purple-500"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={3}
                className="w-full px-3 py-2 bg-[#1F1F1F] border border-gray-600 rounded-md text-white focus:outline-none focus:border-purple-500"
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
                value={formData.shortDescription}
                onChange={(e) =>
                  handleInputChange("shortDescription", e.target.value)
                }
                className="w-full px-3 py-2 bg-[#1F1F1F] border border-gray-600 rounded-md text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Category and Skill Level */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  className="w-full px-3 py-2 bg-[#1F1F1F] border border-gray-600 rounded-md text-white focus:outline-none focus:border-purple-500"
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
                  value={formData.skillLevel}
                  onChange={(e) =>
                    handleInputChange("skillLevel", e.target.value)
                  }
                  className="w-full px-3 py-2 bg-[#1F1F1F] border border-gray-600 rounded-md text-white focus:outline-none focus:border-purple-500"
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Price (USD)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  className="w-full px-3 py-2 bg-[#1F1F1F] border border-gray-600 rounded-md text-white focus:outline-none focus:border-purple-500"
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
                  placeholder="Enter hours only (e.g. 16)"
                  value={formData.estimatedDuration}
                  onChange={(e) =>
                    handleInputChange(
                      "estimatedDuration",
                      parseInt(e.target.value) || ""
                    )
                  }
                  className="w-full px-3 py-2 bg-[#1F1F1F] border border-gray-600 rounded-md text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Learning Outcomes */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Learning Outcomes
              </label>
              <div className="space-y-2">
                {formData.learningOutcomes.map((outcome, index) => (
                  <input
                    key={index}
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
                    className="w-full px-3 py-2 bg-[#1F1F1F] border border-gray-600 rounded-md text-white focus:outline-none focus:border-[#604196]"
                  />
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem("learningOutcomes")}
                  className="text-[#604196] hover:text-[#7052a8] text-sm font-medium"
                >
                  + Add Learning Outcome
                </button>
              </div>
            </div>

            {/* Video URL */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Video URL
              </label>
              <input
                type="url"
                value={formData.video}
                onChange={(e) => handleInputChange("video", e.target.value)}
                placeholder="YouTube or video URL"
                className="w-full px-3 py-2 bg-[#1F1F1F] border border-gray-600 rounded-md text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Certificate Available */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="certificateAvailable"
                checked={formData.certificateAvailable}
                onChange={(e) =>
                  handleInputChange("certificateAvailable", e.target.checked)
                }
                className="mr-2"
              />
              <label htmlFor="certificateAvailable" className="text-gray-300">
                Certificate Available
              </label>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-6 pt-6" style={{ marginTop: "10px" }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: "12px 24px",
                  margin: "0 auto",
                  display: "inline-flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#292929",
                  transition: "all 0.3s ease",
                }}
                className="flex-1 text-white rounded-md hover:bg-gray-700 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "12px 24px",
                  margin: "0 auto",
                  display: "inline-flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#604196",
                  transition: "all 0.3s ease",
                }}
                className="flex-1 text-white rounded-md hover:bg-purple-800 disabled:opacity-50 font-medium"
              >
                {loading ? "Updating..." : "Update Mission"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditMissionModal;
