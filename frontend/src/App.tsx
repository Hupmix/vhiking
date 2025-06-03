import { useState, useEffect } from 'react';
import './App.css';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './components/ui/card';
import { LoginForm } from './components/LoginForm';

function App() {
  // Estado para controlar a aba ativa (usado no onValueChange do Tabs)
  const [_, setActiveTab] = useState('dashboard');
  // Estado para controlar autenticação
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Estado para controlar se é admin
  const [isAdmin, setIsAdmin] = useState(false);
  // Estado para controlar modal de login
  const [showLoginForm, setShowLoginForm] = useState(false);
  // Estado para armazenar dados do usuário
  const [userData, setUserData] = useState({
    name: '',
    email: ''
  });

  // Verificar se o usuário já está logado ao carregar a página
  useEffect(() => {
    const authenticated = localStorage.getItem('isAuthenticated') === 'true';
    const admin = localStorage.getItem('isAdmin') === 'true';
    
    if (authenticated) {
      setIsLoggedIn(true);
      setIsAdmin(admin);
      // Em um ambiente real, buscaríamos os dados do usuário do backend
      setUserData({
        name: localStorage.getItem('userName') || 'Usuário',
        email: localStorage.getItem('userEmail') || 'usuario@exemplo.com'
      });
    }
  }, []);

  // Função para lidar com login
  const handleLogin = (email: string, _password: string, adminLogin: boolean) => {
    // Em produção, isso seria validado no backend
    setIsLoggedIn(true);
    setIsAdmin(adminLogin);
    setShowLoginForm(false);
    
    const userName = email.split('@')[0];
    
    setUserData({
      name: userName,
      email: email
    });
    
    // Salvar no localStorage para persistir entre recarregamentos
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('isAdmin', adminLogin ? 'true' : 'false');
    localStorage.setItem('userName', userName);
    localStorage.setItem('userEmail', email);
    
    // Se for admin, redirecionar para painel admin
    if (adminLogin) {
      window.location.href = '/admin';
    }
  };

  // Função para lidar com logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUserData({
      name: '',
      email: ''
    });
    
    // Limpar localStorage
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
  };

  // Função para abrir documentação
  const openDocumentation = () => {
    window.open('/documentation', '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">App de Treinamento de IA</h1>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={openDocumentation}>Documentação</Button>
              {isLoggedIn ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Olá, {userData.name}</span>
                  <Button onClick={handleLogout}>Sair</Button>
                  {isAdmin && (
                    <Button variant="default" onClick={() => window.location.href = '/admin'}>
                      Painel Admin
                    </Button>
                  )}
                </div>
              ) : (
                <Button onClick={() => setShowLoginForm(true)}>Entrar</Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {showLoginForm && !isLoggedIn ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-md w-full">
            <LoginForm 
              onLogin={handleLogin} 
              onCancel={() => setShowLoginForm(false)} 
            />
          </div>
        </div>
      ) : (
        <main className="container mx-auto px-4 py-8">
          {!isLoggedIn ? (
            <div className="text-center py-12">
              <h2 className="text-3xl font-bold mb-4">Bem-vindo ao App de Treinamento de IA</h2>
              <p className="text-xl text-gray-600 mb-8">
                Treine agentes de IA para atendimento e vendas com integração ao WhatsApp
              </p>
              <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-4">Experimente Gratuitamente</h3>
                  <p className="text-gray-600 mb-6">
                    Obtenha acesso gratuito por 48 horas a todas as funcionalidades do sistema.
                  </p>
                  <Button size="lg" onClick={() => setShowLoginForm(true)}>
                    Começar Agora
                  </Button>
                </div>
                <div className="bg-gray-50 px-8 py-4">
                  <h4 className="font-medium mb-2">Recursos Incluídos:</h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Treinamento de IA personalizado
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Integração com WhatsApp
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Simulador de conversas
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Dashboard de métricas
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <Tabs defaultValue="dashboard" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-5 mb-8">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="treinamento">Treinamento</TabsTrigger>
                <TabsTrigger value="simulador">Simulador</TabsTrigger>
                <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
                <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
              </TabsList>
              
              <TabsContent value="dashboard" className="space-y-6">
                <h2 className="text-2xl font-bold">Dashboard</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Conversas Ativas</CardTitle>
                      <CardDescription>Total de conversas em andamento</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-4xl font-bold text-blue-600">12</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Taxa de Resolução</CardTitle>
                      <CardDescription>Porcentagem de conversas resolvidas</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-4xl font-bold text-green-600">87%</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Tempo Médio</CardTitle>
                      <CardDescription>Tempo médio de resposta</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-4xl font-bold text-orange-600">1.2s</p>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Desempenho Semanal</CardTitle>
                    <CardDescription>Métricas dos últimos 7 dias</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80 flex items-center justify-center">
                    <p className="text-gray-500">Gráfico de desempenho seria exibido aqui</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="treinamento" className="space-y-6">
                <h2 className="text-2xl font-bold">Treinamento de IA</h2>
                <Card>
                  <CardHeader>
                    <CardTitle>Sessões de Treinamento</CardTitle>
                    <CardDescription>Gerencie suas sessões de treinamento</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h3 className="font-medium">Atendimento Básico</h3>
                          <p className="text-sm text-gray-500">Criado em: 15/05/2025</p>
                        </div>
                        <Button variant="outline" onClick={() => alert('Editar sessão de treinamento')}>Editar</Button>
                      </div>
                      
                      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h3 className="font-medium">Vendas Proativas</h3>
                          <p className="text-sm text-gray-500">Criado em: 18/05/2025</p>
                        </div>
                        <Button variant="outline" onClick={() => alert('Editar sessão de treinamento')}>Editar</Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" onClick={() => alert('Criar nova sessão de treinamento')}>Nova Sessão de Treinamento</Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Base de Conhecimento</CardTitle>
                    <CardDescription>Gerencie os dados para treinamento</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">Perguntas Frequentes</h3>
                          <p className="text-sm text-gray-500">50 itens</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => alert('Gerenciar perguntas frequentes')}>Gerenciar</Button>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">Catálogo de Produtos</h3>
                          <p className="text-sm text-gray-500">120 itens</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => alert('Gerenciar catálogo de produtos')}>Gerenciar</Button>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">Histórico de Conversas</h3>
                          <p className="text-sm text-gray-500">500 conversas</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => alert('Gerenciar histórico de conversas')}>Gerenciar</Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" onClick={() => alert('Importar dados')}>Importar Dados</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="simulador" className="space-y-6">
                <h2 className="text-2xl font-bold">Simulador de Chat</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <Card className="h-[600px] flex flex-col">
                      <CardHeader>
                        <CardTitle>Conversa Simulada</CardTitle>
                        <CardDescription>Teste o comportamento do agente de IA</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow overflow-y-auto">
                        <div className="space-y-4">
                          <div className="flex justify-start">
                            <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                              <p>Olá, gostaria de saber mais sobre seus produtos.</p>
                            </div>
                          </div>
                          
                          <div className="flex justify-end">
                            <div className="bg-blue-100 rounded-lg p-3 max-w-[80%]">
                              <p>Olá! Claro, temos uma variedade de produtos disponíveis. Você está procurando algo específico?</p>
                            </div>
                          </div>
                          
                          <div className="flex justify-start">
                            <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                              <p>Estou interessado em smartphones.</p>
                            </div>
                          </div>
                          
                          <div className="flex justify-end">
                            <div className="bg-blue-100 rounded-lg p-3 max-w-[80%]">
                              <p>Ótimo! Temos vários modelos de smartphones disponíveis. Nossos mais populares são o Modelo X, Modelo Y e Modelo Z. Você tem preferência por alguma marca específica?</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t">
                        <div className="flex w-full space-x-2">
                          <input 
                            type="text" 
                            placeholder="Digite sua mensagem..." 
                            className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <Button onClick={() => alert('Mensagem enviada')}>Enviar</Button>
                        </div>
                      </CardFooter>
                    </Card>
                  </div>
                  
                  <div>
                    <Card className="h-[600px] flex flex-col">
                      <CardHeader>
                        <CardTitle>Análise da Conversa</CardTitle>
                        <CardDescription>Detalhes do processamento</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow overflow-y-auto">
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-medium">Última Mensagem</h3>
                            <p className="text-sm text-gray-500">"Estou interessado em smartphones."</p>
                          </div>
                          
                          <div>
                            <h3 className="font-medium">Intenção Detectada</h3>
                            <p className="text-sm font-medium text-green-600">produto_info</p>
                            <div className="mt-1 h-2 bg-gray-200 rounded-full">
                              <div className="h-2 bg-green-600 rounded-full" style={{ width: '87%' }}></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Confiança: 87%</p>
                          </div>
                          
                          <div>
                            <h3 className="font-medium">Entidades Identificadas</h3>
                            <div className="mt-2 space-y-2">
                              <div className="flex items-center space-x-2">
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">produto: smartphones</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="font-medium">Contexto da Conversa</h3>
                            <p className="text-sm text-gray-500">Fase: Exploração de Produtos</p>
                            <p className="text-sm text-gray-500">Próxima ação recomendada: Apresentar opções</p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t">
                        <Button variant="outline" className="w-full" onClick={() => alert('Melhorando resposta...')}>Melhorar Resposta</Button>
                      </CardFooter>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="whatsapp" className="space-y-6">
                <h2 className="text-2xl font-bold">Integração com WhatsApp</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Status da Conexão</CardTitle>
                      <CardDescription>Estado atual da conexão com WhatsApp</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded-full bg-green-500"></div>
                        <p className="font-medium">Conectado</p>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">Conectado desde: 22/05/2025 10:30</p>
                      <p className="text-sm text-gray-500">Número: +55 (11) 98765-4321</p>
                      <p className="text-sm text-gray-500">Nome: Empresa XYZ</p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" onClick={() => alert('Desconectando WhatsApp...')}>Desconectar</Button>
                      <Button onClick={() => alert('Reconectando WhatsApp...')}>Reconectar</Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>QR Code</CardTitle>
                      <CardDescription>Escaneie para conectar ao WhatsApp</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                      <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                        <p className="text-gray-500 text-center">QR Code seria exibido aqui</p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" onClick={() => alert('Gerando novo QR Code...')}>Gerar Novo QR Code</Button>
                    </CardFooter>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Configurações de Mensagens</CardTitle>
                    <CardDescription>Configure mensagens automáticas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Mensagem de Boas-vindas</label>
                        <textarea 
                          className="w-full px-3 py-2 border rounded-md"
                          rows={3}
                          defaultValue="Olá! Sou o assistente virtual da Empresa XYZ. Como posso ajudar você hoje?"
                        ></textarea>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Mensagem Fora do Expediente</label>
                        <textarea 
                          className="w-full px-3 py-2 border rounded-md"
                          rows={3}
                          defaultValue="Obrigado pelo contato! Nosso horário de atendimento é de segunda a sexta, das 9h às 18h. Retornaremos seu contato no próximo dia útil."
                        ></textarea>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Mensagem de Escalação</label>
                        <textarea 
                          className="w-full px-3 py-2 border rounded-md"
                          rows={3}
                          defaultValue="Estou transferindo seu atendimento para um de nossos especialistas humanos. Por favor, aguarde um momento."
                        ></textarea>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" onClick={() => alert('Configurações salvas com sucesso!')}>Salvar Configurações</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="configuracoes" className="space-y-6">
                <h2 className="text-2xl font-bold">Configurações</h2>
                <Card>
                  <CardHeader>
                    <CardTitle>Configurações Gerais</CardTitle>
                    <CardDescription>Ajuste as configurações do aplicativo</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Nome da Empresa</label>
                        <input 
                          type="text" 
                          className="w-full px-3 py-2 border rounded-md"
                          defaultValue="Empresa XYZ"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Email de Contato</label>
                        <input 
                          type="email" 
                          className="w-full px-3 py-2 border rounded-md"
                          defaultValue="contato@empresaxyz.com"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Horário de Atendimento</label>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Início</label>
                            <input 
                              type="time" 
                              className="w-full px-3 py-2 border rounded-md"
                              defaultValue="09:00"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Fim</label>
                            <input 
                              type="time" 
                              className="w-full px-3 py-2 border rounded-md"
                              defaultValue="18:00"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Dias de Atendimento</label>
                        <div className="grid grid-cols-7 gap-2">
                          {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, index) => (
                            <div key={index} className="text-center">
                              <input 
                                type="checkbox" 
                                id={`day-${index}`} 
                                className="sr-only peer"
                                defaultChecked={index > 0 && index < 6}
                              />
                              <label 
                                htmlFor={`day-${index}`}
                                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 peer-checked:bg-blue-100 peer-checked:text-blue-600 cursor-pointer"
                              >
                                {day}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Idioma Principal</label>
                        <select className="w-full px-3 py-2 border rounded-md">
                          <option value="pt-BR">Português (Brasil)</option>
                          <option value="en-US">English (US)</option>
                          <option value="es">Español</option>
                        </select>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" onClick={() => alert('Configurações salvas com sucesso!')}>Salvar Configurações</Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Notificações</CardTitle>
                    <CardDescription>Configure suas preferências de notificação</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Novas Conversas</h3>
                          <p className="text-sm text-gray-500">Receba notificações de novas conversas</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Mensagens Não Respondidas</h3>
                          <p className="text-sm text-gray-500">Alerta para mensagens sem resposta por mais de 10 minutos</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Relatórios Diários</h3>
                          <p className="text-sm text-gray-500">Receba um resumo diário das atividades</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Alertas de Sistema</h3>
                          <p className="text-sm text-gray-500">Notificações sobre atualizações e manutenção</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" onClick={() => alert('Preferências de notificação salvas!')}>Salvar Preferências</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </main>
      )}
    </div>
  );
}

export default App;
