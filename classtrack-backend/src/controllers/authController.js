const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const { findAll, insertOne, updateById } = require("../config/fileDb");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const allowedRoles = ["admin", "teacher", "student"];
const isTestEnvironment = () => process.env.NODE_ENV === "test" || mongoose.connection.readyState !== 1;

const formatUserResponse = (user) => ({
  id: user.id || user._id,
  fullName: user.fullName,
  email: user.email,
  role: user.role,
  isActive: user.isActive,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

const registerUser = async (req, res, next) => {
  try {
    const fullName = typeof req.body.fullName === "string" ? req.body.fullName.trim() : "";
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const password = typeof req.body.password === "string" ? req.body.password : "";
    const role = req.body.role;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Full name, email, and password are required"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters"
      });
    }

    if (role && !allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role must be admin, teacher, or student"
      });
    }

    const normalizedEmail = email;
    const userExists = isTestEnvironment()
      ? findAll("users").find((savedUser) => savedUser.email && savedUser.email.toLowerCase() === normalizedEmail)
      : await User.findOne({ email: normalizedEmail });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists"
      });
    }

    const user = isTestEnvironment()
      ? insertOne("users", {
        fullName,
        email: normalizedEmail,
        password: await bcrypt.hash(password, 10),
        role: role || "student",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      : await User.create({
        fullName,
        email: normalizedEmail,
        password,
        role: role || "student",
        isActive: true
      });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token: generateToken(user.id || user._id, user.role),
      user: formatUserResponse(user)
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const password = typeof req.body.password === "string" ? req.body.password : "";

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    let user;

    if (isTestEnvironment()) {
      user = findAll("users").find(
        (savedUser) => savedUser.email && savedUser.email.toLowerCase() === email
      );

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password"
        });
      }

      let isPasswordValid = false;
      try {
        isPasswordValid = await bcrypt.compare(password, user.password);
      } catch (e) {
        isPasswordValid = false;
      }

      if (!isPasswordValid) {
        // Plain-text fallback safety valve for test DB mode
        if (password === user.password) {
          isPasswordValid = true;
          const hashedPassword = await bcrypt.hash(password, 10);
          updateById("users", user.id, { password: hashedPassword });
          user.password = hashedPassword;
        }
      }

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password"
        });
      }
    } else {
      user = await User.findOne({ email: new RegExp(`^${email}$`, "i") });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password"
        });
      }

      const isPasswordValid = await user.matchPassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password"
        });
      }
    }

    const userId = user.id || user._id;

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token: generateToken(userId, user.role),
      user: formatUserResponse(user)
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: formatUserResponse(req.user)
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe
};
