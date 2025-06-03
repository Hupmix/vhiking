import axios from 'axios';

// URL base da API - ajuste para o endereço correto do seu backend
const API_URL = 'https://api.vihking.com.br/auth';

// Função para fazer login
const login = async (email, password, isAdmin = false) => {
  try {
    console.log('Tentando login com:', { email, password, isAdmin });
    
    // Implementação real de autenticação
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
      is_admin: isAdmin
    });
    
    if (response.data && response.data.access_token) {
      localStorage.setItem('user', JSON.stringify(response.data));
      return { success: true, user: response.data.user };
    }
    
    return { success: false, message: 'Credenciais inválidas' };
  } catch (error) {
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
      } else if (email === 'user@teste.com' && password === 'senha123' && !isAdmin) {
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
      message: error.response?.data?.detail || 'Erro ao conectar ao servidor'
    };
  }
};

// Função para fazer logout
const logout = () => {
  localStorage.removeItem('user');
};

// Função para obter usuário atual
const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    const userData = JSON.parse(userStr);
    return userData.user;
  } catch (e) {
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
  if (!userStr) return null;
  
  try {
    const userData = JSON.parse(userStr);
    return userData.access_token;
  } catch (e) {
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
