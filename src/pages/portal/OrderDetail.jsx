import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../api/client";
import useApi from "../../hooks/useApi";
import { useToast } from "../../components/ui/Toast";
import { ErrorView, Skeleton } from "../../components/ui/StateViews";
import StatusBadge from "../../components/orders/StatusBadge";
import { fmtDateTime } from "../../utils/format";
import { statusLabel } from "../../utils/orderStatus";

export default function OrderDetail() {
  const { id } = useParams();
  const toast = useToast();
  const { data, error, loading, retry } = useApi(`/dealer/orders/${id}`);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const order = data?.order;

  const sendReply = async () => {
    if (!reply.trim()) return toast("Write your reply first.", "error");
    setSending(true);
    try {
      await api.post(`/dealer/orders/${id}/respond`, { message: reply });
      setReply("");
      toast("Reply sent. Your order is back in the review queue.");
      retry();
    } catch (e) {
      toast(e.message, "error");
    } finally {
      setSending(false);
    }
  };

  if (loading) return <Skeleton lines={5} />;
  if (error) return <ErrorView message={error} onRetry={retry} />;
  if (!order) return null;

  return (
    <>
      <div className="page-head">
        <h1>{order.reference || "Draft order"}</h1>
        <StatusBadge status={order.status} />
      </div>
      <p>
        <Link to="/dealer-portal/orders">← All orders</Link>
        {order.status === "draft" && (
          <>
            {" · "}
            <Link to={`/dealer-portal/orders/new?draft=${order.id}`}>Resume editing</Link>
          </>
        )}
      </p>

      {order.status === "needs_clarification" && (
        <section className="panel">
          <h2>PRV needs more information</h2>
          <p>{order.clarification?.message || "Please check your order and reply."}</p>
          <label htmlFor="reply">Your reply</label>
          <textarea id="reply" className="input" rows={3} value={reply} onChange={(e) => setReply(e.target.value)} />
          <div className="btn-row">
            <button type="button" className="btn btn-primary" onClick={sendReply} disabled={sending}>
              {sending ? "Sending…" : "Send reply"}
            </button>
          </div>
        </section>
      )}

      <section className="panel">
        <h2>Items</h2>
        <table className="lines-table data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Product</th>
              <th>Catalogue match</th>
              <th>Qty</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {(order.items || []).map((it, i) => (
              <tr key={it.id || i}>
                <td data-label="Line">{i + 1}</td>
                <td data-label="Product">{it.name}</td>
                <td data-label="Match">{it.matchName || "—"}</td>
                <td data-label="Qty">
                  {it.quantity} {it.unit}
                </td>
                <td data-label="Note">{it.note || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="muted small">Prices and totals appear here after PRV confirms your order.</p>
      </section>

      <section className="panel">
        <h2>Details</h2>
        <dl className="detail-list">
          <dt>Delivery address</dt>
          <dd>{order.deliveryAddress || "—"}</dd>
          <dt>PO / reference</dt>
          <dd>{order.poRef || "—"}</dd>
          <dt>Your notes</dt>
          <dd>{order.notes || "—"}</dd>
          <dt>Created</dt>
          <dd>{fmtDateTime(order.createdAt)}</dd>
        </dl>
      </section>

      <section className="panel">
        <h2>Status timeline</h2>
        <ol className="timeline">
          {[...(order.history || [])].reverse().map((h, i) => (
            <li key={i}>
              <strong>{statusLabel(h.status)}</strong>
              <span className="muted"> · {fmtDateTime(h.at)}</span>
              {h.note && <div>{h.note}</div>}
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
