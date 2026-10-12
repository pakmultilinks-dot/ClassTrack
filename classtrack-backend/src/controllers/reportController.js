const mongoose = require("mongoose");
const Attendance = require("../models/Attendance");
const Student = require("../models/Student");
const ClassModel = require("../models/Class");
const { findAll } = require("../config/fileDb");

const activeFilter = { isActive: { $ne: false } };
const isTestEnvironment = () => process.env.NODE_ENV === "test" || mongoose.connection.readyState !== 1;

const calculateAttendanceStats = (records) => {
  const presentCount = records.filter((record) => record.status === "present").length;
  const absentCount = records.filter((record) => record.status === "absent").length;
  const lateCount = records.filter((record) => record.status === "late").length;
  const totalClassesMarked = records.length;
  const attendancePercentage = totalClassesMarked === 0
    ? 0
    : Math.round(((presentCount + lateCount) / totalClassesMarked) * 100);

  return {
    totalClassesMarked,
    presentCount,
    absentCount,
    lateCount,
    attendancePercentage
  };
};

const canViewStudentReport = (user, student) => {
  if (["admin", "teacher"].includes(user.role)) {
    return true;
  }

  return user.id === student.id || (user.email && student.email && user.email === student.email);
};

const getSummaryReport = async (req, res, next) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    let totalStudents, totalClasses, totalAttendanceRecords, totalPresent, totalAbsent, totalLate, todayAttendanceCount;

    if (isTestEnvironment()) {
      const students = findAll("students").filter(s => s.isActive !== false);
      const classes = findAll("classes").filter(c => c.isActive !== false);
      const attendance = findAll("attendance");
      
      totalStudents = students.length;
      totalClasses = classes.length;
      totalAttendanceRecords = attendance.length;
      totalPresent = attendance.filter(a => a.status === "present").length;
      totalAbsent = attendance.filter(a => a.status === "absent").length;
      totalLate = attendance.filter(a => a.status === "late").length;
      todayAttendanceCount = attendance.filter(a => a.date === today).length;
    } else {
      [
        totalStudents,
        totalClasses,
        totalAttendanceRecords,
        totalPresent,
        totalAbsent,
        totalLate,
        todayAttendanceCount
      ] = await Promise.all([
        Student.countDocuments(activeFilter),
        ClassModel.countDocuments(activeFilter),
        Attendance.countDocuments(),
        Attendance.countDocuments({ status: "present" }),
        Attendance.countDocuments({ status: "absent" }),
        Attendance.countDocuments({ status: "late" }),
        Attendance.countDocuments({ date: today })
      ]);
    }

    res.status(200).json({
      success: true,
      summary: {
        totalStudents,
        totalClasses,
        totalAttendanceRecords,
        totalPresent,
        totalAbsent,
        totalLate,
        todayAttendanceCount
      }
    });
  } catch (error) {
    next(error);
  }
};

const getStudentReport = async (req, res, next) => {
  try {
    let student;
    if (isTestEnvironment()) {
      student = findAll("students").find(s => s.id === req.params.studentId && s.isActive !== false);
    } else {
      student = await Student.findOne({ id: req.params.studentId, ...activeFilter });
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    if (!canViewStudentReport(req.user, student)) {
      return res.status(403).json({
        success: false,
        message: "You can only view your own report"
      });
    }

    let records = [];
    if (isTestEnvironment()) {
      records = findAll("attendance").filter(a => a.studentId === student.id).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      records = await Attendance.find({ studentId: student.id }).sort({ createdAt: -1 });
    }
    const stats = calculateAttendanceStats(records);

    res.status(200).json({
      success: true,
      student: {
        id: student.id,
        studentId: student.studentId,
        fullName: student.fullName,
        email: student.email,
        rollNumber: student.rollNumber,
        classId: student.classId,
        section: student.section
      },
      ...stats,
      records
    });
  } catch (error) {
    next(error);
  }
};

const getClassReport = async (req, res, next) => {
  try {
    let classItem;
    if (isTestEnvironment()) {
      classItem = findAll("classes").find(c => c.id === req.params.classId && c.isActive !== false);
    } else {
      classItem = await ClassModel.findOne({ id: req.params.classId, ...activeFilter });
    }

    if (!classItem) {
      return res.status(404).json({
        success: false,
        message: "Class not found"
      });
    }

    let students, records;
    if (isTestEnvironment()) {
      students = findAll("students").filter(s => s.classId === classItem.id && s.isActive !== false);
      records = findAll("attendance").filter(a => a.classId === classItem.id).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      [students, records] = await Promise.all([
        Student.find({ classId: classItem.id, ...activeFilter }),
        Attendance.find({ classId: classItem.id }).sort({ createdAt: -1 })
      ]);
    }

    const studentWisePercentage = students.map((student) => {
      const studentRecords = records.filter((record) => record.studentId === student.id);
      const stats = calculateAttendanceStats(studentRecords);

      return {
        studentId: student.id,
        studentCode: student.studentId,
        fullName: student.fullName,
        rollNumber: student.rollNumber,
        totalClassesMarked: stats.totalClassesMarked,
        presentCount: stats.presentCount,
        absentCount: stats.absentCount,
        lateCount: stats.lateCount,
        attendancePercentage: stats.attendancePercentage
      };
    });

    res.status(200).json({
      success: true,
      class: {
        id: classItem.id,
        className: classItem.className,
        section: classItem.section,
        teacherId: classItem.teacherId,
        subjects: classItem.subjects
      },
      totalStudents: students.length,
      records,
      studentWisePercentage
    });
  } catch (error) {
    next(error);
  }
};

const getLowAttendanceReport = async (req, res, next) => {
  try {
    const below = Number(req.query.below || 75);

    if (Number.isNaN(below) || below < 0 || below > 100) {
      return res.status(400).json({
        success: false,
        message: "below must be a number between 0 and 100"
      });
    }

    let attendance, students;
    if (isTestEnvironment()) {
      attendance = findAll("attendance");
      students = findAll("students").filter(s => s.isActive !== false);
    } else {
      [attendance, students] = await Promise.all([
        Attendance.find(),
        Student.find(activeFilter)
      ]);
    }

    const lowAttendanceStudents = students
      .map((student) => {
        const records = attendance.filter((record) => record.studentId === student.id);
        const stats = calculateAttendanceStats(records);

        return {
          student: {
            id: student.id,
            studentId: student.studentId,
            fullName: student.fullName,
            email: student.email,
            rollNumber: student.rollNumber,
            classId: student.classId,
            section: student.section
          },
          ...stats
        };
      })
      .filter((report) => {
        return report.totalClassesMarked > 0 && report.attendancePercentage < below;
      });

    res.status(200).json({
      success: true,
      below,
      count: lowAttendanceStudents.length,
      students: lowAttendanceStudents
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSummaryReport,
  getStudentReport,
  getClassReport,
  getLowAttendanceReport
};
