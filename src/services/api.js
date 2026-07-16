const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const AUTH_TOKEN_KEY = "sqh_admin_token";

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
}

export function removeAuthToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

function buildUrl(path) {
  const base = API_BASE_URL.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

export async function request(path, options = {}) {
  const url = buildUrl(path);
  const token = getAuthToken();

  const headers = { ...(options.headers || {}) };

  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  const isFormData = options.body instanceof FormData;
  if (!isFormData && !headers["Content-Type"] && options.body) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      typeof data === "object" && data?.message
        ? data.message
        : `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  get: (path, options = {}) => request(path, { ...options, method: "GET" }),
  post: (path, body, options = {}) =>
    request(path, {
      ...options,
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  patch: (path, body, options = {}) =>
    request(path, {
      ...options,
      method: "PATCH",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  delete: (path, options = {}) =>
    request(path, { ...options, method: "DELETE" }),
};

export function centsToDollars(cents) {
  if (typeof cents !== "number" || Number.isNaN(cents)) return 0;
  return cents / 100;
}

const CURRENCY_LOCALES = {
  NGN: "en-NG",
  USD: "en-US",
};

// `cents` is always the NGN base price. Pass `ngnPerUsd` to display in USD.
export function formatPriceCents(cents, currency = "NGN", ngnPerUsd = null) {
  const ngn = centsToDollars(cents);
  const amount = currency === "USD" && ngnPerUsd ? ngn / ngnPerUsd : ngn;
  const displayCurrency = currency === "USD" && ngnPerUsd ? "USD" : "NGN";

  return new Intl.NumberFormat(CURRENCY_LOCALES[displayCurrency], {
    style: "currency",
    currency: displayCurrency,
  }).format(amount);
}

export function dollarsToCents(dollars) {
  const value = typeof dollars === "string" ? parseFloat(dollars) : dollars;
  if (Number.isNaN(value)) return 0;
  return Math.round(value * 100);
}