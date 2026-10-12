import api from "./api";

export const registerFace = async (studentId, descriptor) => {
  const response = await api.post(`/face/register/${studentId}`, { descriptor });
  return response.data;
};

export const getFaceStatus = async (studentId) => {
  const response = await api.get(`/face/status/${studentId}`);
  return response.data;
};

export const removeFaceData = async (studentId) => {
  const response = await api.delete(`/face/remove/${studentId}`);
  return response.data;
};
