var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try {
            step(generator.next(value));
        }
        catch (e) {
            reject(e);
        } }
        function rejected(value) { try {
            step(generator["throw"](value));
        }
        catch (e) {
            reject(e);
        } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx } from "react/jsx-runtime";
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
    const login = (email, password, isAdmin) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield authService.login(email, password, isAdmin);
        if (response.success) {
            setCurrentUser(response.user);
        }
        return response;
    });
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
    return (_jsx(AuthContext.Provider, { value: value, children: !loading && children }));
};
export default AuthContext;
