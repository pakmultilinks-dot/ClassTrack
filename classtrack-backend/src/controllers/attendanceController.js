const { isFileDbMode } = require("../utils/dbMode");
const Attendance = require("../models/Attendance");
const Student = require("../models/Student");
const ClassModel = require("../models/Class");
const { findBestFaceMatch } = require("../utils/faceMatcher");
const { findAll, insertOne } = require("../config/fileDb");

const allowedStatuses = ["present", "absent", "late"];
const activeFilter = { isActive: { $ne: false } };

const isTestEnvironment = isFileDbMode;

const getTodayDate = () => new Date().toISOString().slice(0, 10);

const isNonEmptyNumberArray = (value) => {
  return Array.isArray(value) && value.length > 0 && value.every((item) => typeof item === "number");
};

const getActiveStudent = (studentId) => {
  if (isTestEnvironment()) {
    const students = findAll("students");
    return students.find(s => s.id === studentId && s.isActive !== false) || null;
  }
  return Student.findOne({ id: studentId, ...activeFilter });
};

const getActiveClass = (classId) => {
  if (isTestEnvironment()) {
    const classes = findAll("classes");
    return classes.find(c => c.id === classId && c.isActive !== false) || null;
  }
  return ClassModel.findOne({ id: classId, ...activeFilter });
};

const findExistingAttendance = (studentId, classId, subject, date) => {
  if (isTestEnvironment()) {
    const attendance = findAll("attendance");
    return attendance.find(a => a.studentId === studentId && a.classId === classId && a.subject === subject && a.date === date) || null;
  }
  return Attendance.findOne({ studentId, classId, subject, date });
};

const createAttendanceRecord = ({
  student,
  classItem,
  subject,
  status,
  method,
  confidence,
  markedBy
}) => {
  const record = {
    studentId: student.id,
    classId: classItem.id,
    studentName: student.fullName,
    studentCode: student.studentId,
    className: classItem.className,
    section: student.section || classItem.section,
    subject,
    date: getTodayDate(),
    status,
    method,
    confidence,
    markedBy,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (isTestEnvironment()) {
    return Promise.resolve(insertOne("attendance", record));
  }

  return Attendance.create(record);
};

const scanFaceAttendance = async (req, res, next) => {
  try {
    const { descriptor } = req.body;
    const classId = typeof req.body.classId === "string" ? req.body.classId.trim() : "";
    const subject = typeof req.body.subject === "string" ? req.body.subject.trim() : "";

    if (!isNonEmptyNumberArray(descriptor)) {
      return res.status(400).json({
        success: false,
        message: "Descriptor is required and must be a non-empty array of numbers"
      });
    }

    if (!classId || !subject) {
      return res.status(400).json({
        success: false,
        message: "Class id and subject are required"
      });
    }

    const classItem = await getActiveClass(classId);

    if (!classItem) {
      return res.status(404).json({
        success: false,
        message: "Class not found"
      });
    }

    const classStudents = await Student.find({ classId, ...activeFilter });
    const matchResult = findBestFaceMatch(
      descriptor,
      classStudents.map((student) => student.toObject())
    );

    if (!matchResult.matched) {
      return res.status(404).json({
        success: false,
        message: "Unknown face. No matching student found.",
        matched: false
      });
    }

    const today = getTodayDate();
    const existingAttendance = await findExistingAttendance(
      matchResult.student.id,
      classId,
      subject,
      today
    );

    if (existingAttendance) {
      return res.status(200).json({
        success: true,
        message: "Attendance already marked for this student today",
        matched: true,
        attendance: existingAttendance
      });
    }

    const attendance = await createAttendanceRecord({
      student: matchResult.student,
      classItem,
      subject,
      status: "present",
      method: "face",
      confidence: matchResult.confidence,
      markedBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: "Attendance marked successfully",
      matched: true,
      confidence: matchResult.confidence,
      attendance
    });
  } catch (error) {
    next(error);
  }
};

const markManualAttendance = async (req, res, next) => {
  try {
    const studentId = typeof req.body.studentId === "string" ? req.body.studentId.trim() : "";
    const classId = typeof req.body.classId === "string" ? req.body.classId.trim() : "";
    const subject = typeof req.body.subject === "string" ? req.body.subject.trim() : "";
    const status = typeof req.body.status === "string" ? req.body.status.trim().toLowerCase() : "";

    if (!studentId || !classId || !subject || !status) {
      return res.status(400).json({
        success: false,
        message: "Student id, class id, subject, and status are required"
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be present, absent, or late"
      });
    }

    const student = await getActiveStudent(studentId);
    const classItem = await getActiveClass(classId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    if (!classItem) {
      return res.status(404).json({
        success: false,
        message: "Class not found"
      });
    }

    if (student.classId !== classId) {
      return res.status(400).json({
        success: false,
        message: "Student does not belong to this class"
      });
    }

    const today = getTodayDate();
    const existingAttendance = await findExistingAttendance(studentId, classId, subject, today);

    if (existingAttendance) {
      return res.status(200).json({
        success: true,
        message: "Attendance already marked for this student today",
        attendance: existingAttendance
      });
    }

    const attendance = await createAttendanceRecord({
      student,
      classItem,
      subject,
      status,
      method: "manual",
      confidence: null,
      markedBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: "Manual attendance marked successfully",
      attendance
    });
  } catch (error) {
    next(error);
  }
};

const getAllAttendance = async (req, res, next) => {
  try {
    let attendance = [];
    if (isTestEnvironment()) {
      attendance = findAll("attendance").sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      attendance = await Attendance.find().sort({ createdAt: -1 });
    }

    res.status(200).json({
      success: true,
      count: attendance.length,
      attendance
    });
  } catch (error) {
    next(error);
  }
};

const getStudentAttendance = async (req, res, next) => {
  try {
    const student = await getActiveStudent(req.params.studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    const isAdminOrTeacher = ["admin", "teacher"].includes(req.user.role);
    const isSameUserId = req.user.id === student.id;
    const isSameEmail = student.email && req.user.email && student.email === req.user.email;

    if (!isAdminOrTeacher && !isSameUserId && !isSameEmail) {
      return res.status(403).json({
        success: false,
        message: "You can only view your own attendance"
      });
    }

    let attendance = [];
    if (isTestEnvironment()) {
      attendance = findAll("attendance").filter(a => a.studentId === student.id).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      attendance = await Attendance.find({ studentId: student.id }).sort({ createdAt: -1 });
    }

    res.status(200).json({
      success: true,
      count: attendance.length,
      attendance
    });
  } catch (error) {
    next(error);
  }
};

const getClassAttendance = async (req, res, next) => {
  try {
    const classItem = await getActiveClass(req.params.classId);

    if (!classItem) {
      return res.status(404).json({
        success: false,
        message: "Class not found"
      });
    }

    let attendance = [];
    if (isTestEnvironment()) {
      attendance = findAll("attendance").filter(a => a.classId === classItem.id).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      attendance = await Attendance.find({ classId: classItem.id }).sort({ createdAt: -1 });
    }

    res.status(200).json({
      success: true,
      count: attendance.length,
      attendance
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  scanFaceAttendance,
  markManualAttendance,
  getAllAttendance,
  getStudentAttendance,
  getClassAttendance
};
