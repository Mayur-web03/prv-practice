export const normName = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

export function findDuplicates(rows) {
  const seen = new Map();
  rows.forEach((r) => {
    const k = normName(r.name);
    if (k) seen.set(k, (seen.get(k) || 0) + 1);
  });
  return new Set([...seen].filter(([, n]) => n > 1).map(([k]) => k));
}

export function validateLines(rows) {
  const errors = [];
  if (!rows.length) errors.push("Add at least one item.");
  rows.forEach((r, i) => {
    const n = i + 1;
    if (!String(r.name || "").trim()) errors.push(`Line ${n}: enter a product name.`);
    const q = Number(r.quantity);
    if (r.quantity === "" || !Number.isFinite(q) || q <= 0) {
      errors.push(`Line ${n}: quantity must be greater than 0.`);
    }
    if (r.needsReview && !r.confirmed) {
      errors.push(`Line ${n}: check this line and tick "Confirm" (or edit it).`);
    }
  });
  return errors;
}
