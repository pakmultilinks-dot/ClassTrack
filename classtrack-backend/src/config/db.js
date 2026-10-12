const mongoose = require("mongoose");

mongoose.set("bufferCommands", false);

const connectDB = async () => {
  if (process.env.NODE_ENV === "test") {
    console.log("Running in local file DB mode, bypassing MongoDB connection.");
    return;
  }

  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.log("MONGO_URI missing from environment. Operating in local JSON DB mode.");
    return;
  }

  try {
    const connection = await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.warn(`MongoDB connection failed: ${error.message}. Defaulting to local JSON DB mode.`);
  }
};

module.exports = connectDB;
