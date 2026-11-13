import products from "../data/product";

export const UNITS = ["pcs", "set", "box", "pair", "carton", "dozen"];

const UNIT_MAP = {
  piece: "pcs", pieces: "pcs", pc: "pcs", pcs: "pcs", nos: "pcs", no: "pcs", unit: "pcs", units: "pcs",
  set: "set", sets: "set", box: "box", boxes: "box", pair: "pair", pairs: "pair",
  carton: "carton", cartons: "carton", ctn: "carton", dozen: "dozen", doz: "dozen",
};

const UNIT_RE = "pieces|piece|pcs|pc|nos|no|units|unit|sets|set|boxes|box|pairs|pair|cartons|carton|ctn|dozen|doz";
const NUM = "(\\d+(?:\\.\\d+)?)";

// "20 pcs angle valve", "2 sets of taps"
const LEAD_UNIT = new RegExp(`^${NUM}\\s*(?:x\\s+|×\\s*)?(${UNIT_RE})\\b\\.?\\s*(?:of\\s+)?(.+)$`, "i");
// "5 x tap", "5x tap"
const LEAD_X = new RegExp(`^${NUM}\\s*(?:x\\s+|×\\s*)(.+)$`, "i");
// "angle valve 20 pcs", "angle valve - 20", "health faucet x 10"
const TRAIL = new RegExp(`^(.+?)(\\s+[x×]\\s*|\\s*[-:–@]\\s*|\\s+)${NUM}\\s*(?:(${UNIT_RE})\\b\\.?)?\\s*$`, "i");
// "20 angle valve" (bare number first; not a size like 15mm)
const LEAD_BARE = new RegExp(`^${NUM}\\s+(?!(?:mm|cm|inch|inches|in|ft)\\b)(.+)$`, "i");
const UNIT_ONLY = new RegExp(`^(?:${UNIT_RE})$`, "i");

const uid = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `r_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const clean = (s) => String(s || "").replace(/^[\s\-–:•*.]+|[\s\-–:,]+$/g, "").replace(/\s+/g, " ");

const tokens = (s) =>
  String(s).toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);

// Suggestion only. The dealer confirms or changes it.
export function suggestMatch(name) {
  const a = tokens(name);
  if (!a.length) return "";
  let best = { score: 0, name: "" };
  for (const p of products) {
    const b = tokens(p.name);
    if (!b.length) continue;
    const common = a.filter((t) => b.includes(t)).length;
    const score = common / Math.max(a.length, b.length);
    if (score > best.score) best = { score, name: p.name };
  }
  return best.score >= 0.6 ? best.name : "";
}

export function newRow(p = {}) {
  return {
    id: uid(),
    sourceText: "",
    name: "",
    matchName: "",
    sku: "",
    quantity: "",
    unit: "pcs",
    note: "",
    confidence: 1,
    needsReview: false,
    confirmed: false,
    source: "manual",
    ...p,
  };
}

function build(name, qty, unit, conf) {
  const q = qty === "" ? "" : Number(qty);
  let c = conf;
  // Odd quantities are exactly what OCR/typing gets wrong, so never trust them.
  if (q !== "" && (!Number.isInteger(q) || q <= 0 || q > 5000)) c = Math.min(c, 0.5);
  return {
    name: clean(name),
    quantity: q,
    unit: UNIT_MAP[String(unit || "").toLowerCase()] || "pcs",
    confidence: c,
  };
}

function parseLine(line) {
  let m;
  if ((m = line.match(LEAD_UNIT))) return build(m[3], m[1], m[2], 0.92);
  if ((m = line.match(LEAD_X))) return build(m[2], m[1], "", 0.88);
  if ((m = line.match(TRAIL))) {
    const explicitSep = m[2].trim() !== "";
    const conf = m[4] ? 0.92 : explicitSep ? 0.85 : 0.65;
    return build(m[1], m[3], m[4] || "", conf);
  }
  if ((m = line.match(LEAD_BARE)) && !UNIT_ONLY.test(clean(m[2]))) return build(m[2], m[1], "", 0.6);
  return build(line, "", "", 0.3); // no quantity found: keep the text, flag it
}

export function parseOrderText(text) {
  return String(text || "")
    .split(/[\n;,]+/)
    .map((l) => l.replace(/^\s*(?:[-•*]+|\d{1,2}[.)])\s+/, "").trim())
    .filter(Boolean)
    .map((line) => {
      const p = parseLine(line);
      return newRow({
        sourceText: line,
        ...p,
        matchName: suggestMatch(p.name),
        needsReview: p.confidence < 0.8,
        confirmed: false,
        source: "typed",
      });
    });
}
