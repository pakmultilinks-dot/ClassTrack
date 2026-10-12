import api from "./api";

export const scanFaceAttendance = async (data) => {
  const response = await api.post("/attendance/scan-face", data);
  return response.data;
};

export const markManualAttendance = async (data) => {
  const response = await api.post("/attendance/manual", data);
  return response.data;
};

export const getAllAttendance = async () => {
  const response = await api.get("/attendance");
  return response.data;
};

export const getStudentAttendance = async (studentId) => {
  const response = await api.get(`/attendance/student/${studentId}`);
  return response.data;
};

export const getClassAttendance = async (classId) => {
  const response = await api.get(`/attendance/class/${classId}`);
  return response.data;
};

export const bulkMarkAttendance = async (data) => {
  const response = await api.post("/attendance/bulk", data);
  return response.data;
};
