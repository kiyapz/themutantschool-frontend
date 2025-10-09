// Simple test for robust ID decoding with error handling

// Since this is Node.js and not browser, we need to simulate btoa/atob
global.btoa = (str) => Buffer.from(str).toString("base64");
global.atob = (str) => Buffer.from(str, "base64").toString();

// Define our encoding function with the URL-safe approach
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

// Define our robust decoding function
function decodeId(encodedId) {
  if (!encodedId) return "";

  try {
    // First check: is this already a MongoDB ObjectID? (24 hex chars)
    if (/^[0-9a-f]{24}$/i.test(encodedId)) {
      return encodedId;
    }

    let processedId = encodedId;

    // If we're dealing with a slug (title-id format), extract just the encoded ID portion
    if (encodedId.includes("-")) {
      const parts = encodedId.split("-");
      processedId = parts[parts.length - 1];
    }

    // Extract the base64 part using the _ or @ separator
    let encoded = processedId;

    // Save original string before removing _ from it
    const originalEncoded = encoded;

    if (processedId.includes("_")) {
      // Get everything before the last _ (since our base64 might contain _)
      encoded = processedId.split("_").slice(0, -1).join("_");
    } else if (processedId.includes("@")) {
      // Backward compatibility for old format
      encoded = processedId.split("@")[0];
    } else {
      // Fallback: Try to guess where the ID ends (this is less reliable)
      // Base64 encoded MongoDB IDs are typically around 22-24 chars
      encoded = processedId.substring(0, 24);
    }

    // Make sure we have a valid Base64 string to work with
    if (!encoded || encoded.length < 8) {
      console.warn("Encoded string too short for Base64 MongoDB ID");
      return processedId;
    }

    try {
      // Only apply URL-safe base64 conversion for real decoding attempts
      let convertedEncoded = encoded;
      convertedEncoded = convertedEncoded.replace(/-/g, "+");
      convertedEncoded = convertedEncoded.replace(/_/g, "/");

      // Add padding if needed
      while (convertedEncoded.length % 4) {
        convertedEncoded += "=";
      }

      // Before trying to decode, validate if this looks like base64
      const base64Regex = /^[A-Za-z0-9+/=]+$/;
      if (!base64Regex.test(convertedEncoded)) {
        throw new Error("Not a valid base64 string");
      }

      // Use atob function to decode
      const decoded = global.atob(convertedEncoded);

      // Validate if the result looks like a MongoDB ObjectId (24 hex chars)
      if (/^[0-9a-f]{24}$/i.test(decoded)) {
        return decoded;
      }
    } catch (e) {
      // Just log to console but don't throw - we'll try our fallback methods
      console.warn("Primary Base64 decoding failed:", e.message);
    }

    // If we get here, let's try a more defensive approach
    try {
      // Direct approach: Try to extract raw MongoDB ID if present in original ID
      const rawIdRegex = /([0-9a-f]{24})/i;
      const rawIdMatch = processedId.match(rawIdRegex);
      if (rawIdMatch && rawIdMatch[1]) {
        return rawIdMatch[1]; // Direct MongoDB ID found!
      }

      // If that fails, try base64 decoding with various lengths
      const possibleEncodedId = originalEncoded || processedId;

      // We'll try with different sections of the ID to find a valid MongoDB ID
      for (let i = 16; i <= 32; i += 2) {
        if (i >= possibleEncodedId.length) continue;

        let testEncoded = possibleEncodedId.substring(0, i);

        // If this contains our separator, use just the part before it
        if (testEncoded.includes("_")) {
          testEncoded = testEncoded.split("_")[0];
        } else if (testEncoded.includes("@")) {
          testEncoded = testEncoded.split("@")[0];
        }

        // Only proceed if we have a clean string that looks like base64
        if (!/^[A-Za-z0-9\-_]+$/.test(testEncoded)) {
          continue;
        }

        try {
          // Convert from URL-safe base64
          testEncoded = testEncoded.replace(/-/g, "+");
          testEncoded = testEncoded.replace(/_/g, "/");

          // Add padding
          while (testEncoded.length % 4) {
            testEncoded += "=";
          }

          // Validate this is actually base64 before trying atob
          if (!/^[A-Za-z0-9+/=]+$/.test(testEncoded)) {
            continue;
          }

          const testDecoded = global.atob(testEncoded);
          if (/^[0-9a-f]{24}$/i.test(testDecoded)) {
            return testDecoded;
          }
        } catch (e) {
          // Just skip this attempt
        }
      }
    } catch (e) {
      console.warn("Fallback decoding failed:", e.message);
    }

    console.warn("Couldn't extract valid MongoDB ID, returning as is");
    return processedId;
  } catch (error) {
    console.error("Failed to decode ID:", error);
    return encodedId;
  }
}

// Test IDs
const validIds = [
  "68ba02f7cf02aa45faf6719b",
  "64f8c3db91f1010534f142ac",
  "60a12345678901234567890a",
  "68cbf0f18f588ae1f7373d68", // The one from the error message
];

console.log("=== Testing valid MongoDB IDs ===");
validIds.forEach((id) => {
  console.log(`\nOriginal ID: ${id}`);

  // Encode and test round-trip
  const encoded = encodeId(id);
  console.log(`Encoded: ${encoded}`);

  const decoded = decodeId(encoded);
  console.log(`Decoded: ${decoded}`);
  console.log(`Success: ${id === decoded}`);
});

console.log("\n\n=== Testing error handling with malformed inputs ===");

// Test cases with malformed/problematic inputs
const problematicInputs = [
  { name: "Empty string", input: "" },
  { name: "Already a MongoDB ID", input: "68ba02f7cf02aa45faf6719b" },
  {
    name: "Invalid characters",
    input: "NjhjYmYwZjE4ZjU4OGFlMWY3MzczZDY4@#$%^&*()",
  },
  { name: "Too short", input: "abc123" },
  { name: "Wrong separator", input: "NjhjYmYwZjE4ZjU4OGFlMWY3MzczZDY4-abc123" },
  { name: "No separator", input: "NjhjYmYwZjE4ZjU4OGFlMWY3MzczZDY4abc123" },
  {
    name: "With slug",
    input: "javascript-NjhjYmYwZjE4ZjU4OGFlMWY3MzczZDY4_randomchars123",
  },
  {
    name: "With old format",
    input: "javascript-NjhjYmYwZjE4ZjU4OGFlMWY3MzczZDY4@randomchars123",
  },
  {
    name: "Raw in string",
    input: "someprefixtext68cbf0f18f588ae1f7373d68moresuffix",
  },
];

problematicInputs.forEach((test) => {
  console.log(`\nTesting: ${test.name}`);
  console.log(`Input: ${test.input}`);
  try {
    const result = decodeId(test.input);
    console.log(`Result: ${result}`);

    // Check if we got a valid MongoDB ID
    if (/^[0-9a-f]{24}$/i.test(result)) {
      console.log("✓ Successfully extracted a valid MongoDB ID");
    } else {
      console.log("✗ Did not extract a valid MongoDB ID");
    }
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }
});
