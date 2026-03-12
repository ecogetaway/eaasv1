import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { useAuth } from './hooks/useAuth.js';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';

import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Onboarding from './pages/Onboarding.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Billing from './pages/Billing.jsx';
import Support from './pages/Support.jsx';
import Profile from './pages/Profile.jsx';
import Subscription from './pages/Subscription.jsx';
import Meters from './pages/Meters.jsx';
import ServicesPlans from './pages/ServicesPlans.jsx';
import AiAdvisor from './pages/AiAdvisor.jsx';
import Settings from './pages/Settings.jsx';
import Discom from './pages/Discom.jsx';
import DesignSystemPage from './pages/design-system/DesignSystemPage.jsx';
import ButtonPage from './pages/design-system/ButtonPage.jsx';
import BadgePage from './pages/design-system/BadgePage.jsx';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/billing/*"
        element={
          <ProtectedRoute>
            <Billing />
          </ProtectedRoute>
        }
      />
      <Route
        path="/support/*"
        element={
          <ProtectedRoute>
            <Support />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/subscription"
        element={
          <ProtectedRoute>
            <Subscription />
          </ProtectedRoute>
        }
      />
      <Route
        path="/meters"
        element={
          <ProtectedRoute>
            <Meters />
          </ProtectedRoute>
        }
      />
      <Route
        path="/services-plans"
        element={
          <ProtectedRoute>
            <ServicesPlans />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai-advisor"
        element={
          <ProtectedRoute>
            <AiAdvisor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/discom"
        element={
          <ProtectedRoute>
            <Discom />
          </ProtectedRoute>
        }
      />
      <Route path="/design-system" element={<DesignSystemPage />} />
      <Route path="/design-system/button" element={<ButtonPage />} />
      <Route path="/design-system/badge" element={<BadgePage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;

