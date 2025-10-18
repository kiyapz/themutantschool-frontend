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

function MutationProfile() {
  const router = useRouter();
  const [model, setModel] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const avatarInputRef = useRef(null);

  useEffect(() => {
    // Clean up the preview URL to avoid memory leaks
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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
        phoneNumber: updatedData.phoneNumber ?? "",
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
        form.append("dob", payload.dob);
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
        // JSON-only update (no file). Allow updating `profile.avatar.url` if the user typed one.
        res = await axios.put(url, payload, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      }

      // Prefer server response (it should include the uploaded avatar URL)
      setUserProfile(res?.data?.data || payload);
      setModel(false);
    } catch (err) {
      console.log(
        "Failed to update profile:",
        err.response?.data || err.message
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

        const response = await axios.get(
          `https://themutantschool-backend.onrender.com/api/user-profile/${id}`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        setUserProfile(response.data?.data || null);
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
    const lvl = userProfile?.level ?? 1;
    if (lvl <= 1) return "Newbie";
    if (lvl <= 3) return "Rising Star";
    return "Pro";
  }, [userProfile]);

  const personalInfo = useMemo(
    () => [
      { label: "Email Address", value: userProfile?.email || "" },
      { label: "Phone Number", value: userProfile?.phoneNumber || "" },
      { label: "Gender", value: userProfile?.gender || "" },
      { label: "Nationality", value: userProfile?.nationality || "" },
      { label: "Date of Birth", value: userProfile?.dob || "" },
      {
        label: "Preferred Language",
        value: userProfile?.preferredLanguage || "",
      },
    ],
    [userProfile]
  );

  const bio = userProfile?.profile?.bio || "";

  // Cache-busted avatar URL
  const rawAvatar = userProfile?.profile?.avatar?.url || DEFAULT_AVATAR;
  const avatarUrl = `${rawAvatar}?v=${new Date().getTime()}`;

  // Use previewUrl if it exists, otherwise use the server URL
  const displayAvatarUrl = previewUrl || avatarUrl;

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
        style={{ gap: "24px", padding: "16px" }}
      >
        <div
          className="w-[200px] h-[200px] lg:w-[189px] lg:h-[140px] border-[4px] border-[#840B94] rounded-full bg-[#1a1a1a] flex items-center justify-center overflow-hidden cursor-pointer relative"
          onClick={() => !isUpdating && avatarInputRef.current?.click()}
          title="Click to change profile picture"
        >
          <input
            type="file"
            ref={avatarInputRef}
            onChange={handleAvatarUpdate}
            accept="image/png, image/jpeg, image/gif"
            style={{ display: "none" }}
          />
          {isUpdating ? (
            <div className="relative w-full h-full">
              <img
                src={displayAvatarUrl}
                alt="Profile avatar"
                className="w-full h-full object-cover rounded-full opacity-50"
                onError={(e) => {
                  e.target.onerror = null; // Prevent infinite loops
                  e.target.src = DEFAULT_AVATAR;
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#840B94] border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          ) : (
            <img
              src={displayAvatarUrl}
              alt="Profile avatar"
              className="w-full h-full object-cover rounded-full"
              onError={(e) => {
                e.target.onerror = null; // Prevent infinite loops
                e.target.src = DEFAULT_AVATAR;
              }}
            />
          )}
        </div>

        <div className="w-full flex flex-col lg:flex-row items-center justify-between">
          <div>
            <h2 className="text-[37px] leading-[20px] font-[500] text-white">
              {displayName}
            </h2>
            <p className="text-[#FDDD3F] font-[500] text-[22px] leading-[40px]">
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

      {model && userProfile && (
        <div className="absolute top-0 left-0 h-screen w-screen z-50 bg-[rgba(0,0,0,0.6)]">
          <UpdateProfileModal
            key={userProfile._id} // Add this key
            onClose={() => setModel(false)}
            onUpdate={handleUpdate}
            isUpdating={isUpdating}
            defaults={{
              firstName: userProfile?.firstName || "",
              lastName: userProfile?.lastName || "",
              username: userProfile?.username || "",
              email: userProfile?.email || "",
              phoneNumber: userProfile?.phoneNumber || "",
              nationality: userProfile?.nationality || "",
              gender: userProfile?.gender || "",
              dob: userProfile?.dob || "",
              profile: {
                bio: userProfile?.profile?.bio || "",
                avatar: userProfile?.profile?.avatar || { url: "" },
                socialLinks: {
                  facebook: userProfile?.profile?.socialLinks?.facebook || "",
                  instagram: userProfile?.profile?.socialLinks?.instagram || "",
                  linkedin: userProfile?.profile?.socialLinks?.linkedin || "",
                  twitter: userProfile?.profile?.socialLinks?.twitter || "",
                  website: userProfile?.profile?.socialLinks?.website || "",
                  youtube: userProfile?.profile?.socialLinks?.youtube || "",
                },
              },
            }}
            defaultAvatarUrl={DEFAULT_AVATAR}
          />
        </div>
      )}
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
