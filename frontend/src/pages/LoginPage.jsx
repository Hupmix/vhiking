import React from 'react';
import LoginForm from '../components/LoginForm';
import { Container, Row, Col } from 'react-bootstrap';

const LoginPage = ({ setUser }) => {
  return (
    <Container className="login-page">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <div className="login-card">
            <LoginForm setUser={setUser} />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
