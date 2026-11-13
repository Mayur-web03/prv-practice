// DEV/DEMO ONLY. localStorage here stands in for the real database.
// The real backend must replace this and re-check every rule server-side.
import { ApiError } from "./client";
import { validateLines } from "../utils/validateOrder";

const KEY = "prv_mock_orders_v1";
const read = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
};
const write = (list) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* storage full or blocked */
  }
};
const now = () => new Date().toISOString();
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : `o_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);
const makeRef = () =>
  `PRV-${now().slice(0, 10).replaceAll("-", "")}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
const str = (v, max) => String(v ?? "").slice(0, max);

function cleanItems(items) {
  if (!Array.isArray(items)) return [];
  return items.slice(0, 200).map((i) => ({
    id: str(i.id, 64),
    sourceText: str(i.sourceText, 300),
    name: str(i.name, 200),
    matchName: str(i.matchName, 200),
    sku: str(i.sku, 60),
    quantity: i.quantity === "" ? "" : Number(i.quantity),
    unit: str(i.unit, 20),
    note: str(i.note, 300),
    confidence: Number(i.confidence) || 0,
    needsReview: !!i.needsReview,
    confirmed: !!i.confirmed,
    source: str(i.source, 20),
  }));
}

function applyBody(order, body) {
  order.inputType = str(body.inputType, 10) || "typed";
  order.rawText = str(body.rawText, 5000);
  order.items = cleanItems(body.items);
  order.notes = str(body.notes, 1000);
  order.poRef = str(body.poRef, 100);
  order.deliveryAddress = str(body.deliveryAddress, 500);
  order.attachmentName = body.attachmentName ? str(body.attachmentName, 200) : null;
  order.updatedAt = now();
}

const summary = (o) => ({
  id: o.id,
  reference: o.reference,
  status: o.status,
  inputType: o.inputType,
  itemCount: o.items.length,
  createdAt: o.createdAt,
  submittedAt: o.submittedAt,
  updatedAt: o.updatedAt,
});

export async function handleOrders(method, rawPath, body) {
  const [path, query] = rawPath.split("?");
  let m;

  if (method === "POST" && path === "/dealer/orders/extract") {
    throw new ApiError(
      501,
      "Reading images is not switched on yet. Please type the items from your image into the box above, or add rows manually."
    );
  }

  if (method === "GET" && path === "/dealer/orders") {
    const status = new URLSearchParams(query || "").get("status");
    const list = read()
      .filter((o) => !status || o.status === status)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    return { orders: list.map(summary) };
  }

  if (method === "POST" && path === "/dealer/orders") {
    const order = {
      id: uid(),
      reference: null,
      status: "draft",
      createdAt: now(),
      submittedAt: null,
      history: [{ status: "draft", at: now(), note: "Draft created" }],
      clarification: null,
    };
    applyBody(order, body || {});
    const list = read();
    list.push(order);
    write(list);
    return { order };
  }

  if ((m = path.match(/^\/dealer\/orders\/([^/]+)\/submit$/)) && method === "POST") {
    const list = read();
    const order = list.find((o) => o.id === m[1]);
    if (!order) throw new ApiError(404, "Order not found.");
    if (order.status !== "draft") throw new ApiError(409, "This order has already been submitted.");
    const errors = validateLines(order.items);
    if (!order.deliveryAddress.trim()) errors.push("Enter a delivery address.");
    if (errors.length) throw new ApiError(422, "Please fix the issues below.", errors);
    order.status = "pending_approval";
    order.reference = makeRef();
    order.submittedAt = now();
    order.updatedAt = now();
    order.history.push({ status: "pending_approval", at: now(), note: "Submitted by you" });
    write(list);
    return { order };
  }

  if ((m = path.match(/^\/dealer\/orders\/([^/]+)\/respond$/)) && method === "POST") {
    const list = read();
    const order = list.find((o) => o.id === m[1]);
    if (!order) throw new ApiError(404, "Order not found.");
    if (order.status !== "needs_clarification") throw new ApiError(409, "This order is not waiting for a reply.");
    const message = str(body?.message, 1000).trim();
    if (!message) throw new ApiError(422, "Write a reply first.");
    order.status = "pending_approval";
    order.updatedAt = now();
    order.history.push({ status: "pending_approval", at: now(), note: `You replied: ${message}` });
    write(list);
    return { order };
  }

  if ((m = path.match(/^\/dealer\/orders\/([^/]+)$/))) {
    const list = read();
    const order = list.find((o) => o.id === m[1]);
    if (!order) throw new ApiError(404, "Order not found.");
    if (method === "GET") return { order };
    if (method === "PUT") {
      if (order.status !== "draft") throw new ApiError(409, "Only drafts can be edited.");
      applyBody(order, body || {});
      write(list);
      return { order };
    }
  }

  return undefined; // not an orders route: let the rest of the mock handle it
}
