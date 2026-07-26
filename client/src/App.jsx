import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layout wrappers
import DashboardLayout from './layouts/DashboardLayout';

// Guard components
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

// Public pages
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';

// Toast Notifications
import { Toaster } from 'react-hot-toast';

// Protected User pages
import Dashboard from './pages/Dashboard';
import Income from './pages/Income';
import Expenses from './pages/Expenses';
import Habits from './pages/Habits';
import Savings from './pages/Savings';
import Investments from './pages/Investments';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Feedback from './pages/Feedback';

// Protected Admin pages
import AdminDashboard from './pages/AdminDashboard';
import AdminUserManagement from './pages/AdminUserManagement';
import AdminReports from './pages/AdminReports';
import AdminFeedback from './pages/AdminFeedback';
import AdminProfile from './pages/AdminProfile';

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
      <Routes>
        {/* Public authentication entry routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected User Panel Shell */}
        <Route
          path="/"
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

        {/* Global Fallback Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
