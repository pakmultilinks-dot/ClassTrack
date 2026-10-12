const jwt = require("jsonwebtoken");

const generateToken = (userId, role) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing from environment variables");
  }

  const payload = typeof userId === "object" && userId !== null
    ? { id: userId.id ? userId.id.toString() : userId.toString(), ...userId }
    : { id: userId.toString(), ...(role ? { role } : {}) };

  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d"
    }
  );
};

module.exports = generateToken;
