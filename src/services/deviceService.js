import API from "./api";

export const getDevices = () => API.get("/device/list");

export const controlDevice = (deviceId, action) =>
  API.put("/device/control", { deviceId, action });

export const getDeviceAnalytics = (deviceId) =>
  API.get(`/analytics/device/${deviceId}`);

export const addDevice = (deviceData) => API.post("/device/add", deviceData);

export const deleteDevice = (deviceId) =>
  API.delete(`/device/delete/${deviceId}`);
