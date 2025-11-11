"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import UpdateProfileModal from "./UpdateProfileModal";
import Image from "next/image";

const DEFAULT_AVATAR = "/images/default-avatar.jpg"; // Corrected path

// Loading skeleton component
const LoadingSkeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-700 rounded ${className}`}></div>
);

// Helper function to parse phone number into country code and number
const parsePhoneNumber = (fullPhone) => {
  if (!fullPhone) return { countryCode: "+971", phoneNumber: "" };

  const phone = fullPhone.toString();
  // Common country codes (sorted by length, longest first to match correctly)
  const countryCodes = [
    "+971",
    "+234",
    "+1",
    "+44",
    "+33",
    "+49",
    "+81",
    "+86",
    "+91",
    "+27",
    "+55",
    "+61",
    "+7",
  ];

  for (const code of countryCodes) {
    if (phone.startsWith(code)) {
      return {
        countryCode: code,
        phoneNumber: phone.substring(code.length),
      };
    }
  }

  // If no country code found, assume it's just the number
  const stripped = phone.replace(/^\+?971/, "");
  return { countryCode: "+971", phoneNumber: stripped };
};

function MutationProfile() {
  const router = useRouter();
  const [model, setModel] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);
  const avatarInputRef = useRef(null);
  const [feedbackModal, setFeedbackModal] = useState({
    open: false,
    type: "success",
    message: "",
  });

  useEffect(() => {
    // Clean up the preview URL to avoid memory leaks
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Reset image loading when avatar URL changes
  useEffect(() => {
    if (userProfile?.profile?.avatar?.url) {
      setImageLoading(true);
    }
  }, [userProfile?.profile?.avatar?.url]);

  const handleAvatarUpdate = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create a temporary local URL for immediate preview
    const localPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(localPreviewUrl);

    try {
      setIsUpdating(true);
      const accessToken = localStorage.getItem("login-accessToken");
      if (!accessToken) {
        router.push("/auth/login");
        return;
      }

      const form = new FormData();
      form.append("avatar", file);

      const url = `https://themutantschool-backend.onrender.com/api/user-profile/${userProfile?._id}`;
      await axios.put(url, form, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Refetch the profile to get the permanent URL from the server
      const storedUser = localStorage.getItem("USER");
      const id = JSON.parse(storedUser)._id;
      const freshProfileResponse = await axios.get(
        `https://themutantschool-backend.onrender.com/api/user-profile/${id}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      // Update the profile, which will automatically replace the preview
      setUserProfile(freshProfileResponse.data?.data);
      setPreviewUrl(null); // Clear the preview to use the server URL

      const successMsg = "Profile picture updated successfully!";
      console.log("✅", successMsg);
      setFeedbackModal({ open: true, type: "success", message: successMsg });
    } catch (err) {
      console.error(
        "Failed to update profile picture:",
        err.response?.data || err.message
      );
      const errorMsg = "Failed to update profile picture. Please try again.";
      setFeedbackModal({ open: true, type: "error", message: errorMsg });
      setPreviewUrl(null); // Clear preview on failure to revert to old image
    } finally {
      setIsUpdating(false);
      // Clear the file input so the same file can be selected again
      if (avatarInputRef.current) {
        avatarInputRef.current.value = "";
      }
    }
  };

  const handleUpdate = async (updatedData) => {
    try {
      setIsUpdating(true);
      const accessToken = localStorage.getItem("login-accessToken");
      if (!accessToken) {
        router.push("/Login");
        return;
      }

      // Build a safe payload (keep existing values if not changed)
      const resolvedDateOfBirth =
        updatedData?.dateOfBirth ??
        updatedData?.dob ??
        userProfile?.dateOfBirth ??
        userProfile?.dob ??
        "";

      const resolvedCountry =
        updatedData?.country ??
        updatedData?.nationality ??
        userProfile?.country ??
        userProfile?.nationality ??
        "";

      const payload = {
        firstName: updatedData.firstName ?? "",
        lastName: updatedData.lastName ?? "",
        email: updatedData.email ?? "",
        phoneNumber: updatedData.phoneE164 ?? updatedData.phoneNumber ?? "",
        country: resolvedCountry,
        gender: updatedData.gender ?? "",
        dateOfBirth: resolvedDateOfBirth,
        username: updatedData.username ?? "",
        profile: {
          ...(userProfile?.profile || {}),
          bio: updatedData.profile?.bio ?? userProfile?.profile?.bio ?? "",
          avatar: {
            ...(userProfile?.profile?.avatar || {}),
            // This is only used in JSON-only path below.
            url:
              updatedData.profile?.avatar?.url ??
              userProfile?.profile?.avatar?.url ??
              "",
          },
          socialLinks: {
            ...(userProfile?.profile?.socialLinks || {}),
            ...(updatedData.profile?.socialLinks || {}),
          },
        },
      };

      const url = `https://themutantschool-backend.onrender.com/api/user-profile/${userProfile?._id}`;

      let res;
      if (updatedData?.avatarFile) {
        // ⛑️ Multipart: send file + NON-avatar fields (flat). Do NOT send avatar.url or profile JSON.
        const form = new FormData();
        form.append("avatar", updatedData.avatarFile); // field name server expects

        // Flat, non-avatar fields
        form.append("firstName", payload.firstName);
        form.append("lastName", payload.lastName);
        form.append("email", payload.email);
        form.append("phoneNumber", payload.phoneNumber);
        if (payload.country && payload.country.trim() !== "") {
          form.append("country", payload.country);
        }
        form.append("gender", payload.gender);
        // Only send dob if it has a value (not empty string)
        if (payload.dateOfBirth && payload.dateOfBirth.trim() !== "") {
          form.append("dateOfBirth", payload.dateOfBirth);
        }
        form.append("username", payload.username);

        // Profile bits EXCEPT avatar.url
        form.append("profile.bio", payload.profile.bio ?? "");
        const sl = payload.profile.socialLinks || {};
        form.append("profile.socialLinks.facebook", sl.facebook ?? "");
        form.append("profile.socialLinks.instagram", sl.instagram ?? "");
        form.append("profile.socialLinks.linkedin", sl.linkedin ?? "");
        form.append("profile.socialLinks.twitter", sl.twitter ?? "");
        form.append("profile.socialLinks.website", sl.website ?? "");
        form.append("profile.socialLinks.youtube", sl.youtube ?? "");

        // ❌ Do NOT send these (they can overwrite the uploaded URL):
        // form.append("profile.avatar.url", ...)
        // form.append("profile", JSON.stringify(payload.profile))

        res = await axios.put(url, form, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      } else {
        const jsonPayload = { ...payload };
        if (!jsonPayload.dateOfBirth || jsonPayload.dateOfBirth.trim() === "") {
          delete jsonPayload.dateOfBirth;
        }

        if (!jsonPayload.country || jsonPayload.country.trim() === "") {
          delete jsonPayload.country;
        }

        res = await axios.put(url, jsonPayload, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      }

      // Prefer server response (it should include the uploaded avatar URL)
      const serverResponse = res?.data;

      // Refetch the complete profile data to ensure we have the latest values
      const storedUser = localStorage.getItem("USER");
      const id = JSON.parse(storedUser)._id;

      const [profileResponse, dashboardResponse] = await Promise.all([
        axios.get(
          `https://themutantschool-backend.onrender.com/api/user-profile/${id}`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        ),
        axios.get(
          "https://themutantschool-backend.onrender.com/api/student/dashboard",
          { headers: { Authorization: `Bearer ${accessToken}` } }
        ),
      ]);

      const profileData = profileResponse.data?.data || null;
      const dashboardData = dashboardResponse.data?.data;

      // Merge avatarStage from dashboard into profile
      if (profileData && dashboardData) {
        profileData.avatarStage = dashboardData.avatarStage || "Newbie";
        profileData.level = dashboardData.level || 1;
        profileData.xp = dashboardData.xp || 0;
      }

      // Update localStorage USER object to refresh navbar
      const storedUserData = localStorage.getItem("USER");
      if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        // Update the user data with new profile information
        const updatedUserData = {
          ...userData,
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          username: profileData.username,
          email: profileData.email,
        };
        localStorage.setItem("USER", JSON.stringify(updatedUserData));

        // Dispatch custom event to notify navbar of profile update
        window.dispatchEvent(
          new CustomEvent("profileUpdated", {
            detail: { updatedUserData },
          })
        );
      }

      setUserProfile(profileData);
      setModel(false);
      const successMsg = "Profile updated successfully!";
      console.log("✅", successMsg);
      setFeedbackModal({ open: true, type: "success", message: successMsg });
      return serverResponse;
    } catch (err) {
      console.error(
        "❌ Failed to update profile:",
        err.response?.data || err.message
      );
      console.error("Full error:", err);
      const errorMsg = `Failed to update profile: ${
        err.response?.data?.message || err.message || "Unknown error"
      }`;
      console.error("❌", errorMsg);
      setFeedbackModal({ open: true, type: "error", message: errorMsg });
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    async function fetchProfile() {
      setIsLoading(true);
      try {
        const storedUser = localStorage.getItem("USER");
        const accessToken = localStorage.getItem("login-accessToken");
        if (!storedUser || !accessToken) {
          router.push("/Login");
          return;
        }
        const id = JSON.parse(storedUser)._id;

        // Fetch both user profile and dashboard data to get avatarStage
        const [profileResponse, dashboardResponse] = await Promise.all([
          axios.get(
            `https://themutantschool-backend.onrender.com/api/user-profile/${id}`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
          ),
          axios.get(
            "https://themutantschool-backend.onrender.com/api/student/dashboard",
            { headers: { Authorization: `Bearer ${accessToken}` } }
          ),
        ]);

        const profileData = profileResponse.data?.data || null;
        const dashboardData = dashboardResponse.data?.data;

        // Merge avatarStage from dashboard into profile
        if (profileData && dashboardData) {
          profileData.avatarStage = dashboardData.avatarStage || "Newbie";
          profileData.level = dashboardData.level || 1;
          profileData.xp = dashboardData.xp || 0;
        }

        setUserProfile(profileData);
      } catch (error) {
        console.error(
          "Failed to load user profile:",
          error.response?.data || error.message
        );
        if (error.response?.status === 401 || error.response?.status === 403) {
          router.push("/Login");
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, [router]);

  const displayName = useMemo(() => {
    const first = userProfile?.firstName || "";
    const last = userProfile?.lastName || "";
    const fallback = "Loading...";
    return first || last
      ? `${first} ${last}`.trim()
      : isLoading
      ? "Loading..."
      : fallback;
  }, [userProfile, isLoading]);

  const levelLabel = useMemo(() => {
    // Use avatarStage from backend if available, otherwise calculate from level
    return userProfile?.avatarStage || "Newbie";
  }, [userProfile]);

  const personalInfo = useMemo(() => {
    // Format date of birth for display
    const formatDateForDisplay = (dateStr) => {
      if (!dateStr) return "";
      try {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      } catch (e) {
        return dateStr; // Return as-is if formatting fails
      }
    };

    return [
      { label: "Email Address", value: userProfile?.email || "" },
      { label: "Phone Number", value: userProfile?.phoneNumber || "" },
      { label: "Gender", value: userProfile?.gender || "" },
      {
        label: "Country",
        value: userProfile?.country || userProfile?.nationality || "",
      },
      {
        label: "Date of Birth",
        value:
          formatDateForDisplay(
            userProfile?.dateOfBirth || userProfile?.dob || ""
          ) || "",
      },
      {
        label: "Preferred Language",
        value: userProfile?.preferredLanguage || "",
      },
    ];
  }, [userProfile]);

  const bio = userProfile?.profile?.bio || "";

  // Get avatar URL without adding cache buster to signed URLs
  const rawAvatar = userProfile?.profile?.avatar?.url;
  const displayAvatarUrl = previewUrl || rawAvatar || DEFAULT_AVATAR;

  // Only show default avatar if there's no avatar URL at all
  const shouldShowDefaultAvatar = !rawAvatar && !previewUrl;

  console.log("🖼️ Avatar URL:", {
    rawAvatar: rawAvatar,
    displayUrl: displayAvatarUrl,
    shouldShowDefault: shouldShowDefaultAvatar,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col" style={{ gap: "20px" }}>
        {/* Header Loading Skeleton */}
        <div
          className="flex flex-col lg:flex-row items-center"
          style={{ gap: "24px", padding: "16px" }}
        >
          <div className="w-[200px] h-[200px] lg:w-[189px] lg:h-[140px] border-[4px] border-[#840B94] rounded-full bg-[#1a1a1a] flex items-center justify-center overflow-hidden">
            <LoadingSkeleton className="w-full h-full rounded-full" />
          </div>

          <div className="w-full flex flex-col lg:flex-row items-center justify-between">
            <div>
              <LoadingSkeleton
                className="h-[37px] w-48"
                style={{ marginBottom: "8px" }}
              />
              <LoadingSkeleton className="h-[22px] w-32" />
            </div>
            <LoadingSkeleton
              className="h-10 w-24 rounded-[10px]"
              style={{ marginTop: "8px" }}
            />
          </div>
        </div>

        {/* Bio Loading Skeleton */}
        <div
          className="border border-[#939393] rounded-[20px] bg-[#0C0C0C] text-white w-full"
          style={{ padding: "16px" }}
        >
          <LoadingSkeleton
            className="h-[26px] w-16"
            style={{ marginBottom: "12px" }}
          />
          <LoadingSkeleton className="h-[16px] w-full" />
          <LoadingSkeleton
            className="h-[16px] w-3/4"
            style={{ marginTop: "8px" }}
          />
        </div>

        {/* Personal Info Loading Skeleton */}
        <div
          className="border border-[#939393] rounded-[20px] bg-[#0C0C0C] text-white w-full"
          style={{ padding: "16px" }}
        >
          <LoadingSkeleton
            className="h-[26px] w-48"
            style={{ marginBottom: "12px" }}
          />
          <div className="grid grid-cols-2" style={{ gap: "16px" }}>
            {Array.from({ length: 6 }).map((_, index) => (
              <React.Fragment key={index}>
                <LoadingSkeleton className="h-[19px] w-32" />
                <LoadingSkeleton className="h-[18px] w-24" />
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col" style={{ gap: "20px" }}>
        {/* Header */}
        <div
          className="flex flex-col lg:flex-row items-center"
          style={{ gap: "32px", padding: "16px" }}
        >
          <div
            className="w-[100px] aspect-square lg:w-[189px] border-[4px] border-[#840B94] rounded-full bg-[#1a1a1a] flex items-center justify-center overflow-hidden cursor-pointer relative"
            style={{ borderRadius: "50%" }}
            onClick={() =>
              !isUpdating && !imageLoading && avatarInputRef.current?.click()
            }
            title="Click to change profile picture"
          >
            <input
              type="file"
              ref={avatarInputRef}
              onChange={handleAvatarUpdate}
              accept="image/png, image/jpeg, image/gif"
              style={{ display: "none" }}
            />

            {/* Show loading spinner while image is loading or updating */}
            {(imageLoading || isUpdating) && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="w-12 h-12 border-4 border-[#840B94] border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            {/* Only show the uploaded image (no default avatar unless URL is empty) */}
            <Image
              width={189}
              height={189}
              src={displayAvatarUrl}
              alt="Profile avatar"
              className={`w-full h-full object-cover rounded-full aspect-square ${
                imageLoading || isUpdating ? "opacity-0" : "opacity-100"
              } transition-opacity duration-300`}
              style={{ borderRadius: "50%" }}
              onLoadStart={() => setImageLoading(true)}
              onLoad={() => {
                console.log("✅ Avatar loaded");
                setImageLoading(false);
              }}
              onError={(e) => {
                console.error("❌ Failed to load avatar");
                setImageLoading(false);
                // Only use default if there's no avatar URL from backend
                if (shouldShowDefaultAvatar) {
                  e.target.onerror = null;
                  e.target.src = DEFAULT_AVATAR;
                }
              }}
            />
          </div>

          <div className="w-full flex flex-col lg:flex-row items-center justify-between">
            <div className="flex flex-col gap-1">
              <h2 className="text-[24px] sm:text-[28px] md:text-[20px] xl:text-[37px] leading-[28px] sm:leading-[32px] md:leading-[34px] lg:leading-[37px] font-[500] text-white">
                {displayName}
              </h2>
              {userProfile?.username && (
                <p className="text-[#A9A9A9] font-[400] text-[16px] leading-[20px]">
                  @{userProfile.username}
                </p>
              )}
              <p className="text-[#FDDD3F] font-[500] xl:text-[22px] leading-[28px]">
                {levelLabel}
              </p>
            </div>
            <button
              onClick={() => setModel(true)}
              disabled={isUpdating}
              className={`flex items-center text-[14px] font-[700] bg-[#161616] text-[#A9A9A9] rounded-[10px] cursor-pointer ${
                isUpdating
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-[#2a2a2a]"
              }`}
              style={{ marginTop: "8px", padding: "8px 16px", gap: "4px" }}
            >
              {isUpdating ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#A9A9A9] border-t-transparent rounded-full animate-spin"></div>
                  Updating...
                </>
              ) : (
                "Edit Profile"
              )}
            </button>
          </div>
        </div>

        {/* Bio */}
        <InfoBox title="Bio" content={bio || "No bio yet."} />

        {/* Personal info */}
        <InfoBox title="Personal Information">
          <div
            className="grid grid-cols-2"
            style={{ gap: "0 16px", rowGap: "16px" }}
          >
            {personalInfo.map(({ label, value }) => (
              <React.Fragment key={label}>
                <p>
                  <strong className="lg:text-[19px] text-[#ADA5A5] font-[700] lg:leading-[40px]">
                    {label}:
                  </strong>
                </p>
                <p className="lg:text-[18px] text-[#818181] font-[400] lg:leading-[20px] max-w-full">
                  {value || "--"}
                </p>
              </React.Fragment>
            ))}
          </div>
        </InfoBox>

        {model &&
          userProfile &&
          (() => {
            const { countryCode, phoneNumber } = parsePhoneNumber(
              userProfile?.phoneNumber
            );
            return (
              <div className="absolute top-0 left-0 h-screen w-screen z-50 bg-[rgba(0,0,0,0.6)]">
                <UpdateProfileModal
                  onClose={() => setModel(false)}
                  onUpdate={handleUpdate}
                  isLoading={isUpdating}
                  defaults={{
                    firstName: userProfile?.firstName || "",
                    lastName: userProfile?.lastName || "",
                    username: userProfile?.username || "",
                    email: userProfile?.email || "",
                    phoneCountry: countryCode,
                    phoneNumber: phoneNumber,
                    country:
                      userProfile?.country || userProfile?.nationality || "",
                    gender: userProfile?.gender || "",
                    dob: userProfile?.dateOfBirth || userProfile?.dob || "",
                    dateOfBirth:
                      userProfile?.dateOfBirth || userProfile?.dob || "",
                    profile: {
                      bio: userProfile?.profile?.bio || "",
                      avatar: userProfile?.profile?.avatar || { url: "" },
                      socialLinks: {
                        facebook:
                          userProfile?.profile?.socialLinks?.facebook || "",
                        instagram:
                          userProfile?.profile?.socialLinks?.instagram || "",
                        linkedin:
                          userProfile?.profile?.socialLinks?.linkedin || "",
                        twitter:
                          userProfile?.profile?.socialLinks?.twitter || "",
                        website:
                          userProfile?.profile?.socialLinks?.website || "",
                        youtube:
                          userProfile?.profile?.socialLinks?.youtube || "",
                      },
                    },
                  }}
                  defaultAvatarUrl={displayAvatarUrl}
                />
              </div>
            );
          })()}
      </div>
      {feedbackModal.open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-4">
          <div className="bg-[#121212] border border-[var(--mutant-color)] rounded-xl p-6 max-w-sm w-full text-white text-center space-y-4">
            <div
              className={`text-sm font-semibold ${
                feedbackModal.type === "success"
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {feedbackModal.type === "success" ? "Success" : "Error"}
            </div>
            <p className="text-sm leading-relaxed">{feedbackModal.message}</p>
            <button
              onClick={() =>
                setFeedbackModal((prev) => ({ ...prev, open: false }))
              }
              className="bg-[var(--mutant-color)] hover:bg-[var(--primary)] transition-colors text-white px-4 py-2 rounded-lg text-sm font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const InfoBox = ({ title, content, children }) => (
  <div
    className="border border-[#939393] rounded-[20px] bg-[#0C0C0C] text-white w-full"
    style={{ padding: "16px 24px" }}
  >
    {title && (
      <h3
        className="text-[26px] font-[600] leading-[40px]"
        style={{ marginBottom: "12px" }}
      >
        {title}
      </h3>
    )}
    {content && (
      <p className="text-[16px] text-[#989898] font-[400] leading-[23px]">
        {content}
      </p>
    )}
    {children}
  </div>
);

export default MutationProfile;
