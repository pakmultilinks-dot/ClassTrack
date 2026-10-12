const { initDb } = require("../src/config/fileDb");
const app = require("../src/app");

let initialized = false;

/**
 * Vercel serverless entry point.
 * Initializes the database (downloads from Blob on cold start),
 * then delegates to the Express app.
 */
module.exports = async (req, res) => {
  if (!initialized) {
    await initDb();
    initialized = true;
  }
  return app(req, res);
};
