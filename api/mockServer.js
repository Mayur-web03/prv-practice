// DEV-ONLY mock backend. Replace with a real server before any real data.
import { ApiError } from "./client.js";

const USERS = [
  { id: "u1", email: "dealer@prv.test", password: "dealer123", name: "Sharma Sanitary", role: "dealer", dealerId: "d1", company: "Sharma Sanitary Traders" },
  { id: "u2", email: "admin@prv.test", password: "admin123", name: "Super Admin", role: "super_admin" },
  { id: "u3", email: "orders@prv.test", password: "orders123", name: "Order Manager", role: "order_manager" },
  { id: "u4", email: "accounts@prv.test", password: "accounts123", name: "Accounts", role: "accounts" },
];

const KEY = "prv_mock_session";
const wait = (ms = 300) => new Promise((r) => setTimeout(r, ms));
const publicUser = ({ password, ...u }) => u;

const getSession = () => {
  try {
    const id = sessionStorage.getItem(KEY);
    return USERS.find((u) => u.id === id) || null;
  } catch {
    return null;
  }
};

export async function mockHandle(method, path, body) {
  await wait();
  const user = getSession();

  if (method === "POST" && path === "/auth/login") {
    const found = USERS.find(
      (u) => u.email === String(body.email).trim().toLowerCase() && u.password === body.password
    );
    if (!found) throw new ApiError(401, "Incorrect email or password.");
    // Area check mirrors what the real server must enforce.
    const isAdmin = found.role !== "dealer";
    if (body.area === "admin" && !isAdmin) throw new ApiError(403, "This account is not a staff account.");
    if (body.area === "dealer" && isAdmin) throw new ApiError(403, "Please use the staff login.");
    sessionStorage.setItem(KEY, found.id);
    return { user: publicUser(found) };
  }

  if (method === "GET" && path === "/auth/me") {
    if (!user) throw new ApiError(401, "Not signed in.");
    return { user: publicUser(user) };
  }

  if (method === "POST" && path === "/auth/logout") {
    sessionStorage.removeItem(KEY);
    return { ok: true };
  }

  if (!user) throw new ApiError(401, "Not signed in.");

  if (method === "GET" && path === "/dealer/summary") {
    if (user.role !== "dealer") throw new ApiError(403, "Forbidden.");
    // Placeholder zeros: real counts come from the database in Phase 3-5.
    return { outstanding: 0, nextDueDate: null, ordersThisMonth: 0, pendingApproval: 0, processing: 0, dispatched: 0 };
  }

  if (method === "GET" && path === "/admin/summary") {
    if (user.role === "dealer") throw new ApiError(403, "Forbidden.");
    return { newToday: 0, pendingApproval: 0, needsClarification: 0, approved: 0, processing: 0, readyForDispatch: 0, dispatchedToday: 0, overdueInvoices: 0 };
  }

  throw new ApiError(404, "Not found.");
}

