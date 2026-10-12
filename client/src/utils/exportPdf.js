import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const brand = {
  primary: [91, 91, 247],
  dark: [5, 8, 22],
  muted: [100, 116, 139]
};

const formatDateTime = () => new Date().toLocaleString();

const safeFileName = (value) => {
  return String(value || "report")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

const createDocument = (reportType) => {
  const doc = new jsPDF();
  doc.setTextColor(...brand.dark);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("ClassTrack", 14, 18);
  doc.setTextColor(...brand.primary);
  doc.setFontSize(13);
  doc.text(reportType, 14, 27);
  doc.setTextColor(...brand.muted);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Generated: ${formatDateTime()}`, 14, 34);
  return doc;
};

const addFooter = (doc) => {
  const pageCount = doc.internal.getNumberOfPages();

  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page);
    doc.setFontSize(8);
    doc.setTextColor(...brand.muted);
    doc.text("ClassTrack Attendance Management System", 14, 286);
    doc.text(`Page ${page} of ${pageCount}`, 180, 286);
  }
};

const addInfoTable = (doc, rows, startY = 42) => {
  autoTable(doc, {
    body: rows,
    startY,
    styles: { fontSize: 9, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: "bold", textColor: brand.dark, fillColor: [245, 247, 255] },
      1: { textColor: brand.dark }
    },
    theme: "grid"
  });

  return doc.lastAutoTable.finalY + 8;
};

const addRecordsTable = (doc, title, head, body, startY) => {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...brand.dark);
  doc.text(title, 14, startY);

  autoTable(doc, {
    head: [head],
    body,
    startY: startY + 5,
    headStyles: { fillColor: brand.primary, textColor: [255, 255, 255] },
    styles: { fontSize: 8, cellPadding: 2.5 },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    theme: "striped"
  });
};

export const exportSummaryReportPdf = (summary = {}) => {
  const doc = createDocument("Summary Report");
  const startY = addInfoTable(doc, [
    ["Total Students", summary.totalStudents ?? 0],
    ["Total Classes", summary.totalClasses ?? 0],
    ["Attendance Records", summary.totalAttendanceRecords ?? 0],
    ["Present", summary.totalPresent ?? 0],
    ["Absent", summary.totalAbsent ?? 0],
    ["Late", summary.totalLate ?? 0],
    ["Today Attendance Count", summary.todayAttendanceCount ?? 0]
  ]);

  addRecordsTable(
    doc,
    "Attendance Summary",
    ["Metric", "Value"],
    [
      ["Present", summary.totalPresent ?? 0],
      ["Absent", summary.totalAbsent ?? 0],
      ["Late", summary.totalLate ?? 0],
      ["Today", summary.todayAttendanceCount ?? 0]
    ],
    startY
  );
  addFooter(doc);
  doc.save("classtrack-summary-report.pdf");
};

export const exportStudentReportPdf = (studentReport = {}) => {
  const student = studentReport.student || {};
  const doc = createDocument("Student Attendance Report");
  const startY = addInfoTable(doc, [
    ["Student Name", student.fullName || "-"],
    ["Student ID", student.studentId || "-"],
    ["Email", student.email || "-"],
    ["Roll Number", student.rollNumber || "-"],
    ["Section", student.section || "-"],
    ["Attendance Percentage", `${studentReport.attendancePercentage ?? 0}%`],
    ["Present / Absent / Late", `${studentReport.presentCount ?? 0} / ${studentReport.absentCount ?? 0} / ${studentReport.lateCount ?? 0}`]
  ]);

  addRecordsTable(
    doc,
    "Attendance Records",
    ["Date", "Class", "Subject", "Status", "Method", "Confidence"],
    (studentReport.records || []).map((record) => [
      record.date || "-",
      record.className || "-",
      record.subject || "-",
      record.status || "-",
      record.method || "-",
      typeof record.confidence === "number" ? `${record.confidence}%` : "-"
    ]),
    startY
  );
  addFooter(doc);
  doc.save(`classtrack-student-${safeFileName(student.studentId || student.fullName)}.pdf`);
};

export const exportClassReportPdf = (classReport = {}) => {
  const classInfo = classReport.class || {};
  const doc = createDocument("Class Attendance Report");
  const startY = addInfoTable(doc, [
    ["Class Name", classInfo.className || "-"],
    ["Section", classInfo.section || "-"],
    ["Teacher ID", classInfo.teacherId || "-"],
    ["Subjects", (classInfo.subjects || []).join(", ") || "-"],
    ["Total Students", classReport.totalStudents ?? 0],
    ["Attendance Records", (classReport.records || []).length]
  ]);

  addRecordsTable(
    doc,
    "Student-Wise Attendance",
    ["Student", "Code", "Roll", "Marked", "Present", "Absent", "Late", "Percent"],
    (classReport.studentWisePercentage || []).map((student) => [
      student.fullName || "-",
      student.studentCode || "-",
      student.rollNumber || "-",
      student.totalClassesMarked ?? 0,
      student.presentCount ?? 0,
      student.absentCount ?? 0,
      student.lateCount ?? 0,
      `${student.attendancePercentage ?? 0}%`
    ]),
    startY
  );
  addFooter(doc);
  doc.save(`classtrack-class-${safeFileName(classInfo.className)}-${safeFileName(classInfo.section)}.pdf`);
};
