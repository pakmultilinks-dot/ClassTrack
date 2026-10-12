const Student = require("../models/Student");
const ClassModel = require("../models/Class");
const { findAll, findById, insertOne, updateById } = require("../config/fileDb");

const activeFilter = { isActive: { $ne: false } };
const isTestEnvironment = () => process.env.NODE_ENV === "test";

const getActiveStudents = async () => {
  if (isTestEnvironment()) {
    return findAll("students").filter((student) => student.isActive !== false);
  }

  return Student.find(activeFilter).sort({ createdAt: -1 });
};

const findActiveClassById = async (classId) => {
  if (!classId) {
    return null;
  }

  if (isTestEnvironment()) {
    const classItem = findById("classes", classId);
    return classItem && classItem.isActive !== false ? classItem : null;
  }

  return ClassModel.findOne({ id: classId, ...activeFilter });
};

const findActiveStudentById = async (studentId) => {
  if (isTestEnvironment()) {
    const student = findById("students", studentId);
    return student && student.isActive !== false ? student : null;
  }

  return Student.findOne({ id: studentId, ...activeFilter });
};

const hasDuplicateStudentId = async (studentId, currentStudentId = null) => {
  if (isTestEnvironment()) {
    return (await getActiveStudents()).some((student) => {
      return student.studentId === studentId && student.id !== currentStudentId;
    });
  }

  const query = { studentId, ...activeFilter };

  if (currentStudentId) {
    query.id = { $ne: currentStudentId };
  }

  return Boolean(await Student.exists(query));
};

const hasDuplicateRollNumber = async (rollNumber, classId, currentStudentId = null) => {
  if (isTestEnvironment()) {
    return (await getActiveStudents()).some((student) => {
      return (
        student.rollNumber === rollNumber &&
        (student.classId || "") === (classId || "") &&
        student.id !== currentStudentId
      );
    });
  }

  const query = {
    rollNumber,
    classId: classId || "",
    ...activeFilter
  };

  if (currentStudentId) {
    query.id = { $ne: currentStudentId };
  }

  return Boolean(await Student.exists(query));
};

const createStudentRecord = async (data) => {
  if (isTestEnvironment()) {
    const now = new Date().toISOString();
    return insertOne("students", {
      ...data,
      createdAt: now,
      updatedAt: now
    });
  }

  return Student.create(data);
};

const updateStudentRecord = async (id, updates) => {
  if (isTestEnvironment()) {
    return updateById("students", id, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  }

  return Student.findOneAndUpdate(
    { id, ...activeFilter },
    updates,
    { new: true, runValidators: true }
  );
};

const createStudent = async (req, res, next) => {
  try {
    const studentId = typeof req.body.studentId === "string" ? req.body.studentId.trim() : "";
    const fullName = typeof req.body.fullName === "string" ? req.body.fullName.trim() : "";
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const phone = typeof req.body.phone === "string" ? req.body.phone.trim() : "";
    const rollNumber = typeof req.body.rollNumber === "string" ? req.body.rollNumber.trim() : "";
    const classId = typeof req.body.classId === "string" ? req.body.classId.trim() : "";
    const section = typeof req.body.section === "string" ? req.body.section.trim() : "";

    if (!studentId || !fullName || !rollNumber) {
      return res.status(400).json({
        success: false,
        message: "Student id, full name, and roll number are required"
      });
    }

    const classItem = await findActiveClassById(classId);

    if (classId && !classItem) {
      return res.status(400).json({
        success: false,
        message: "Class not found"
      });
    }

    if (await hasDuplicateStudentId(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Student id already exists"
      });
    }

    if (await hasDuplicateRollNumber(rollNumber, classId)) {
      return res.status(400).json({
        success: false,
        message: "Roll number already exists in this class"
      });
    }

    const student = await createStudentRecord({
      studentId,
      fullName,
      email,
      phone,
      rollNumber,
      classId,
      section: section || (classItem ? classItem.section : ""),
      faceRegistered: false,
      faceDescriptors: [],
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      student
    });
  } catch (error) {
    next(error);
  }
};

const getStudents = async (req, res, next) => {
  try {
    const students = await getActiveStudents();

    res.status(200).json({
      success: true,
      count: students.length,
      students
    });
  } catch (error) {
    next(error);
  }
};

const getStudentById = async (req, res, next) => {
  try {
    const student = await findActiveStudentById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    res.status(200).json({
      success: true,
      student
    });
  } catch (error) {
    next(error);
  }
};

const updateStudent = async (req, res, next) => {
  try {
    const existingStudent = await findActiveStudentById(req.params.id);

    if (!existingStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    const updates = {};

    if (req.body.studentId !== undefined) {
      const studentId = typeof req.body.studentId === "string" ? req.body.studentId.trim() : "";

      if (!studentId) {
        return res.status(400).json({
          success: false,
          message: "Student id cannot be empty"
        });
      }

      if (await hasDuplicateStudentId(studentId, existingStudent.id)) {
        return res.status(400).json({
          success: false,
          message: "Student id already exists"
        });
      }

      updates.studentId = studentId;
    }

    if (req.body.fullName !== undefined) {
      const fullName = typeof req.body.fullName === "string" ? req.body.fullName.trim() : "";

      if (!fullName) {
        return res.status(400).json({
          success: false,
          message: "Full name cannot be empty"
        });
      }

      updates.fullName = fullName;
    }

    if (req.body.email !== undefined) {
      updates.email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    }

    if (req.body.phone !== undefined) {
      updates.phone = typeof req.body.phone === "string" ? req.body.phone.trim() : "";
    }

    if (req.body.rollNumber !== undefined) {
      const rollNumber = typeof req.body.rollNumber === "string" ? req.body.rollNumber.trim() : "";

      if (!rollNumber) {
        return res.status(400).json({
          success: false,
          message: "Roll number cannot be empty"
        });
      }

      updates.rollNumber = rollNumber;
    }

    if (req.body.classId !== undefined) {
      const classId = typeof req.body.classId === "string" ? req.body.classId.trim() : "";
      const classItem = await findActiveClassById(classId);

      if (classId && !classItem) {
        return res.status(400).json({
          success: false,
          message: "Class not found"
        });
      }

      updates.classId = classId;

      if (classItem && req.body.section === undefined) {
        updates.section = classItem.section;
      }
    }

    if (req.body.section !== undefined) {
      updates.section = typeof req.body.section === "string" ? req.body.section.trim() : "";
    }

    const nextRollNumber = updates.rollNumber || existingStudent.rollNumber;
    const nextClassId = updates.classId !== undefined ? updates.classId : existingStudent.classId;

    if (await hasDuplicateRollNumber(nextRollNumber, nextClassId, existingStudent.id)) {
      return res.status(400).json({
        success: false,
        message: "Roll number already exists in this class"
      });
    }

    const updatedStudent = await updateStudentRecord(req.params.id, updates);

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      student: updatedStudent
    });
  } catch (error) {
    next(error);
  }
};

const deleteStudent = async (req, res, next) => {
  try {
    const existingStudent = await findActiveStudentById(req.params.id);

    if (!existingStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    const deletedStudent = await updateStudentRecord(req.params.id, { isActive: false });

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
      student: deletedStudent
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent
};
