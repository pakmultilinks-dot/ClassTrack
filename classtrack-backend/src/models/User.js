const { randomUUID } = require("crypto");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const modelOptions = require("./modelOptions");

const userSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: randomUUID,
      unique: true,
      index: true
    },
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    role: {
      type: String,
      enum: ["admin", "teacher", "student"],
      default: "student"
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  modelOptions
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  return next();
});

userSchema.methods.matchPassword = function matchPassword(enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.index({ email: 1 });

module.exports = mongoose.model("User", userSchema);
