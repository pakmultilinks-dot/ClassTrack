const { initDb, flushBlob } = require("../src/config/fileDb");
const app = require("../src/app");

let initialized = false;

/**
 * Vercel serverless entry point.
 * Initializes the database (downloads from Blob on cold start),
 * then delegates to the Express app.
 * Waits for Blob uploads to complete before returning.
 */
module.exports = async (req, res) => {
  if (!initialized) {
    await initDb();
    initialized = true;
  }

  await new Promise((resolve) => {
    res.on("finish", resolve);
    res.on("close", resolve);
    app(req, res);
  });

  await flushBlob();
};
