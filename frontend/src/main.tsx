import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import { AdminPanel } from './components/AdminPanel';
import './index.css';

// Componente para rota protegida de admin
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  // Em um ambiente real, verificaríamos o token de autenticação
  // e o papel do usuário (admin ou não)
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Função para lidar com logout
const handleLogout = () => {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('isAdmin');
  window.location.href = '/';
};

const root = createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminPanel onLogout={handleLogout} />
            </AdminRoute>
          } 
        />
      </Routes>
    </Router>
  </React.StrictMode>
);
