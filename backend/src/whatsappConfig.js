// Configuração central para integração com WhatsApp
require('dotenv').config();

// Tipo de integração ativa (BUSINESS_API ou WHATSAPP_WEB)
const INTEGRATION_TYPE = process.env.WHATSAPP_INTEGRATION_TYPE || 'WHATSAPP_WEB';

// Configurações da API do WhatsApp Business
const WHATSAPP_BUSINESS_CONFIG = {
  apiVersion: 'v22.0',
  phoneNumberId: '636925012834337',
  businessAccountId: '991158666472115',
  testNumber: '+1 555 168 0627',
  appId: '980464100585658',
  accessToken: process.env.WHATSAPP_ACCESS_TOKEN || 'seu_token_de_acesso_aqui'
};

// Configurações do WhatsApp Web
const WHATSAPP_WEB_CONFIG = {
  sessionDir: process.env.WHATSAPP_SESSION_DIR || '.wwebjs_auth',
  webhookUrl: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/webhook/whatsapp`
};

// Configurações gerais
const GENERAL_CONFIG = {
  testPhoneNumber: process.env.TEST_PHONE_NUMBER || '5511999999999',
  debugMode: process.env.DEBUG_MODE === 'true' || false,
  logWebhooks: process.env.LOG_WEBHOOKS === 'true' || true
};

// Custos estimados (para exibição no painel administrativo)
const COST_ESTIMATES = {
  businessApi: {
    setupFee: 0,
    monthlyFee: 0,
    messageReceived: 0.0085,
    messageSent: 0.0085,
    templateMessage: 0.0127,
    mediaMessage: 0.0170
  },
  whatsappWeb: {
    setupFee: 0,
    monthlyFee: 0,
    messageReceived: 0,
    messageSent: 0,
    templateMessage: 0,
    mediaMessage: 0
  }
};

// Função para obter a configuração ativa
function getActiveConfig() {
  return {
    integrationType: INTEGRATION_TYPE,
    config: INTEGRATION_TYPE === 'BUSINESS_API' ? WHATSAPP_BUSINESS_CONFIG : WHATSAPP_WEB_CONFIG,
    general: GENERAL_CONFIG,
    costs: INTEGRATION_TYPE === 'BUSINESS_API' ? COST_ESTIMATES.businessApi : COST_ESTIMATES.whatsappWeb
  };
}

// Função para atualizar o tipo de integração
function updateIntegrationType(type) {
  if (type !== 'BUSINESS_API' && type !== 'WHATSAPP_WEB') {
    throw new Error('Tipo de integração inválido. Use BUSINESS_API ou WHATSAPP_WEB');
  }
  
  // Em um ambiente real, isso atualizaria o .env ou banco de dados
  console.log(`Tipo de integração atualizado para: ${type}`);
  return { success: true, message: `Integração alterada para ${type}` };
}

module.exports = {
  INTEGRATION_TYPE,
  WHATSAPP_BUSINESS_CONFIG,
  WHATSAPP_WEB_CONFIG,
  GENERAL_CONFIG,
  COST_ESTIMATES,
  getActiveConfig,
  updateIntegrationType
};
