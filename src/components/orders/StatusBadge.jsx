import { statusLabel } from "../../utils/orderStatus";

// Text label always shown, so status is never conveyed by colour alone.
export default function StatusBadge({ status }) {
  return (
    <span className={`badge badge-${status}`}>
      <span aria-hidden="true">●</span> {statusLabel(status)}
    </span>
  );
}
