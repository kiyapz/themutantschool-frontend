"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import UpdateProfileModal from "./UpdateProfileModal";

const DEFAULT_AVATAR = "/images/default-avatar.jpg"; // Corrected path

// Loading skeleton component
const LoadingSkeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-700 rounded ${className}`}></div>
);

// Helper function to parse phone number into country code and number
const parsePhoneNumber = (fullPhone) => {
  if (!fullPhone) return { countryCode: "+234", phoneNumber: "" };

  const phone = fullPhone.toString();
  // Common country codes (sorted by length, longest first to match correctly)
  const countryCodes = [
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
  return { countryCode: "+234", phoneNumber: phone };
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

      alert("Profile picture updated successfully!");
    } catch (err) {
      console.error(
        "Failed to update profile picture:",
        err.response?.data || err.message
      );
      alert("Failed to update profile picture. Please try again.");
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
      const payload = {
        firstName: updatedData.firstName ?? "",
        lastName: updatedData.lastName ?? "",
        email: updatedData.email ?? "",
        phoneNumber: updatedData.phoneE164 ?? updatedData.phoneNumber ?? "",
        nationality: updatedData.nationality ?? "",
        gender: updatedData.gender ?? "",
        dob: updatedData.dob ?? "",
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

      console.log("🚀 Submitting profile update with payload:", {
        dob: payload.dob,
        dobValue: `"${payload.dob}"`,
        dobLength: payload.dob?.length,
        dobType: typeof payload.dob,
        phoneNumber: payload.phoneNumber,
        phoneE164: updatedData.phoneE164,
      });
      console.log("🚀 FULL PAYLOAD:", payload);

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
        form.append("nationality", payload.nationality);
        form.append("gender", payload.gender);
        // Only send dob if it has a value (not empty string)
        if (payload.dob && payload.dob.trim() !== "") {
          console.log("✅ Appending dob to FormData:", payload.dob);
          form.append("dob", payload.dob);
        } else {
          console.log("❌ NOT appending dob - value is:", payload.dob);
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

        // Log what's in FormData
        console.log("📤 Sending FormData (with avatar file):");
        for (let [key, value] of form.entries()) {
          console.log(`  ${key}: ${value}`);
        }

        res = await axios.put(url, form, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      } else {
        // JSON-only update (no file). Allow updating `profile.avatar.url` if the user typed one.
        // Remove dob from payload if it's empty to avoid backend validation errors
        const jsonPayload = { ...payload };
        if (!jsonPayload.dob || jsonPayload.dob.trim() === "") {
          console.log("❌ Removing empty dob from JSON payload");
          delete jsonPayload.dob;
        } else {
          console.log("✅ Keeping dob in JSON payload:", jsonPayload.dob);
        }

        console.log("📤 Sending JSON payload (no avatar file):", jsonPayload);

        res = await axios.put(url, jsonPayload, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      }

      // Prefer server response (it should include the uploaded avatar URL)
      console.log("✅ Profile update successful. Server response:", res?.data);

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
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(
        "❌ Failed to update profile:",
        err.response?.data || err.message
      );
      console.error("Full error:", err);
      alert(
        `Failed to update profile: ${
          err.response?.data?.message || err.message || "Unknown error"
        }`
      );
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
      { label: "Nationality", value: userProfile?.nationality || "" },
      {
        label: "Date of Birth",
        value: formatDateForDisplay(userProfile?.dob) || "",
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
    <div className="flex flex-col" style={{ gap: "20px" }}>
      {/* Header */}
      <div
        className="flex flex-col lg:flex-row items-center"
        style={{ gap: "32px", padding: "16px" }}
      >
        <div
          className="w-[200px] h-[200px] lg:w-[189px] lg:h-[140px] border-[4px] border-[#840B94] rounded-full bg-[#1a1a1a] flex items-center justify-center overflow-hidden cursor-pointer relative"
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
          <img
            src={displayAvatarUrl}
            alt="Profile avatar"
            className={`w-full h-full object-cover rounded-full ${
              imageLoading || isUpdating ? "opacity-0" : "opacity-100"
            } transition-opacity duration-300`}
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
            <h2 className="text-[37px] leading-[37px] font-[500] text-white">
              {displayName}
            </h2>
            {userProfile?.username && (
              <p className="text-[#A9A9A9] font-[400] text-[16px] leading-[20px]">
                @{userProfile.username}
              </p>
            )}
            <p className="text-[#FDDD3F] font-[500] text-[22px] leading-[28px]">
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
                  nationality: userProfile?.nationality || "",
                  gender: userProfile?.gender || "",
                  dob: userProfile?.dob || "",
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
                      twitter: userProfile?.profile?.socialLinks?.twitter || "",
                      website: userProfile?.profile?.socialLinks?.website || "",
                      youtube: userProfile?.profile?.socialLinks?.youtube || "",
                    },
                  },
                }}
                defaultAvatarUrl={DEFAULT_AVATAR}
              />
            </div>
          );
        })()}
    </div>
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
