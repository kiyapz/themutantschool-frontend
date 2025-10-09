// Simple test for URL appearance

const ids = [
  "68ba02f7cf02aa45faf6719b",
  "64f8c3db91f1010534f142ac",
  "60a12345678901234567890a",
];

// Simulate our encoding function
function encodeId(id) {
  const encoded = Buffer.from(id)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  // Create random chars
  const chars =
    "#$%^&*()_+-=[]{}|;:,.<>?~ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomChars = "";
  for (let i = 0; i < 8; i++) {
    randomChars += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `${encoded}@${randomChars}${Math.floor(Math.random() * 10000)}`;
}

// Test URL appearances
ids.forEach((id) => {
  const encoded = encodeId(id);
  console.log(`\nOriginal ID: ${id}`);
  console.log(`Encoded ID: ${encoded}`);
  console.log(`URL: http://localhost:3000/mission/javascript-${encoded}`);
});
