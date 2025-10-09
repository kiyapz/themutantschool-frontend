// Node.js test script for ID encoding/decoding

// Since this is Node.js and not browser, we need to simulate btoa/atob
global.btoa = (str) => Buffer.from(str).toString("base64");
global.atob = (str) => Buffer.from(str, "base64").toString();

// Define our encoding function
function encodeId(id) {
  if (!id) return "";

  // Convert to base64
  let encoded = global.btoa(id.toString());

  // Replace characters that might look like URL parameters
  encoded = encoded.replace(/=/g, "");
  encoded = encoded.replace(/\+/g, "-");
  encoded = encoded.replace(/\//g, "_");

  // Generate a random string of special chars and letters
  const randomChars = generateRandomString(8);

  // Create a more chaotic looking ID - adding a separator to help with parsing
  return `${encoded}@${randomChars}${Math.floor(Math.random() * 10000)}`;
}

// Generate a random string with special characters and letters
function generateRandomString(length) {
  const chars =
    "#$%^&*()_+-=[]{}|;:,.<>?~ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Define our decoding function
function decodeId(encodedId) {
  if (!encodedId) return "";

  try {
    let processedId = encodedId;

    // If we're dealing with a slug (title-id format), extract just the encoded ID portion
    if (encodedId.includes("-")) {
      const parts = encodedId.split("-");
      processedId = parts[parts.length - 1];
    }

    // Extract the base64 part using the @ separator
    let encoded = processedId;
    if (processedId.includes("@")) {
      encoded = processedId.split("@")[0];
    } else {
      // Fallback: Try to guess where the ID ends (this is less reliable)
      // Base64 encoded MongoDB IDs are typically around 22-24 chars
      encoded = processedId.substring(0, 24);
    }

    // Convert back from URL-safe base64
    encoded = encoded.replace(/-/g, "+");
    encoded = encoded.replace(/_/g, "/");

    // Add padding if needed
    while (encoded.length % 4) {
      encoded += "=";
    }

    try {
      // Use atob function to decode
      const decoded = global.atob(encoded);

      // Validate if the result looks like a MongoDB ObjectId (24 hex chars)
      if (/^[0-9a-f]{24}$/i.test(decoded)) {
        return decoded;
      }
    } catch (e) {
      console.error("Error decoding base64:", e);
    }

    console.warn("Couldn't extract valid MongoDB ID, returning as is");
    return processedId;
  } catch (error) {
    console.error("Failed to decode ID:", error);

    // If decoding fails, it might be a raw ID, so return it as is
    return encodedId;
  }
}

// Test different MongoDB IDs
const testIds = [
  "68ba02f7cf02aa45faf6719b",
  "64f8c3db91f1010534f142ac",
  "60a12345678901234567890a",
];

// Test each ID
testIds.forEach((id) => {
  console.log(`Original ID: ${id}`);

  // Encode the ID
  const encoded = encodeId(id);
  console.log(`Encoded ID: ${encoded}`);

  // Decode it back
  const decoded = decodeId(encoded);
  console.log(`Decoded ID: ${decoded}`);

  // Check if it matches the original
  console.log(`Matches original: ${decoded === id}`);
  console.log("-".repeat(50));

  // Test with slug format
  const slug = `javascript-basics-${encoded}`;
  console.log(`Slug: ${slug}`);
  const decodedFromSlug = decodeId(slug);
  console.log(`Decoded from slug: ${decodedFromSlug}`);
  console.log(`Matches original: ${decodedFromSlug === id}`);
  console.log("=".repeat(50));
});

// Test edge cases
console.log("Edge cases:");
console.log(`Empty string: ${decodeId("")}`);
console.log(`Invalid format: ${decodeId("not-an-encoded-id")}`);
console.log(`Just random chars: ${decodeId("#@$%^&*()_+")}`);
