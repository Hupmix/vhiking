import axios from 'axios';

// Configuração da URL da API - usando URL pública para produção
const API_URL = process.env.REACT_APP_API_URL || 'https://api.vihking.com.br/api';

/**
 * Serviço para comunicação com o backend da integração WhatsApp
 */
const WhatsAppService = {
  /**
   * Inicializa a integração com WhatsApp
   * @returns {Promise} Resultado da inicialização
   */
  initializeIntegration: async () => {
    try {
      const response = await axios.post(`${API_URL}/whatsapp/initialize`);
      return response.data;
    } catch (error) {
      console.error('Erro ao inicializar integração:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao conectar com o servidor de integração'
      };
    }
  },

  /**
   * Obtém o status atual da integração
   * @returns {Promise} Status da integração
   */
  getStatus: async () => {
    try {
      const response = await axios.get(`${API_URL}/whatsapp/status`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter status:', error);
      return {
        success: false,
        connected: false,
        status: 'error',
        message: error.response?.data?.message || 'Erro ao conectar com o servidor de integração'
      };
    }
  },

  /**
   * Obtém QR Code para conexão
   * @returns {Promise} QR Code para conexão
   */
  getQRCode: async () => {
    try {
      const response = await axios.get(`${API_URL}/whatsapp/qrcode`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter QR Code:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao gerar QR Code'
      };
    }
  },

  /**
   * Envia mensagem de texto
   * @param {string} to Número de telefone do destinatário
   * @param {string} text Texto da mensagem
   * @returns {Promise} Resultado do envio
   */
  sendTextMessage: async (to, text) => {
    try {
      const response = await axios.post(`${API_URL}/whatsapp/send`, { to, text });
      return response.data;
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao enviar mensagem'
      };
    }
  },

  /**
   * Envia mensagem de boas-vindas
   * @param {string} to Número de telefone do destinatário
   * @returns {Promise} Resultado do envio
   */
  sendWelcomeMessage: async (to) => {
    try {
      const response = await axios.post(`${API_URL}/whatsapp/send-welcome`, { to });
      return response.data;
    } catch (error) {
      console.error('Erro ao enviar mensagem de boas-vindas:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao enviar mensagem de boas-vindas'
      };
    }
  },

  /**
   * Obtém estatísticas de mensagens
   * @returns {Promise} Estatísticas de mensagens
   */
  getMessageStats: async () => {
    try {
      const response = await axios.get(`${API_URL}/whatsapp/stats`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      return {
        received: 0,
        sent: 0,
        templates: 0,
        media: 0,
        lastUpdated: new Date().toISOString()
      };
    }
  },

  /**
   * Obtém custos estimados
   * @returns {Promise} Custos estimados
   */
  getEstimatedCosts: async () => {
    try {
      const response = await axios.get(`${API_URL}/whatsapp/costs`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter custos:', error);
      return {
        integrationType: 'EVOLUTION_API',
        costs: {
          setupFee: 0,
          monthlyFee: 0,
          messageReceived: 0,
          messageSent: 0,
          templateMessage: 0,
          mediaMessage: 0
        },
        estimatedTotal: 0
      };
    }
  },

  /**
   * Obtém logs de atividade
   * @returns {Promise} Logs de atividade
   */
  getLogs: async () => {
    try {
      const response = await axios.get(`${API_URL}/whatsapp/logs`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter logs:', error);
      return [];
    }
  },

  /**
   * Alterna o tipo de integração
   * @param {string} type Tipo de integração (BUSINESS_API ou EVOLUTION_API)
   * @returns {Promise} Resultado da alteração
   */
  switchIntegrationType: async (type) => {
    try {
      const response = await axios.post(`${API_URL}/whatsapp/switch-type`, { type });
      return response.data;
    } catch (error) {
      console.error('Erro ao alterar tipo de integração:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao alterar tipo de integração'
      };
    }
  },

  /**
   * Desconecta a instância do WhatsApp
   * @returns {Promise} Resultado da desconexão
   */
  disconnect: async () => {
    try {
      const response = await axios.post(`${API_URL}/whatsapp/disconnect`);
      return response.data;
    } catch (error) {
      console.error('Erro ao desconectar:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao desconectar WhatsApp'
      };
    }
  }
};

export default WhatsAppService;
