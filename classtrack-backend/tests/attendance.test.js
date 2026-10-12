process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test_jwt_secret";
process.env.JWT_EXPIRES_IN = "1d";

const request = require("supertest");
const app = require("../src/app");
const { resetTestDatabase, registerAndLoginAdmin, testAdmin } = require("./setupTestDb");

const classPayload = {
  className: "BS Computer Science",
  section: "A",
  teacherId: "teacher-user-id",
  subjects: ["Computer"]
};

const buildStudentPayload = (classId) => ({
  studentId: "STU-001",
  fullName: "Ali Khan",
  email: "ali@example.com",
  phone: "03000000000",
  rollNumber: "01",
  classId,
  section: "A"
});

const setupData = async (token) => {
  const classRes = await request(app)
    .post("/api/classes")
    .set("Authorization", `Bearer ${token}`)
    .send(classPayload);
  
  const classId = classRes.body.class.id;

  const stuRes = await request(app)
    .post("/api/students")
    .set("Authorization", `Bearer ${token}`)
    .send(buildStudentPayload(classId));
    
  return { classId, studentId: stuRes.body.student.id };
};

beforeEach(() => {
  resetTestDatabase();
});

describe("Attendance API", () => {
  it("marks manual attendance successfully and prevents duplicates", async () => {
    const token = await registerAndLoginAdmin(app);
    const { classId, studentId } = await setupData(token);

    const markPayload = {
      studentId,
      classId,
      subject: "Computer",
      status: "present"
    };

    const res1 = await request(app)
      .post("/api/attendance/manual")
      .set("Authorization", `Bearer ${token}`)
      .send(markPayload);

    expect(res1.statusCode).toBe(201);
    expect(res1.body.success).toBe(true);
    expect(res1.body.attendance.status).toBe("present");
    expect(res1.body.attendance.method).toBe("manual");

    const res2 = await request(app)
      .post("/api/attendance/manual")
      .set("Authorization", `Bearer ${token}`)
      .send(markPayload);

    expect(res2.statusCode).toBe(200);
    expect(res2.body.message).toBe("Attendance already marked for this student today");
  });

  it("gets all attendance", async () => {
    const token = await registerAndLoginAdmin(app);
    const { classId, studentId } = await setupData(token);

    await request(app)
      .post("/api/attendance/manual")
      .set("Authorization", `Bearer ${token}`)
      .send({ studentId, classId, subject: "Computer", status: "present" });

    const response = await request(app)
      .get("/api/attendance")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.count).toBe(1);
    expect(response.body.attendance[0].studentId).toBe(studentId);
  });
});
