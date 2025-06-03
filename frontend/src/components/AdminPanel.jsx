import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Tab, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import WhatsAppIntegration from './WhatsAppIntegration';
import AuthService from '../services/authService';
import './AdminPanel.css';

const AdminPanel = () => {
  const [activeKey, setActiveKey] = useState('dashboard');
  const navigate = useNavigate();
  
  useEffect(() => {
    // Verificar se o usuário é administrador
    if (!AuthService.isAdmin()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };

  return (
    <Container fluid className="admin-panel">
      <Row className="header">
        <Col>
          <h2>Painel Administrativo</h2>
        </Col>
        <Col xs="auto">
          <div className="user-info">
            <span>Olá, {AuthService.getCurrentUser().name || 'Administrador'}</span>
            <button className="logout-btn" onClick={handleLogout}>Sair</button>
          </div>
        </Col>
      </Row>
      
      <Row className="main-content">
        <Col md={2} className="sidebar">
          <Nav variant="pills" className="flex-column" activeKey={activeKey} onSelect={(k) => setActiveKey(k)}>
            <Nav.Item>
              <Nav.Link eventKey="dashboard">Dashboard</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="treinamento">Treinamento</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="simulador">Simulador</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="whatsapp">WhatsApp</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="configuracoes">Configurações</Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        
        <Col md={10} className="content-area">
          <Tab.Content>
            <Tab.Pane eventKey="dashboard">
              <h3>Dashboard</h3>
              <Row>
                <Col md={4}>
                  <Card className="stat-card">
                    <Card.Body>
                      <Card.Title>Usuários</Card.Title>
                      <div className="stat-value">42</div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="stat-card">
                    <Card.Body>
                      <Card.Title>Agentes Treinados</Card.Title>
                      <div className="stat-value">18</div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="stat-card">
                    <Card.Body>
                      <Card.Title>Mensagens Enviadas</Card.Title>
                      <div className="stat-value">1,254</div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              
              <Row className="mt-4">
                <Col>
                  <Card>
                    <Card.Header>Atividade Recente</Card.Header>
                    <Card.Body>
                      <div className="activity-log">
                        <div className="activity-item">
                          <span className="timestamp">24/05/2025 15:30</span>
                          <span className="description">Novo usuário registrado: maria@exemplo.com</span>
                        </div>
                        <div className="activity-item">
                          <span className="timestamp">24/05/2025 14:45</span>
                          <span className="description">Agente de IA treinado para Atendimento ao Cliente</span>
                        </div>
                        <div className="activity-item">
                          <span className="timestamp">24/05/2025 13:20</span>
                          <span className="description">Integração com WhatsApp atualizada</span>
                        </div>
                        <div className="activity-item">
                          <span className="timestamp">24/05/2025 11:05</span>
                          <span className="description">Novo plano de assinatura adquirido: Premium</span>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab.Pane>
            
            <Tab.Pane eventKey="treinamento">
              <h3>Treinamento de IA</h3>
              <p>Módulo de treinamento de agentes de IA em desenvolvimento.</p>
            </Tab.Pane>
            
            <Tab.Pane eventKey="simulador">
              <h3>Simulador de Conversas</h3>
              <p>Simulador de conversas em desenvolvimento.</p>
            </Tab.Pane>
            
            <Tab.Pane eventKey="whatsapp">
              <WhatsAppIntegration />
            </Tab.Pane>
            
            <Tab.Pane eventKey="configuracoes">
              <h3>Configurações</h3>
              <p>Configurações do sistema em desenvolvimento.</p>
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
      
      <Row className="footer">
        <Col>
          <p>© 2025 App de Treinamento de IA - Todos os direitos reservados</p>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminPanel;
