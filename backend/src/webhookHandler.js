// Manipulador de webhooks para integração com WhatsApp
const fs = require('fs');
const path = require('path');
const whatsappConfig = require('./whatsappConfig');

// Diretório para logs de webhook
const LOGS_DIR = path.join(__dirname, '../logs');
if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
}

// Contador de mensagens para estatísticas
let messageStats = {
  received: 0,
  sent: 0,
  templates: 0,
  media: 0,
  lastUpdated: new Date().toISOString()
};

/**
 * Processa webhooks da Evolution API
 * @param {Object} payload - Dados do webhook
 * @returns {Object} - Resultado do processamento
 */
function processEvolutionWebhook(payload) {
  try {
    // Registrar webhook para depuração se habilitado
    if (whatsappConfig.GENERAL_CONFIG.logWebhooks) {
      logWebhook('evolution', payload);
    }

    // Processar diferentes tipos de eventos
    if (payload.event === 'MESSAGES_UPSERT') {
      // Incrementar contador de mensagens recebidas
      if (payload.data?.messages?.length > 0) {
        messageStats.received += payload.data.messages.length;
        messageStats.lastUpdated = new Date().toISOString();
        
        // Aqui você pode adicionar lógica para processar mensagens recebidas
        // Por exemplo, encaminhar para o agente de IA, salvar no banco de dados, etc.
      }
    } else if (payload.event === 'QRCODE_UPDATED') {
      // Registrar atualização de QR Code
      console.log('QR Code atualizado:', payload.data?.qrcode);
    } else if (payload.event === 'CONNECTION_UPDATE') {
      // Registrar atualização de status de conexão
      console.log('Status de conexão atualizado:', payload.data?.state);
    }

    return {
      success: true,
      message: `Webhook processado: ${payload.event}`,
      stats: messageStats
    };
  } catch (error) {
    console.error('Erro ao processar webhook da Evolution API:', error);
    return {
      success: false,
      message: `Erro ao processar webhook: ${error.message}`,
      error: error.message
    };
  }
}

/**
 * Processa webhooks da API do WhatsApp Business
 * @param {Object} payload - Dados do webhook
 * @returns {Object} - Resultado do processamento
 */
function processBusinessWebhook(payload) {
  try {
    // Registrar webhook para depuração se habilitado
    if (whatsappConfig.GENERAL_CONFIG.logWebhooks) {
      logWebhook('business', payload);
    }

    // Processar diferentes tipos de eventos
    if (payload.object === 'whatsapp_business_account') {
      // Processar entradas de mensagens
      if (payload.entry && payload.entry.length > 0) {
        for (const entry of payload.entry) {
          if (entry.changes && entry.changes.length > 0) {
            for (const change of entry.changes) {
              if (change.value && change.value.messages && change.value.messages.length > 0) {
                // Incrementar contador de mensagens recebidas
                messageStats.received += change.value.messages.length;
                messageStats.lastUpdated = new Date().toISOString();
                
                // Aqui você pode adicionar lógica para processar mensagens recebidas
                // Por exemplo, encaminhar para o agente de IA, salvar no banco de dados, etc.
              }
            }
          }
        }
      }
    }

    return {
      success: true,
      message: 'Webhook processado com sucesso',
      stats: messageStats
    };
  } catch (error) {
    console.error('Erro ao processar webhook da API do WhatsApp Business:', error);
    return {
      success: false,
      message: `Erro ao processar webhook: ${error.message}`,
      error: error.message
    };
  }
}

/**
 * Registra dados de webhook em arquivo de log
 * @param {string} type - Tipo de webhook (evolution ou business)
 * @param {Object} data - Dados do webhook
 */
function logWebhook(type, data) {
  const timestamp = new Date().toISOString();
  const logFile = path.join(LOGS_DIR, `webhook_${type}_${new Date().toISOString().split('T')[0]}.log`);
  
  const logEntry = {
    timestamp,
    type,
    data
  };
  
  fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
}

/**
 * Obtém estatísticas de mensagens
 * @returns {Object} - Estatísticas de mensagens
 */
function getMessageStats() {
  return messageStats;
}

/**
 * Reseta estatísticas de mensagens
 */
function resetMessageStats() {
  messageStats = {
    received: 0,
    sent: 0,
    templates: 0,
    media: 0,
    lastUpdated: new Date().toISOString()
  };
  return messageStats;
}

/**
 * Processa webhook com base no tipo de integração ativa
 * @param {Object} payload - Dados do webhook
 * @returns {Object} - Resultado do processamento
 */
function processWebhook(payload) {
  const activeConfig = whatsappConfig.getActiveConfig();
  
  if (activeConfig.integrationType === 'EVOLUTION_API') {
    return processEvolutionWebhook(payload);
  } else {
    return processBusinessWebhook(payload);
  }
}

module.exports = {
  processWebhook,
  getMessageStats,
  resetMessageStats
};
