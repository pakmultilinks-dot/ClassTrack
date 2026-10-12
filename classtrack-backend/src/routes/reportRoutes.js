const express = require("express");
const {
  getSummaryReport,
  getStudentReport,
  getClassReport,
  getLowAttendanceReport
} = require("../controllers/reportController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles, teacherOrAdmin } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(protect);

router.get("/summary", teacherOrAdmin, getSummaryReport);
router.get("/student/:studentId", authorizeRoles("admin", "teacher", "student"), getStudentReport);
router.get("/class/:classId", teacherOrAdmin, getClassReport);
router.get("/low-attendance", teacherOrAdmin, getLowAttendanceReport);

module.exports = router;
