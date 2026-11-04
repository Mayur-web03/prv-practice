import PortalShell from "./PortalShell";
import { ADMIN_NAV, DEALER_NAV } from "../auth/roles";

export const DealerLayout = () => (
  <PortalShell title="Dealer Portal" nav={DEALER_NAV} loginPath="/dealer-portal/login" />
);

export const AdminLayout = () => (
  <PortalShell title="Admin Portal" nav={ADMIN_NAV} loginPath="/admin/login" />
);

