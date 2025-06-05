var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from 'axios';
// URL base da API - ajuste para o endereço correto do seu backend
const API_URL = 'https://api.vihking.com.br/auth';
// Função para fazer login
const login = (email_1, password_1, ...args_1) => __awaiter(void 0, [email_1, password_1, ...args_1], void 0, function* (email, password, isAdmin = false) {
    var _a, _b;
    try {
        console.log('Tentando login com:', { email, password, isAdmin });
        // Implementação real de autenticação
        const response = yield axios.post(`${API_URL}/login`, {
            email,
            password,
            is_admin: isAdmin
        });
        if (response.data && response.data.access_token) {
            localStorage.setItem('user', JSON.stringify(response.data));
            return { success: true, user: response.data.user };
        }
        return { success: false, message: 'Credenciais inválidas' };
    }
    catch (error) {
        console.error('Erro no login:', error);
        // Fallback para modo de desenvolvimento/teste quando a API não está disponível
        if (!error.response && (email === 'admin@teste.com' || email === 'user@teste.com')) {
            console.warn('API indisponível, usando modo de fallback para desenvolvimento');
            if (email === 'admin@teste.com' && password === 'senha123' && isAdmin) {
                const userData = {
                    access_token: 'token-simulado-admin-123456',
                    token_type: 'bearer',
                    user: {
                        email: 'admin@teste.com',
                        role: 'admin',
                        name: 'Administrador'
                    }
                };
                localStorage.setItem('user', JSON.stringify(userData));
                return { success: true, user: userData.user };
            }
            else if (email === 'user@teste.com' && password === 'senha123' && !isAdmin) {
                const userData = {
                    access_token: 'token-simulado-user-123456',
                    token_type: 'bearer',
                    user: {
                        email: 'user@teste.com',
                        role: 'user',
                        name: 'Usuário Comum'
                    }
                };
                localStorage.setItem('user', JSON.stringify(userData));
                return { success: true, user: userData.user };
            }
        }
        return {
            success: false,
            message: ((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.detail) || 'Erro ao conectar ao servidor'
        };
    }
});
// Função para fazer logout
const logout = () => {
    localStorage.removeItem('user');
};
// Função para obter usuário atual
const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    if (!userStr)
        return null;
    try {
        const userData = JSON.parse(userStr);
        return userData.user;
    }
    catch (e) {
        console.error('Erro ao obter usuário atual:', e);
        return null;
    }
};
// Função para verificar se o usuário está autenticado
const isAuthenticated = () => {
    return getCurrentUser() !== null;
};
// Função para verificar se o usuário é administrador
const isAdmin = () => {
    const user = getCurrentUser();
    return user && user.role === 'admin';
};
// Função para obter o token de autenticação
const getAuthToken = () => {
    const userStr = localStorage.getItem('user');
    if (!userStr)
        return null;
    try {
        const userData = JSON.parse(userStr);
        return userData.access_token;
    }
    catch (e) {
        console.error('Erro ao obter token de autenticação:', e);
        return null;
    }
};
const authService = {
    login,
    logout,
    getCurrentUser,
    isAuthenticated,
    isAdmin,
    getAuthToken
};
export default authService;
