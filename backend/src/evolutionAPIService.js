// Implementação da integração com Evolution API para WhatsApp
const axios = require('axios');
require('dotenv').config();

// Configurações da Evolution API
const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL || 'http://localhost:8080';
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY || 'sua_chave_api_aqui';
const INSTANCE_NAME = process.env.EVOLUTION_INSTANCE_NAME || 'app_treinamento_ia';

/**
 * Inicializa uma instância do WhatsApp na Evolution API
 * @returns {Promise} - Resposta da API
 */
async function initializeInstance() {
  try {
    const response = await axios({
      method: 'POST',
      url: `${EVOLUTION_API_URL}/instance/init`,
      headers: {
        'Content-Type': 'application/json',
        'apikey': EVOLUTION_API_KEY
      },
      data: {
        instanceName: INSTANCE_NAME,
        webhook: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/webhook/whatsapp`,
        webhookByEvents: true,
        events: [
          'QRCODE_UPDATED',
          'MESSAGES_UPSERT',
          'MESSAGES_UPDATE',
          'CONNECTION_UPDATE'
        ]
      }
    });
    
    console.log('Instância inicializada com sucesso:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao inicializar instância:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Obtém o QR Code para conexão do WhatsApp
 * @returns {Promise} - Resposta da API contendo o QR Code
 */
async function getQRCode() {
  try {
    const response = await axios({
      method: 'GET',
      url: `${EVOLUTION_API_URL}/instance/qrcode?instanceName=${INSTANCE_NAME}`,
      headers: {
        'apikey': EVOLUTION_API_KEY
      }
    });
    
    console.log('QR Code obtido com sucesso');
    return response.data;
  } catch (error) {
    console.error('Erro ao obter QR Code:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Verifica o status da conexão da instância
 * @returns {Promise} - Resposta da API com o status
 */
async function checkConnectionStatus() {
  try {
    const response = await axios({
      method: 'GET',
      url: `${EVOLUTION_API_URL}/instance/connectionState?instanceName=${INSTANCE_NAME}`,
      headers: {
        'apikey': EVOLUTION_API_KEY
      }
    });
    
    console.log('Status da conexão:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao verificar status da conexão:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Envia uma mensagem de texto simples via WhatsApp
 * @param {string} to - Número de telefone do destinatário com código do país
 * @param {string} text - Texto da mensagem a ser enviada
 * @returns {Promise} - Resposta da API
 */
async function sendTextMessage(to, text) {
  try {
    const response = await axios({
      method: 'POST',
      url: `${EVOLUTION_API_URL}/message/text?instanceName=${INSTANCE_NAME}`,
      headers: {
        'Content-Type': 'application/json',
        'apikey': EVOLUTION_API_KEY
      },
      data: {
        number: to,
        options: {
          delay: 1200
        },
        textMessage: {
          text: text
        }
      }
    });
    
    console.log('Mensagem enviada com sucesso:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Envia uma mensagem de template (botões) via WhatsApp
 * @param {string} to - Número de telefone do destinatário com código do país
 * @param {string} text - Texto principal da mensagem
 * @param {string} footer - Texto do rodapé (opcional)
 * @param {Array} buttons - Array de botões com texto
 * @returns {Promise} - Resposta da API
 */
async function sendButtonMessage(to, text, footer = '', buttons = []) {
  try {
    const formattedButtons = buttons.map(button => ({
      buttonText: {
        displayText: button
      },
      type: 1
    }));

    const response = await axios({
      method: 'POST',
      url: `${EVOLUTION_API_URL}/message/button?instanceName=${INSTANCE_NAME}`,
      headers: {
        'Content-Type': 'application/json',
        'apikey': EVOLUTION_API_KEY
      },
      data: {
        number: to,
        options: {
          delay: 1200
        },
        buttonMessage: {
          title: text,
          description: '',
          footerText: footer,
          buttons: formattedButtons
        }
      }
    });
    
    console.log('Mensagem com botões enviada com sucesso:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar mensagem com botões:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Envia uma mensagem de template para experiência gratuita
 * @param {string} to - Número de telefone do destinatário
 * @returns {Promise} - Resposta da API
 */
async function sendFreeTrialTemplate(to) {
  const text = "Bem-vindo ao App de Treinamento de IA! 🤖\n\nVocê ganhou uma experiência gratuita de 48 horas para testar nosso sistema.";
  const footer = "Sua experiência expira em 48 horas";
  const buttons = ["Ver Planos", "Começar Agora", "Saiba Mais"];
  
  return sendButtonMessage(to, text, footer, buttons);
}

/**
 * Desconecta a instância do WhatsApp
 * @returns {Promise} - Resposta da API
 */
async function disconnectInstance() {
  try {
    const response = await axios({
      method: 'DELETE',
      url: `${EVOLUTION_API_URL}/instance/logout?instanceName=${INSTANCE_NAME}`,
      headers: {
        'apikey': EVOLUTION_API_KEY
      }
    });
    
    console.log('Instância desconectada com sucesso:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao desconectar instância:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Testa a integração com a Evolution API
 */
async function testEvolutionAPIIntegration() {
  try {
    // Inicializar instância
    await initializeInstance();
    
    // Verificar status da conexão
    const status = await checkConnectionStatus();
    console.log('Status da conexão:', status);
    
    if (status.state !== 'open') {
      console.log('Instância não está conectada. Obtenha o QR Code para conectar.');
      const qrCode = await getQRCode();
      console.log('QR Code URL:', qrCode.qrcode);
      return {
        success: false,
        message: 'Instância não conectada. Escaneie o QR Code para continuar.',
        qrCode: qrCode.qrcode
      };
    }
    
    // Enviar mensagem de teste
    const testNumber = process.env.TEST_PHONE_NUMBER || '5511999999999';
    await sendTextMessage(testNumber, 'Olá! Esta é uma mensagem de teste do nosso aplicativo de treinamento de IA.');
    
    // Enviar mensagem de template
    await sendFreeTrialTemplate(testNumber);
    
    console.log('Testes de integração concluídos com sucesso!');
    return {
      success: true,
      message: 'Integração com Evolution API testada com sucesso!'
    };
  } catch (error) {
    console.error('Falha nos testes de integração:', error);
    return {
      success: false,
      message: `Erro nos testes: ${error.message}`,
      error
    };
  }
}

module.exports = {
  initializeInstance,
  getQRCode,
  checkConnectionStatus,
  sendTextMessage,
  sendButtonMessage,
  sendFreeTrialTemplate,
  disconnectInstance,
  testEvolutionAPIIntegration
};
