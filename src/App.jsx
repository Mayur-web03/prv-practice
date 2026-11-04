import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Catalogue from "./pages/Catalogue";
import ProductDetail from "./pages/ProductDetail";
import Dealer from "./pages/Dealer";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import useScrollTop from "./hooks/useScrollTop";

import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import { ROLES } from "./auth/roles";
import { ToastProvider } from "./components/ui/Toast";
import PublicLayout from "./layouts/PublicLayout";
import { DealerLayout, AdminLayout } from "./layouts/PortalLayouts";
import LoginPage from "./pages/portal/LoginPage";
import { DealerDashboard, AdminDashboard, Placeholder } from "./pages/portal/Dashboards";

const ScrollToTop = () => {
  useScrollTop();
  return null;
};

const { SUPER_ADMIN: SA, ORDER_MANAGER: OM, CATALOG_MANAGER: CM, ACCOUNTS: AC, DISPATCH: DP } = ROLES;

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public website */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/catalogue/:category" element={<Catalogue />} />
              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="/dealer" element={<Dealer />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Dealer portal */}
            <Route path="/dealer-portal/login" element={<LoginPage area="dealer" />} />
            <Route
              path="/dealer-portal"
              element={
                <ProtectedRoute area="dealer">
                  <DealerLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DealerDashboard />} />
              <Route path="orders" element={<Placeholder title="My Orders" phase={3} />} />
              <Route path="orders/new" element={<Placeholder title="Place New Order" phase={3} />} />
              <Route path="orders/:id" element={<Placeholder title="Order detail" phase={3} />} />
              <Route path="billing" element={<Placeholder title="Billing & Dues" phase={5} />} />
              <Route path="invoices/:id" element={<Placeholder title="Invoice" phase={5} />} />
              <Route path="payments" element={<Placeholder title="Payments" phase={5} />} />
              <Route path="profile" element={<Placeholder title="Profile" phase={3} />} />
            </Route>

            {/* Admin portal */}
            <Route path="/admin/login" element={<LoginPage area="admin" />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute area="admin">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="orders" element={<ProtectedRoute area="admin" roles={[SA, OM]}><Placeholder title="Orders" phase={4} /></ProtectedRoute>} />
              <Route path="orders/:id" element={<ProtectedRoute area="admin" roles={[SA, OM]}><Placeholder title="Order review" phase={4} /></ProtectedRoute>} />
              <Route path="products" element={<ProtectedRoute area="admin" roles={[SA, CM]}><Placeholder title="Products" phase={2} /></ProtectedRoute>} />
              <Route path="products/new" element={<ProtectedRoute area="admin" roles={[SA, CM]}><Placeholder title="New product" phase={2} /></ProtectedRoute>} />
              <Route path="products/:id/edit" element={<ProtectedRoute area="admin" roles={[SA, CM]}><Placeholder title="Edit product" phase={2} /></ProtectedRoute>} />
              <Route path="dealers" element={<ProtectedRoute area="admin" roles={[SA, OM, AC]}><Placeholder title="Dealers" phase={2} /></ProtectedRoute>} />
              <Route path="dealers/:id" element={<ProtectedRoute area="admin" roles={[SA, OM, AC]}><Placeholder title="Dealer" phase={2} /></ProtectedRoute>} />
              <Route path="billing" element={<ProtectedRoute area="admin" roles={[SA, AC]}><Placeholder title="Billing" phase={5} /></ProtectedRoute>} />
              <Route path="invoices" element={<ProtectedRoute area="admin" roles={[SA, AC]}><Placeholder title="Invoices" phase={5} /></ProtectedRoute>} />
              <Route path="payments" element={<ProtectedRoute area="admin" roles={[SA, AC]}><Placeholder title="Payments" phase={5} /></ProtectedRoute>} />
              <Route path="dispatch" element={<ProtectedRoute area="admin" roles={[SA, DP]}><Placeholder title="Dispatch" phase={4} /></ProtectedRoute>} />
              <Route path="reports" element={<ProtectedRoute area="admin" roles={[SA, AC]}><Placeholder title="Reports" phase={5} /></ProtectedRoute>} />
              <Route path="settings" element={<ProtectedRoute area="admin" roles={[SA]}><Placeholder title="Settings" phase={1} /></ProtectedRoute>} />
            </Route>
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
