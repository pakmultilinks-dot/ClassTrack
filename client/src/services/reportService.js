import api from "./api";

export const getSummaryReport = async () => {
  const response = await api.get("/reports/summary");
  return response.data;
};

export const getStudentReport = async (studentId) => {
  const response = await api.get(`/reports/student/${studentId}`);
  return response.data;
};

export const getClassReport = async (classId) => {
  const response = await api.get(`/reports/class/${classId}`);
  return response.data;
};

export const getLowAttendanceReport = async (below = 75) => {
  const response = await api.get(`/reports/low-attendance?below=${below}`);
  return response.data;
};
