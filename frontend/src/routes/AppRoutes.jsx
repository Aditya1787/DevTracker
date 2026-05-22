import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

// Layouts
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// Public Pages
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import GitHubCallback from '../pages/github/GitHubCallback';

// Protected Pages
import DashboardPage from '../pages/DashboardPage';
import RepositoriesPage from '../pages/RepositoriesPage';
import AIInsightsPage from '../pages/AIInsightsPage';
import ReportsPage from '../pages/ReportsPage';
import SettingsPage from '../pages/SettingsPage';

// Common Components
import Spinner from '../components/common/Spinner';
import PageWrapper from '../components/layout/PageWrapper';

// Protected Route HOC wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Anonymous Route wrapper (prevent logged in users from seeing login/signup)
const AnonymousRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<PageWrapper><LandingPage /></PageWrapper>} />

        {/* Auth callback */}
        <Route path="/github/callback" element={<PageWrapper><GitHubCallback /></PageWrapper>} />

        {/* Public / Auth routes with centered layout */}
        <Route
          element={
            <AnonymousRoute>
              <AuthLayout />
            </AnonymousRoute>
          }
        >
          <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />
          <Route path="/signup" element={<PageWrapper><SignupPage /></PageWrapper>} />
          <Route path="/forgot-password" element={<PageWrapper><ForgotPasswordPage /></PageWrapper>} />
        </Route>

        {/* Protected Dashboard console routes */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<PageWrapper><DashboardPage /></PageWrapper>} />
          <Route path="/repositories" element={<PageWrapper><RepositoriesPage /></PageWrapper>} />
          <Route path="/insights" element={<PageWrapper><AIInsightsPage /></PageWrapper>} />
          <Route path="/reports" element={<PageWrapper><ReportsPage /></PageWrapper>} />
          <Route path="/settings" element={<PageWrapper><SettingsPage /></PageWrapper>} />
        </Route>

        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
