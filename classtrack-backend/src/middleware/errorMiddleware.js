const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  if (err.message && err.message.includes("buffering timed out")) {
    return res.status(503).json({
      success: false,
      message: "Database connection timeout. Ensure backend is running in local JSON DB mode or MongoDB is connected."
    });
  }

  if (err.code === 11000) {
    const duplicateField = Object.keys(err.keyValue || {})[0] || "field";

    return res.status(400).json({
      success: false,
      message: `${duplicateField} already exists`
    });
  }

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors || {}).map((val) => val.message);
    return res.status(400).json({
      success: false,
      message: `Validation Error: ${messages.join(", ")}`
    });
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || "An unexpected server error occurred"
  });
};

module.exports = {
  notFound,
  errorHandler
};
