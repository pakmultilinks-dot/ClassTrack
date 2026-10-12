const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { findById } = require("../config/fileDb");
const User = require("../models/User");

const isTestEnvironment = () => process.env.NODE_ENV === "test" || mongoose.connection.readyState !== 1;

const protect = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token provided"
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = isTestEnvironment()
      ? findById("users", decoded.id)
      : await User.findById(decoded.id).select("-password") || await User.findOne({ id: decoded.id }).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, user not found"
      });
    }

    if (user.isActive === false) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, user is inactive"
      });
    }

    req.user = isTestEnvironment() ? user : user.toObject();
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Not authorized, token failed"
    });
  }
};

module.exports = {
  protect
};
