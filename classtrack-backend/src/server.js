
const connectDB = require("./config/db");
const app = require("./app");

const PORT = process.env.PORT || 5000;


const startServer = async () => {
  if (process.env.NODE_ENV === "production" || process.env.USE_MONGO === "true") {
    await connectDB();
  }

  app.listen(PORT, () => {
    console.log(`ClassTrack backend server is running on port ${PORT}`);
  });
};

startServer();
