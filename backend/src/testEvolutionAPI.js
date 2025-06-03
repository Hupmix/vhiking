// Script para testar a integração com Evolution API
require('dotenv').config();
const evolutionAPIService = require('./evolutionAPIService');

// Configurações para teste
const TEST_PHONE_NUMBER = process.env.TEST_PHONE_NUMBER || '5511999999999';

async function runTests() {
  console.log('Iniciando testes de integração com Evolution API...');
  
  try {
    // 1. Inicializar instância
    console.log('1. Inicializando instância...');
    const initResult = await evolutionAPIService.initializeInstance();
    console.log('Resultado da inicialização:', initResult);
    
    // 2. Verificar status da conexão
    console.log('\n2. Verificando status da conexão...');
    const status = await evolutionAPIService.checkConnectionStatus();
    console.log('Status da conexão:', status);
    
    // 3. Se não estiver conectado, obter QR Code
    if (status.state !== 'open') {
      console.log('\n3. Instância não está conectada. Obtendo QR Code...');
      const qrCode = await evolutionAPIService.getQRCode();
      console.log('QR Code URL:', qrCode.qrcode);
      console.log('Escaneie o QR Code acima com seu WhatsApp para conectar a instância.');
      console.log('Após escanear, execute este teste novamente para continuar.');
      return;
    }
    
    // 4. Enviar mensagem de texto simples
    console.log('\n4. Enviando mensagem de texto simples...');
    const textMessageResult = await evolutionAPIService.sendTextMessage(
      TEST_PHONE_NUMBER, 
      'Olá! Esta é uma mensagem de teste do nosso aplicativo de treinamento de IA.'
    );
    console.log('Resultado do envio de mensagem de texto:', textMessageResult);
    
    // 5. Enviar mensagem com botões (template de experiência gratuita)
    console.log('\n5. Enviando mensagem com botões (template de experiência gratuita)...');
    const templateResult = await evolutionAPIService.sendFreeTrialTemplate(TEST_PHONE_NUMBER);
    console.log('Resultado do envio de template:', templateResult);
    
    console.log('\nTodos os testes foram concluídos com sucesso!');
  } catch (error) {
    console.error('\nErro durante os testes:', error.message);
    console.error('Detalhes do erro:', error);
  }
}

// Executar testes
runTests().then(() => {
  console.log('\nScript de teste finalizado.');
}).catch(error => {
  console.error('\nErro fatal durante a execução dos testes:', error);
});
