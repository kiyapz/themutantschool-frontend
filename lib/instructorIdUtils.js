"use client";

export function encodeInstructorId(id) {
  if (!id) return "";
  let encoded = btoa(id.toString());
  const prefix = "instrmission_";
  const suffix = "_instruct" + Math.floor(Math.random() * 1000);
  encoded = encoded.replace(/=/g, "");
  encoded = encoded.replace(/\+/g, "-");
  encoded = encoded.replace(/\//g, "_");
  return `${prefix}${encoded}${suffix}`;
}

export function decodeInstructorId(encodedId) {
  if (!encodedId) return "";
  try {
    let encoded = encodedId;
    if (encoded.startsWith("instrmission_")) {
      encoded = encoded.substring(13); // Length of "instrmission_"
    }
    const instructIndex = encoded.lastIndexOf("_instruct");
    if (instructIndex !== -1) {
      encoded = encoded.substring(0, instructIndex);
    }
    encoded = encoded.replace(/-/g, "+");
    encoded = encoded.replace(/_/g, "/");
    while (encoded.length % 4) {
      encoded += "=";
    }
    return atob(encoded);
  } catch (error) {
    console.error("Failed to decode instructor ID:", error);
    return encodedId;
  }
}

/**
 * Generate an encoded link to an instructor mission levels page
 * @param {string} missionId - The MongoDB ID of the mission
 * @param {string} title - Optional mission title to make more SEO friendly
 * @returns {string} The encoded URL path
 */
export function generateInstructorMissionLevelLink(missionId, title = "") {
  const encodedId = encodeInstructorId(missionId);

  // If title is provided, create a SEO-friendly slug
  if (title) {
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove special characters except spaces and hyphens
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .substring(0, 50); // Limit length

    return `/instructor/missions/createnewmission/missionlevels/${slug}-${encodedId}`;
  }

  return `/instructor/missions/createnewmission/missionlevels/${encodedId}`;
}
