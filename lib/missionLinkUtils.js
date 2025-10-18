"use client";

import { encodeId } from "./idUtils";

/**
 * Generate a link to a mission detail page using the title slug
 * @param {string} missionId - The MongoDB ID of the mission (no longer used but kept for backwards compatibility)
 * @param {string} title - Mission title to create SEO-friendly slug
 * @returns {string} The URL path
 */
export function generateMissionLink(missionId, title = "") {
  // If title is provided, create a SEO-friendly slug
  if (title) {
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove special characters except spaces and hyphens
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .substring(0, 50); // Limit length

    return `/mission/${slug}`;
  }

  // Fallback to encoded ID if no title provided
  const encodedId = encodeId(missionId);
  return `/mission/${encodedId}`;
}
