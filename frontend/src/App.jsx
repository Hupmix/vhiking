import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AdminPanel from './components/AdminPanel';
import Dashboard from './components/Dashboard';
import WhatsAppIntegration from './components/WhatsAppIntegration';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Componente para rotas protegidas
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { currentUser, isAdmin } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

function AppRoutes() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminPanel />
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
            path="/whatsapp" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <WhatsAppIntegration />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default AppRoutes;
