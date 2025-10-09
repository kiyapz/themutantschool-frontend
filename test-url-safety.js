// Test URL safety of our encoding function

// Since this is Node.js and not browser, we need to simulate btoa/atob
global.btoa = (str) => Buffer.from(str).toString("base64");
global.atob = (str) => Buffer.from(str, "base64").toString();

// Define our encoding function with the new URL-safe approach
function encodeId(id) {
  if (!id) return "";

  // Convert to base64
  let encoded = global.btoa(id.toString());

  // Replace characters that might look like URL parameters
  encoded = encoded.replace(/=/g, "");
  encoded = encoded.replace(/\+/g, "-");
  encoded = encoded.replace(/\//g, "_");

  // Generate random string with URL-safe characters
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_.";
  let randomChars = "";
  for (let i = 0; i < 8; i++) {
    randomChars += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `${encoded}_${randomChars}${Math.floor(Math.random() * 10000)}`;
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

    // Extract the base64 part using the _ separator
    let encoded = processedId;
    if (processedId.includes("_")) {
      encoded = processedId.split("_")[0];
    } else if (processedId.includes("@")) {
      // Backward compatibility
      encoded = processedId.split("@")[0];
    } else {
      encoded = processedId.substring(0, 24);
    }

    // Convert back from URL-safe base64
    encoded = encoded.replace(/-/g, "+");
    encoded = encoded.replace(/_/g, "/");

    // Add padding if needed
    while (encoded.length % 4) {
      encoded += "=";
    }

    // Use atob function to decode
    const decoded = global.atob(encoded);

    // Validate if the result looks like a MongoDB ObjectId (24 hex chars)
    if (/^[0-9a-f]{24}$/i.test(decoded)) {
      return decoded;
    }

    console.warn("Couldn't extract valid MongoDB ID, returning as is");
    return processedId;
  } catch (error) {
    console.error("Failed to decode ID:", error);
    return encodedId;
  }
}

// Test IDs
const testIds = [
  "68ba02f7cf02aa45faf6719b",
  "64f8c3db91f1010534f142ac",
  "60a12345678901234567890a",
  "68cbf0f18f588ae1f7373d68", // The one from the error message
];

// Test each ID
testIds.forEach((id) => {
  console.log(`Original ID: ${id}`);

  // Encode the ID
  const encoded = encodeId(id);
  console.log(`Encoded ID: ${encoded}`);

  // Check if URL is safe
  const url = `http://localhost:3000/mission/javascript-${encoded}`;
  console.log(`URL: ${url}`);

  // Make sure URL is valid
  try {
    new URL(url);
    console.log("✓ URL is valid");
  } catch (e) {
    console.log("✗ URL is invalid:", e.message);
  }

  // Decode it back
  const decoded = decodeId(encoded);
  console.log(`Decoded ID: ${decoded}`);
  console.log(`Matches original: ${decoded === id}`);
  console.log("=".repeat(50));
});

// Test backward compatibility with @ format
const oldFormatId = "NjhjYmYwZjE4ZjU4OGFlMWY3MzczZDY4@someChars123";
console.log(`\nTesting backward compatibility:`);
console.log(`Old format ID: ${oldFormatId}`);
const decodedOld = decodeId(oldFormatId);
console.log(`Decoded old format: ${decodedOld}`);
console.log(`Expected: 68cbf0f18f588ae1f7373d68`);
