const { randomUUID } = require("crypto");
const mongoose = require("mongoose");
const modelOptions = require("./modelOptions");

const classSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: randomUUID,
      unique: true,
      index: true
    },
    className: {
      type: String,
      required: true,
      trim: true
    },
    section: {
      type: String,
      required: true,
      trim: true
    },
    teacherId: {
      type: String,
      required: true,
      trim: true
    },
    subjects: {
      type: [String],
      default: []
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  modelOptions
);

module.exports = mongoose.model("Class", classSchema);
