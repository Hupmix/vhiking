// Arquivo de teste para integração WhatsApp
const axios = require('axios');
require('dotenv').config();

// Importar serviço WhatsApp
const whatsappService = require('./whatsappService');

// Número de telefone para teste
const TEST_PHONE_NUMBER = '+1 555 168 0627';

// Função para testar o envio de mensagem de texto
async function testSendTextMessage() {
  console.log('Testando envio de mensagem de texto...');
  try {
    const result = await whatsappService.sendTextMessage(
      TEST_PHONE_NUMBER,
      'Olá! Esta é uma mensagem de teste enviada pelo nosso aplicativo de treinamento de IA. Hora: ' + new Date().toLocaleTimeString()
    );
    console.log('Mensagem enviada com sucesso:', result);
    return result;
  } catch (error) {
    console.error('Erro ao enviar mensagem de texto:', error);
    throw error;
  }
}

// Função para testar o envio de mensagem de modelo
async function testSendTemplateMessage() {
  console.log('Testando envio de mensagem de modelo...');
  try {
    const result = await whatsappService.sendHelloWorldTemplate(TEST_PHONE_NUMBER);
    console.log('Mensagem de modelo enviada com sucesso:', result);
    return result;
  } catch (error) {
    console.error('Erro ao enviar mensagem de modelo:', error);
    throw error;
  }
}

// Função para verificar o status da API
async function testApiStatus() {
  console.log('Verificando status da API WhatsApp...');
  try {
    const result = await whatsappService.checkApiStatus();
    console.log('Status da API:', result ? 'Disponível' : 'Indisponível');
    return result;
  } catch (error) {
    console.error('Erro ao verificar status da API:', error);
    throw error;
  }
}

// Função principal para executar todos os testes
async function runAllTests() {
  console.log('Iniciando testes de integração WhatsApp...');
  
  try {
    // Verificar status da API
    const apiStatus = await testApiStatus();
    if (!apiStatus) {
      console.log('API indisponível. Abortando testes.');
      return;
    }
    
    // Testar envio de mensagem de texto
    await testSendTextMessage();
    
    // Testar envio de mensagem de modelo
    await testSendTemplateMessage();
    
    console.log('Todos os testes concluídos com sucesso!');
  } catch (error) {
    console.error('Falha nos testes:', error);
  }
}

// Executar testes se este arquivo for executado diretamente
if (require.main === module) {
  runAllTests();
}

module.exports = {
  testSendTextMessage,
  testSendTemplateMessage,
  testApiStatus,
  runAllTests
};
