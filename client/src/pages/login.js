import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Row, Col, Image, Alert } from 'react-bootstrap';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import aniv from '../assets/50N.avif';
import logo from '../assets/logoLogotipo-IEST-blanco.png';
import "../styles/styles.css";

function Login() {
  const [formData, setFormData] = useState({
    idInput: '',
    passwordInput: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    if (!formData.idInput.match(/^\d{5}$/)) {
      setError('El ID debe contener 5 dígitos');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error en el inicio de sesión');
      }

      navigate('/home');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="d-flex flex-column auth-container">
      <div className="auth-header">
        <Row className="justify-content-between pt-2 pb-2 align-items-center">
          <Col xs="auto" className="header-logo">
            <Image src={logo} alt="IEST Logo" fluid />
          </Col>
          <Col xs="auto">
            <Image src={aniv} alt="Anniversary" className="anniversary-image" fluid />
          </Col>
        </Row>
      </div>

      <div className="auth-card mx-auto">
        <h1 className="auth-title">Iniciar Sesión</h1>
        
        {error && (
          <Alert 
            variant="danger" 
            dismissible 
            onClose={() => setError('')}
            className="mt-3"
          >
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <FloatingLabel
            controlId="floatingId"
            label="ID IEST"
            className="mb-3"
          >
            <Form.Control
              type="number"
              name="idInput"
              placeholder="00000"
              required
              pattern="\d{5}"
              value={formData.idInput}
              onChange={handleChange}
            />
          </FloatingLabel>

          <FloatingLabel
            controlId="floatingPassword"
            label="Password"
            className="mb-4"
          >
            <Form.Control
              type="password"
              name="passwordInput"
              placeholder="Contraseña"
              required
              value={formData.passwordInput}
              onChange={handleChange}
            />
          </FloatingLabel>

          <div className="d-grid gap-2">
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="auth-button"
            >
              {loading ? 'Verificando...' : 'Ingresar'}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Login;
