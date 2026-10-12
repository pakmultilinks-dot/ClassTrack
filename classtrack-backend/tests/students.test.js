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
  subjects: ["Computer"]
};

const buildStudentPayload = (classId, overrides = {}) => ({
  studentId: "STU-001",
  fullName: "Ali Khan",
  email: "ali@example.com",
  phone: "03000000000",
  rollNumber: "01",
  classId,
  section: "A",
  ...overrides
});

const createClass = async (token) => {
  const response = await request(app)
    .post("/api/classes")
    .set("Authorization", `Bearer ${token}`)
    .send(classPayload);

  return response.body.class;
};

const createStudent = (token, classId, overrides = {}) => {
  return request(app)
    .post("/api/students")
    .set("Authorization", `Bearer ${token}`)
    .send(buildStudentPayload(classId, overrides));
};

beforeEach(() => {
  resetTestDatabase();
});

describe("Students API", () => {
  it("creates a student successfully", async () => {
    const token = await registerAndLoginAdmin(app);
    const classItem = await createClass(token);
    const response = await createStudent(token, classItem.id);

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.student).toMatchObject({
      studentId: "STU-001",
      fullName: "Ali Khan",
      rollNumber: "01",
      classId: classItem.id,
      faceRegistered: false,
      isActive: true
    });
    expect(response.body.student.id).toBeDefined();
  });

  it("gets all students", async () => {
    const token = await registerAndLoginAdmin(app);
    const classItem = await createClass(token);
    await createStudent(token, classItem.id);

    const response = await request(app)
      .get("/api/students")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.count).toBe(1);
    expect(response.body.students[0].studentId).toBe("STU-001");
  });

  it("gets a student by id", async () => {
    const token = await registerAndLoginAdmin(app);
    const classItem = await createClass(token);
    const createResponse = await createStudent(token, classItem.id);
    const studentId = createResponse.body.student.id;

    const response = await request(app)
      .get(`/api/students/${studentId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.student.id).toBe(studentId);
  });

  it("updates a student", async () => {
    const token = await registerAndLoginAdmin(app);
    const classItem = await createClass(token);
    const createResponse = await createStudent(token, classItem.id);
    const studentId = createResponse.body.student.id;

    const response = await request(app)
      .put(`/api/students/${studentId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        fullName: "Ali Raza",
        phone: "03111111111"
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.student.fullName).toBe("Ali Raza");
    expect(response.body.student.phone).toBe("03111111111");
  });

  it("soft deletes a student", async () => {
    const token = await registerAndLoginAdmin(app);
    const classItem = await createClass(token);
    const createResponse = await createStudent(token, classItem.id);
    const studentId = createResponse.body.student.id;

    const response = await request(app)
      .delete(`/api/students/${studentId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.student.isActive).toBe(false);
  });

  it("fails duplicate studentId", async () => {
    const token = await registerAndLoginAdmin(app);
    const classItem = await createClass(token);
    await createStudent(token, classItem.id);

    const response = await createStudent(token, classItem.id, {
      rollNumber: "02"
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Student id already exists");
  });

  it("fails duplicate rollNumber in the same class", async () => {
    const token = await registerAndLoginAdmin(app);
    const classItem = await createClass(token);
    await createStudent(token, classItem.id);

    const response = await createStudent(token, classItem.id, {
      studentId: "STU-002",
      email: "sara@example.com"
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Roll number already exists in this class");
  });

  it("fails to create a student with invalid classId", async () => {
    const token = await registerAndLoginAdmin(app);

    const response = await createStudent(token, "missing-class-id");

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Class not found");
  });

  it("fails to create a student without token", async () => {
    const response = await request(app)
      .post("/api/students")
      .send(buildStudentPayload("class-id"));

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
  });
});
