"use client";

import { useContext, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { FiCamera, FiUpload } from "react-icons/fi";
import { InstructorContext } from "../../_components/context/InstructorContex";

const DEFAULT_AVATAR = "/images/default-avatar.jpg";

const resolveAvatarUrl = (userUpdatedValue, userProfile) => {
  const candidates = [
    userUpdatedValue?.url,
    userProfile?.profile?.avatar?.url,
    userProfile?.profile?.avatar?.secure_url,
    userProfile?.profile?.avatarUrl,
    userProfile?.avatar?.url,
    userProfile?.avatar?.secure_url,
    userProfile?.avatarUrl,
  ];

  return candidates.find(
    (candidate) => typeof candidate === "string" && candidate.trim().length > 0
  );
};

export default function UserProfileImage() {
  const { userUpdatedValue, userProfile, setUserUpdatedValue, setUserProfile } =
    useContext(InstructorContext);

  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showFallbackInitials, setShowFallbackInitials] = useState(false);

  const displayAvatarUrl = useMemo(() => {
    if (previewUrl) return previewUrl;
    const serverAvatar = resolveAvatarUrl(userUpdatedValue, userProfile);
    return serverAvatar || DEFAULT_AVATAR;
  }, [previewUrl, userUpdatedValue, userProfile]);

  const isExternalImage =
    typeof displayAvatarUrl === "string" &&
    displayAvatarUrl.startsWith("http");

  const handleImageClick = () => {
    setUploadError(null);
    setUploadSuccess(false);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image size must be less than 5MB.");
      return;
    }

    const localPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(localPreviewUrl);
    setShowFallbackInitials(false);

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      const storedUser = localStorage.getItem("USER");
      const accessToken = localStorage.getItem("login-accessToken");

      if (!storedUser || !accessToken) {
        throw new Error("Authentication required");
      }

      const parsedUser = JSON.parse(storedUser);
      const userId = parsedUser._id;

      const formData = new FormData();
      formData.append("avatar", file);

      const response = await fetch(
        `https://themutantschool-backend.onrender.com/api/user-profile/${userId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Upload failed");
      }

      const result = await response.json();

      if (result.data) {
        setUserProfile(result.data);
      }

      const newUrl =
        result.data?.profile?.avatar?.url ||
        result.data?.profile?.avatar?.secure_url ||
        result.data?.profile?.avatarUrl ||
        result.data?.avatar?.url ||
        result.data?.avatar?.secure_url ||
        result.data?.avatarUrl ||
        "";
      const newKey =
        result.data?.profile?.avatar?.key ||
        result.data?.profile?.avatar?.public_id ||
        result.data?.avatar?.key ||
        result.data?.avatar?.public_id ||
        "";

      if (newUrl) {
        setUserUpdatedValue((prev) => ({
          ...prev,
          url: newUrl,
          publicId: newKey,
        }));
        setShowFallbackInitials(false);
        setUploadError(null);
        setUploadSuccess(true);
      } else {
        setUploadError("Upload completed but no image URL received.");
      }

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }

      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadError("Failed to upload image. Please try again.");

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="relative w-full h-full rounded-full overflow-hidden group border-[3px] border-[#604196] hover:border-[#7051a8] transition-all duration-200 bg-black">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div
        onClick={handleImageClick}
        className="relative w-full h-full cursor-pointer"
      >
        {!showFallbackInitials ? (
          <Image
            key={displayAvatarUrl}
            src={displayAvatarUrl}
            alt="User Profile"
            fill
            className="object-cover transition-opacity group-hover:opacity-75"
            onError={() => {
              if (displayAvatarUrl === DEFAULT_AVATAR) {
                setShowFallbackInitials(true);
              } else {
                setShowFallbackInitials(true);
              }
            }}
            onLoad={() => setShowFallbackInitials(false)}
            unoptimized={isExternalImage}
            priority={!!previewUrl || isExternalImage}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <div className="text-white text-2xl font-bold">
              {userUpdatedValue?.firstName?.charAt(0)?.toUpperCase() ||
                userUpdatedValue?.username?.charAt(0)?.toUpperCase() ||
                "I"}
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white">
            {isUploading ? (
              <FiUpload className="w-6 h-6 animate-spin" />
            ) : (
              <FiCamera className="w-6 h-6" />
            )}
          </div>
        </div>
      </div>

      {isUploading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
          <div className="text-white text-xs text-center">Uploading...</div>
        </div>
      )}

      {uploadError && (
        <div className="absolute -bottom-8 left-0 right-0 text-red-500 text-xs text-center">
          {uploadError}
        </div>
      )}

      {uploadSuccess && (
        <div className="absolute -bottom-8 left-0 right-0 text-green-500 text-xs text-center">
          Profile image updated successfully!
        </div>
      )}
    </div>
  );
}
