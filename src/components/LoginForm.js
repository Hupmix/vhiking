var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
export function LoginForm({ onLogin, onCancel }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
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
            yield new Promise(resolve => setTimeout(resolve, 1000));
            // Para fins de demonstração, aceitamos qualquer login
            // Em produção, isso seria validado no backend
            onLogin(email, password, isAdmin);
        }
        catch (err) {
            setError('Erro ao fazer login. Tente novamente.');
            console.error('Login error:', err);
        }
        finally {
            setLoading(false);
        }
    });
    return (_jsxs(Card, { className: "w-full max-w-md mx-auto", children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Login" }), _jsx(CardDescription, { children: "Acesse sua conta para gerenciar o sistema de treinamento de IA" })] }), _jsx(CardContent, { children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "email", children: "Email" }), _jsx(Input, { id: "email", type: "email", placeholder: "seu@email.com", value: email, onChange: (e) => setEmail(e.target.value), required: true })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "password", children: "Senha" }), _jsx(Input, { id: "password", type: "password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", value: password, onChange: (e) => setPassword(e.target.value), required: true })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", id: "admin", checked: isAdmin, onChange: (e) => setIsAdmin(e.target.checked), className: "rounded border-gray-300" }), _jsx(Label, { htmlFor: "admin", className: "text-sm font-normal", children: "Login como administrador" })] }), error && (_jsx("div", { className: "text-sm text-red-500 font-medium", children: error }))] }) }), _jsxs(CardFooter, { className: "flex justify-between", children: [_jsx(Button, { variant: "outline", onClick: onCancel, disabled: loading, children: "Cancelar" }), _jsx(Button, { onClick: handleSubmit, disabled: loading, children: loading ? 'Entrando...' : 'Entrar' })] })] }));
}
