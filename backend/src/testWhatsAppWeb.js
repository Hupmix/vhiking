// Script para testar a integração com WhatsApp-web.js
const whatsappWebService = require('./whatsappWebService');

/**
 * Função principal para testar a integração
 */
async function testWhatsAppWebIntegration() {
  try {
    console.log('Iniciando teste de integração com WhatsApp-web.js...');
    
    // Inicializar cliente
    console.log('Inicializando cliente...');
    const initResult = await whatsappWebService.initializeClient();
    console.log('Resultado da inicialização:', initResult);
    
    if (!initResult.success) {
      console.error('Falha ao inicializar cliente');
      return;
    }
    
    // Verificar status
    console.log('Verificando status da conexão...');
    const status = await whatsappWebService.checkConnectionStatus();
    console.log('Status da conexão:', status);
    
    if (!status.connected) {
      console.log('Cliente não está conectado. Gerando QR Code...');
      const qrResult = await whatsappWebService.getQRCode();
      
      if (qrResult.success) {
        console.log('QR Code gerado com sucesso. Escaneie com seu WhatsApp:');
        console.log(qrResult.qrCode);
        console.log('Aguardando conexão...');
        
        // Aguardar até que o cliente esteja conectado (máximo 2 minutos)
        let connected = false;
        let attempts = 0;
        while (!connected && attempts < 24) {
          await new Promise(resolve => setTimeout(resolve, 5000)); // Aguardar 5 segundos
          const currentStatus = await whatsappWebService.checkConnectionStatus();
          connected = currentStatus.connected;
          attempts++;
          
          if (connected) {
            console.log('Cliente conectado com sucesso!');
            break;
          } else {
            console.log(`Aguardando conexão... (tentativa ${attempts}/24)`);
          }
        }
        
        if (!connected) {
          console.error('Timeout ao aguardar conexão');
          return;
        }
      } else {
        console.error('Falha ao gerar QR Code:', qrResult.message);
        return;
      }
    }
    
    // Enviar mensagem de teste
    console.log('Enviando mensagem de teste...');
    const testNumber = process.env.TEST_PHONE_NUMBER || '5511999999999';
    const sendResult = await whatsappWebService.sendTextMessage(
      testNumber, 
      'Olá! Esta é uma mensagem de teste do nosso aplicativo de treinamento de IA.'
    );
    
    console.log('Resultado do envio:', sendResult);
    
    if (sendResult.success) {
      console.log('Mensagem enviada com sucesso!');
    } else {
      console.error('Falha ao enviar mensagem:', sendResult.message);
    }
    
    console.log('Teste de integração concluído!');
  } catch (error) {
    console.error('Erro durante o teste de integração:', error);
  }
}

// Executar teste
testWhatsAppWebIntegration();
