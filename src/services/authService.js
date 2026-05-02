import API from "./api";

export const login = async (username, password) => {
  const res = await API.post("/auth/login", { username, password });
  localStorage.setItem("token", res.data.token);
  return res.data;
};

export const signup = async (username, password, email) => {
  const res = await API.post("/auth/register", { username, password, email });
  return res.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

export const getToken = () => localStorage.getItem("token");

export const isAuthenticated = () => !!localStorage.getItem("token");
