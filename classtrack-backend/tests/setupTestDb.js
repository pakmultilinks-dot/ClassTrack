const fs = require("fs");
const path = require("path");
const request = require("supertest");

const testDatabasePath = path.join(__dirname, "../data/test-database.json");
const testAdmin = {
  fullName: "Test Admin",
  email: "admin@test.local",
  password: "123456",
  role: "admin"
};

const emptyDatabase = {
  users: [],
  students: [],
  classes: [],
  attendance: []
};

const resetTestDatabase = () => {
  const dataDirectory = path.dirname(testDatabasePath);

  if (!fs.existsSync(dataDirectory)) {
    fs.mkdirSync(dataDirectory, { recursive: true });
  }

  fs.writeFileSync(testDatabasePath, JSON.stringify(emptyDatabase, null, 2));
};

const registerAndLoginAdmin = async (app) => {
  await request(app)
    .post("/api/auth/register")
    .send(testAdmin);

  const loginResponse = await request(app)
    .post("/api/auth/login")
    .send({
      email: testAdmin.email,
      password: testAdmin.password
    });

  return loginResponse.body.token;
};

module.exports = {
  resetTestDatabase,
  registerAndLoginAdmin,
  testAdmin
};
