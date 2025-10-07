"use client";

/**
 * Simple encoding function to convert MongoDB ID to a more obscured string
 * This is not for security but for hiding the raw ID from users
 * Uses browser-safe base64 encoding without Buffer
 */
export function encodeId(id) {
  if (!id) return "";

  // Convert to base64 using browser-safe btoa function
  let encoded = btoa(id.toString());

  // Add some random-looking characters
  const prefix = "mission_";
  const suffix = "_mutant" + Math.floor(Math.random() * 1000);

  // Replace characters that might look like URL parameters
  encoded = encoded.replace(/=/g, "");
  encoded = encoded.replace(/\+/g, "-");
  encoded = encoded.replace(/\//g, "_");

  return `${prefix}${encoded}${suffix}`;
}

/**
 * Decodes the obfuscated ID back to original MongoDB ID
 * Uses browser-safe atob function
 */
export function decodeId(encodedId) {
  if (!encodedId) return "";

  try {
    // Handle title-prefixed URLs
    let processedId = encodedId;
    const missionPrefix = "mission_";
    const missionIndex = processedId.indexOf(missionPrefix);

    if (missionIndex !== -1) {
      // Extract just the encoded portion
      processedId = processedId.substring(missionIndex);
    }

    // Strip prefix
    let encoded = processedId;
    if (encoded.startsWith(missionPrefix)) {
      encoded = encoded.substring(missionPrefix.length);
    }

    // Strip suffix
    const mutantIndex = encoded.lastIndexOf("_mutant");
    if (mutantIndex !== -1) {
      encoded = encoded.substring(0, mutantIndex);
    }

    // Convert back from URL-safe base64
    encoded = encoded.replace(/-/g, "+");
    encoded = encoded.replace(/_/g, "/");

    // Add padding if needed
    while (encoded.length % 4) {
      encoded += "=";
    }

    // Use browser-safe atob function
    return atob(encoded);
  } catch (error) {
    console.error("Failed to decode ID:", error);

    // If decoding fails, it might be a raw ID, so return it as is
    return encodedId;
  }
}
