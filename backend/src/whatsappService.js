// Implementação da autenticação e envio de mensagens WhatsApp
const axios = require('axios');
require('dotenv').config();

// Configurações da API WhatsApp Business
const WHATSAPP_API_VERSION = 'v22.0';
const PHONE_NUMBER_ID = '636925012834337';
const WHATSAPP_BUSINESS_ACCOUNT_ID = '991158666472115';
const TEST_NUMBER = '+1 555 168 0627';

// Token de acesso - em produção, deve ser armazenado em variáveis de ambiente
// Nota: Este é um placeholder, o token real deve ser obtido do Meta Business Manager
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || 'seu_token_de_acesso_aqui';

/**
 * Envia uma mensagem de texto simples via WhatsApp API
 * @param {string} to - Número de telefone do destinatário com código do país
 * @param {string} text - Texto da mensagem a ser enviada
 * @returns {Promise} - Resposta da API
 */
async function sendTextMessage(to, text) {
  try {
    const response = await axios({
      method: 'POST',
      url: `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${PHONE_NUMBER_ID}/messages`,
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      data: {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: to,
        type: 'text',
        text: {
          body: text
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
 * Envia uma mensagem usando um modelo pré-aprovado
 * @param {string} to - Número de telefone do destinatário com código do país
 * @param {string} templateName - Nome do modelo pré-aprovado
 * @param {string} languageCode - Código do idioma (ex: pt_BR, en_US)
 * @param {Array} components - Componentes do modelo (opcional)
 * @returns {Promise} - Resposta da API
 */
async function sendTemplateMessage(to, templateName, languageCode = 'pt_BR', components = []) {
  try {
    const response = await axios({
      method: 'POST',
      url: `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${PHONE_NUMBER_ID}/messages`,
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      data: {
        messaging_product: 'whatsapp',
        to: to,
        type: 'template',
        template: {
          name: templateName,
          language: {
            code: languageCode
          },
          components: components
        }
      }
    });
    
    console.log('Mensagem de modelo enviada com sucesso:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar mensagem de modelo:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Envia o modelo "olá_mundo" para o número especificado
 * @param {string} to - Número de telefone do destinatário
 * @returns {Promise} - Resposta da API
 */
async function sendHelloWorldTemplate(to) {
  return sendTemplateMessage(to, 'olá_mundo', 'en_US');
}

/**
 * Verifica o status da API WhatsApp
 * @returns {Promise<boolean>} - true se a API estiver acessível
 */
async function checkApiStatus() {
  try {
    const response = await axios({
      method: 'GET',
      url: `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${WHATSAPP_BUSINESS_ACCOUNT_ID}`,
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`
      }
    });
    
    console.log('API WhatsApp está acessível:', response.data);
    return true;
  } catch (error) {
    console.error('Erro ao verificar status da API:', error.response?.data || error.message);
    return false;
  }
}

// Exemplo de uso
async function testWhatsAppIntegration() {
  try {
    // Verificar status da API
    const apiStatus = await checkApiStatus();
    if (!apiStatus) {
      console.log('API WhatsApp não está acessível. Verifique suas credenciais.');
      return;
    }
    
    // Enviar mensagem de texto
    await sendTextMessage(TEST_NUMBER, 'Olá! Esta é uma mensagem de teste do nosso aplicativo de treinamento de IA.');
    
    // Enviar mensagem de modelo
    await sendHelloWorldTemplate(TEST_NUMBER);
    
    console.log('Testes de integração concluídos com sucesso!');
  } catch (error) {
    console.error('Falha nos testes de integração:', error);
  }
}

module.exports = {
  sendTextMessage,
  sendTemplateMessage,
  sendHelloWorldTemplate,
  checkApiStatus,
  testWhatsAppIntegration
};
