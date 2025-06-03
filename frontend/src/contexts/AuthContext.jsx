import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

// Criação do contexto de autenticação
const AuthContext = createContext();

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provedor do contexto de autenticação
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar se o usuário está autenticado ao carregar o componente
  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    setLoading(false);
  }, []);

  // Função para fazer login
  const login = async (email, password, isAdmin) => {
    const response = await authService.login(email, password, isAdmin);
    if (response.success) {
      setCurrentUser(response.user);
    }
    return response;
  };

  // Função para fazer logout
  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  // Verificar se o usuário é administrador
  const isAdmin = () => {
    return currentUser && currentUser.role === 'admin';
  };

  // Valor do contexto
  const value = {
    currentUser,
    login,
    logout,
    isAdmin,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
