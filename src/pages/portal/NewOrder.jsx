import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../../api/client";
import { useAuth } from "../../auth/AuthContext";
import { useToast } from "../../components/ui/Toast";
import { ErrorView, LoadingView } from "../../components/ui/StateViews";
import OrderLinesTable from "../../components/orders/OrderLinesTable";
import { newRow, parseOrderText } from "../../utils/parseOrderText";
import { validateLines } from "../../utils/validateOrder";

const MAX_BYTES = 10 * 1024 * 1024;
const OK_TYPES = ["image/jpeg", "image/png", "image/webp"];
const EXAMPLE = "Angle valve 20 pcs\nHealth faucet 10 pcs\nOverhead shower 5 pcs";

export default function NewOrder() {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const draftParam = params.get("draft");

  const [orderId, setOrderId] = useState(null);
  const [text, setText] = useState("");
  const [rows, setRows] = useState([]);
  const [notes, setNotes] = useState("");
  const [poRef, setPoRef] = useState("");
  const [address, setAddress] = useState(user?.address || "");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [fileError, setFileError] = useState("");
  const [extractMsg, setExtractMsg] = useState("");
  const [dragging, setDragging] = useState(false);
  const [load, setLoad] = useState({ loading: !!draftParam, error: "" });
  const [busy, setBusy] = useState(""); // "" | save | submit | extract
  const [problems, setProblems] = useState([]);
  const [dirty, setDirty] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const loadedId = useRef(null);
  const lastParsed = useRef("");
  const dialogRef = useRef(null);
  const fileInputRef = useRef(null);
  const problemsRef = useRef(null);

  const field = (setter) => (e) => {
    setter(e.target.value);
    setDirty(true);
  };
  const setRowsDirty = (r) => {
    setRows(r);
    setDirty(true);
  };

  // Resume a saved draft
  useEffect(() => {
    if (!draftParam || loadedId.current === draftParam) return;
    let alive = true;
    setLoad({ loading: true, error: "" });
    api
      .get(`/dealer/orders/${draftParam}`)
      .then(({ order }) => {
        if (!alive) return;
        if (order.status !== "draft") {
          navigate(`/dealer-portal/orders/${order.id}`, { replace: true });
          return;
        }
        loadedId.current = order.id;
        setOrderId(order.id);
        setText(order.rawText || "");
        lastParsed.current = order.rawText || "";
        setRows(order.items || []);
        setNotes(order.notes || "");
        setPoRef(order.poRef || "");
        setAddress(order.deliveryAddress || "");
        setLoad({ loading: false, error: "" });
      })
      .catch((e) => alive && setLoad({ loading: false, error: e.message }));
    return () => {
      alive = false;
    };
  }, [draftParam, navigate]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    if (!dirty) return;
    const handler = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  // Image preview
  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // Confirm dialog
  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (confirmOpen && !d.open) d.showModal();
    if (!confirmOpen && d.open) d.close();
  }, [confirmOpen]);

  useEffect(() => {
    if (problems.length) problemsRef.current?.focus();
  }, [problems]);

  const pickFile = (f) => {
    setFileError("");
    setExtractMsg("");
    if (!f) return;
    if (!OK_TYPES.includes(f.type)) return setFileError("Please use a JPG, PNG or WEBP image.");
    if (f.size > MAX_BYTES) return setFileError("That image is over 10 MB. Please choose a smaller one.");
    setFile(f);
    setDirty(true);
  };

  const extractTyped = () => {
    const parsed = parseOrderText(text);
    if (!parsed.length) return toast("Type at least one item first.", "error");
    if (text === lastParsed.current) return toast("These items are already in the table below.", "error");
    lastParsed.current = text;
    setRowsDirty([...rows, ...parsed]);
    setProblems([]);
    toast(`${parsed.length} line${parsed.length === 1 ? "" : "s"} ready for your review.`);
  };

  const readImage = async () => {
    setBusy("extract");
    setExtractMsg("");
    try {
      const res = await api.post("/dealer/orders/extract", {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      });
      const items = (res.items || []).map((i) => newRow({ ...i, source: "ocr", confirmed: false, needsReview: true }));
      if (items.length) setRowsDirty([...rows, ...items]);
      else setExtractMsg("No items could be read. Please type them in manually.");
    } catch (e) {
      setExtractMsg(e.message);
    } finally {
      setBusy("");
    }
  };

  const buildPayload = () => ({
    inputType: file && text.trim() ? "mixed" : file ? "image" : "typed",
    rawText: text,
    items: rows,
    notes,
    poRef,
    deliveryAddress: address,
    attachmentName: file ? file.name : null,
  });

  const persist = async () => {
    const body = buildPayload();
    const res = orderId
      ? await api.put(`/dealer/orders/${orderId}`, body)
      : await api.post("/dealer/orders", body);
    const saved = res.order;
    setOrderId(saved.id);
    loadedId.current = saved.id;
    if (draftParam !== saved.id) setParams({ draft: saved.id }, { replace: true });
    setDirty(false);
    return saved;
  };

  const saveDraft = async () => {
    if (!rows.length && !text.trim()) return toast("Nothing to save yet.", "error");
    setBusy("save");
    try {
      await persist();
      toast("Draft saved. You can resume it from My Orders.");
    } catch (e) {
      toast(e.message, "error");
    } finally {
      setBusy("");
    }
  };

  const openSubmit = () => {
    const errs = validateLines(rows);
    if (!address.trim()) errs.push("Enter a delivery address.");
    setProblems(errs);
    if (errs.length) return toast("Please fix the items listed below the table.", "error");
    setConfirmOpen(true);
  };

  const confirmSubmit = async () => {
    setBusy("submit");
    try {
      const saved = await persist();
      await api.post(`/dealer/orders/${saved.id}/submit`);
      toast("Order submitted for approval.");
      navigate(`/dealer-portal/orders/${saved.id}`);
    } catch (e) {
      setConfirmOpen(false);
      setProblems(Array.isArray(e.details) && e.details.length ? e.details : [e.message]);
      toast(e.message, "error");
    } finally {
      setBusy("");
    }
  };

  if (load.loading) return <LoadingView label="Opening your draft…" />;
  if (load.error) return <ErrorView message={load.error} onRetry={() => setLoad({ loading: false, error: "" })} />;

  const working = busy !== "";

  return (
    <>
      <div className="page-head">
        <h1>Place New Order</h1>
        <button type="button" className="btn btn-outline" onClick={() => navigate("/dealer-portal/orders")}>
          My Orders
        </button>
      </div>
      <p className="muted lead">
        Type your list or upload a photo. Nothing is sent until you press <strong>Submit for Approval</strong>.
      </p>

      <section className="panel" aria-labelledby="s1">
        <h2 id="s1">1. Add your items</h2>
        <div className="input-grid">
          <div className="field">
            <label htmlFor="order-text">Type your order</label>
            <textarea
              id="order-text"
              className="input"
              rows={7}
              placeholder={`One item per line, for example:\n${EXAMPLE}`}
              value={text}
              onChange={field(setText)}
              disabled={working}
            />
            <div className="btn-row">
              <button type="button" className="btn btn-primary" onClick={extractTyped} disabled={working || !text.trim()}>
                Extract items
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setText(EXAMPLE);
                  setDirty(true);
                }}
                disabled={working}
              >
                Use example
              </button>
            </div>
          </div>

          <div className="field">
            <span className="field-label">Or upload a photo / screenshot</span>
            <div
              className={`dropzone ${dragging ? "is-drag" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                pickFile(e.dataTransfer.files?.[0]);
              }}
            >
              {previewUrl ? (
                <img src={previewUrl} alt="Preview of your uploaded order list" className="drop-preview" />
              ) : (
                <p>Drag an image here, or</p>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                hidden
                onChange={(e) => pickFile(e.target.files?.[0])}
              />
              <div className="btn-row">
                <button type="button" className="btn btn-outline" onClick={() => fileInputRef.current?.click()}>
                  {file ? "Replace image" : "Choose image / take photo"}
                </button>
                {file && (
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => {
                      setFile(null);
                      setExtractMsg("");
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
              <small className="muted">JPG, PNG or WEBP, up to 10 MB.</small>
            </div>
            {fileError && (
              <div className="form-error" role="alert">
                {fileError}
              </div>
            )}
            {file && (
              <>
                <button type="button" className="btn btn-primary" onClick={readImage} disabled={working}>
                  {busy === "extract" ? "Reading image…" : "Read items from image"}
                </button>
                <small className="muted">
                  The image is shown for your reference. Saving it with the order is switched on once file storage is
                  connected.
                </small>
              </>
            )}
            {extractMsg && (
              <div className="form-error" role="status">
                {extractMsg}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="panel" aria-labelledby="s2">
        <h2 id="s2">2. Review and edit</h2>
        {rows.length === 0 && (
          <p className="muted">Your items will appear here. You can also add them one by one.</p>
        )}
        <OrderLinesTable rows={rows} onChange={setRowsDirty} />
        {problems.length > 0 && (
          <div className="form-error problems" role="alert" tabIndex={-1} ref={problemsRef}>
            <strong>Please fix before submitting:</strong>
            <ul>
              {problems.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="panel" aria-labelledby="s3">
        <h2 id="s3">3. Delivery and submit</h2>
        <div className="input-grid">
          <div className="field">
            <label htmlFor="addr">Delivery address</label>
            <textarea id="addr" className="input" rows={3} value={address} onChange={field(setAddress)} disabled={working} />
          </div>
          <div className="field">
            <label htmlFor="po">PO / reference (optional)</label>
            <input id="po" className="input" value={poRef} onChange={field(setPoRef)} disabled={working} />
            <label htmlFor="notes">Notes for PRV (optional)</label>
            <textarea id="notes" className="input" rows={2} value={notes} onChange={field(setNotes)} disabled={working} />
          </div>
        </div>
        <p className="muted small">Prices and totals are confirmed by PRV after review. No final amount is shown now.</p>
        <div className="btn-row">
          <button type="button" className="btn btn-outline" onClick={saveDraft} disabled={working}>
            {busy === "save" ? "Saving…" : "Save draft"}
          </button>
          <button type="button" className="btn btn-primary" onClick={openSubmit} disabled={working}>
            Review &amp; submit
          </button>
        </div>
      </section>

      <dialog ref={dialogRef} className="confirm-dialog" onClose={() => setConfirmOpen(false)} aria-labelledby="dlg-title">
        <h2 id="dlg-title">Submit for approval?</h2>
        <p className="muted">PRV will review your order. It is not confirmed until an admin approves it.</p>
        <ul className="confirm-lines">
          {rows.map((r) => (
            <li key={r.id}>
              {r.name} — {r.quantity} {r.unit}
              {r.note ? ` (${r.note})` : ""}
            </li>
          ))}
        </ul>
        <p>
          <strong>Deliver to:</strong> {address}
        </p>
        {poRef && (
          <p>
            <strong>PO / reference:</strong> {poRef}
          </p>
        )}
        {notes && (
          <p>
            <strong>Notes:</strong> {notes}
          </p>
        )}
        <div className="btn-row">
          <button type="button" className="btn btn-outline" onClick={() => setConfirmOpen(false)} disabled={busy === "submit"}>
            Go back
          </button>
          <button type="button" className="btn btn-primary" onClick={confirmSubmit} disabled={busy === "submit"}>
            {busy === "submit" ? "Submitting…" : "Submit for Approval"}
          </button>
        </div>
      </dialog>
    </>
  );
}
