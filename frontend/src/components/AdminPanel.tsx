import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

interface AdminPanelProps {
  onLogout: () => void;
}

export function AdminPanel({ onLogout }: AdminPanelProps) {
  // Estados para métricas do painel
  const activeUsers = React.useState(42)[0];
  const totalSubscriptions = React.useState(28)[0];
  const revenue = React.useState(1399.72)[0];
  const apiCosts = React.useState(215.50)[0];

  // Funções para gerenciar usuários
  const handleManageUsers = () => {
    alert('Abrindo gerenciamento de usuários');
  };

  // Funções para gerenciar assinaturas
  const handleManageSubscriptions = () => {
    alert('Abrindo gerenciamento de assinaturas');
  };

  // Funções para gerenciar custos da API
  const handleManageCosts = () => {
    alert('Abrindo gerenciamento de custos da API');
  };

  // Funções para gerenciar configurações do sistema
  const handleSystemSettings = () => {
    alert('Abrindo configurações do sistema');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">Painel Administrativo</h1>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => window.location.href = '/'}>Voltar ao Site</Button>
              <Button variant="destructive" onClick={onLogout}>Sair</Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Dashboard Administrativo</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Usuários Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">{activeUsers}</p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full text-xs" onClick={handleManageUsers}>
                Gerenciar Usuários
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Assinaturas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{totalSubscriptions}</p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full text-xs" onClick={handleManageSubscriptions}>
                Gerenciar Assinaturas
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Receita Mensal</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-emerald-600">R$ {revenue.toFixed(2)}</p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full text-xs" onClick={() => alert('Abrindo relatório financeiro')}>
                Ver Relatório
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Custos da API</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-orange-600">R$ {apiCosts.toFixed(2)}</p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full text-xs" onClick={handleManageCosts}>
                Gerenciar Custos
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Usuários</CardTitle>
              <CardDescription>Administre os usuários do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium">Usuários Ativos</h3>
                  <p className="text-sm text-gray-500">Gerenciar usuários com assinaturas ativas</p>
                </div>
                <Button onClick={() => alert('Gerenciando usuários ativos')}>Gerenciar</Button>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium">Período de Teste</h3>
                  <p className="text-sm text-gray-500">Usuários em período de teste gratuito</p>
                </div>
                <Button onClick={() => alert('Gerenciando usuários em teste')}>Gerenciar</Button>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium">Assinaturas Expiradas</h3>
                  <p className="text-sm text-gray-500">Usuários com assinaturas expiradas</p>
                </div>
                <Button onClick={() => alert('Gerenciando assinaturas expiradas')}>Gerenciar</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Custos da API do WhatsApp</CardTitle>
              <CardDescription>Monitore e gerencie os custos da API</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium">Custos Atuais</h3>
                  <p className="text-sm text-gray-500">R$ {apiCosts.toFixed(2)} neste mês</p>
                </div>
                <Button onClick={() => alert('Visualizando detalhes de custos')}>Detalhes</Button>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium">Limites de Gastos</h3>
                  <p className="text-sm text-gray-500">Configure alertas de limite</p>
                </div>
                <Button onClick={() => alert('Configurando limites de gastos')}>Configurar</Button>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium">Relatórios</h3>
                  <p className="text-sm text-gray-500">Relatórios detalhados de uso e custos</p>
                </div>
                <Button onClick={() => alert('Gerando relatórios de custos')}>Gerar</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Sistema</CardTitle>
              <CardDescription>Ajuste as configurações globais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium">Planos e Preços</h3>
                  <p className="text-sm text-gray-500">Configure os planos de assinatura</p>
                </div>
                <Button onClick={() => alert('Configurando planos e preços')}>Configurar</Button>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium">Integrações</h3>
                  <p className="text-sm text-gray-500">Gerencie integrações com serviços</p>
                </div>
                <Button onClick={() => alert('Gerenciando integrações')}>Gerenciar</Button>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium">Configurações Avançadas</h3>
                  <p className="text-sm text-gray-500">Ajustes avançados do sistema</p>
                </div>
                <Button onClick={() => alert('Acessando configurações avançadas')}>Acessar</Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleSystemSettings}>Todas as Configurações</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
              <CardDescription>Últimas atividades no sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4 py-1">
                  <p className="text-sm font-medium">Novo usuário registrado</p>
                  <p className="text-xs text-gray-500">Hoje, 14:32</p>
                </div>
                
                <div className="border-l-4 border-green-500 pl-4 py-1">
                  <p className="text-sm font-medium">Assinatura ativada</p>
                  <p className="text-xs text-gray-500">Hoje, 11:15</p>
                </div>
                
                <div className="border-l-4 border-yellow-500 pl-4 py-1">
                  <p className="text-sm font-medium">Alerta de limite de custos (80%)</p>
                  <p className="text-xs text-gray-500">Ontem, 18:45</p>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-4 py-1">
                  <p className="text-sm font-medium">Configuração do sistema atualizada</p>
                  <p className="text-xs text-gray-500">Ontem, 10:20</p>
                </div>
                
                <div className="border-l-4 border-gray-500 pl-4 py-1">
                  <p className="text-sm font-medium">Backup do sistema realizado</p>
                  <p className="text-xs text-gray-500">21/05/2025, 23:00</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => alert('Visualizando histórico completo')}>
                Ver Histórico Completo
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
