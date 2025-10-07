"use client";

import { encodeId } from "./idUtils";

/**
 * Generate an encoded link to a mission detail page
 * @param {string} missionId - The MongoDB ID of the mission
 * @param {string} title - Optional mission title to make more SEO friendly
 * @returns {string} The encoded URL path
 */
export function generateMissionLink(missionId, title = "") {
  const encodedId = encodeId(missionId);

  // If title is provided, create a SEO-friendly slug
  if (title) {
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove special characters except spaces and hyphens
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .substring(0, 50); // Limit length

    return `/mission/${slug}-${encodedId}`;
  }

  return `/mission/${encodedId}`;
}
