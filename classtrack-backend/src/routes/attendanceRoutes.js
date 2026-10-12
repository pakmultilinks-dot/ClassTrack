const express = require("express");
const {
  scanFaceAttendance,
  markManualAttendance,
  bulkMarkAttendance,
  getAllAttendance,
  getStudentAttendance,
  getClassAttendance
} = require("../controllers/attendanceController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles, teacherOrAdmin } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(protect);

router.post("/scan-face", teacherOrAdmin, scanFaceAttendance);
router.post("/manual", teacherOrAdmin, markManualAttendance);
router.post("/bulk", teacherOrAdmin, bulkMarkAttendance);
router.get("/", teacherOrAdmin, getAllAttendance);
router.get("/student/:studentId", authorizeRoles("admin", "teacher", "student"), getStudentAttendance);
router.get("/class/:classId", teacherOrAdmin, getClassAttendance);

module.exports = router;
