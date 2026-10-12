const ClassModel = require("../models/Class");
const { findAll, findById, insertOne, updateById } = require("../config/fileDb");
const { isFileDbMode } = require("../utils/dbMode");

const activeFilter = { isActive: { $ne: false } };
const isTestEnvironment = isFileDbMode;

const getActiveClasses = async () => {
  if (isTestEnvironment()) {
    return findAll("classes").filter((classItem) => classItem.isActive !== false);
  }

  return ClassModel.find(activeFilter).sort({ createdAt: -1 });
};

const findActiveClassById = async (id) => {
  if (isTestEnvironment()) {
    const classItem = findById("classes", id);
    return classItem && classItem.isActive !== false ? classItem : null;
  }

  return ClassModel.findOne({ id, ...activeFilter });
};

const createClassRecord = async (data) => {
  if (isTestEnvironment()) {
    const now = new Date().toISOString();
    return insertOne("classes", {
      ...data,
      createdAt: now,
      updatedAt: now
    });
  }

  return ClassModel.create(data);
};

const updateClassRecord = async (id, updates) => {
  if (isTestEnvironment()) {
    return updateById("classes", id, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  }

  return ClassModel.findOneAndUpdate(
    { id, ...activeFilter },
    updates,
    { new: true, runValidators: true }
  );
};

const createClass = async (req, res, next) => {
  try {
    const className = typeof req.body.className === "string" ? req.body.className.trim() : "";
    const section = typeof req.body.section === "string" ? req.body.section.trim() : "";
    const teacherId = typeof req.body.teacherId === "string" && req.body.teacherId.trim()
      ? req.body.teacherId.trim()
      : req.user.id;
    const subjects = req.body.subjects || [];

    if (!className || !section) {
      return res.status(400).json({
        success: false,
        message: "Class name and section are required"
      });
    }

    if (!Array.isArray(subjects)) {
      return res.status(400).json({
        success: false,
        message: "Subjects must be an array"
      });
    }

    const classItem = await createClassRecord({
      className,
      section,
      teacherId,
      subjects,
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: "Class created successfully",
      class: classItem
    });
  } catch (error) {
    next(error);
  }
};

const getClasses = async (req, res, next) => {
  try {
    const classes = await getActiveClasses();

    res.status(200).json({
      success: true,
      count: classes.length,
      classes
    });
  } catch (error) {
    next(error);
  }
};

const getClassById = async (req, res, next) => {
  try {
    const classItem = await findActiveClassById(req.params.id);

    if (!classItem) {
      return res.status(404).json({
        success: false,
        message: "Class not found"
      });
    }

    res.status(200).json({
      success: true,
      class: classItem
    });
  } catch (error) {
    next(error);
  }
};

const updateClass = async (req, res, next) => {
  try {
    const existingClass = await findActiveClassById(req.params.id);

    if (!existingClass) {
      return res.status(404).json({
        success: false,
        message: "Class not found"
      });
    }

    const updates = {};

    if (req.body.className !== undefined) {
      const className = typeof req.body.className === "string" ? req.body.className.trim() : "";

      if (!className) {
        return res.status(400).json({
          success: false,
          message: "Class name cannot be empty"
        });
      }

      updates.className = className;
    }

    if (req.body.section !== undefined) {
      const section = typeof req.body.section === "string" ? req.body.section.trim() : "";

      if (!section) {
        return res.status(400).json({
          success: false,
          message: "Section cannot be empty"
        });
      }

      updates.section = section;
    }

    if (req.body.teacherId !== undefined) {
      const teacherId = typeof req.body.teacherId === "string" ? req.body.teacherId.trim() : "";

      if (!teacherId) {
        return res.status(400).json({
          success: false,
          message: "Teacher id cannot be empty"
        });
      }

      updates.teacherId = teacherId;
    }

    if (req.body.subjects !== undefined) {
      if (!Array.isArray(req.body.subjects)) {
        return res.status(400).json({
          success: false,
          message: "Subjects must be an array"
        });
      }

      updates.subjects = req.body.subjects;
    }

    const updatedClass = await updateClassRecord(req.params.id, updates);

    res.status(200).json({
      success: true,
      message: "Class updated successfully",
      class: updatedClass
    });
  } catch (error) {
    next(error);
  }
};

const deleteClass = async (req, res, next) => {
  try {
    const existingClass = await findActiveClassById(req.params.id);

    if (!existingClass) {
      return res.status(404).json({
        success: false,
        message: "Class not found"
      });
    }

    const deletedClass = await updateClassRecord(req.params.id, { isActive: false });

    res.status(200).json({
      success: true,
      message: "Class deleted successfully",
      class: deletedClass
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createClass,
  getClasses,
  getClassById,
  updateClass,
  deleteClass
};
