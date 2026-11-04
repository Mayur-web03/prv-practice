export const ROLES = {
  DEALER: "dealer",
  SUPER_ADMIN: "super_admin",
  ORDER_MANAGER: "order_manager",
  CATALOG_MANAGER: "catalog_manager",
  ACCOUNTS: "accounts",
  DISPATCH: "dispatch",
};

export const ADMIN_ROLES = [
  ROLES.SUPER_ADMIN,
  ROLES.ORDER_MANAGER,
  ROLES.CATALOG_MANAGER,
  ROLES.ACCOUNTS,
  ROLES.DISPATCH,
];

export const isAdminRole = (role) => ADMIN_ROLES.includes(role);

export const ROLE_LABELS = {
  dealer: "Dealer",
  super_admin: "Super Admin",
  order_manager: "Order Manager",
  catalog_manager: "Catalog Manager",
  accounts: "Accounts",
  dispatch: "Dispatch",
};

const { SUPER_ADMIN: SA, ORDER_MANAGER: OM, CATALOG_MANAGER: CM, ACCOUNTS: AC, DISPATCH: DP } = ROLES;

export const DEALER_NAV = [
  { to: "/dealer-portal", label: "Dashboard", end: true },
  { to: "/dealer-portal/orders/new", label: "Place New Order" },
  { to: "/dealer-portal/orders", label: "My Orders", end: true },
  { to: "/dealer-portal/billing", label: "Billing & Dues" },
  { to: "/dealer-portal/payments", label: "Payments" },
  { to: "/dealer-portal/profile", label: "Profile" },
];

export const ADMIN_NAV = [
  { to: "/admin", label: "Today", end: true, roles: [SA, OM, AC, DP, CM] },
  { to: "/admin/orders", label: "Orders", roles: [SA, OM] },
  { to: "/admin/products", label: "Products", roles: [SA, CM] },
  { to: "/admin/dealers", label: "Dealers", roles: [SA, OM, AC] },
  { to: "/admin/billing", label: "Billing", roles: [SA, AC] },
  { to: "/admin/invoices", label: "Invoices", roles: [SA, AC] },
  { to: "/admin/payments", label: "Payments", roles: [SA, AC] },
  { to: "/admin/dispatch", label: "Dispatch", roles: [SA, DP] },
  { to: "/admin/reports", label: "Reports", roles: [SA, AC] },
  { to: "/admin/settings", label: "Settings", roles: [SA] },
];