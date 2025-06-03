// Implementação da integração com WhatsApp-web.js
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs-extra');
const path = require('path');
require('dotenv').config();

// Diretório para armazenar dados da sessão
const SESSION_DIR = path.join(__dirname, '../../.wwebjs_auth');
fs.ensureDirSync(SESSION_DIR);

// Cliente WhatsApp
let client = null;
let qrCodeData = null;
let connectionStatus = 'disconnected';
let clientInfo = {};

/**
 * Inicializa o cliente WhatsApp
 * @returns {Promise} - Promessa que resolve quando o cliente é inicializado
 */
async function initializeClient() {
  if (client) {
    console.log('Cliente já inicializado');
    return { success: true, message: 'Cliente já inicializado' };
  }

  try {
    // Criar cliente com autenticação local
    client = new Client({
      authStrategy: new LocalAuth({ dataPath: SESSION_DIR }),
      puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    });

    // Evento de QR Code
    client.on('qr', (qr) => {
      qrCodeData = qr;
      console.log('QR Code recebido:');
      qrcode.generate(qr, { small: true });
    });

    // Evento de autenticação
    client.on('authenticated', () => {
      console.log('Autenticado com sucesso!');
      qrCodeData = null;
    });

    // Evento de pronto
    client.on('ready', () => {
      connectionStatus = 'connected';
      console.log('Cliente pronto!');
      
      // Obter informações do cliente
      client.getState().then(state => {
        console.log('Estado atual:', state);
      });
      
      client.getInfo().then(info => {
        clientInfo = {
          phoneNumber: info.wid.user,
          name: info.pushname || 'Não disponível'
        };
        console.log('Informações do cliente:', clientInfo);
      }).catch(err => {
        console.error('Erro ao obter informações do cliente:', err);
        clientInfo = {
          phoneNumber: 'Não disponível',
          name: 'Não disponível'
        };
      });
    });

    // Evento de desconexão
    client.on('disconnected', (reason) => {
      connectionStatus = 'disconnected';
      client = null;
      console.log('Cliente desconectado:', reason);
    });

    // Evento de mensagem recebida
    client.on('message', async (message) => {
      console.log('Mensagem recebida:', message.body);
      // Aqui você pode implementar lógica para processar mensagens recebidas
    });

    // Inicializar cliente
    await client.initialize();
    return { success: true, message: 'Cliente inicializado com sucesso' };
  } catch (error) {
    console.error('Erro ao inicializar cliente:', error);
    return { success: false, message: `Erro ao inicializar cliente: ${error.message}` };
  }
}

/**
 * Obtém o QR Code para conexão
 * @returns {Promise} - QR Code em formato de string
 */
async function getQRCode() {
  if (!client) {
    await initializeClient();
  }
  
  if (connectionStatus === 'connected') {
    return { success: false, message: 'Cliente já está conectado' };
  }
  
  // Aguardar até que o QR Code esteja disponível (máximo 30 segundos)
  let attempts = 0;
  while (!qrCodeData && attempts < 30) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    attempts++;
  }
  
  if (!qrCodeData) {
    return { success: false, message: 'Timeout ao aguardar QR Code' };
  }
  
  return { success: true, qrCode: qrCodeData };
}

/**
 * Verifica o status da conexão
 * @returns {Promise} - Status da conexão
 */
async function checkConnectionStatus() {
  if (!client) {
    return { 
      success: true, 
      connected: false, 
      status: 'disconnected',
      data: {}
    };
  }
  
  try {
    const state = await client.getState();
    // Corrigido: Verificar se state é null antes de chamar toLowerCase()
    const statusString = state ? state.toLowerCase() : 'unknown';
    
    return {
      success: true,
      connected: state === 'CONNECTED',
      status: statusString,
      data: clientInfo
    };
  } catch (error) {
    console.error('Erro ao verificar status:', error);
    return {
      success: false,
      connected: false,
      status: 'error',
      message: `Erro ao verificar status: ${error.message}`
    };
  }
}

/**
 * Envia uma mensagem de texto
 * @param {string} to - Número de telefone do destinatário
 * @param {string} text - Texto da mensagem
 * @returns {Promise} - Resultado do envio
 */
async function sendTextMessage(to, text) {
  if (!client) {
    return { success: false, message: 'Cliente não inicializado' };
  }
  
  try {
    // Formatar número (adicionar @c.us se necessário)
    const formattedNumber = to.includes('@c.us') ? to : `${to}@c.us`;
    
    // Enviar mensagem
    const response = await client.sendMessage(formattedNumber, text);
    console.log('Mensagem enviada:', response);
    
    return { 
      success: true, 
      message: 'Mensagem enviada com sucesso',
      messageId: response.id._serialized
    };
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    return { 
      success: false, 
      message: `Erro ao enviar mensagem: ${error.message}` 
    };
  }
}

/**
 * Envia uma mensagem de template para experiência gratuita
 * @param {string} to - Número de telefone do destinatário
 * @returns {Promise} - Resultado do envio
 */
async function sendFreeTrialTemplate(to) {
  const text = "Bem-vindo ao App de Treinamento de IA! 🤖\n\nVocê ganhou uma experiência gratuita de 48 horas para testar nosso sistema.\n\nOpções:\n1. Ver Planos\n2. Começar Agora\n3. Saiba Mais";
  
  return sendTextMessage(to, text);
}

/**
 * Desconecta o cliente
 * @returns {Promise} - Resultado da desconexão
 */
async function disconnectClient() {
  if (!client) {
    return { success: false, message: 'Cliente não inicializado' };
  }
  
  try {
    await client.destroy();
    client = null;
    connectionStatus = 'disconnected';
    qrCodeData = null;
    
    return { success: true, message: 'Cliente desconectado com sucesso' };
  } catch (error) {
    console.error('Erro ao desconectar cliente:', error);
    return { 
      success: false, 
      message: `Erro ao desconectar cliente: ${error.message}` 
    };
  }
}

/**
 * Testa a integração
 * @returns {Promise} - Resultado do teste
 */
async function testWhatsAppWebIntegration() {
  try {
    // Inicializar cliente
    await initializeClient();
    
    // Verificar status
    const status = await checkConnectionStatus();
    console.log('Status da conexão:', status);
    
    if (!status.connected) {
      console.log('Cliente não está conectado. Obtenha o QR Code para conectar.');
      const qrCode = await getQRCode();
      console.log('QR Code disponível');
      return {
        success: false,
        message: 'Cliente não conectado. Escaneie o QR Code para continuar.',
        qrCode: qrCode.qrCode
      };
    }
    
    // Enviar mensagem de teste
    const testNumber = process.env.TEST_PHONE_NUMBER || '5511999999999';
    await sendTextMessage(testNumber, 'Olá! Esta é uma mensagem de teste do nosso aplicativo de treinamento de IA.');
    
    console.log('Teste de integração concluído com sucesso!');
    return {
      success: true,
      message: 'Integração com WhatsApp Web testada com sucesso!'
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
  initializeClient,
  getQRCode,
  checkConnectionStatus,
  sendTextMessage,
  sendFreeTrialTemplate,
  disconnectClient,
  testWhatsAppWebIntegration
};
