import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LifeOSHome from './pages/LifeOSHome';
import HabitDashboard from './pages/HabitDashboard';
import ExpenseDashboard from './pages/ExpenseDashboard';
import TodoDashboard from './pages/TodoDashboard';
import Layout from './components/layout/Layout';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return !isAuthenticated ? children : <Navigate to="/" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#1a1a2e', color: '#e2e8f0', border: '1px solid #4a5568' },
          success: { iconTheme: { primary: '#68d391', secondary: '#1a1a2e' } },
          error: { iconTheme: { primary: '#fc8181', secondary: '#1a1a2e' } },
        }}
      />
      <Routes>
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<LifeOSHome />} />
          <Route path="habits" element={<HabitDashboard />} />
          <Route path="expenses" element={<ExpenseDashboard />} />
          <Route path="todos" element={<TodoDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
