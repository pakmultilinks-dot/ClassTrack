import * as XLSX from "xlsx";

const safeFileName = (value) => {
  return String(value || "report")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

const saveWorkbook = (sheets, fileName) => {
  const workbook = XLSX.utils.book_new();

  sheets.forEach(({ data, name }) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, name.slice(0, 31));
  });

  XLSX.writeFile(workbook, fileName);
};

export const exportStudentReportExcel = (studentReport = {}) => {
  const student = studentReport.student || {};
  const summary = [{
    "Student Name": student.fullName || "-",
    "Student ID": student.studentId || "-",
    Email: student.email || "-",
    "Roll Number": student.rollNumber || "-",
    Section: student.section || "-",
    "Total Marked": studentReport.totalClassesMarked ?? 0,
    Present: studentReport.presentCount ?? 0,
    Absent: studentReport.absentCount ?? 0,
    Late: studentReport.lateCount ?? 0,
    "Attendance Percentage": `${studentReport.attendancePercentage ?? 0}%`
  }];
  const records = (studentReport.records || []).map((record) => ({
    Date: record.date || "-",
    Class: record.className || "-",
    Subject: record.subject || "-",
    Status: record.status || "-",
    Method: record.method || "-",
    Confidence: typeof record.confidence === "number" ? `${record.confidence}%` : "-"
  }));

  saveWorkbook(
    [
      { name: "Summary", data: summary },
      { name: "Records", data: records.length ? records : [{ Message: "No attendance records" }] }
    ],
    `classtrack-student-${safeFileName(student.studentId || student.fullName)}.xlsx`
  );
};

export const exportClassReportExcel = (classReport = {}) => {
  const classInfo = classReport.class || {};
  const summary = [{
    "Class Name": classInfo.className || "-",
    Section: classInfo.section || "-",
    "Teacher ID": classInfo.teacherId || "-",
    Subjects: (classInfo.subjects || []).join(", ") || "-",
    "Total Students": classReport.totalStudents ?? 0,
    "Attendance Records": (classReport.records || []).length
  }];
  const studentWise = (classReport.studentWisePercentage || []).map((student) => ({
    Student: student.fullName || "-",
    Code: student.studentCode || "-",
    Roll: student.rollNumber || "-",
    Marked: student.totalClassesMarked ?? 0,
    Present: student.presentCount ?? 0,
    Absent: student.absentCount ?? 0,
    Late: student.lateCount ?? 0,
    Percentage: `${student.attendancePercentage ?? 0}%`
  }));
  const records = (classReport.records || []).map((record) => ({
    Date: record.date || "-",
    Student: record.studentName || "-",
    Code: record.studentCode || "-",
    Subject: record.subject || "-",
    Status: record.status || "-",
    Method: record.method || "-",
    Confidence: typeof record.confidence === "number" ? `${record.confidence}%` : "-"
  }));

  saveWorkbook(
    [
      { name: "Summary", data: summary },
      { name: "Student Percentages", data: studentWise.length ? studentWise : [{ Message: "No student percentage data" }] },
      { name: "Records", data: records.length ? records : [{ Message: "No attendance records" }] }
    ],
    `classtrack-class-${safeFileName(classInfo.className)}-${safeFileName(classInfo.section)}.xlsx`
  );
};

export const exportAllAttendanceExcel = (records = []) => {
  const rows = records.map((record) => ({
    Date: record.date || "-",
    Student: record.studentName || "-",
    "Student Code": record.studentCode || "-",
    Class: record.className || "-",
    Section: record.section || "-",
    Subject: record.subject || "-",
    Status: record.status || "-",
    Method: record.method || "-",
    Confidence: typeof record.confidence === "number" ? `${record.confidence}%` : "-",
    "Created At": record.createdAt || "-"
  }));

  saveWorkbook(
    [{ name: "Attendance Records", data: rows.length ? rows : [{ Message: "No attendance records" }] }],
    "classtrack-all-attendance.xlsx"
  );
};
