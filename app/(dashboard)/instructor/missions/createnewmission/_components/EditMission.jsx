// EditModal.js
import { useState } from "react";
import axios from "axios";

const EditModal = ({
  showModal,
  onClose,
  editingItem, 
  itemType, 
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    title: editingItem?.title || "",
    summary: editingItem?.summary || "",
    estimatedTime: editingItem?.estimatedTime || "",
    description: editingItem?.description || "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save Edit Handler
  const handleSaveEdit = async () => {
    setIsLoading(true);

    try {
      const accessToken = localStorage.getItem("login-accessToken");

      if (!accessToken) {
        alert("Access token not found");
        return;
      }

      let response;

      if (itemType === "level") {
        // Editing a level
        response = await axios.put(
          `https://themutantschool-backend.onrender.com/api/mission-level/${editingItem._id}`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      } else {
        // Editing the mission
        const storedMissionId = localStorage.getItem("missionId");

        if (!storedMissionId) {
          alert("Mission ID not found");
          return;
        }

        response = await axios.put(
          `https://themutantschool-backend.onrender.com/api/mission/${storedMissionId}`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      }

      console.log(`${itemType} updated successfully:`, response.data);
      alert(
        `${itemType === "level" ? "Level" : "Mission"} updated successfully!`
      );

      
      onSuccess(formData);

      
      onClose();
    } catch (error) {
      console.error("Error updating:", error);
      alert("Failed to update. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  
  useState(() => {
    if (editingItem) {
      setFormData({
        title: editingItem.title || "",
        summary: editingItem.summary || "",
        estimatedTime: editingItem.estimatedTime || "",
        description: editingItem.description || "",
      });
    }
  }, [editingItem]);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[var(--black-bg)] p-6 rounded-[12px] max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
        <h3 className="text-white text-lg font-semibold mb-4">
          {itemType === "level"
            ? `Edit Level: ${editingItem?.title}`
            : "Edit Mission"}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-[#BDE75D] focus:outline-none"
              placeholder="Enter title"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Summary
            </label>
            <textarea
              name="summary"
              value={formData.summary}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-[#BDE75D] focus:outline-none"
              placeholder="Enter summary"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Estimated Time
            </label>
            <input
              type="text"
              name="estimatedTime"
              value={formData.estimatedTime}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-[#BDE75D] focus:outline-none"
              placeholder="e.g., 2 hours"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-[#BDE75D] focus:outline-none"
              placeholder="Enter description"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSaveEdit}
            className="flex-1 px-4 py-2 bg-[#BDE75D] text-black rounded hover:bg-[#a8d147] transition-colors font-medium disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
