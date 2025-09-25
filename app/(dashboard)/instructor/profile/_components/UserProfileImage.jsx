"use client";

import { useContext, useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { InstructorContext } from "../../_components/context/InstructorContex";
import { FiCamera, FiUpload, FiCheck } from "react-icons/fi";

// Enhanced utility function to validate and clean image URL with CORS workaround
const validateImageUrl = (url) => {
  if (!url) return null;

  // Handle truncated URLs more intelligently
  let cleanUrl = url;

  // If URL contains truncation indicator, try to reconstruct it
  if (url.includes("…")) {
    // For Wasabi S3 URLs, try to reconstruct the full URL
    if (url.includes("s3.eu-central-2.wasabisys.com/mutant-schoo")) {
      // Extract the key part after the truncation
      const keyMatch = url.match(/avatars\/[^…]*$/);
      if (keyMatch) {
        cleanUrl = `https://s3.eu-central-2.wasabisys.com/mutant-school/${keyMatch[0]}`;
      }
    } else {
      // Remove truncation indicators for other URLs
      cleanUrl = url.replace(/…/g, "");
    }
  }

  // Validate URL format
  try {
    const urlObj = new URL(cleanUrl);
    // Ensure it's a valid image URL
    if (urlObj.protocol === "http:" || urlObj.protocol === "https:") {
      return cleanUrl;
    }
  } catch (error) {
    console.warn("Invalid URL format:", url, "cleaned:", cleanUrl);
  }

  return null;
};

// Create a proxy URL for S3 images to bypass CORS issues
const createProxyUrl = (url, attempt = 0) => {
  if (!url || !url.includes("s3.eu-central-2.wasabisys.com")) {
    return url;
  }

  // Use a CORS proxy service to bypass S3 CORS restrictions
  // Try multiple proxy services for better reliability
  const proxyServices = [
    `https://cors-anywhere.herokuapp.com/${url}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    `https://corsproxy.io/?${encodeURIComponent(url)}`,
  ];

  // Return the proxy service based on the attempt
  return proxyServices[attempt % proxyServices.length];
};

// Spine-based image preloader for better preview functionality
const preloadImageWithSpine = (url) => {
  return new Promise((resolve, reject) => {
    if (!url) {
      reject(new Error("No URL provided"));
      return;
    }

    const img = new window.Image();

    // Set up spine loading strategy
    img.onload = () => {
      console.log("Spine preload successful for:", url);
      resolve(url);
    };

    img.onerror = (error) => {
      console.warn("Spine preload failed for:", url, error);
      reject(error);
    };

    // Use spine approach - set crossOrigin before src for better compatibility
    img.crossOrigin = "anonymous";
    img.src = url;
  });
};

export default function UserProfileImage() {
  const { userUpdatedValue, setUserUpdatedValue, setUserProfile } =
    useContext(InstructorContext);
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isPreloading, setIsPreloading] = useState(false);
  const [preloadedUrl, setPreloadedUrl] = useState(null);
  const [imageKey, setImageKey] = useState(0); // Force re-render key
  const [defaultImageError, setDefaultImageError] = useState(false);
  const [proxyAttempt, setProxyAttempt] = useState(0); // Track proxy attempts
  const PROXY_COUNT = 3; // Number of available proxies

  // Set the URL for display immediately when available
  useEffect(() => {
    if (!userUpdatedValue?.url) {
      setPreloadedUrl(null);
      setImageError(false);
      setProxyAttempt(0); // Reset proxy attempts
      return;
    }

    const validatedUrl = validateImageUrl(userUpdatedValue.url);
    if (!validatedUrl) {
      console.warn("Invalid URL, skipping display:", userUpdatedValue.url);
      setImageError(true);
      return;
    }

    // Always set the validated URL for display and reset error state
    console.log("Setting preloaded URL for display:", validatedUrl);
    setPreloadedUrl(validatedUrl);
    setImageError(false); // Always reset error state when we have a valid URL
    setProxyAttempt(0); // Reset proxy attempts for new URL
    setImageKey((prev) => prev + 1); // Force re-render immediately
  }, []);

  // Determine the best URL to display with CORS workaround
  const getDisplayUrl = useCallback(() => {
    const urlToUse = preloadedUrl || validateImageUrl(userUpdatedValue?.url);
    if (!urlToUse) return null;

    // If direct loading failed, try proxies
    if (proxyAttempt > 0) {
      // Stop trying if we've exhausted all proxies
      if (proxyAttempt > PROXY_COUNT) {
        return null; // Triggers fallback to default image
      }
      // Return the next proxy URL to try
      return createProxyUrl(urlToUse, proxyAttempt - 1);
    }

    // Initially, try to load the URL directly
    return urlToUse;
  }, []);

  const displayUrl = getDisplayUrl();

  // Reset image error when we have a valid display URL
  useEffect(() => {
    if (displayUrl && imageError) {
      console.log("Resetting image error state for valid URL:", displayUrl);
      setImageError(false);
    }
  }, []);

  const handleImageClick = () => {
    // Clear any previous error or success messages
    setUploadError(null);
    setUploadSuccess(false);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image size must be less than 5MB");
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      // Get user ID and auth token
      const storedUser = localStorage.getItem("USER");
      const accessToken = localStorage.getItem("login-accessToken");

      if (!storedUser || !accessToken) {
        throw new Error("Authentication required");
      }

      const parsedUser = JSON.parse(storedUser);
      const userId = parsedUser._id;

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("avatar", file);

      // Upload to the user profile endpoint
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

      console.log("Upload response:", result);
      console.log("Avatar data in response:", {
        profileAvatarUrl: result.data?.profile?.avatar?.url,
        profileAvatarKey: result.data?.profile?.avatar?.key,
        directAvatarUrl: result.data?.avatar?.url,
        directAvatarKey: result.data?.avatar?.key,
      });

      // Update the user profile with the complete response data
      if (result.data) {
        setUserProfile(result.data);
      }

      // Update the profile image URL in state
      const newUrl =
        result.data?.profile?.avatar?.url || result.data?.avatar?.url;
      const newKey =
        result.data?.profile?.avatar?.key || result.data?.avatar?.key;

      console.log("Setting new image URL:", newUrl);

      // Use spine approach to preload the new image before updating state
      if (newUrl) {
        try {
          console.log("Preloading new image with spine approach:", newUrl);
          await preloadImageWithSpine(newUrl);

          setUserUpdatedValue((prev) => ({
            ...prev,
            url: newUrl,
            publicId: newKey,
          }));

          // Clear any previous errors and show success
          setUploadError(null);
          setUploadSuccess(true);
          setImageError(false);
          setPreloadedUrl(newUrl); // Set preloaded URL to prevent re-preloading

          console.log("Image uploaded and preloaded successfully:", result);
        } catch (preloadError) {
          console.warn(
            "Failed to preload new image, updating anyway:",
            preloadError
          );

          setUserUpdatedValue((prev) => ({
            ...prev,
            url: newUrl,
            publicId: newKey,
          }));

          setUploadError(null);
          setUploadSuccess(true);
        }
      } else {
        console.warn("No URL returned from upload");
        setUploadError("Upload completed but no image URL received");
      }

      // Hide success message after 3 seconds
      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadError("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Debug logging only when values change
  useEffect(() => {
    console.log(
      "UserProfileImage state change - Original URL:",
      userUpdatedValue?.url
    );
    console.log("UserProfileImage state change - Preloaded URL:", preloadedUrl);
    console.log("UserProfileImage state change - Display URL:", displayUrl);
    console.log(
      "UserProfileImage state change - Image error state:",
      imageError
    );
    console.log("UserProfileImage state change - Is preloading:", isPreloading);
    console.log(
      "UserProfileImage state change - Should show image:",
      !!displayUrl && !imageError
    );
  }, [
    // userUpdatedValue?.url,
    // preloadedUrl,
    // displayUrl,
    // imageError,
    // isPreloading,
  ]);

  // Force reset error state if we have a valid display URL
  useEffect(() => {
    if (displayUrl && imageError) {
      console.log("Force resetting image error for valid display URL");
      setImageError(false);
    }
  }, []);

  // Let Next.js Image component handle the loading and errors
  // We'll only set imageError to true when the Image component's onError fires

  return (
    <div className="relative w-full h-full max-w-[200px] max-h-[200px] rounded-full overflow-hidden group border-4 border-transparent hover:border-purple-500 transition-all duration-200">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Profile Image */}
      <div
        onClick={handleImageClick}
        className="relative w-full h-full cursor-pointer"
      >
        {!defaultImageError ? (
          <Image
            key={`${imageKey}-${displayUrl}`}
            src={
              displayUrl && !imageError
                ? displayUrl
                : "/images/default-avatar.jpg"
            }
            alt="User Profile"
            fill
            onError={(e) => {
              const currentSrc = e.target.src;
              console.log("Next.js Image load error for URL:", currentSrc);

              // Handle failure of the default avatar itself
              if (currentSrc.includes("default-avatar.jpg")) {
                console.log("Default avatar failed to load, using fallback");
                setDefaultImageError(true);
                return;
              }

              // An external image failed (either direct or proxy)
              if (proxyAttempt < PROXY_COUNT) {
                console.log(
                  `Image load failed. Attempting proxy ${proxyAttempt + 1}...`
                );
                setProxyAttempt((prev) => prev + 1);
              } else {
                console.log(
                  "All image load attempts (direct and proxy) have failed."
                );
                setImageError(true); // All retries failed, now set final error state
              }
            }}
            onLoad={() => {
              const isExternalImage = displayUrl && !imageError;
              console.log("Next.js Image loaded successfully");
              console.log("Is external image loaded:", isExternalImage);
              console.log("Loaded URL:", displayUrl);

              if (isExternalImage) {
                setImageError(false);
              }
            }}
            className="object-cover transition-opacity group-hover:opacity-75"
            unoptimized={displayUrl ? true : false}
            priority={!!displayUrl}
          />
        ) : (
          // Fallback when even default image fails or 403 error
          <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <div className="text-white text-2xl font-bold">
              {userUpdatedValue?.firstName?.charAt(0)?.toUpperCase() ||
                userUpdatedValue?.username?.charAt(0)?.toUpperCase() ||
                "U"}
            </div>
          </div>
        )}

        {/* Overlay with camera icon */}
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

      {/* Loading indicator */}
      {(isUploading || isPreloading) && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
          <div className="text-white text-xs text-center">
            {isUploading
              ? "Uploading..."
              : isPreloading
              ? "Loading image..."
              : "Processing..."}
          </div>
        </div>
      )}

      {/* Error message */}
      {uploadError && (
        <div className="absolute -bottom-8 left-0 right-0 text-red-500 text-xs text-center">
          {uploadError}
        </div>
      )}

      {/* 403 Error message */}
      {imageError && displayUrl && (
        <div className="absolute -bottom-8 left-0 right-0 text-yellow-500 text-xs text-center">
          Image access restricted - showing fallback
        </div>
      )}

      {/* Success message */}
      {uploadSuccess && (
        <div className="absolute -bottom-8 left-0 right-0 text-green-500 text-xs text-center">
          Profile image updated successfully!
        </div>
      )}
    </div>
  );
}
