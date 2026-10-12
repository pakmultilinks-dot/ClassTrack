const getHealthStatus = (req, res) => {
  res.status(200).json({
    success: true,
    message: "ClassTrack backend is running",
    app: "ClassTrack",
    phase: "Backend Phase 1",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  getHealthStatus
};
