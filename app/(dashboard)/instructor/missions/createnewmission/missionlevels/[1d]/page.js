"use client";

import { useParams, useRouter } from "next/navigation";
import MutationProcess from "../_components/MutationProcess";
import { FiDownload, FiSave, FiEdit, FiTrash2 } from "react-icons/fi";
import { FaLessThan, FaTimes } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { decodeInstructorId } from "@/lib/instructorIdUtils";
import LoadingSpinner from "@/components/LoadingSpinner";
import Addlevelbtn from "../../_components/Addlevelbtn";

const actions = [
  { text: "Delete", icon: <FiTrash2 /> },
  { text: "Edit", icon: <FiEdit /> },
];

export default function Page() {
  const params = useParams();
  const router = useRouter();

  const [levels, setLevels] = useState([]);
  const [levelData, setLevelData] = useState(null);
  const [levelProgress, setLevelProgress] = useState(null);
  const [missionData, setMissionData] = useState(null);
  const [buttonAction, setbuttonAction] = useState("Edit");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [levelEditModal, setLevelEditModal] = useState({
    isOpen: false,
    level: null,
  });
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: null,
    item: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  // Support both [id] and legacy [1d] dynamic route folders
  const { id: idParam, ["1d"]: oneDeeParam } = params || {};
  let routeParam = idParam ?? oneDeeParam;
  let id;

  // Extract the mission ID from the slug (if it's a slug-based URL)
  // It could be a raw MongoDB ID or an encoded ID with or without title prefix
  if (routeParam.includes("instrmission_")) {
    // It contains our encoding marker, try to decode it
    try {
      // First try to extract just the encoded part if there's a slug prefix
      const encodedPart = routeParam.split("-").pop();
      if (encodedPart && encodedPart.includes("instrmission_")) {
        id = decodeInstructorId(encodedPart);
        console.log("Decoded instructor mission ID from slug:", id);
      } else {
        // Try decoding the whole thing
        id = decodeInstructorId(routeParam);
        console.log("Decoded instructor mission ID:", id);
      }
    } catch (e) {
      console.error("Error decoding instructor mission ID:", e);
      id = routeParam;
    }
  } else if (/^[0-9a-f]{24}$/.test(routeParam)) {
    // It looks like a raw MongoDB ObjectId
    id = routeParam;
    console.log("Using raw MongoDB ID:", id);
  } else {
    // It might be a slug format without our encoding marker
    const parts = routeParam.split("-");
    const lastPart = parts.pop();

    // Check if the last part looks like a MongoDB ID
    if (lastPart && /^[0-9a-f]{24}$/.test(lastPart)) {
      id = lastPart;
      console.log("Extracted MongoDB ID from slug:", id);
    } else {
      // Just use the original param as fallback
      id = routeParam;
    }
  }

  // --- Token refresh, memoized so callers stay stable ---
  const refreshAuthToken = useCallback(async () => {
    try {
      const refreshToken =
        typeof window !== "undefined"
          ? localStorage.getItem("refreshToken")
          : null;
      if (!refreshToken) {
        console.warn("No refresh token found - skipping refresh");
        return null;
      }

      const response = await fetch("/api/auth/refresh-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        console.warn("Token refresh failed - response not ok");
        return null;
      }

      const data = await response.json();

      localStorage.setItem("login-accessToken", data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }
      return data.accessToken;
    } catch (err) {
      console.error("Token refresh failed:", err);
      // Don't clear tokens or redirect immediately - just return null
      return null;
    }
  }, []);

  // --- Authenticated GET wrapper, memoized ---
  const makeAuthenticatedRequest = useCallback(
    async (url, options = {}) => {
      const accessToken =
        typeof window !== "undefined"
          ? localStorage.getItem("login-accessToken")
          : null;

      if (!accessToken) {
        console.warn("No access token found - skipping request");
        return null;
      }

      try {
        const response = await axios.get(url, {
          ...options,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            ...options.headers,
          },
        });
        return response;
      } catch (err) {
        console.error("API request failed:", err);

        // Only try to refresh token for 401/403 errors
        if (err.response?.status === 401 || err.response?.status === 403) {
          console.log("Token expired, attempting to refresh...");
          try {
            const newAccessToken = await refreshAuthToken();
            if (newAccessToken) {
              const retry = await axios.get(url, {
                ...options,
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${newAccessToken}`,
                  ...options.headers,
                },
              });
              return retry;
            }
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            // Don't redirect to login immediately, just log the error
          }
        }

        // Return null instead of throwing to prevent crashes
        return null;
      }
    },
    [refreshAuthToken]
  );

  // Fetch specific level data
  const fetchLevelData = useCallback(
    async (levelId) => {
      try {
        console.log("Fetching level data for ID:", levelId);
        const response = await makeAuthenticatedRequest(
          `https://themutantschool-backend.onrender.com/api/mission-level/${levelId}`
        );

        if (response?.data?.data) {
          console.log("Level data response:", response.data);
          setLevelData(response.data.data);
          console.log("Level data set:", response.data.data);
        } else {
          console.log("No level data received or request failed");
        }
      } catch (err) {
        console.error("Error fetching level data:", err);
        // Don't set error state, just log it
      }
    },
    [makeAuthenticatedRequest]
  );

  // Fetch level progress for mission
  const fetchLevelProgress = async (missionId) => {
    try {
      console.log("Fetching level progress for mission ID:", missionId);

      // Check if we have a valid token before making the request
      const token = localStorage.getItem("login-accessToken");
      if (!token) {
        console.log("No auth token available for level progress request");
        return;
      }

      // Use direct axios call with better error handling
      const response = await axios.get(
        `https://themutantschool-backend.onrender.com/api/mission-level/${missionId}/progress`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 8000, // 8 second timeout
        }
      );

      if (response?.data?.data) {
        console.log("Level progress response:", response.data);
        setLevelProgress(response.data.data);
        console.log("Level progress set:", response.data.data);
      } else {
        console.log("No level progress received");
      }
    } catch (err) {
      // Handle specific error cases
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (err.response.status === 403) {
          console.log(
            "Permission denied for level progress (403). This is normal for some users."
          );
        } else {
          console.error(
            `Error ${err.response.status} fetching level progress:`,
            err.response.data
          );
        }
      } else if (err.request) {
        // The request was made but no response was received
        console.error(
          "No response received for level progress request:",
          err.request
        );
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error setting up level progress request:", err.message);
      }
      // Don't set error for progress as it's optional
    }
  };

  // Fetch mission data to get thumbnail
  const fetchMissionData = useCallback(
    async (missionId) => {
      try {
        console.log("Fetching mission data for ID:", missionId);
        const response = await makeAuthenticatedRequest(
          `https://themutantschool-backend.onrender.com/api/mission/${missionId}`
        );

        if (response?.data?.data) {
          console.log("Mission data response:", response.data);
          setMissionData(response.data.data);
          console.log("Mission data set:", response.data.data);
        } else {
          console.log("No mission data received or request failed");
        }
      } catch (err) {
        console.error("Error fetching mission data:", err);
      }
    },
    [makeAuthenticatedRequest]
  );

  useEffect(() => {
    let isMounted = true;

    const fetchMissionLevels = async () => {
      try {
        setLoading(true);
        setError(null);

        const storedMissionId =
          typeof window !== "undefined"
            ? localStorage.getItem("missionId")
            : null;

        if (!storedMissionId) {
          console.log("Missing missionId in localStorage");
          router.push("/instructor/myMissions/createnewmission");
          return;
        }

        // Fetch all levels first
        const response = await makeAuthenticatedRequest(
          `https://themutantschool-backend.onrender.com/api/mission-level/mission/${storedMissionId}`
        );

        if (isMounted && response?.data?.data) {
          setLevels(response.data.data);

          // Then fetch specific level data
          if (id) {
            await fetchLevelData(id);
          }

          // Also fetch level progress and mission data
          await fetchLevelProgress(storedMissionId);
          await fetchMissionData(storedMissionId);
        } else {
          console.log("No levels data received or request failed");
        }
      } catch (err) {
        console.error("Error retrieving mission data:", err);
        if (isMounted) setError("Failed to load mission data");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMissionLevels();
    return () => {
      isMounted = false;
    };
  }, [makeAuthenticatedRequest, router, id, fetchLevelData, fetchMissionData]);

  if (loading) {
    return (
      <div className="p-5 text-white">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="xlarge" color="mutant" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 text-white">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="text-lg text-red-500 bg-red-500/10 p-4 rounded-lg border border-red-500/30">
            <div className="font-bold mb-2">Error Loading Mission</div>
            <div>{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-white rounded-md transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const responseLevel = levelData || levels.find((el) => el._id === id);

  // Level CRUD operations
  const handleEditLevel = () => {
    if (responseLevel) {
      setLevelEditModal({ isOpen: true, level: responseLevel });
    }
  };

  const handleDeleteLevel = () => {
    if (responseLevel) {
      setConfirmModal({
        isOpen: true,
        type: "level",
        item: responseLevel,
      });
    }
  };

  const handleUpdateLevel = async (levelId, updatedData) => {
    const accessToken = localStorage.getItem("login-accessToken");
    if (!accessToken) {
      alert("Please login first");
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
        alert("Level updated successfully!");
        // Refresh the page to show updated data
        window.location.reload();
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
        alert(errorMsg);
      } else if (error.request) {
        alert("Network error. Please check your connection.");
      } else {
        alert("Failed to update level. Please try again.");
      }
      return false;
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
          alert("Level deleted successfully!");
          // Redirect back to createnewmission page
          router.push("/instructor/missions/createnewmission");
        }
      }
    } catch (error) {
      console.error("Delete failed:", error);
      if (error.response) {
        const errorMsg =
          error.response.data?.message ||
          error.response.data?.error ||
          `Server error: ${error.response.status}`;
        alert(errorMsg);
      } else if (error.request) {
        alert("Network error. Please check your connection.");
      } else {
        alert(error.message || "Failed to delete. Please try again.");
      }
    } finally {
      setIsDeleting(false);
      setConfirmModal({
        isOpen: false,
        type: null,
        item: null,
      });
    }
  };


  const handleActionClick = (actionText) => {
    setbuttonAction(actionText);
    switch (actionText) {
      case "Edit":
        handleEditLevel();
        break;
      case "Delete":
        handleDeleteLevel();
        break;
      default:
        break;
    }
  };

  // Debug: Log the level data
  console.log("=== LEVEL DATA DEBUG ===");
  console.log("Level ID from URL:", id);
  console.log("Level Data from API:", levelData);
  console.log("Response Level (final):", responseLevel);
  console.log("All levels:", levels);
  console.log("Level Progress:", levelProgress);

  // Debug: Log image data
  console.log("=== IMAGE DATA DEBUG ===");
  console.log("responseLevel.imageUrl:", responseLevel?.imageUrl);
  console.log("responseLevel.image:", responseLevel?.image);
  console.log("responseLevel.thumbnail:", responseLevel?.thumbnail);
  console.log("responseLevel.thumbnail?.url:", responseLevel?.thumbnail?.url);
  console.log("missionData:", missionData);
  console.log("missionData?.thumbnail:", missionData?.thumbnail);
  console.log("missionData?.thumbnail?.url:", missionData?.thumbnail?.url);
  console.log("missionData?.status:", missionData?.status);

  if (!responseLevel) {
    return (
      <div className="p-5 text-white">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Mission level not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 text-white">
      <div className="w-full flex items-center justify-between">
        <div>
          <p className=" text-[25px]  xl:text-[42px] font-[600] leading-[40px] flex items-center gap-2">
            <Link
              className="cursor-pointer"
              href="/instructor/missions/createnewmission"
            >
              <span>
                <FaLessThan />
              </span>
            </Link>
            {` ${responseLevel.title}`}
          </p>
          <p className="text-[var(--link-color)] font-[500] text-[14px] leading-[57px]">
            Mission: {responseLevel.mission?.title || "Mission"} .
            <span>{`Level ${responseLevel.order || responseLevel.level}: ${
              responseLevel.title
            }`}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          {actions.map((el, idx) => (
            <button
              style={{ padding: "15px" }}
              onClick={() => handleActionClick(el.text)}
              key={idx}
              disabled={
                (el.text === "Edit" && !responseLevel) ||
                (el.text === "Delete" && !responseLevel) ||
                (el.text === "Delete" && isDeleting)
              }
              className={`flex items-center gap-2 px-4 py-2 rounded-[10px] text-white font-medium ${
                buttonAction === el.text ? "bg-[#604196]" : "bg-[#292929]"
              } ${
                (el.text === "Delete" && isDeleting)
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {el.icon}
              {el.text}
            </button>
          ))}
        </div>
      </div>

      <div className="grid xl:grid-cols-3 w-full gap-10">
        <div
          className="xl:col-span-2 gap-10 flex flex-col bg-[var(--black-bg)] rounded-[20px]"
          style={{ padding: "20px" }}
        >
          <div>
            <p className="text-[42px] font-[600] leading-[40px]">{`Level: ${responseLevel.title}`}</p>
            <p className="text-[var(--link-color)] font-[500] text-[14px] leading-[57px]">
              Duration: {responseLevel.estimatedTime || "N/A"} .{" "}
              <span>
                Difficulty: {responseLevel.difficulty || "N/A"} . Last Edited:{" "}
                {responseLevel.updatedAt
                  ? new Date(responseLevel.updatedAt).toLocaleDateString()
                  : "N/A"}
              </span>
            </p>

            <div className="flex flex-col gap-5">
              {responseLevel.imageUrl ||
              responseLevel.image ||
              responseLevel.thumbnail?.url ||
              missionData?.thumbnail?.url ? (
                <div className="relative w-full h-[438px] rounded-[30px] overflow-hidden">
                  <Image
                    src={
                      responseLevel.imageUrl ||
                      responseLevel.image ||
                      responseLevel.thumbnail?.url ||
                      missionData?.thumbnail?.url
                    }
                    alt={responseLevel.title}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "block";
                    }}
                  />
                  <div className="w-full h-[438px] rounded-[30px] bg-[#604196] hidden flex items-center justify-center">
                    <span className="text-white text-lg">
                      Image failed to load
                    </span>
                  </div>
                </div>
              ) : (
                <div className="w-full h-[438px] rounded-[30px] bg-[#604196] flex items-center justify-center">
                  <span className="text-white text-lg">No image available</span>
                </div>
              )}

              <div className="flex flex-col gap-5">
                <h1 className="text-[27px] leading-[57px] font-[600] text-[var(--sidebar-hovercolor)]">
                  Level Summary
                </h1>

                <p className="text-[16px]">
                  {responseLevel.description ||
                    responseLevel.summary ||
                    "No description available for this level."}
                </p>

                <h2 className="text-[16px]">{`Capsules in this level (${
                  responseLevel.capsules?.length || 0
                }):`}</h2>
                {responseLevel.capsules && responseLevel.capsules.length > 0 ? (
                  <ul
                    style={{ paddingLeft: "30px" }}
                    className="text-[16px] list-disc pl-5"
                  >
                    {responseLevel.capsules.map((capsule, index) => (
                      <li key={capsule._id || index}>
                        <strong>{capsule.title}</strong>
                        {capsule.description && (
                          <span className="text-gray-400">
                            {" "}
                            - {capsule.description}
                          </span>
                        )}
                        {capsule.duration && (
                          <span className="text-gray-500">
                            {" "}
                            ({capsule.duration})
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[16px] text-gray-400">
                    No capsules available for this level.
                  </p>
                )}

                <p className="text-[16px]">
                  Level Order: {responseLevel.order || "N/A"} | Created:{" "}
                  {responseLevel.createdAt
                    ? new Date(responseLevel.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>

                {/* Show level-level video if available */}
                {responseLevel.videoUrl && (
                  <div className="mt-4">
                    <h2 className="text-[18px] font-[600] text-[#BDE75D] mb-2">
                      Level Video:
                    </h2>
                    <video
                      controls
                      className="w-full rounded-lg"
                      style={{ maxHeight: "300px" }}
                    >
                      <source
                        src={
                          responseLevel.videoUrl.url || responseLevel.videoUrl
                        }
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <p className="text-[var(--sidebar-hovercolor)] text-[27px] leading-[57px] font-[600]">
              Capsule Attachments
            </p>

            {responseLevel.capsules && responseLevel.capsules.length > 0 ? (
              responseLevel.capsules.map((capsule, index) => (
                <div key={capsule._id || index} className="flex flex-col gap-3">
                  <h3 className="text-[18px] font-[600] text-[#BDE75D]">
                    {capsule.title}
                  </h3>

                  {capsule.attachments && capsule.attachments.length > 0 ? (
                    capsule.attachments.map((attachment, attIndex) => (
                      <div
                        key={attIndex}
                        style={{ paddingLeft: "10px", paddingRight: "10px" }}
                        className="bg-[var(--button-background)] w-full h-[73.64px] rounded-[12px] flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <p>
                            <FiSave className="text-[#818181]" />
                          </p>
                          <p>
                            {attachment.filename ||
                              attachment.name ||
                              `Attachment ${attIndex + 1}`}
                          </p>
                        </div>
                        <div
                          onClick={async () => {
                            try {
                              const attachmentUrl =
                                attachment.url ||
                                attachment.fileUrl ||
                                attachment.downloadUrl;
                              
                              if (!attachmentUrl) {
                                alert("Attachment URL not available");
                                return;
                              }

                              const accessToken = localStorage.getItem("login-accessToken");
                              
                              // Try to download with authentication
                              const response = await fetch(attachmentUrl, {
                                headers: accessToken
                                  ? {
                                      Authorization: `Bearer ${accessToken}`,
                                    }
                                  : {},
                              });

                              if (!response.ok) {
                                // If fetch fails, try direct download
                                throw new Error("Fetch failed, trying direct download");
                              }

                              const blob = await response.blob();
                              const url = window.URL.createObjectURL(blob);
                              const link = document.createElement("a");
                              link.href = url;
                              link.download =
                                attachment.filename ||
                                attachment.name ||
                                `attachment-${attIndex + 1}`;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                              window.URL.revokeObjectURL(url);
                            } catch (error) {
                              console.error("Download error:", error);
                              
                              // Fallback: Try direct download
                              try {
                                const attachmentUrl =
                                  attachment.url ||
                                  attachment.fileUrl ||
                                  attachment.downloadUrl;
                                
                                if (!attachmentUrl) {
                                  alert("Unable to download attachment. URL not available.");
                                  return;
                                }

                                const link = document.createElement("a");
                                link.href = attachmentUrl;
                                link.download =
                                  attachment.filename ||
                                  attachment.name ||
                                  `attachment-${attIndex + 1}`;
                                link.target = "_blank";
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                
                                // Show warning if direct download is used
                                setTimeout(() => {
                                  alert(
                                    "If download didn't start, the attachment link may have expired or require authentication."
                                  );
                                }, 500);
                              } catch (fallbackError) {
                                console.error("Fallback download error:", fallbackError);
                                alert(
                                  "Unable to download attachment. The link may have expired or require authentication."
                                );
                              }
                            }
                          }}
                          className="cursor-pointer hover:opacity-70 transition-opacity"
                          title="Download Attachment"
                        >
                          <FiDownload className="text-[#818181] cursor-pointer" />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-[14px]">
                      No attachments for this capsule
                    </p>
                  )}

                  {/* Show video if available */}
                  {capsule.videoUrl && (
                    <div className="mt-2">
                      <h4 className="text-[14px] font-[600] text-[#BDE75D] mb-2">
                        Video:
                      </h4>
                      <video
                        controls
                        className="w-full max-w-md rounded-lg"
                        style={{ maxHeight: "200px" }}
                      >
                        <source
                          src={capsule.videoUrl.url || capsule.videoUrl}
                          type="video/mp4"
                        />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-[14px]">
                No capsules with attachments available
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <MutationProcess 
            missionStatus={missionData?.status} 
            levels={levels}
            missionData={missionData}
          />

          {/* Level Progress Section */}
          {levelProgress && (
            <div className="bg-[var(--black-bg)] rounded-[20px] p-5">
              <h2 className="text-[var(--sidebar-hovercolor)] text-[27px] leading-[57px] font-[600] mb-4">
                Level Progress
              </h2>

              <div className="space-y-4">
                {levelProgress.map((progress, index) => (
                  <div
                    key={progress.levelId || index}
                    className="bg-[var(--button-background)] rounded-lg p-4"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-[#BDE75D] font-[600] text-[18px]">
                        Level {progress.levelOrder || index + 1}
                      </h3>
                      <span className="text-[#818181] text-[14px]">
                        {progress.completionPercentage || 0}% Complete
                      </span>
                    </div>

                    <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                      <div
                        className="bg-[#BDE75D] h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${progress.completionPercentage || 0}%`,
                        }}
                      ></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-[14px] text-gray-300">
                      <div>
                        <span className="text-gray-400">Status:</span>
                        <span
                          className={`ml-2 ${
                            progress.status === "completed"
                              ? "text-green-400"
                              : progress.status === "in_progress"
                              ? "text-yellow-400"
                              : "text-gray-400"
                          }`}
                        >
                          {progress.status || "Not Started"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Capsules:</span>
                        <span className="ml-2">
                          {progress.completedCapsules || 0} /{" "}
                          {progress.totalCapsules || 0}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Started:</span>
                        <span className="ml-2">
                          {progress.startedAt
                            ? new Date(progress.startedAt).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Completed:</span>
                        <span className="ml-2">
                          {progress.completedAt
                            ? new Date(
                                progress.completedAt
                              ).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                    </div>

                    {progress.notes && (
                      <div className="mt-2 text-[12px] text-gray-400">
                        <span className="text-gray-500">Notes:</span>{" "}
                        {progress.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Overall Progress Summary */}
              <div className="mt-4 p-4 bg-[#604196] rounded-lg">
                <h3 className="text-white font-[600] text-[18px] mb-2">
                  Overall Mission Progress
                </h3>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">
                    {
                      levelProgress.filter((p) => p.status === "completed")
                        .length
                    }{" "}
                    of {levelProgress.length} levels completed
                  </span>
                  <span className="text-[#BDE75D] font-[600]">
                    {Math.round(
                      levelProgress.reduce(
                        (acc, p) => acc + (p.completionPercentage || 0),
                        0
                      ) / levelProgress.length
                    )}
                    % Complete
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center z-50 bg-[rgba(0,0,0,0.9)]">
          <div
            style={{ padding: "20px" }}
            className="max-w-[500px] w-full mx-4 bg-[#101010] rounded-lg p-6"
          >
            <h3 className="text-[20px] font-[600] mb-4">
              Delete {confirmModal.type === "level" ? "Level" : "Item"}
            </h3>
            <p className="text-[#9C9C9C] mb-6">
              Are you sure you want to delete this {confirmModal.type}? This
              action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                style={{ padding: "10px" }}
                onClick={() =>
                  setConfirmModal({
                    isOpen: false,
                    type: null,
                    item: null,
                  })
                }
                disabled={isDeleting}
                className="px-4 py-2 text-[#9C9C9C] hover:text-white transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                style={{ padding: "10px" }}
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting ? (
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
      )}

      {/* Level Edit Modal */}
      {levelEditModal.isOpen && levelEditModal.level && (
        <LevelEditModal
          isOpen={levelEditModal.isOpen}
          onClose={() => setLevelEditModal({ isOpen: false, level: null })}
          level={levelEditModal.level}
          onSave={(updatedData) =>
            handleUpdateLevel(levelEditModal.level._id, updatedData)
          }
        />
      )}
    </div>
  );
}

// Level Edit Modal Component
const LevelEditModal = ({ isOpen, onClose, level, onSave }) => {
  const [editTitle, setEditTitle] = useState("");
  const [editEstimatedTime, setEditEstimatedTime] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (level) {
      setEditTitle(level.title || "");
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
