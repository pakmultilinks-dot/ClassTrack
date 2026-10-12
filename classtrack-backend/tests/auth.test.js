process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test_jwt_secret";
process.env.JWT_EXPIRES_IN = "1d";

const request = require("supertest");
const app = require("../src/app");
const { resetTestDatabase } = require("./setupTestDb");

const adminUser = {
  fullName: "Admin User",
  email: "admin@classtrack.test",
  password: "123456",
  role: "admin"
};

const registerAdmin = () => {
  return request(app)
    .post("/api/auth/register")
    .send(adminUser);
};

beforeEach(() => {
  resetTestDatabase();
});

describe("Auth API", () => {
  it("POST /api/auth/register creates an admin user", async () => {
    const response = await registerAdmin();

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeDefined();
    expect(response.body.user).toMatchObject({
      fullName: adminUser.fullName,
      email: adminUser.email,
      role: "admin",
      isActive: true
    });
    expect(response.body.user.password).toBeUndefined();
  });

  it("POST /api/auth/login returns a token", async () => {
    await registerAdmin();

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: adminUser.email,
        password: adminUser.password
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeDefined();
    expect(response.body.user.email).toBe(adminUser.email);
  });

  it("GET /api/auth/me works with a token", async () => {
    const registerResponse = await registerAdmin();
    const token = registerResponse.body.token;

    const response = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.user.email).toBe(adminUser.email);
    expect(response.body.user.role).toBe("admin");
  });

  it("GET /api/auth/me fails without a token", async () => {
    const response = await request(app).get("/api/auth/me");

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Not authorized, no token provided");
  });
});
