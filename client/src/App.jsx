import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

// Layout wrappers
import DashboardLayout from './layouts/DashboardLayout';

// Guard components
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

// Code Splitting with React.lazy
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));

// Protected User pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Income = lazy(() => import('./pages/Income'));
const Expenses = lazy(() => import('./pages/Expenses'));
const Habits = lazy(() => import('./pages/Habits'));
const Savings = lazy(() => import('./pages/Savings'));
const Investments = lazy(() => import('./pages/Investments'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Profile = lazy(() => import('./pages/Profile'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Feedback = lazy(() => import('./pages/Feedback'));

// Protected Admin pages
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminUserManagement = lazy(() => import('./pages/AdminUserManagement'));
const AdminReports = lazy(() => import('./pages/AdminReports'));
const AdminFeedback = lazy(() => import('./pages/AdminFeedback'));
const AdminProfile = lazy(() => import('./pages/AdminProfile'));

// Loading Fallback Component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-950">
    <div className="flex flex-col items-center gap-3">
      <Loader2 size={40} className="animate-spin text-brand-500" />
      <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
        Loading FinanceHabit...
      </span>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#151c2c',
            color: '#f8fafc',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
          },
        }}
      />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public Landing Page at "/" */}
          <Route path="/" element={<LandingPage />} />

          {/* Public authentication entry routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected User Panel Shell at "/dashboard" */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="income" element={<Income />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="habits" element={<Habits />} />
            <Route path="savings" element={<Savings />} />
            <Route path="investments" element={<Investments />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="profile" element={<Profile />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="feedback" element={<Feedback />} />
          </Route>

          {/* Backward compatibility direct subroutes */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/income" element={<Income />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/habits" element={<Habits />} />
            <Route path="/savings" element={<Savings />} />
            <Route path="/investments" element={<Investments />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/feedback" element={<Feedback />} />
          </Route>

          {/* Protected Admin Panel Shell */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <DashboardLayout />
              </AdminRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUserManagement />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="feedback" element={<AdminFeedback />} />
            <Route path="profile" element={<AdminProfile />} />
          </Route>

          {/* Global Fallback Redirect to "/" */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
