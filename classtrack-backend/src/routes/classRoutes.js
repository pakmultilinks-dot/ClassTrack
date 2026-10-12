const express = require("express");
const {
  createClass,
  getClasses,
  getClassById,
  updateClass,
  deleteClass
} = require("../controllers/classController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(protect);

router
  .route("/")
  .post(authorizeRoles("admin", "teacher"), createClass)
  .get(authorizeRoles("admin", "teacher", "student"), getClasses);

router
  .route("/:id")
  .get(authorizeRoles("admin", "teacher", "student"), getClassById)
  .put(authorizeRoles("admin", "teacher"), updateClass)
  .delete(authorizeRoles("admin", "teacher"), deleteClass);

module.exports = router;
