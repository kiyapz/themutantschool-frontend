"use client";

import { useContext, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { InstructorContext } from "./context/InstructorContex";

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

export default function InstructorProfileImage() {
  const { userUpdatedValue } = useContext(InstructorContext);
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
  }, [userUpdatedValue?.url]);

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
  }, [preloadedUrl, userUpdatedValue?.url, proxyAttempt]);

  const displayUrl = getDisplayUrl();

  return (
    <div className="relative w-full h-full rounded-full overflow-hidden">
      {!defaultImageError ? (
        <Image
          key={`${imageKey}-${displayUrl}`}
          src={
            displayUrl && !imageError
              ? displayUrl
              : "/images/default-avatar.jpg"
          }
          alt="Instructor Profile"
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
          className="object-cover"
          unoptimized={displayUrl ? true : false}
          priority={!!displayUrl}
        />
      ) : (
        // Fallback when even default image fails or 403 error
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
