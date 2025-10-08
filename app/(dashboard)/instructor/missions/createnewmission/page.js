"use client";
import { useContext, useState, useEffect, useCallback } from "react";
import MissionDetails from "./_components/MissionDetails";
import AddLevels from "./_components/AddLevels";
import PreviewandLaunch from "./_components/PreviewandLaunch";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Link from "next/link";
import { FaLessThan } from "react-icons/fa";
import { InstructorContext } from "../../_components/context/InstructorContex";
import { HiArrowNarrowLeft } from "react-icons/hi";
import EditMissionModal from "../_components/EditMissionModal";
import DeleteMissionModal from "../_components/DeleteMissionModal";
import axios from "axios";
import api from "../../../../../lib/api";

export default function Createnewmission() {
  const { activeTab, setActiveTab, quiztitle, Level, setLevel } =
    useContext(InstructorContext);

  const handleActionClick = (actionText) => {
    // Set the button action state for UI highlighting
    setbuttonAction(actionText);

    // Call specific functions based on action
    // Each function manages its own loading state independently
    switch (actionText) {
      case "Edit":
        editMission();
        break;
      case "Delete":
        deleteMission();
        break;
      case "Publish":
        handlePublishMission();
        break;
      default:
        break;
    }
  };

  const deleteMission = async () => {
    console.log("Delete mission function called");
    try {
      // Set delete loading state
      setIsDeleteLoading(true);

      const storedMissionId = localStorage.getItem("missionId");
      const accessToken = localStorage.getItem("login-accessToken");

      if (!storedMissionId) {
        alert("Please create a mission first before deleting");
        setIsDeleteLoading(false);
        return;
      }

      if (!accessToken) {
        alert("Please login first to delete mission");
        setIsDeleteLoading(false);
        return;
      }

      // Fetch mission data to confirm deletion
      console.log("Fetching mission data for deletion confirmation...");

      const response = await api.get(`/mission/${storedMissionId}`);

      if (!response.data.data) {
        alert("Mission data not found");
        setIsDeleteLoading(false);
        return;
      }

      // Set current mission and show delete modal
      console.log("Setting current mission and showing delete modal");
      setCurrentMission(response.data.data);
      setShowDeleteModal(true);
      console.log("Delete modal should now be visible");

      // Reset delete loading state
      setIsDeleteLoading(false);
    } catch (error) {
      console.error("Error preparing mission for deletion:", error);
      setIsDeleteLoading(false);

      if (error.response?.status === 404) {
        alert("Mission not found. Please create a mission first.");
      } else if (error.response?.status === 401) {
        alert("Authentication failed. Please login again.");
      } else {
        alert(
          `Error fetching mission: ${
            error.response?.data?.message || error.message
          }`
        );
      }
    }
  };

  const [buttonAction, setbuttonAction] = useState("Publish");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isPublishLoading, setIsPublishLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentMission, setCurrentMission] = useState(null);
  const [validationStatus, setValidationStatus] = useState(null);
  const [quizCount, setQuizCount] = useState(0);
  const actions = [
    { text: "Delete", icon: <FiTrash2 /> },
    { text: "Edit", icon: <FiEdit /> },
    { text: "Publish", icon: null },
  ];

  const fetchMissionQuizzes = useCallback(async () => {
    const storedMissionId = localStorage.getItem("missionId");
    const accessToken = localStorage.getItem("login-accessToken");

    if (!storedMissionId || !accessToken) {
      return;
    }

    try {
      const response = await axios.get(
        `https://themutantschool-backend.onrender.com/api/mission-quiz/${storedMissionId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const quizCount =
        response.data?.count || response.data?.data?.length || 0;

      // Store quiz count for validation
      setQuizCount(quizCount);
    } catch (error) {
      console.error("Error fetching mission quizzes:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Error status:", error.response.status);
      }
    }
  }, []);

  const fetchMission = async (missionId) => {
    try {
      const accessToken = localStorage.getItem("login-accessToken");
      if (!accessToken) {
        console.log("Missing accessToken in localStorage");
        return;
      }

      console.log("Fetching mission data for ID:", missionId);
      const response = await axios.get(
        `https://themutantschool-backend.onrender.com/api/mission/${missionId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log("Mission data fetched:", response.data);

      // Update current mission state
      if (response.data && response.data.data) {
        setCurrentMission(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching mission:", error);
    }
  };

  // Fetch mission and quizzes when component mounts
  useEffect(() => {
    const missionId = localStorage.getItem("missionId");
    if (missionId) {
      fetchMission(missionId);
    }
    fetchMissionQuizzes();
  }, [fetchMissionQuizzes]);

  const editMission = async () => {
    // Set edit loading state to true when starting the edit process
    setIsEditLoading(true);

    const storedMissionId = localStorage.getItem("missionId");
    const accessToken = localStorage.getItem("login-accessToken");

    if (!storedMissionId) {
      alert("Please create a mission first before editing");
      setIsEditLoading(false);
      return;
    }

    if (!accessToken) {
      alert("Please login first to edit mission");
      setIsEditLoading(false);
      return;
    }

    try {
      console.log("Attempting to fetch mission with ID:", storedMissionId);
      console.log(
        "API URL:",
        `http://localhost:3000/api/mission/${storedMissionId}`
      );

      // Use the exact same approach as PreviewandLaunch component
      const response = await api.get(`/mission/${storedMissionId}`);

      console.log("=== FULL API RESPONSE ===");
      console.log("Response status:", response);
      console.log("Response headers:", response.headers);
      console.log("Full response object:", response);

      console.log("=== RESPONSE DATA ===");
      console.log("response.data:", response.data);
      console.log("response.data.data:", response.data.data);

      console.log("=== MISSION DETAILS ===");
      if (response.data.data) {
        console.log("Mission ID:", response.data.data._id);
        console.log("Mission Title:", response.data.data.title);
        console.log("Mission Description:", response.data.data.description);
        console.log("Mission Category:", response.data.data.category);
        console.log("Mission Price:", response.data.data.price);
        console.log(
          "Mission Learning Outcomes:",
          response.data.data.learningOutcomes
        );
        console.log("Mission Tags:", response.data.data.tags);
        console.log(
          "Complete Mission Object:",
          JSON.stringify(response.data.data, null, 2)
        );
      } else {
        console.log("❌ No mission data found in response.data.data");
        console.log(
          "Available keys in response.data:",
          Object.keys(response.data)
        );
      }

      // Check if mission data exists
      if (!response.data.data) {
        alert("Mission data not found in response");
        return;
      }

      // Use the actual mission data with the _id from the API response
      const missionData = {
        ...response.data.data,
        _id: response.data.data._id, // Use the _id from the API response
      };

      console.log("=== FINAL MISSION DATA FOR MODAL ===");
      console.log("Final mission data:", missionData);
      console.log("Mission data keys:", Object.keys(missionData));

      // Set the current mission and show the modal
      setCurrentMission(missionData);
      setShowEditModal(true);

      // Reset edit loading state after modal is shown
      setIsEditLoading(false);
    } catch (error) {
      console.error("Error fetching mission data:", error);
      // Make sure to reset edit loading state on error
      setIsEditLoading(false);

      if (error.response?.status === 404) {
        alert("Mission not found. Please create a mission first.");
      } else if (error.response?.status === 401) {
        alert("Authentication failed. Please login again.");
      } else {
        alert(
          `Error fetching mission: ${
            error.response?.data?.message || error.message
          }`
        );
      }
    }
  };

  const validateMissionForPublish = async () => {
    const storedMissionId = localStorage.getItem("missionId");
    const accessToken = localStorage.getItem("login-accessToken");

    if (!storedMissionId || !accessToken) {
      return {
        isValid: false,
        message: "Missing missionId or accessToken in localStorage",
      };
    }

    try {
      // Fetch mission levels to validate
      const response = await axios.get(
        `https://themutantschool-backend.onrender.com/api/mission-level/mission/${storedMissionId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const levels = response.data.data || [];

      // Check if mission has at least 2 levels
      if (levels.length < 2) {
        return {
          isValid: false,
          message: `Mission must have at least 2 levels. Currently has ${levels.length} level(s). Please add more levels before publishing.`,
        };
      }

      // Check if each level has at least 3 capsules
      for (let i = 0; i < levels.length; i++) {
        const level = levels[i];
        const capsuleCount = Array.isArray(level.capsules)
          ? level.capsules.length
          : 0;

        if (capsuleCount < 3) {
          return {
            isValid: false,
            message: `Level ${i + 1} "${
              level.title || "Untitled"
            }" must have at least 3 capsules. Currently has ${capsuleCount} capsule(s). Please add more capsules to this level before publishing.`,
          };
        }
      }

      // Also fetch quizzes for debugging
      await fetchMissionQuizzes();

      // Check if there are any quizzes
      if (quizCount === 0) {
        return {
          isValid: false,
          message: "Mission must have at least one quiz before publishing.",
          details:
            "Please add quizzes to your levels before publishing the mission.",
        };
      }

      return { isValid: true, message: "Mission is ready for publishing!" };
    } catch (error) {
      console.error("Error validating mission:", error);
      return {
        isValid: false,
        message: "Error validating mission. Please try again.",
      };
    }
  };

  const checkValidationStatus = useCallback(async () => {
    const validation = await validateMissionForPublish();
    setValidationStatus(validation);
  }, []);

  // Check validation when switching to Preview and Launch tab
  useEffect(() => {
    if (activeTab === "Preview and Launch") {
      checkValidationStatus();
      fetchMissionQuizzes();
    }
  }, [activeTab, checkValidationStatus, fetchMissionQuizzes]);

  const handlePublishMission = async () => {
    setIsPublishLoading(true);

    try {
      // First validate the mission
      const validation = await validateMissionForPublish();

      if (!validation.isValid) {
        alert(validation.message);
        setIsPublishLoading(false);
        return;
      }

      const storedMissionId = localStorage.getItem("missionId");
      const accessToken = localStorage.getItem("login-accessToken");

      if (!storedMissionId || !accessToken) {
        console.log("Missing missionId or accessToken in localStorage");
        setIsPublishLoading(false);
        return;
      }

      const response = await axios.put(
        `https://themutantschool-backend.onrender.com/api/mission/${storedMissionId}/status`,
        {
          status: "Pending Review",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log("Mission status updated successfully:", response.data);
      alert("Mission published successfully! It's now pending review.");
      // You can add additional success handling here (e.g., show success message, redirect, etc.)
    } catch (error) {
      console.error("Error updating mission status:", error);
      alert("Error publishing mission. Please try again.");
      // You can add error handling here (e.g., show error message)
    } finally {
      setIsPublishLoading(false);
    }
  };

  return (
    <div className="flex  flex-col gap-3 ">
      <div className="w-full h-fit flex flex-col sm:flex-row sm:items-center sm:gap-5 sm:justify-between ">
        <div>
          {activeTab === "Add Levels" ? (
            <>
              {Level === "AddQuize" ? (
                <div className="flex items-center gap-1 text-[25px]">
                  <Link href="/instructor/missions/createnewmission">
                    <span
                      onClick={() => setLevel("AddLevel")}
                      className="cursor-pointer"
                    >
                      <HiArrowNarrowLeft />
                    </span>
                  </Link>
                  <p
                    style={{ marginTop: "10px" }}
                    className="font-[600] text-[33px] leading-[40px] "
                  >
                    Final Quiz: {quiztitle}
                  </p>
                </div>
              ) : (
                <p className="font-[600] text-[#BDE75D] text-[18px] sm:text-[42px] leading-[150%] sm:leading-[40px]">
                  Mission Levels
                </p>
              )}
            </>
          ) : activeTab === "Preview and Launch" ? (
            <p className=" font-[600] text-[20px] sm:text-[25px] xl:text-[42px] flex items-center gap-1 leading-[40px] text-white ">
              <Link href="/instructor/missions/createnewmission">
                <span
                  className="cursor-pointer"
                  onClick={() => setActiveTab("Add Levels")}
                >
                  <FaLessThan />
                </span>
              </Link>
              {`Mission Preview`}
            </p>
          ) : (
            <p className="font-[600]  text-[#BDE75D] text-[18px] sm:text-[42px] leading-[150%] sm:leading-[40px]">
              Create New Mission
            </p>
          )}
        </div>

        <div>
          {activeTab === "Preview and Launch" ? (
            <div className="hidden sm:flex gap-3 mt-4">
              {actions.map((el, idx) => (
                <button
                  style={{ padding: "15px" }}
                  onClick={() => {
                    setbuttonAction(el.text);
                    if (el.text === "Publish") {
                      handlePublishMission();
                    } else if (el.text === "Edit") {
                      editMission();
                    } else if (el.text === "Delete") {
                      deleteMission();
                    }
                  }}
                  key={idx}
                  title={
                    el.text === "Publish" && quizCount === 0
                      ? "Mission must have at least one quiz before publishing"
                      : el.text === "Publish" &&
                        validationStatus &&
                        !validationStatus.isValid
                      ? validationStatus.message
                      : ""
                  }
                  disabled={
                    (el.text === "Edit" && isEditLoading) ||
                    (el.text === "Delete" && isDeleteLoading) ||
                    (el.text === "Publish" && isPublishLoading) ||
                    (el.text === "Publish" &&
                      validationStatus &&
                      !validationStatus.isValid) ||
                    (el.text === "Publish" && quizCount === 0)
                  }
                  className={`flex items-center gap-2 px-4 py-2 rounded-[10px] text-white font-[600] ${
                    buttonAction == el.text ? "bg-[#604196]" : "bg-[#292929]"
                  } ${
                    (el.text === "Edit" && isEditLoading) ||
                    (el.text === "Delete" && isDeleteLoading) ||
                    (el.text === "Publish" && isPublishLoading) ||
                    (el.text === "Publish" &&
                      validationStatus &&
                      !validationStatus.isValid) ||
                    (el.text === "Publish" && quizCount === 0)
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {(el.text === "Edit" && isEditLoading) ||
                  (el.text === "Delete" && isDeleteLoading) ||
                  (el.text === "Publish" && isPublishLoading) ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    el.icon
                  )}
                  {el.text === "Publish" && isPublishLoading
                    ? "Publishing..."
                    : el.text === "Edit" && isEditLoading
                    ? "Editing..."
                    : el.text === "Delete" && isDeleteLoading
                    ? "Deleting..."
                    : el.text}
                </button>
              ))}
            </div>
          ) : (
            // </div>
            <Link href={`/instructor/missions/`}>
              <button
                style={{ padding: "15px" }}
                className="hidden sm:block  bg-[var(--purpel-btncolor)] rounded-[10px] "
              >
                Preview Mission
              </button>
            </Link>
          )}
        </div>
      </div>

      {activeTab == "Preview and Launch" ? (
        <p className="text-[#616161] font-[600] text-[13px] leading-[40px] ">
          Review your mission before publishing
        </p>
      ) : (
        <div>
          <div>
            <ul className="flex items-center gap-3">
              {[
                { text: "Mission Details", level: "1" },
                { text: "Add Levels", level: "2" },
                { text: "Preview and Launch", level: "3" },
              ].map((tab) => (
                <li
                  key={tab.level}
                  onClick={() => setActiveTab(tab.text)}
                  className={`cursor-pointer px-4 text-[10px] flex items-center gap-1 sm:text-[15px] py-2 font-semibold relative
                     ${
                       activeTab === tab.text
                         ? "text-[#BDE75D] "
                         : "text-[#6D6D6D]"
                     }
                             hover:text-[#BDE75D] transition-colors duration-200`}
                >
                  <span
                    className={`${
                      activeTab === tab.text
                        ? "text-[var(--background)] bg-[#BDE75D] "
                        : "text-[var(--background)] bg-[#6D6D6D]"
                    }   h-[20px] w-[20px]  flexcenter text-[10px] font-[600] rounded-full`}
                  >
                    {tab.level}
                  </span>
                  {tab.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div>
        {activeTab === "Mission Details" && (
          <div>
            <MissionDetails />
          </div>
        )}
        {activeTab === "Add Levels" && (
          <div>
            <AddLevels />
          </div>
        )}
        {activeTab === "Preview and Launch" && (
          <div>
            <PreviewandLaunch />
          </div>
        )}
      </div>

      {/* Edit Mission Modal */}
      <EditMissionModal
        mission={currentMission}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={(updatedMission) => {
          console.log(
            "Mission updated successfully in parent component:",
            updatedMission
          );
          setShowEditModal(false);

          // Update the current mission with the updated data
          if (updatedMission) {
            setCurrentMission(updatedMission);
          }

          // Refresh the mission data
          const missionId = localStorage.getItem("missionId");
          if (missionId) {
            fetchMission(missionId);
          }
        }}
      />

      {/* Delete Mission Modal */}
      <DeleteMissionModal
        mission={currentMission}
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
