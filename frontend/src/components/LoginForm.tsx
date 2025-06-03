import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface LoginFormProps {
  onLogin: (email: string, password: string, isAdmin: boolean) => void;
  onCancel: () => void;
}

export function LoginForm({ onLogin, onCancel }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }
    
    try {
      setLoading(true);
      
      // Em um ambiente real, isso seria uma chamada à API
      // Simulando uma verificação de login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Para fins de demonstração, aceitamos qualquer login
      // Em produção, isso seria validado no backend
      onLogin(email, password, isAdmin);
      
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Acesse sua conta para gerenciar o sistema de treinamento de IA
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="admin"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="admin" className="text-sm font-normal">
              Login como administrador
            </Label>
          </div>
          
          {error && (
            <div className="text-sm text-red-500 font-medium">
              {error}
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
      </CardFooter>
    </Card>
  );
}
