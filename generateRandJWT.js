const jwt = require("jsonwebtoken");

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function generateRandomJWT() {
  const payload = {
    id: randomIntFromInterval(1, 10000),
    username: `user${randomIntFromInterval(1, 10000)}`,
  };

  const secretKey = "your_very_secret_key";

  const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });

  console.log("Generated JWT:", token);
}

generateRandomJWT();
