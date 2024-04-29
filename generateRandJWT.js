const jwt = require("jsonwebtoken");

// Function to generate a random number within a range
function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Function to generate a random JWT
function generateRandomJWT() {
  // Creating a random user payload
  const payload = {
    id: randomIntFromInterval(1, 10000), // Random user ID between 1 and 10000
    username: `user${randomIntFromInterval(1, 10000)}`, // Random username
  };

  // Secret key for JWT signing
  const secretKey = "your_very_secret_key"; // This should be a secure key stored properly in production

  // Sign the JWT
  const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });

  // Print the JWT
  console.log("Generated JWT:", token);
}

// Call the function to generate a JWT
generateRandomJWT();
