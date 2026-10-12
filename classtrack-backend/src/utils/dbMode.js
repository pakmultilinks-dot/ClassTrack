const mongoose = require("mongoose");

/**
 * Returns true when the app should use the local JSON file database
 * instead of MongoDB. This happens when:
 * - Running tests (NODE_ENV === "test"), or
 * - MongoDB is not connected (no MONGO_URI set, or connection failed)
 *
 * This lets ClassTrack run with zero database setup: no MongoDB
 * account, no connection string, no config. Data persists to a
 * local JSON file (or Vercel Blob in serverless mode).
 */
const isFileDbMode = () => {
  return process.env.NODE_ENV === "test" || mongoose.connection.readyState !== 1;
};

module.exports = { isFileDbMode };
