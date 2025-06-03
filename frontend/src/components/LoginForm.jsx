import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Tentando login com:', { email, password, isAdmin });
      const response = await login(email, password, isAdmin);
      
      if (response.success) {
        console.log('Login bem-sucedido:', response);
        
        // Redirecionar para a página apropriada
        if (isAdmin) {
          console.log('Redirecionando para /admin');
          navigate('/admin');
        } else {
          console.log('Redirecionando para /dashboard');
          navigate('/dashboard');
        }
      } else {
        console.error('Falha no login:', response);
        setError(response.message || 'Falha no login. Verifique suas credenciais.');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setError('Erro ao conectar ao servidor. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form-container">
      <h3>Login</h3>
      <p>Acesse sua conta para gerenciar o sistema de treinamento de IA</p>
      
      {error && (
        <Alert variant="danger" onClose={() => setError('')} dismissible>
          {error}
        </Alert>
      )}
      
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Senha</Form.Label>
          <Form.Control
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label="Login como administrador"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
          />
        </Form.Group>
        
        <div className="d-flex justify-content-between">
          <Button variant="secondary" onClick={() => navigate('/')}>
            Cancelar
          </Button>
          
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                <span className="ms-2">Entrando...</span>
              </>
            ) : (
              'Entrar'
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default LoginForm;
