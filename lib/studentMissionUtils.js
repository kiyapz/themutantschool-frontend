"use client";

/**
 * Encode a mission ID for student mission study levels URLs
 * @param {string} id - The MongoDB ID of the mission
 * @returns {string} The encoded ID
 */
export function encodeStudentMissionId(id) {
  if (!id) return "";
  let encoded = btoa(id.toString());
  const prefix = "studymission_";
  const suffix = "_student" + Math.floor(Math.random() * 1000);
  encoded = encoded.replace(/=/g, "");
  encoded = encoded.replace(/\+/g, "-");
  encoded = encoded.replace(/\//g, "_");
  return `${prefix}${encoded}${suffix}`;
}

/**
 * Decode an encoded mission ID from student mission study levels URLs
 * @param {string} encodedId - The encoded ID
 * @returns {string} The original MongoDB ID
 */
export function decodeStudentMissionId(encodedId) {
  if (!encodedId) return "";
  try {
    // First, extract just the encoded part
    let encoded = encodedId;

    // Handle full slug format (e.g., "learn-css-the-smart-way-studymission_abc123_student456")
    const studymissionIndex = encoded.indexOf("studymission_");
    if (studymissionIndex !== -1) {
      encoded = encoded.substring(studymissionIndex);
    }

    // Now we should have something like "studymission_abc123_student456"
    if (encoded.startsWith("studymission_")) {
      encoded = encoded.substring(13); // Length of "studymission_"
    }

    const studentIndex = encoded.indexOf("_student");
    if (studentIndex !== -1) {
      encoded = encoded.substring(0, studentIndex);
    }

    // Replace URL-safe characters
    encoded = encoded.replace(/-/g, "+");
    encoded = encoded.replace(/_/g, "/");

    // Add padding
    while (encoded.length % 4) {
      encoded += "=";
    }

    console.log("Prepared for decoding:", encoded);

    // Decode the Base64 string
    const decoded = atob(encoded);
    return decoded;
  } catch (error) {
    console.error(
      "Failed to decode student mission ID:",
      error,
      "Original ID:",
      encodedId
    );
    // If decoding fails, return the original ID or extract MongoDB ID if possible
    if (/^[0-9a-f]{24}$/.test(encodedId)) {
      return encodedId; // It's already a MongoDB ID
    }

    // Try to extract MongoDB ID from the URL if it exists
    const match = encodedId.match(/[0-9a-f]{24}/);
    if (match) {
      return match[0];
    }

    return encodedId;
  }
}

/**
 * Generate a slug for student mission study levels
 * @param {string} missionId - The MongoDB ID of the mission
 * @param {string} title - The mission title
 * @returns {string} The slug for the URL
 */
export function generateStudyMissionSlug(missionId, title = "") {
  const encodedId = encodeStudentMissionId(missionId);

  // If title is provided, create a SEO-friendly slug
  if (title) {
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove special characters except spaces and hyphens
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .substring(0, 50); // Limit length

    return `${slug}-${encodedId}`;
  }

  return encodedId;
}

/**
 * Encode a level ID for student course guide URLs
 * @param {string} id - The MongoDB ID of the level
 * @returns {string} The encoded ID
 */
export function encodeCourseGuideId(id) {
  if (!id) return "";
  let encoded = btoa(id.toString());
  const prefix = "courseguide_";
  const suffix = "_guide" + Math.floor(Math.random() * 1000);
  encoded = encoded.replace(/=/g, "");
  encoded = encoded.replace(/\+/g, "-");
  encoded = encoded.replace(/\//g, "_");
  return `${prefix}${encoded}${suffix}`;
}

/**
 * Decode an encoded level ID from student course guide URLs
 * @param {string} encodedId - The encoded ID
 * @returns {string} The original MongoDB ID
 */
export function decodeCourseGuideId(encodedId) {
  if (!encodedId) return "";
  try {
    // First, extract just the encoded part
    let encoded = encodedId;

    // Handle full slug format (e.g., "level-name-courseguide_abc123_guide456")
    const courseguideIndex = encoded.indexOf("courseguide_");
    if (courseguideIndex !== -1) {
      encoded = encoded.substring(courseguideIndex);
    }

    // Now we should have something like "courseguide_abc123_guide456"
    if (encoded.startsWith("courseguide_")) {
      encoded = encoded.substring(12); // Length of "courseguide_"
    }

    const guideIndex = encoded.indexOf("_guide");
    if (guideIndex !== -1) {
      encoded = encoded.substring(0, guideIndex);
    }

    // Replace URL-safe characters
    encoded = encoded.replace(/-/g, "+");
    encoded = encoded.replace(/_/g, "/");

    // Add padding
    while (encoded.length % 4) {
      encoded += "=";
    }

    console.log("Prepared for decoding:", encoded);

    // Decode the Base64 string
    const decoded = atob(encoded);
    return decoded;
  } catch (error) {
    console.error(
      "Failed to decode course guide ID:",
      error,
      "Original ID:",
      encodedId
    );
    // If decoding fails, return the original ID or extract MongoDB ID if possible
    if (/^[0-9a-f]{24}$/.test(encodedId)) {
      return encodedId; // It's already a MongoDB ID
    }

    // Try to extract MongoDB ID from the URL if it exists
    const match = encodedId.match(/[0-9a-f]{24}/);
    if (match) {
      return match[0];
    }

    return encodedId;
  }
}

/**
 * Generate a slug for student course guide
 * @param {string} levelId - The MongoDB ID of the level
 * @param {string} levelName - The level name or title
 * @param {string} capsuleId - Optional capsule ID to include as query parameter
 * @returns {string} The slug for the URL
 */
export function generateCourseGuideSlug(
  levelId,
  levelName = "",
  capsuleId = null
) {
  const encodedId = encodeCourseGuideId(levelId);

  // Create base URL
  let url;

  // If level name is provided, create a SEO-friendly slug
  if (levelName) {
    const slug = levelName
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove special characters except spaces and hyphens
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .substring(0, 50); // Limit length

    url = `${slug}-${encodedId}`;
  } else {
    url = encodedId;
  }

  // Add capsule ID as query parameter if provided
  if (capsuleId) {
    url = `${url}?capsuleId=${capsuleId}`;
  }

  return url;
}
