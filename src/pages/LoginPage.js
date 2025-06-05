import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import LoginForm from '../components/LoginForm';
import { Container, Row, Col } from 'react-bootstrap';
const LoginPage = ({ setUser }) => {
    return (_jsx(Container, { className: "login-page", children: _jsx(Row, { className: "justify-content-center", children: _jsx(Col, { md: 6, lg: 5, children: _jsx("div", { className: "login-card", children: _jsx(LoginForm, { setUser: setUser }) }) }) }) }));
};
export default LoginPage;
