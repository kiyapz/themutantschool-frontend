"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const DeleteMissionModal = ({ mission, isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const router = useRouter();

  if (!isOpen || !mission) return null;

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError(null);

      const accessToken = localStorage.getItem("login-accessToken");
      if (!accessToken) {
        setError("Authentication token not found. Please log in again.");
        setLoading(false);
        return;
      }

      console.log(`Deleting mission with ID: ${mission._id}`);

      const response = await axios({
        method: "delete",
        url: `https://themutantschool-backend.onrender.com/api/mission/${mission._id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        timeout: 10000, // 10 seconds timeout
      });

      console.log("Delete response:", response.data);

      // Show success message
      alert("Mission deleted successfully!");

      // Clear the mission ID from localStorage if it matches the deleted mission
      const storedMissionId = localStorage.getItem("missionId");
      if (storedMissionId === mission._id) {
        localStorage.removeItem("missionId");
      }

      // Close the modal
      onClose();

      // Redirect to missions list
      router.push("/instructor/missions");
    } catch (error) {
      console.error("Error deleting mission:", error);

      // Handle different error types
      if (error.response) {
        // Server responded with an error status code
        console.error("Server response error:", error.response.data);
        console.error("Status code:", error.response.status);

        if (error.response.status === 401) {
          setError("Authentication failed. Please login again.");
        } else if (error.response.status === 403) {
          setError("You do not have permission to delete this mission.");
        } else if (error.response.status === 404) {
          setError("Mission not found.");
        } else {
          // Try to extract a meaningful error message
          const errorMessage =
            error.response.data?.message ||
            error.response.data?.error ||
            `Server error (${error.response.status})`;
          setError(`Error deleting mission: ${errorMessage}`);
        }
      } else if (error.request) {
        // Request was made but no response received
        setError(
          "No response from server. Please check your internet connection and try again."
        );
      } else {
        // Error in setting up the request
        setError(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#121212] rounded-lg max-w-md w-full p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            ⚠️ Delete Mission
          </h2>
          <div className="bg-red-900/30 border border-red-500/50 rounded-md p-4 mb-4">
            <p className="text-white font-bold mb-2">
              WARNING: You are about to delete:
            </p>
            <p className="text-white text-lg font-semibold mb-3">
              "{mission.title}"
            </p>

            <ul className="text-red-300 list-disc pl-5 space-y-1">
              <li>All mission content will be permanently deleted</li>
              <li>All levels and capsules will be removed</li>
              <li>
                All uploaded files (thumbnails, videos) will be deleted from
                storage
              </li>
              <li>Student enrollments and progress will be lost</li>
              <li>This action CANNOT be undone</li>
            </ul>
          </div>
          <p className="text-gray-300 font-medium">
            Please type <span className="font-bold text-red-400">DELETE</span>{" "}
            to confirm:
          </p>
          <input
            type="text"
            className="w-full mt-2 px-4 py-3 bg-[#1A1A1A] border border-red-500/30 rounded-md text-white focus:outline-none focus:border-red-500"
            placeholder="Type DELETE to confirm"
            onChange={(e) => setDeleteConfirmation(e.target.value)}
          />
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500/50 rounded-md p-3 mb-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 text-white bg-transparent border border-[#333] rounded-md py-3 px-6 hover:bg-[#1A1A1A] font-medium"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading || deleteConfirmation !== "DELETE"}
            className={`flex-1 text-white rounded-md py-3 px-6 font-medium ${
              loading
                ? "bg-red-600 opacity-70"
                : deleteConfirmation !== "DELETE"
                ? "bg-red-800 opacity-50 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
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
                Deleting...
              </>
            ) : (
              "Delete Mission"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteMissionModal;
