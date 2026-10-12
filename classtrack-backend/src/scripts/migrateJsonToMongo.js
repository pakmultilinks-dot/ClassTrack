const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");
const Student = require("../models/Student");
const ClassModel = require("../models/Class");
const Attendance = require("../models/Attendance");

dotenv.config();

const databasePath = path.join(__dirname, "../../data/database.json");

const readJsonDatabase = () => {
  if (!fs.existsSync(databasePath)) {
    throw new Error(`JSON database not found at ${databasePath}`);
  }

  return JSON.parse(fs.readFileSync(databasePath, "utf8"));
};

const upsertCollection = async (Model, documents, collectionName) => {
  if (!Array.isArray(documents) || documents.length === 0) {
    console.log(`No ${collectionName} records to migrate`);
    return;
  }

  const operations = documents.map((document) => ({
    updateOne: {
      filter: { id: document.id },
      update: { $set: document },
      upsert: true
    }
  }));

  const result = await Model.bulkWrite(operations);
  console.log(
    `${collectionName}: ${result.upsertedCount} inserted, ${result.modifiedCount} updated`
  );
};

const migrateJsonToMongo = async () => {
  try {
    await connectDB();
    const data = readJsonDatabase();

    await upsertCollection(User, data.users, "users");
    await upsertCollection(ClassModel, data.classes, "classes");
    await upsertCollection(Student, data.students, "students");
    await upsertCollection(Attendance, data.attendance, "attendance");

    console.log("JSON to MongoDB migration completed successfully");
  } catch (error) {
    console.error(`Migration failed: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

migrateJsonToMongo();
