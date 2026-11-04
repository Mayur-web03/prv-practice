import { Link } from "react-router-dom";
import useApi from "../../hooks/useApi";
import { useAuth } from "../../auth/AuthContext";
import { ErrorView, Skeleton } from "../../components/ui/StateViews";

const money = (paise) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format((paise || 0) / 100);

function Cards({ items }) {
  return (
    <div className="card-grid">
      {items.map((c) => (
        <div className="stat-card" key={c.label}>
          <span className="stat-label">{c.label}</span>
          <strong className="stat-value">{c.value}</strong>
        </div>
      ))}
    </div>
  );
}

export function DealerDashboard() {
  const { user } = useAuth();
  const { data, error, loading, retry } = useApi("/dealer/summary");

  return (
    <>
      <div className="page-head">
        <h1>{user.company}</h1>
        <Link to="/dealer-portal/orders/new" className="btn btn-primary">
          Place New Order
        </Link>
      </div>
      {loading && <Skeleton lines={3} />}
      {error && <ErrorView message={error} onRetry={retry} />}
      {data && (
        <Cards
          items={[
            { label: "Outstanding", value: money(data.outstanding) },
            { label: "Next due date", value: data.nextDueDate || "None" },
            { label: "Orders this month", value: data.ordersThisMonth },
            { label: "Pending approval", value: data.pendingApproval },
            { label: "Processing", value: data.processing },
            { label: "Dispatched", value: data.dispatched },
          ]}
        />
      )}
    </>
  );
}

export function AdminDashboard() {
  const { data, error, loading, retry } = useApi("/admin/summary");
  return (
    <>
      <div className="page-head">
        <h1>Today's operations</h1>
      </div>
      {loading && <Skeleton lines={3} />}
      {error && <ErrorView message={error} onRetry={retry} />}
      {data && (
        <Cards
          items={[
            { label: "New orders today", value: data.newToday },
            { label: "Pending approval", value: data.pendingApproval },
            { label: "Needs clarification", value: data.needsClarification },
            { label: "Approved / confirmed", value: data.approved },
            { label: "Processing", value: data.processing },
            { label: "Ready for dispatch", value: data.readyForDispatch },
            { label: "Dispatched today", value: data.dispatchedToday },
            { label: "Overdue invoices", value: data.overdueInvoices },
          ]}
        />
      )}
    </>
  );
}

export function Placeholder({ title, phase }) {
  return (
    <>
      <div className="page-head">
        <h1>{title}</h1>
      </div>
      <div className="state-view">
        <h3>Coming in Phase {phase}</h3>
        <p>This screen is routed and protected, and will be built in that phase.</p>
      </div>
    </>
  );
}

