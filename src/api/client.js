// Single API client. Every network call in the app goes through here.
// Mock mode (default in dev) is for UI work only; the real backend must be the
// source of truth for auth, roles, orders, prices and payments.
//   VITE_USE_MOCK=false  -> talk to a real server
//   VITE_API_URL=https://api.example.com  (default "/api")

const BASE = import.meta.env.VITE_API_URL || "/api";
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";

export class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

async function request(method, path, body) {
  if (USE_MOCK) {
    const { mockHandle } = await import("./mockServer.js");
    return mockHandle(method, path, body);
  }

  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      credentials: "include", // httpOnly session cookie set by the server
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, "Network error. Check your connection and retry.");
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    /* empty body */
  }

  if (!res.ok) {
    if (res.status === 401) window.dispatchEvent(new Event("auth:unauthorized"));
    throw new ApiError(
      res.status,
      data?.message || "Something went wrong. Please try again.",
      data?.details
    );
  }
  return data;
}

export const api = {
  get: (p) => request("GET", p),
  post: (p, b) => request("POST", p, b ?? {}),
  put: (p, b) => request("PUT", p, b ?? {}),
  patch: (p, b) => request("PATCH", p, b ?? {}),
  del: (p) => request("DELETE", p),
};

