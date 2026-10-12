process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test_jwt_secret";

const request = require("supertest");
const app = require("../src/app");
const { resetTestDatabase } = require("./setupTestDb");

beforeEach(() => {
  resetTestDatabase();
});

describe("Health API", () => {
  it("GET /api/health returns success true", async () => {
    const response = await request(app).get("/api/health");

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("ClassTrack backend is running");
  });
});
