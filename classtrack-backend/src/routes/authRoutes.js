const express = require("express");
const {
  registerUser,
  loginUser,
  getMe,
  getTeachers
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.get("/teachers", protect, authorizeRoles("admin"), getTeachers);

module.exports = router;
