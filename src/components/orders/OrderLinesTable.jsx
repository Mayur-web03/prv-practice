import { useEffect, useRef } from "react";
import products from "../../data/product";
import { UNITS, newRow } from "../../utils/parseOrderText";
import { findDuplicates, normName } from "../../utils/validateOrder";

const productNames = [...new Set(products.map((p) => p.name))];

function lineState(r) {
  if (r.confirmed) return { cls: "ok", text: "✓ Confirmed" };
  if (r.needsReview) return { cls: "warn", text: `⚠ Check · ${Math.round(r.confidence * 100)}%` };
  return { cls: "info", text: "Suggested" };
}

export default function OrderLinesTable({ rows, onChange }) {
  const focusNew = useRef(false);
  const bodyRef = useRef(null);
  const dupes = findDuplicates(rows);
  const unresolved = rows.filter((r) => r.needsReview && !r.confirmed).length;

  useEffect(() => {
    if (!focusNew.current) return;
    focusNew.current = false;
    bodyRef.current?.querySelector("tr:last-child input[data-field='name']")?.focus();
  }, [rows.length]);

  const update = (i, patch) =>
    onChange(
      rows.map((r, idx) =>
        idx === i
          ? { ...r, ...patch, confirmed: "confirmed" in patch ? patch.confirmed : true }
          : r
      )
    );

  const addRow = () => {
    focusNew.current = true;
    onChange([...rows, newRow({ source: "manual", confirmed: true })]);
  };

  const duplicate = (i) => {
    const copy = newRow({ ...rows[i], id: undefined, confirmed: true });
    copy.id = newRow().id;
    onChange([...rows.slice(0, i + 1), copy, ...rows.slice(i + 1)]);
  };

  const remove = (i) => onChange(rows.filter((_, idx) => idx !== i));

  return (
    <div>
      <datalist id="prv-products">
        {productNames.map((n) => (
          <option key={n} value={n} />
        ))}
      </datalist>

      <div className="lines-summary" role="status" aria-live="polite">
        <strong>{rows.length}</strong> line{rows.length === 1 ? "" : "s"}
        {unresolved > 0 && <span className="warn-text"> · {unresolved} to check</span>}
        {dupes.size > 0 && (
          <span className="warn-text"> · possible duplicate items (nothing was removed)</span>
        )}
      </div>

      {rows.length > 0 && (
        <table className="lines-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Product / description</th>
              <th>Catalogue match</th>
              <th>Qty</th>
              <th>Unit</th>
              <th>Dealer note</th>
              <th>Status</th>
              <th>Confirm</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody ref={bodyRef}>
            {rows.map((r, i) => {
              const st = lineState(r);
              const isDup = dupes.has(normName(r.name));
              return (
                <tr key={r.id} className={isDup ? "is-dup" : ""}>
                  <td data-label="Line">{i + 1}</td>
                  <td data-label="Product">
                    <input
                      className="input"
                      data-field="name"
                      aria-label={`Product name, line ${i + 1}`}
                      value={r.name}
                      onChange={(e) => update(i, { name: e.target.value })}
                    />
                    {r.sourceText && r.sourceText !== r.name && (
                      <small className="muted">Original: {r.sourceText}</small>
                    )}
                  </td>
                  <td data-label="Catalogue match">
                    <input
                      className="input"
                      list="prv-products"
                      placeholder="Optional"
                      aria-label={`Catalogue match, line ${i + 1}`}
                      value={r.matchName || ""}
                      onChange={(e) => update(i, { matchName: e.target.value })}
                    />
                  </td>
                  <td data-label="Qty">
                    <input
                      className="input input-qty"
                      type="number"
                      min="1"
                      step="1"
                      inputMode="numeric"
                      aria-label={`Quantity, line ${i + 1}`}
                      value={r.quantity}
                      onChange={(e) => update(i, { quantity: e.target.value === "" ? "" : Number(e.target.value) })}
                    />
                  </td>
                  <td data-label="Unit">
                    <select
                      className="input"
                      aria-label={`Unit, line ${i + 1}`}
                      value={r.unit}
                      onChange={(e) => update(i, { unit: e.target.value })}
                    >
                      {UNITS.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td data-label="Note">
                    <input
                      className="input"
                      placeholder="Size, finish, model…"
                      aria-label={`Dealer note, line ${i + 1}`}
                      value={r.note}
                      onChange={(e) => update(i, { note: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && i === rows.length - 1) {
                          e.preventDefault();
                          addRow();
                        }
                      }}
                    />
                  </td>
                  <td data-label="Status">
                    <span className={`line-state ${st.cls}`}>{st.text}</span>
                    {isDup && <span className="line-state warn">Duplicate?</span>}
                  </td>
                  <td data-label="Confirm">
                    <input
                      type="checkbox"
                      aria-label={`Confirm line ${i + 1}`}
                      checked={!!r.confirmed}
                      onChange={(e) => update(i, { confirmed: e.target.checked })}
                    />
                  </td>
                  <td data-label="Actions" className="row-actions">
                    <button type="button" className="btn btn-outline btn-sm" onClick={() => duplicate(i)}>
                      Duplicate
                    </button>
                    <button type="button" className="btn btn-outline btn-sm" onClick={() => remove(i)}>
                      Remove
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <button type="button" className="btn btn-outline" onClick={addRow}>
        + Add item
      </button>
    </div>
  );
}
