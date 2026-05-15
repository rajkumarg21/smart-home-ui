import API from "./api";

export const login = async (username, password) => {
  const res = await API.post("/auth/login", { username, password });

  console.log("[authService] Full response:", res.data);

  // Backend wraps in ApiResponse: { message, data: AuthResponse { token, ... } }
  const authData = res.data.data || res.data;
  const token = authData.token || authData.accessToken || authData.jwt;

  console.log("[authService] authData:", authData);
  console.log("[authService] Resolved token:", token);
  console.log("[authService] Email from authData:", authData.email ?? "not present");

  if (token) localStorage.setItem("token", token);
  localStorage.setItem("username", username);
  if (authData.email) localStorage.setItem("email", authData.email);

  return { ...authData, token };
};

export const signup = async (username, password, email) => {
  const res = await API.post("/auth/register", { username, password, email });
  console.log("[authService] Signup response:", res.data);
  return res.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("email");
  window.location.href = "/login";
};

export const getToken = () => localStorage.getItem("token");

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token && token !== "undefined" && token !== "null";
};
