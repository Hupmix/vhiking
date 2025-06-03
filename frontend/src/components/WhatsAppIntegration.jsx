import React, { useState, useEffect } from 'react';
import { Card, Button, Alert, Spinner, Badge, Container, Row, Col, Tabs, Tab, Form, Table } from 'react-bootstrap';
import QRCode from 'qrcode.react';
import WhatsAppService from '../services/whatsappService';
import './WhatsAppIntegration.css';

const WhatsAppIntegration = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({
    connected: false,
    status: 'disconnected',
    integrationType: 'EVOLUTION_API',
    phoneNumber: '',
    businessName: ''
  });
  const [qrCode, setQrCode] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [activeTab, setActiveTab] = useState('status');
  const [testNumber, setTestNumber] = useState('');
  const [testMessage, setTestMessage] = useState('');
  const [stats, setStats] = useState({
    received: 0,
    sent: 0,
    templates: 0,
    media: 0,
    lastUpdated: new Date().toISOString()
  });
  const [costs, setCosts] = useState({
    integrationType: 'EVOLUTION_API',
    costs: {
      setupFee: 0,
      monthlyFee: 0,
      messageReceived: 0,
      messageSent: 0,
      templateMessage: 0,
      mediaMessage: 0
    },
    estimatedTotal: 0
  });
  const [logs, setLogs] = useState([]);

  // Buscar status da integração
  const fetchStatus = async () => {
    setLoading(true);
    try {
      const response = await WhatsAppService.getStatus();
      if (response.success) {
        setStatus({
          connected: response.connected,
          status: response.status,
          integrationType: response.integrationType,
          phoneNumber: response.data?.phoneNumber || '',
          businessName: response.data?.businessName || ''
        });
        
        // Se não estiver conectado, ocultar QR Code
        if (!response.connected) {
          setShowQR(false);
        }
      } else {
        setMessage({
          text: response.message || 'Erro ao obter status da integração',
          type: 'danger'
        });
      }
    } catch (error) {
      setMessage({
        text: `Erro ao obter status: ${error.message}`,
        type: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  // Gerar QR Code para conexão
  const generateQRCode = async () => {
    setLoading(true);
    try {
      // Primeiro inicializar a integração
      await WhatsAppService.initializeIntegration();
      
      // Depois obter o QR Code
      const response = await WhatsAppService.getQRCode();
      if (response.success && response.qrCode) {
        setQrCode(response.qrCode);
        setShowQR(true);
        setMessage({
          text: 'QR Code gerado com sucesso. Escaneie com seu WhatsApp para conectar.',
          type: 'success'
        });
      } else {
        setMessage({
          text: response.message || 'Erro ao gerar QR Code',
          type: 'danger'
        });
      }
    } catch (error) {
      setMessage({
        text: `Erro ao gerar QR Code: ${error.message}`,
        type: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  // Desconectar WhatsApp
  const disconnectWhatsApp = async () => {
    setLoading(true);
    try {
      const response = await WhatsAppService.disconnect();
      if (response.success) {
        setStatus(prev => ({
          ...prev,
          connected: false,
          status: 'disconnected'
        }));
        setShowQR(false);
        setMessage({
          text: 'WhatsApp desconectado com sucesso',
          type: 'success'
        });
      } else {
        setMessage({
          text: response.message || 'Erro ao desconectar WhatsApp',
          type: 'danger'
        });
      }
    } catch (error) {
      setMessage({
        text: `Erro ao desconectar WhatsApp: ${error.message}`,
        type: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  // Reconectar WhatsApp
  const reconnectWhatsApp = async () => {
    setLoading(true);
    try {
      // Primeiro inicializar a integração
      await WhatsAppService.initializeIntegration();
      
      // Verificar status
      await fetchStatus();
      
      setMessage({
        text: 'Tentativa de reconexão iniciada. Verifique o status.',
        type: 'info'
      });
    } catch (error) {
      setMessage({
        text: `Erro ao reconectar WhatsApp: ${error.message}`,
        type: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  // Enviar mensagem de teste
  const sendTestMessage = async (e) => {
    e.preventDefault();
    if (!testNumber || !testMessage) {
      setMessage({
        text: 'Por favor, preencha o número e a mensagem de teste.',
        type: 'warning'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await WhatsAppService.sendTextMessage(testNumber, testMessage);
      if (response.success) {
        setMessage({
          text: 'Mensagem de teste enviada com sucesso!',
          type: 'success'
        });
        // Atualizar estatísticas
        fetchStats();
      } else {
        setMessage({
          text: response.message || 'Erro ao enviar mensagem',
          type: 'danger'
        });
      }
    } catch (error) {
      setMessage({
        text: `Erro ao enviar mensagem: ${error.message}`,
        type: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  // Buscar estatísticas
  const fetchStats = async () => {
    try {
      const response = await WhatsAppService.getMessageStats();
      if (response) {
        setStats(response);
      }
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
    }
  };

  // Buscar custos
  const fetchCosts = async () => {
    try {
      const response = await WhatsAppService.getEstimatedCosts();
      if (response) {
        setCosts(response);
      }
    } catch (error) {
      console.error('Erro ao obter custos:', error);
    }
  };

  // Buscar logs
  const fetchLogs = async () => {
    try {
      const response = await WhatsAppService.getLogs();
      if (response) {
        setLogs(response);
      }
    } catch (error) {
      console.error('Erro ao obter logs:', error);
    }
  };

  // Alternar tipo de integração
  const switchIntegrationType = async (type) => {
    setLoading(true);
    try {
      const response = await WhatsAppService.switchIntegrationType(type);
      if (response.success) {
        setStatus(prev => ({
          ...prev,
          integrationType: type
        }));
        setMessage({
          text: `Tipo de integração alterado para ${type}`,
          type: 'success'
        });
        // Atualizar status
        fetchStatus();
      } else {
        setMessage({
          text: response.message || `Erro ao alterar tipo de integração para ${type}`,
          type: 'danger'
        });
      }
    } catch (error) {
      setMessage({
        text: `Erro ao alterar tipo de integração: ${error.message}`,
        type: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados iniciais
  useEffect(() => {
    fetchStatus();
    fetchStats();
    fetchCosts();
    fetchLogs();
    
    // Verificar status e estatísticas periodicamente
    const statusInterval = setInterval(() => {
      if (activeTab === 'status') fetchStatus();
      if (activeTab === 'stats') fetchStats();
      if (activeTab === 'costs') fetchCosts();
      if (activeTab === 'logs') fetchLogs();
    }, 30000); // a cada 30 segundos
    
    return () => clearInterval(statusInterval);
  }, [activeTab]);

  return (
    <Container className="whatsapp-integration-container">
      <h2>Integração com WhatsApp</h2>
      
      {message.text && (
        <Alert variant={message.type} onClose={() => setMessage({ text: '', type: '' })} dismissible>
          {message.text}
        </Alert>
      )}
      
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-3"
      >
        <Tab eventKey="status" title="Status">
          <Row>
            <Col md={6}>
              <Card className="mb-4">
                <Card.Header as="h5">Status da Conexão</Card.Header>
                <Card.Body>
                  <p>Estado atual da conexão com WhatsApp</p>
                  
                  <div className="status-info">
                    <p>
                      <Badge bg={status.connected ? 'success' : 'danger'} className="status-badge">
                        {status.connected ? 'Conectado' : 'Desconectado'}
                      </Badge>
                    </p>
                    
                    {status.connected && (
                      <>
                        <p>Conectado desde: {new Date().toLocaleString()}</p>
                        <p>Número: {status.phoneNumber || 'Não disponível'}</p>
                        <p>Nome: {status.businessName || 'Não disponível'}</p>
                      </>
                    )}
                    
                    <div className="mt-3">
                      {status.connected ? (
                        <Button 
                          variant="danger" 
                          onClick={disconnectWhatsApp} 
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                              <span className="ms-2">Processando...</span>
                            </>
                          ) : (
                            'Desconectar'
                          )}
                        </Button>
                      ) : (
                        <Button 
                          variant="primary" 
                          onClick={reconnectWhatsApp} 
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                              <span className="ms-2">Processando...</span>
                            </>
                          ) : (
                            'Reconectar'
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </Card.Body>
              </Card>
              
              <Card className="mb-4">
                <Card.Header as="h5">Tipo de Integração</Card.Header>
                <Card.Body>
                  <p>Selecione o tipo de integração com WhatsApp</p>
                  
                  <div className="d-flex">
                    <Button 
                      variant={status.integrationType === 'EVOLUTION_API' ? 'primary' : 'outline-primary'} 
                      onClick={() => switchIntegrationType('EVOLUTION_API')}
                      disabled={loading || status.integrationType === 'EVOLUTION_API'}
                      className="me-2"
                    >
                      Evolution API
                    </Button>
                    
                    <Button 
                      variant={status.integrationType === 'BUSINESS_API' ? 'primary' : 'outline-primary'} 
                      onClick={() => switchIntegrationType('BUSINESS_API')}
                      disabled={loading || status.integrationType === 'BUSINESS_API'}
                    >
                      WhatsApp Business API
                    </Button>
                  </div>
                  
                  <div className="mt-3">
                    <small className="text-muted">
                      {status.integrationType === 'EVOLUTION_API' 
                        ? 'Evolution API não requer validação comercial e não tem custos por mensagem.' 
                        : 'WhatsApp Business API requer validação comercial e tem custos por mensagem.'}
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={6}>
              <Card className="mb-4">
                <Card.Header as="h5">QR Code</Card.Header>
                <Card.Body>
                  <p>Escaneie para conectar ao WhatsApp</p>
                  
                  {showQR && qrCode ? (
                    <div className="qrcode-container">
                      <QRCode value={qrCode} size={200} />
                      <p className="mt-2">Escaneie este QR Code com seu WhatsApp para conectar</p>
                    </div>
                  ) : (
                    <div className="qrcode-placeholder">
                      <p>QR Code seria exibido aqui</p>
                    </div>
                  )}
                  
                  <div className="mt-3">
                    <Button 
                      variant="primary" 
                      onClick={generateQRCode} 
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                          <span className="ms-2">Gerando...</span>
                        </>
                      ) : (
                        'Gerar Novo QR Code'
                      )}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>
        
        <Tab eventKey="test" title="Teste">
          <Card>
            <Card.Header as="h5">Enviar Mensagem de Teste</Card.Header>
            <Card.Body>
              <Form onSubmit={sendTestMessage}>
                <Form.Group className="mb-3">
                  <Form.Label>Número de Telefone (com código do país)</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Ex: 5511999999999" 
                    value={testNumber}
                    onChange={(e) => setTestNumber(e.target.value)}
                    required
                  />
                  <Form.Text className="text-muted">
                    Inclua o código do país e DDD, sem espaços ou caracteres especiais.
                  </Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Mensagem</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={3} 
                    placeholder="Digite sua mensagem de teste" 
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    required
                  />
                </Form.Group>
                
                <Button variant="primary" type="submit" disabled={loading || !status.connected}>
                  {loading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                      <span className="ms-2">Enviando...</span>
                    </>
                  ) : (
                    'Enviar Mensagem'
                  )}
                </Button>
                
                {!status.connected && (
                  <Alert variant="warning" className="mt-3">
                    É necessário conectar o WhatsApp antes de enviar mensagens. Vá para a aba "Status" e escaneie o QR Code.
                  </Alert>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Tab>
        
        <Tab eventKey="stats" title="Estatísticas">
          <Card>
            <Card.Body>
              <h4>Estatísticas de Mensagens</h4>
              <div className="stats-container">
                <div className="stat-card">
                  <h5>Recebidas</h5>
                  <div className="stat-value">{stats.received}</div>
                </div>
                
                <div className="stat-card">
                  <h5>Enviadas</h5>
                  <div className="stat-value">{stats.sent}</div>
                </div>
                
                <div className="stat-card">
                  <h5>Templates</h5>
                  <div className="stat-value">{stats.templates}</div>
                </div>
                
                <div className="stat-card">
                  <h5>Mídia</h5>
                  <div className="stat-value">{stats.media}</div>
                </div>
              </div>
              
              <p className="text-muted mt-3">
                Última atualização: {new Date(stats.lastUpdated).toLocaleString()}
              </p>
              
              <Button 
                variant="outline-primary" 
                onClick={fetchStats}
                disabled={loading}
              >
                Atualizar Estatísticas
              </Button>
            </Card.Body>
          </Card>
        </Tab>
        
        <Tab eventKey="costs" title="Custos">
          <Card>
            <Card.Body>
              <h4>Custos Estimados</h4>
              <p>
                <strong>Tipo de Integração:</strong>{' '}
                {costs.integrationType === 'EVOLUTION_API' ? 'Evolution API' : 'WhatsApp Business API'}
              </p>
              
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Custo Unitário</th>
                    <th>Quantidade</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Taxa de Configuração</td>
                    <td>R$ {costs.costs.setupFee.toFixed(2)}</td>
                    <td>1</td>
                    <td>R$ {costs.costs.setupFee.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Mensalidade</td>
                    <td>R$ {costs.costs.monthlyFee.toFixed(2)}</td>
                    <td>1</td>
                    <td>R$ {costs.costs.monthlyFee.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Mensagens Recebidas</td>
                    <td>R$ {costs.costs.messageReceived.toFixed(4)}</td>
                    <td>{stats.received}</td>
                    <td>R$ {(costs.costs.messageReceived * stats.received).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Mensagens Enviadas</td>
                    <td>R$ {costs.costs.messageSent.toFixed(4)}</td>
                    <td>{stats.sent}</td>
                    <td>R$ {(costs.costs.messageSent * stats.sent).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Mensagens de Template</td>
                    <td>R$ {costs.costs.templateMessage.toFixed(4)}</td>
                    <td>{stats.templates}</td>
                    <td>R$ {(costs.costs.templateMessage * stats.templates).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Mensagens de Mídia</td>
                    <td>R$ {costs.costs.mediaMessage.toFixed(4)}</td>
                    <td>{stats.media}</td>
                    <td>R$ {(costs.costs.mediaMessage * stats.media).toFixed(2)}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <th colSpan="3">Total Estimado</th>
                    <th>R$ {costs.estimatedTotal.toFixed(2)}</th>
                  </tr>
                </tfoot>
              </Table>
              
              <div className="alert alert-info">
                <strong>Nota:</strong> Os custos da Evolution API são zero, pois é uma solução gratuita. 
                Os custos da WhatsApp Business API são baseados na tabela de preços oficial da Meta.
              </div>
              
              <Button 
                variant="outline-primary" 
                onClick={fetchCosts}
                disabled={loading}
              >
                Atualizar Custos
              </Button>
            </Card.Body>
          </Card>
        </Tab>
        
        <Tab eventKey="logs" title="Logs">
          <Card>
            <Card.Body>
              <h4>Logs de Integração</h4>
              <div className="logs-container">
                {logs.length > 0 ? (
                  logs.map((log, index) => (
                    <div key={index} className={`log-entry log-${log.type}`}>
                      <span className="log-timestamp">{new Date(log.timestamp).toLocaleString()}</span>
                      <span className="log-message">{log.message}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">Nenhum log disponível.</p>
                )}
              </div>
              
              <Button 
                variant="outline-primary" 
                onClick={fetchLogs}
                disabled={loading}
                className="mt-3"
              >
                Atualizar Logs
              </Button>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default WhatsAppIntegration;
