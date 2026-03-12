// EaaS Operator Portal — Separate deployment from consumer app.
// Security & compliance mandate frontend + services separation.
// Shared database sits behind firewall and proxy. No direct client access.
import { Navigate, Route, Routes } from "react-router-dom";
import AdminLogin from "./AdminLogin";
import IntelliSmartAdmin from "./IntelliSmartAdmin";

const RootRoute = () => {
  const isAuthenticated = localStorage.getItem("isAdminAuthenticated") === "true";
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <AdminLogin />;
};

const DashboardRoute = () => {
  const isAuthenticated = localStorage.getItem("isAdminAuthenticated") === "true";
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return <IntelliSmartAdmin />;
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<RootRoute />} />
      <Route path="/dashboard" element={<DashboardRoute />} />
    </Routes>
  );
};

export default App;
