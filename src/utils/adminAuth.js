const ADMIN_SESSION_KEY = "sqh_admin_authenticated";

export function isAdminAuthenticated() {
  return localStorage.getItem(ADMIN_SESSION_KEY) === "true";
}

export function setAdminAuthenticated(value) {
  if (value) {
    localStorage.setItem(ADMIN_SESSION_KEY, "true");
    return;
  }

  localStorage.removeItem(ADMIN_SESSION_KEY);
}
