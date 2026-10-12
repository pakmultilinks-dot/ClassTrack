const express = require("express");
const {
  registerFace,
  getFaceStatus,
  removeFaceData
} = require("../controllers/faceController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles, teacherOrAdmin } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(protect);

router.post("/register/:studentId", teacherOrAdmin, registerFace);
router.get("/status/:studentId", authorizeRoles("admin", "teacher", "student"), getFaceStatus);
router.delete("/remove/:studentId", teacherOrAdmin, removeFaceData);

module.exports = router;
