var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import './WhatsAppIntegration.css';
import axios from 'axios';
import { API_BASE_URL, fetchStats, fetchCosts, getLogs } from '../services/whatsappService';
const WhatsAppIntegration = () => {
    const [connectionStatus, setConnectionStatus] = useState('disconnected');
    const [qrCode, setQrCode] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [message, setMessage] = useState('');
    const [logs, setLogs] = useState([]);
    const [costs, setCosts] = useState({
        integrationType: '',
        costs: {
            setupFee: 0,
            monthlyFee: 0,
            messageReceived: 0,
            messageSent: 0,
            templateMessage: 0,
            mediaMessage: 0,
        },
        estimatedTotal: 0,
    });
    const [stats, setStats] = useState({
        received: 0,
        sent: 0,
        templates: 0,
        media: 0,
        lastUpdated: '',
    });
    const [integrationType, setIntegrationType] = useState('WHATSAPP_WEB');
    const [activeTab, setActiveTab] = useState('status');
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    const checkStatus = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield axios.get(`${API_BASE_URL}/whatsapp/status`);
            const data = response.data;
            if (data.success) {
                setConnectionStatus(data.status);
                setIntegrationType(data.integrationType || 'WHATSAPP_WEB');
            }
        }
        catch (_a) {
            setConnectionStatus('error');
        }
    });
    const generateQRCode = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            setNotification({ show: true, message: 'Gerando QR Code...', type: 'info' });
            const response = yield axios.get(`${API_BASE_URL}/whatsapp/qrcode`);
            const data = response.data;
            if (data.success && data.qrCode) {
                setQrCode(data.qrCode);
                setNotification({ show: true, message: 'QR Code gerado com sucesso!', type: 'success' });
            }
            else {
                setNotification({ show: true, message: data.message || 'Erro ao gerar QR Code', type: 'error' });
            }
        }
        catch (_a) {
            setNotification({ show: true, message: 'Erro ao gerar QR Code', type: 'error' });
        }
    });
    const sendTextMessage = () => __awaiter(void 0, void 0, void 0, function* () {
        if (!phoneNumber || !message) {
            setNotification({ show: true, message: 'Número de telefone e mensagem são obrigatórios', type: 'error' });
            return;
        }
        try {
            setNotification({ show: true, message: 'Enviando mensagem...', type: 'info' });
            const response = yield axios.post(`${API_BASE_URL}/whatsapp/send`, {
                to: phoneNumber,
                text: message,
            });
            const data = response.data;
            if (data.success) {
                setNotification({ show: true, message: 'Mensagem enviada com sucesso!', type: 'success' });
                setMessage('');
                const updatedStats = yield fetchStats();
                setStats(updatedStats);
            }
            else {
                setNotification({ show: true, message: data.message || 'Erro ao enviar mensagem', type: 'error' });
            }
        }
        catch (_a) {
            setNotification({ show: true, message: 'Erro ao enviar mensagem', type: 'error' });
        }
    });
    const sendWelcomeMessage = () => __awaiter(void 0, void 0, void 0, function* () {
        if (!phoneNumber) {
            setNotification({ show: true, message: 'Número de telefone é obrigatório', type: 'error' });
            return;
        }
        try {
            setNotification({ show: true, message: 'Enviando mensagem de boas-vindas...', type: 'info' });
            const response = yield axios.post(`${API_BASE_URL}/whatsapp/send-welcome`, { to: phoneNumber });
            const data = response.data;
            if (data.success) {
                setNotification({ show: true, message: 'Mensagem enviada com sucesso!', type: 'success' });
                const updatedStats = yield fetchStats();
                setStats(updatedStats);
            }
            else {
                setNotification({ show: true, message: data.message || 'Erro ao enviar mensagem de boas-vindas', type: 'error' });
            }
        }
        catch (_a) {
            setNotification({ show: true, message: 'Erro ao enviar mensagem de boas-vindas', type: 'error' });
        }
    });
    const disconnect = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            setNotification({ show: true, message: 'Desconectando...', type: 'info' });
            const response = yield axios.post(`${API_BASE_URL}/whatsapp/disconnect`);
            const data = response.data;
            if (data.success) {
                setConnectionStatus('disconnected');
                setQrCode('');
                setNotification({ show: true, message: 'Desconectado com sucesso!', type: 'success' });
            }
            else {
                setNotification({ show: true, message: data.message || 'Erro ao desconectar', type: 'error' });
            }
        }
        catch (_a) {
            setNotification({ show: true, message: 'Erro ao desconectar', type: 'error' });
        }
    });
    const switchIntegrationType = (type) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            setNotification({ show: true, message: `Alterando para ${type}...`, type: 'info' });
            const response = yield axios.post(`${API_BASE_URL}/whatsapp/switch-type`, { type });
            const data = response.data;
            if (data.success) {
                setIntegrationType(type);
                setNotification({ show: true, message: `Integração alterada para ${type}!`, type: 'success' });
                checkStatus();
            }
            else {
                setNotification({ show: true, message: data.message || 'Erro ao alterar integração', type: 'error' });
            }
        }
        catch (_a) {
            setNotification({ show: true, message: 'Erro ao alterar tipo de integração', type: 'error' });
        }
    });
    const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    useEffect(() => {
        checkStatus();
        fetchStats().then((data) => setStats(data));
        fetchCosts().then((data) => setCosts(data));
        getLogs().then((data) => setLogs(data));
        const statusInterval = setInterval(checkStatus, 30000);
        const statsInterval = setInterval(() => {
            fetchStats().then((data) => setStats(data));
        }, 120000);
        return () => {
            clearInterval(statusInterval);
            clearInterval(statsInterval);
        };
    }, []);
    useEffect(() => {
        if (notification.show) {
            const timer = setTimeout(() => {
                setNotification((prev) => (Object.assign(Object.assign({}, prev), { show: false })));
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [notification]);
    return (_jsx("div", { className: "whatsapp-integration", children: _jsx("h2", { children: "Integra\u00E7\u00E3o com WhatsApp" }) }));
};
export default WhatsAppIntegration;
