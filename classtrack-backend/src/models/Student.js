const { randomUUID } = require("crypto");
const mongoose = require("mongoose");
const modelOptions = require("./modelOptions");

const faceDescriptorSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: randomUUID
    },
    descriptor: {
      type: [Number],
      required: true,
      default: []
    },
    capturedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    _id: false,
    id: false
  }
);

const studentSchema = new mongoose.Schema(
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
      trim: true,
      index: true
    },
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: ""
    },
    phone: {
      type: String,
      trim: true,
      default: ""
    },
    rollNumber: {
      type: String,
      required: true,
      trim: true
    },
    classId: {
      type: String,
      trim: true,
      default: ""
    },
    section: {
      type: String,
      trim: true,
      default: ""
    },
    faceRegistered: {
      type: Boolean,
      default: false
    },
    faceDescriptors: {
      type: [faceDescriptorSchema],
      default: []
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  modelOptions
);

studentSchema.index({ studentId: 1, isActive: 1 });
studentSchema.index({ rollNumber: 1, classId: 1, isActive: 1 });
studentSchema.index({ classId: 1, isActive: 1 });

module.exports = mongoose.model("Student", studentSchema);
