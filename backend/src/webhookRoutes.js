// Configuração de webhooks para recebimento de mensagens e eventos do WhatsApp
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
require('dotenv').config();

// Configurações do webhook
const WEBHOOK_VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN || 'token_de_verificacao_personalizado';

// Serviço de WhatsApp para processamento de mensagens
const whatsappService = require('./whatsappService');

// Middleware para verificar assinatura de requisições do WhatsApp
const verifyWhatsAppSignature = (req, res, next) => {
  try {
    const signature = req.headers['x-hub-signature-256'];
    
    // Se não estiver em ambiente de produção, pular verificação
    if (process.env.NODE_ENV !== 'production' || !signature) {
      return next();
    }
    
    const appSecret = process.env.WHATSAPP_APP_SECRET;
    if (!appSecret) {
      console.error('WHATSAPP_APP_SECRET não configurado no ambiente');
      return res.status(500).send('Configuração incompleta');
    }
    
    // Verificar assinatura
    const hmac = crypto.createHmac('sha256', appSecret);
    hmac.update(JSON.stringify(req.body));
    const expectedSignature = 'sha256=' + hmac.digest('hex');
    
    if (signature !== expectedSignature) {
      console.error('Assinatura inválida na requisição do webhook');
      return res.status(403).send('Assinatura inválida');
    }
    
    next();
  } catch (error) {
    console.error('Erro ao verificar assinatura:', error);
    res.status(500).send('Erro interno');
  }
};

// Endpoint para verificação do webhook (GET)
router.get('/', (req, res) => {
  try {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    
    // Verificar modo e token
    if (mode === 'subscribe' && token === WEBHOOK_VERIFY_TOKEN) {
      console.log('Webhook verificado com sucesso');
      return res.status(200).send(challenge);
    }
    
    console.error('Falha na verificação do webhook:', { mode, token });
    return res.status(403).send('Verificação falhou');
  } catch (error) {
    console.error('Erro na verificação do webhook:', error);
    res.status(500).send('Erro interno');
  }
});

// Endpoint para recebimento de eventos (POST)
router.post('/', verifyWhatsAppSignature, async (req, res) => {
  try {
    const body = req.body;
    
    // Registrar evento recebido (para debug)
    console.log('Evento recebido do WhatsApp:', JSON.stringify(body, null, 2));
    
    // Verificar se é um evento válido
    if (!body || !body.object || body.object !== 'whatsapp_business_account') {
      console.error('Evento inválido recebido');
      return res.status(400).send('Evento inválido');
    }
    
    // Processar entradas (pode haver múltiplas)
    if (body.entry && body.entry.length > 0) {
      for (const entry of body.entry) {
        // Processar alterações em cada entrada
        if (entry.changes && entry.changes.length > 0) {
          for (const change of entry.changes) {
            // Verificar se é uma alteração de valor para WhatsApp
            if (change.field === 'messages' && change.value) {
              await processWhatsAppMessage(change.value);
            }
          }
        }
      }
    }
    
    // Sempre responder com 200 OK para confirmar recebimento
    res.status(200).send('OK');
  } catch (error) {
    console.error('Erro ao processar evento do webhook:', error);
    // Ainda retornar 200 para evitar reenvios
    res.status(200).send('Processado com erros');
  }
});

/**
 * Processa mensagens recebidas do WhatsApp
 * @param {Object} value - Objeto de valor da mensagem
 */
async function processWhatsAppMessage(value) {
  try {
    // Verificar se há mensagens
    if (!value.messages || value.messages.length === 0) {
      return;
    }
    
    for (const message of value.messages) {
      // Obter informações do remetente
      const from = message.from;
      const phoneNumberId = value.metadata?.phone_number_id;
      
      // Processar com base no tipo de mensagem
      if (message.type === 'text' && message.text) {
        const text = message.text.body;
        console.log(`Mensagem de texto recebida de ${from}: ${text}`);
        
        // Aqui você pode integrar com seu sistema de IA para gerar respostas
        // Por enquanto, vamos enviar uma resposta simples
        const response = `Recebemos sua mensagem: "${text}". Nosso agente de IA está processando.`;
        await whatsappService.sendTextMessage(from, response);
      } 
      else if (message.type === 'interactive' && message.interactive) {
        console.log(`Mensagem interativa recebida de ${from}:`, message.interactive);
        // Processar mensagens interativas (botões, listas, etc.)
      }
      else if (message.type === 'image' && message.image) {
        console.log(`Imagem recebida de ${from}:`, message.image);
        // Processar imagens
      }
      else {
        console.log(`Mensagem de tipo ${message.type} recebida de ${from}`);
      }
      
      // Registrar a mensagem no banco de dados para treinamento futuro
      // await messageRepository.saveMessage(from, message);
    }
  } catch (error) {
    console.error('Erro ao processar mensagem do WhatsApp:', error);
  }
}

module.exports = router;
