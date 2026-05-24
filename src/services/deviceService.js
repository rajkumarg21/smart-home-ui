import API from "./api";

export const getDevices = () => API.get("/device/list");

export const controlDevice = (deviceId, action) =>
  API.put("/device/control", { deviceId, action });

export const aiControlDevice = (command) =>
  API.post("/ai/device-command", { command });

export const reportDeviceStatus = (deviceId, status) =>
  API.put("/device/status", { deviceId, status });

export const getDeviceAnalytics = (deviceId) =>
  API.get(`/analytics/device/${deviceId}`);

export const addDevice = (deviceData) => API.post("/device/add", deviceData);

export const updateDevice = (deviceId, deviceData) =>
  API.put(`/device/update/${deviceId}`, deviceData);

export const deleteDevice = (deviceId) =>
  API.delete(`/device/delete/${deviceId}`);

// ── AI Predictive Automation ──────────────────────────────────────────────────
export const getPredictions = () => API.get("/predictions");

export const applyPrediction = (deviceId, action) =>
  API.post("/predictions/apply", { deviceId, action });

// ── Smart Energy Optimization Engine ─────────────────────────────────────────
export const getEnergyReport = (period = "TODAY", tariff = null) => {
  const params = { period };
  if (tariff) params.tariff = tariff;
  return API.get("/energy/report", { params });
};
