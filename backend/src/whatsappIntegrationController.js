// Controlador para integração com WhatsApp
const whatsappWebService = require('./whatsappWebService');
const whatsappConfig = require('./whatsappConfig');

// Estatísticas de mensagens
let messageStats = {
  received: 0,
  sent: 0,
  templates: 0,
  media: 0,
  lastUpdated: new Date().toISOString()
};

// Logs de atividade
const activityLogs = [];

/**
 * Adiciona um log de atividade
 * @param {string} action - Ação realizada
 * @param {string} status - Status da ação (success/error)
 * @param {string} message - Mensagem descritiva
 */
function addActivityLog(action, status, message) {
  activityLogs.unshift({
    timestamp: new Date().toISOString(),
    action,
    status,
    message
  });
  
  // Manter apenas os últimos 100 logs
  if (activityLogs.length > 100) {
    activityLogs.pop();
  }
}

/**
 * Inicializa a integração com WhatsApp
 * @param {object} req - Requisição
 * @param {object} res - Resposta
 */
async function initializeIntegration(req, res) {
  try {
    const result = await whatsappWebService.initializeClient();
    
    addActivityLog('initialize', result.success ? 'success' : 'error', result.message);
    
    res.json(result);
  } catch (error) {
    console.error('Erro ao inicializar integração:', error);
    addActivityLog('initialize', 'error', `Erro ao inicializar integração: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      message: `Erro ao inicializar integração: ${error.message}` 
    });
  }
}

/**
 * Obtém o status da integração
 * @param {object} req - Requisição
 * @param {object} res - Resposta
 */
async function getStatus(req, res) {
  try {
    const status = await whatsappWebService.checkConnectionStatus();
    
    // Adicionar informações adicionais
    const config = whatsappConfig.getActiveConfig();
    status.integrationType = 'WHATSAPP_WEB';
    
    res.json(status);
  } catch (error) {
    console.error('Erro ao obter status:', error);
    res.status(500).json({ 
      success: false, 
      message: `Erro ao obter status: ${error.message}` 
    });
  }
}

/**
 * Obtém QR Code para conexão
 * @param {object} req - Requisição
 * @param {object} res - Resposta
 */
async function getQRCode(req, res) {
  try {
    const result = await whatsappWebService.getQRCode();
    
    addActivityLog('getQRCode', result.success ? 'success' : 'error', result.message || 'QR Code gerado');
    
    res.json(result);
  } catch (error) {
    console.error('Erro ao obter QR Code:', error);
    addActivityLog('getQRCode', 'error', `Erro ao obter QR Code: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      message: `Erro ao obter QR Code: ${error.message}` 
    });
  }
}

/**
 * Envia mensagem de texto
 * @param {object} req - Requisição
 * @param {object} res - Resposta
 */
async function sendMessage(req, res) {
  const { to, text } = req.body;
  
  if (!to || !text) {
    return res.status(400).json({ 
      success: false, 
      message: 'Número de telefone e texto da mensagem são obrigatórios' 
    });
  }
  
  try {
    const result = await whatsappWebService.sendTextMessage(to, text);
    
    if (result.success) {
      // Atualizar estatísticas
      messageStats.sent += 1;
      messageStats.lastUpdated = new Date().toISOString();
    }
    
    addActivityLog('sendMessage', result.success ? 'success' : 'error', 
      `Mensagem para ${to}: ${result.success ? 'enviada' : 'falhou'}`);
    
    res.json(result);
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    addActivityLog('sendMessage', 'error', `Erro ao enviar mensagem para ${to}: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      message: `Erro ao enviar mensagem: ${error.message}` 
    });
  }
}

/**
 * Envia mensagem de boas-vindas
 * @param {object} req - Requisição
 * @param {object} res - Resposta
 */
async function sendWelcomeMessage(req, res) {
  const { to } = req.body;
  
  if (!to) {
    return res.status(400).json({ 
      success: false, 
      message: 'Número de telefone é obrigatório' 
    });
  }
  
  try {
    const result = await whatsappWebService.sendFreeTrialTemplate(to);
    
    if (result.success) {
      // Atualizar estatísticas
      messageStats.sent += 1;
      messageStats.templates += 1;
      messageStats.lastUpdated = new Date().toISOString();
    }
    
    addActivityLog('sendWelcome', result.success ? 'success' : 'error', 
      `Mensagem de boas-vindas para ${to}: ${result.success ? 'enviada' : 'falhou'}`);
    
    res.json(result);
  } catch (error) {
    console.error('Erro ao enviar mensagem de boas-vindas:', error);
    addActivityLog('sendWelcome', 'error', `Erro ao enviar mensagem de boas-vindas para ${to}: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      message: `Erro ao enviar mensagem de boas-vindas: ${error.message}` 
    });
  }
}

/**
 * Desconecta a integração
 * @param {object} req - Requisição
 * @param {object} res - Resposta
 */
async function disconnect(req, res) {
  try {
    const result = await whatsappWebService.disconnectClient();
    
    addActivityLog('disconnect', result.success ? 'success' : 'error', result.message);
    
    res.json(result);
  } catch (error) {
    console.error('Erro ao desconectar:', error);
    addActivityLog('disconnect', 'error', `Erro ao desconectar: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      message: `Erro ao desconectar: ${error.message}` 
    });
  }
}

/**
 * Obtém estatísticas de mensagens
 * @param {object} req - Requisição
 * @param {object} res - Resposta
 */
function getMessageStats(req, res) {
  res.json(messageStats);
}

/**
 * Obtém custos estimados
 * @param {object} req - Requisição
 * @param {object} res - Resposta
 */
function getEstimatedCosts(req, res) {
  const config = whatsappConfig.getActiveConfig();
  
  // WhatsApp Web não tem custos
  const costs = {
    integrationType: 'WHATSAPP_WEB',
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
  
  res.json(costs);
}

/**
 * Obtém logs de atividade
 * @param {object} req - Requisição
 * @param {object} res - Resposta
 */
function getLogs(req, res) {
  res.json(activityLogs);
}

/**
 * Alterna o tipo de integração
 * @param {object} req - Requisição
 * @param {object} res - Resposta
 */
function switchIntegrationType(req, res) {
  const { type } = req.body;
  
  if (type !== 'WHATSAPP_WEB' && type !== 'BUSINESS_API') {
    return res.status(400).json({ 
      success: false, 
      message: 'Tipo de integração inválido. Use WHATSAPP_WEB ou BUSINESS_API' 
    });
  }
  
  try {
    // Atualmente só suportamos WHATSAPP_WEB
    if (type === 'BUSINESS_API') {
      return res.status(400).json({
        success: false,
        message: 'Integração com WhatsApp Business API não implementada'
      });
    }
    
    addActivityLog('switchType', 'success', `Tipo de integração alterado para ${type}`);
    
    res.json({ 
      success: true, 
      message: `Integração alterada para ${type}` 
    });
  } catch (error) {
    console.error('Erro ao alterar tipo de integração:', error);
    addActivityLog('switchType', 'error', `Erro ao alterar tipo de integração: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      message: `Erro ao alterar tipo de integração: ${error.message}` 
    });
  }
}

module.exports = {
  initializeIntegration,
  getStatus,
  getQRCode,
  sendMessage,
  sendWelcomeMessage,
  disconnect,
  getMessageStats,
  getEstimatedCosts,
  getLogs,
  switchIntegrationType
};
