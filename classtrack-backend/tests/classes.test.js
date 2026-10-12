process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test_jwt_secret";
process.env.JWT_EXPIRES_IN = "1d";

const request = require("supertest");
const app = require("../src/app");
const { resetTestDatabase, registerAndLoginAdmin } = require("./setupTestDb");

const classPayload = {
  className: "BS Computer Science",
  section: "A",
  teacherId: "teacher-user-id",
  subjects: ["English", "Computer", "Math"]
};

const createClass = (token, overrides = {}) => {
  return request(app)
    .post("/api/classes")
    .set("Authorization", `Bearer ${token}`)
    .send({
      ...classPayload,
      ...overrides
    });
};

beforeEach(() => {
  resetTestDatabase();
});

describe("Classes API", () => {
  it("creates a class successfully", async () => {
    const token = await registerAndLoginAdmin(app);
    const response = await createClass(token);

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.class).toMatchObject({
      className: classPayload.className,
      section: classPayload.section,
      teacherId: classPayload.teacherId,
      subjects: classPayload.subjects,
      isActive: true
    });
    expect(response.body.class.id).toBeDefined();
  });

  it("gets all classes", async () => {
    const token = await registerAndLoginAdmin(app);
    await createClass(token);

    const response = await request(app)
      .get("/api/classes")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.count).toBe(1);
    expect(response.body.classes[0].className).toBe(classPayload.className);
  });

  it("gets a class by id", async () => {
    const token = await registerAndLoginAdmin(app);
    const createResponse = await createClass(token);
    const classId = createResponse.body.class.id;

    const response = await request(app)
      .get(`/api/classes/${classId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.class.id).toBe(classId);
  });

  it("updates a class", async () => {
    const token = await registerAndLoginAdmin(app);
    const createResponse = await createClass(token);
    const classId = createResponse.body.class.id;

    const response = await request(app)
      .put(`/api/classes/${classId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        className: "BS Software Engineering",
        subjects: ["Programming", "Databases"]
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.class.className).toBe("BS Software Engineering");
    expect(response.body.class.subjects).toEqual(["Programming", "Databases"]);
  });

  it("soft deletes a class", async () => {
    const token = await registerAndLoginAdmin(app);
    const createResponse = await createClass(token);
    const classId = createResponse.body.class.id;

    const response = await request(app)
      .delete(`/api/classes/${classId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.class.isActive).toBe(false);
  });

  it("fails to create a class without token", async () => {
    const response = await request(app)
      .post("/api/classes")
      .send(classPayload);

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it("fails to create a class with missing required fields", async () => {
    const token = await registerAndLoginAdmin(app);

    const response = await request(app)
      .post("/api/classes")
      .set("Authorization", `Bearer ${token}`)
      .send({
        className: "",
        section: ""
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Class name and section are required");
  });
});
