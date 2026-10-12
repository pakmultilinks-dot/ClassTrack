const { randomUUID } = require("crypto");
const mongoose = require("mongoose");
const modelOptions = require("./modelOptions");

const attendanceSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: randomUUID,
      unique: true,
      index: true
    },
    studentId: {
      type: String,
      required: true,
      trim: true
    },
    classId: {
      type: String,
      required: true,
      trim: true
    },
    studentName: {
      type: String,
      required: true,
      trim: true
    },
    studentCode: {
      type: String,
      required: true,
      trim: true
    },
    className: {
      type: String,
      required: true,
      trim: true
    },
    section: {
      type: String,
      trim: true,
      default: ""
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ["present", "absent", "late"],
      default: "present"
    },
    method: {
      type: String,
      enum: ["face", "manual"],
      required: true
    },
    confidence: {
      type: Number,
      default: null
    },
    markedBy: {
      type: String,
      required: true,
      trim: true
    }
  },
  modelOptions
);

attendanceSchema.index({ studentId: 1, classId: 1, subject: 1, date: 1 });
attendanceSchema.index({ classId: 1, date: 1, studentId: 1 });

module.exports = mongoose.model("Attendance", attendanceSchema);
