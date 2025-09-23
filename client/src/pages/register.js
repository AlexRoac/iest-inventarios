import { useState } from 'react';
import { Button, Modal, Container, Nav, Navbar, NavDropdown, Row, Col, Image, Alert } from 'react-bootstrap';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import aniv from '../assets/50N.avif';
import logo from '../assets/logoLogotipo-IEST-blanco.png';
import "../styles/styles.css";

function Register() {
  const [formData, setFormData] = useState({
    id: '',
    password: '',
    tipo: "normal"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    if (!formData.id.match(/^\d{5}$/)) {
      setError('ID must be 5 digits');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
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
      const apiUrl = process.env.REACT_APP_API_URL || '';
      const response = await fetch(`${apiUrl}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include'
      });


      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message || 'An error occurred during registration');
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
        <h1 className="auth-title">Regístrate</h1>
        
        {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
        {success && (
          <Alert variant="success">
            El registro ha sido exitoso! Ahora inicia sesión.
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
              name="id"
              placeholder="00000"
              required
              pattern="\d{5}"
              value={formData.id}
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
              name="password"
              placeholder="Password"
              required
              minLength="8"
              value={formData.password}
              onChange={handleChange}
            />
          </FloatingLabel>

          <div className="d-grid gap-2">
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Registrarse'}
            </Button>
            <p>¿Ya te registraste? Inicia sesión <a href='./login'>Aqui</a></p>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Register;