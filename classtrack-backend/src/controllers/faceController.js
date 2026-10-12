const mongoose = require("mongoose");
const { randomUUID } = require("crypto");
const Student = require("../models/Student");
const { findAll, updateById } = require("../config/fileDb");

const isTestEnvironment = () => process.env.NODE_ENV === "test" || mongoose.connection.readyState !== 1;

const getActiveStudent = (studentId) => {
  if (isTestEnvironment()) {
    const students = findAll("students");
    return students.find(s => s.id === studentId && s.isActive !== false) || null;
  }
  return Student.findOne({ id: studentId, isActive: { $ne: false } });
};

const registerFace = async (req, res, next) => {
  try {
    const student = await getActiveStudent(req.params.studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    const { descriptor } = req.body;

    if (!Array.isArray(descriptor)) {
      return res.status(400).json({
        success: false,
        message: "Descriptor must be an array"
      });
    }

    if (descriptor.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Descriptor array cannot be empty"
      });
    }

    if (!descriptor.every((value) => typeof value === "number")) {
      return res.status(400).json({
        success: false,
        message: "Descriptor array must contain only numbers"
      });
    }

    const faceDescriptors = student.faceDescriptors || [];

    if (faceDescriptors.length >= 5) {
      return res.status(400).json({
        success: false,
        message: "Maximum 5 face samples are allowed per student"
      });
    }

    student.faceDescriptors.push({
      id: randomUUID(),
      descriptor,
      capturedAt: new Date()
    });
    student.faceRegistered = true;
    
    if (isTestEnvironment()) {
      updateById("students", student.id, student);
    } else {
      await student.save();
    }

    res.status(200).json({
      success: true,
      message: "Face descriptor registered successfully",
      samplesCount: student.faceDescriptors.length
    });
  } catch (error) {
    next(error);
  }
};

const getFaceStatus = async (req, res, next) => {
  try {
    const student = await getActiveStudent(req.params.studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    const faceDescriptors = student.faceDescriptors || [];

    res.status(200).json({
      success: true,
      studentId: student.studentId,
      fullName: student.fullName,
      faceRegistered: student.faceRegistered,
      samplesCount: faceDescriptors.length
    });
  } catch (error) {
    next(error);
  }
};

const removeFaceData = async (req, res, next) => {
  try {
    const student = await getActiveStudent(req.params.studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    student.faceDescriptors = [];
    student.faceRegistered = false;
    
    if (isTestEnvironment()) {
      updateById("students", student.id, student);
    } else {
      await student.save();
    }

    res.status(200).json({
      success: true,
      message: "Face data removed successfully"
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerFace,
  getFaceStatus,
  removeFaceData
};
