import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import { AdminPanel } from './components/AdminPanel';
import './index.css';
// Componente para rota protegida de admin
const AdminRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (!isAuthenticated || !isAdmin) {
        return _jsx(Navigate, { to: "/", replace: true });
    }
    return _jsx(_Fragment, { children: children });
};
// Função para lidar com logout
const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('isAdmin');
    window.location.href = '/';
};
const root = createRoot(document.getElementById('root'));
root.render(_jsx(React.StrictMode, { children: _jsx(Router, { basename: "/vhiking", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(App, {}) }), _jsx(Route, { path: "/admin", element: _jsx(AdminRoute, { children: _jsx(AdminPanel, { onLogout: handleLogout }) }) })] }) }) }));
