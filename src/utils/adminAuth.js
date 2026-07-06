import { api, setAuthToken, removeAuthToken, getAuthToken } from "../services/api";

const ADMIN_SESSION_KEY = "sqh_admin_authenticated";

export function isAdminAuthenticated() {
  return localStorage.getItem(ADMIN_SESSION_KEY) === "true" && Boolean(getAuthToken());
}

export function setAdminAuthenticated(value) {
  if (value) {
    localStorage.setItem(ADMIN_SESSION_KEY, "true");
    return;
  }

  localStorage.removeItem(ADMIN_SESSION_KEY);
  removeAuthToken();
}

export async function loginAdmin(email, password) {
  const response = await api.post("/admin/auth/login", { email, password });
  const { accessToken, admin } = response.data || {};

  if (!accessToken) {
    throw new Error("Login response did not include an access token.");
  }

  setAuthToken(accessToken);
  setAdminAuthenticated(true);

  return admin;
}

export async function fetchAdminProfile() {
  const response = await api.get("/admin/auth/me");
  return response.data;
}

export async function logoutAdmin() {
  try {
    await api.post("/admin/auth/logout", {});
  } catch {
    // Ignore logout API errors; still clear local session.
  } finally {
    setAdminAuthenticated(false);
  }
}
