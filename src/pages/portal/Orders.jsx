import { useState } from "react";
import { Link } from "react-router-dom";
import useApi from "../../hooks/useApi";
import { EmptyView, ErrorView, Skeleton } from "../../components/ui/StateViews";
import StatusBadge from "../../components/orders/StatusBadge";
import { STATUS } from "../../utils/orderStatus";
import { fmtDate } from "../../utils/format";

export default function Orders() {
  const [status, setStatus] = useState("");
  const { data, error, loading, retry } = useApi(`/dealer/orders${status ? `?status=${status}` : ""}`);
  const orders = data?.orders || [];

  return (
    <>
      <div className="page-head">
        <h1>My Orders</h1>
        <Link to="/dealer-portal/orders/new" className="btn btn-primary">
          Place New Order
        </Link>
      </div>

      <div className="filter-row">
        <label htmlFor="status-filter">Status</label>
        <select id="status-filter" className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All orders</option>
          {Object.entries(STATUS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </div>

      {loading && <Skeleton lines={4} />}
      {error && <ErrorView message={error} onRetry={retry} />}
      {!loading && !error && orders.length === 0 && (
        <EmptyView
          title="No orders here yet"
          text={status ? "No orders match this filter." : "Place your first order to see it here."}
          action={
            !status && (
              <Link to="/dealer-portal/orders/new" className="btn btn-primary">
                Place New Order
              </Link>
            )
          }
        />
      )}

      {orders.length > 0 && (
        <table className="lines-table data-table">
          <thead>
            <tr>
              <th>Reference</th>
              <th>Date</th>
              <th>Items</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td data-label="Reference">{o.reference || "Draft (no reference yet)"}</td>
                <td data-label="Date">{fmtDate(o.submittedAt || o.createdAt)}</td>
                <td data-label="Items">{o.itemCount}</td>
                <td data-label="Status">
                  <StatusBadge status={o.status} />
                </td>
                <td data-label="Action">
                  {o.status === "draft" ? (
                    <Link className="btn btn-outline btn-sm" to={`/dealer-portal/orders/new?draft=${o.id}`}>
                      Resume
                    </Link>
                  ) : (
                    <Link className="btn btn-outline btn-sm" to={`/dealer-portal/orders/${o.id}`}>
                      View
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
