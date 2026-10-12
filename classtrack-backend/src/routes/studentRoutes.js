const express = require("express");
const {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent
} = require("../controllers/studentController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(protect);

router
  .route("/")
  .post(authorizeRoles("admin", "teacher"), createStudent)
  .get(authorizeRoles("admin", "teacher", "student"), getStudents);

router
  .route("/:id")
  .get(authorizeRoles("admin", "teacher", "student"), getStudentById)
  .put(authorizeRoles("admin", "teacher"), updateStudent)
  .delete(authorizeRoles("admin", "teacher"), deleteStudent);

module.exports = router;
