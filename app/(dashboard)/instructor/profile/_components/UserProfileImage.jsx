"use client";

import { useContext, useMemo, useState } from "react";
import Image from "next/image";
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

  const [showFallbackInitials, setShowFallbackInitials] = useState(false);

  const displayAvatarUrl = useMemo(() => {
    // Check for preview URL from context (set when uploading in modal)
    const previewFromContext = userUpdatedValue?.previewAvatarUrl;
    if (previewFromContext) return previewFromContext;
    const serverAvatar = resolveAvatarUrl(userUpdatedValue, userProfile);
    return serverAvatar || DEFAULT_AVATAR;
  }, [userUpdatedValue?.previewAvatarUrl, userUpdatedValue, userProfile]);

  const isExternalImage =
    typeof displayAvatarUrl === "string" &&
    displayAvatarUrl.startsWith("http");

  return (
    <div className="relative w-full h-full rounded-full overflow-hidden border-[3px] border-[#604196] bg-black">
      {!showFallbackInitials ? (
        <Image
          key={displayAvatarUrl}
          src={displayAvatarUrl}
          alt="User Profile"
          fill
          className="object-cover"
          onError={() => {
            setShowFallbackInitials(true);
          }}
          onLoad={() => setShowFallbackInitials(false)}
          unoptimized={isExternalImage}
          priority={isExternalImage}
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
    </div>
  );
}
