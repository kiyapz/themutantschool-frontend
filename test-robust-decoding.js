// Test robust ID decoding with error handling

// Since this is Node.js and not browser, we need to simulate btoa/atob
global.btoa = (str) => Buffer.from(str).toString("base64");
global.atob = (str) => Buffer.from(str, "base64").toString();

// Import directly from lib/idUtils.js functions
const fs = require("fs");
const path = require("path");

// Read in the actual implementation from the file
const idUtilsContent = fs.readFileSync(
  path.join(__dirname, "lib/idUtils.js"),
  "utf8"
);

// Extract encodeId and decodeId functions (this is a bit hacky but works for testing)
let encodeIdFn = "";
let decodeIdFn = "";

// Extract function implementations
const encodeFnMatch = idUtilsContent.match(
  /export function encodeId\([^)]*\) \{[\s\S]*?\}(?=\s*\/\*\*|$)/
);
if (encodeFnMatch) encodeIdFn = encodeFnMatch[0];

const decodeFnMatch = idUtilsContent.match(
  /export function decodeId\([^)]*\) \{[\s\S]*?\}(?=\s*\/\*\*|$)/
);
if (decodeFnMatch) decodeIdFn = decodeFnMatch[0];

// Also get the generateRandomString function
const randomFnMatch = idUtilsContent.match(
  /function generateRandomString\([^)]*\) \{[\s\S]*?\}(?=\s*\/\*\*|$)/
);
let randomFn = "";
if (randomFnMatch) randomFn = randomFnMatch[0];

// Create executable functions
const encodeId = new Function(
  "id",
  "btoa",
  "generateRandomString",
  randomFn + "\n" + encodeIdFn.replace("export ", "return ")
);

const decodeId = new Function(
  "encodedId",
  "atob",
  decodeIdFn.replace("export ", "return ")
);

// Now we can call our actual implementation functions
function encode(id) {
  return encodeId(id, global.btoa, generateRandomString);
}

function decode(encoded) {
  return decodeId(encoded, global.atob);
}

function generateRandomString(length) {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_.";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Test IDs
const validIds = [
  "68ba02f7cf02aa45faf6719b",
  "64f8c3db91f1010534f142ac",
  "60a12345678901234567890a",
  "68cbf0f18f588ae1f7373d68",
];

console.log("=== Testing valid MongoDB IDs ===");
validIds.forEach((id) => {
  console.log(`\nOriginal ID: ${id}`);

  // Encode and test round-trip
  const encoded = encode(id);
  console.log(`Encoded: ${encoded}`);

  const decoded = decode(encoded);
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
    const result = decode(test.input);
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
