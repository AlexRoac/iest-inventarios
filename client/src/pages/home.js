import { Container, Row, Col, Image } from 'react-bootstrap';
import { FaChevronDown } from 'react-icons/fa';
import BtnArea from '../components/BtnArea.js';
import DefaultNavbar from '../components/navbar.js';
import aniv from '../assets/50N.avif';
import logo from '../assets/logo-iest.avif';
import peligro from '../assets/peligro.avif';
import imgServiciosGenerales from '../assets/ServiciosGenerales.png';
import imgGastronomia from '../assets/Gastronomia.avif';
import imgMedicina from '../assets/Medicina.png';
import imgCafeteria from '../assets/Cafeteria.avif';
import imgRiesgosInfog from '../assets/riesgosInfog.avif';
import imgTablaAnalisis from '../assets/tablaRiesgos.avif';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import useUserType from '../hooks/useUserType.js';
import AnalisisDeRiesgos from '../assets/analisis_de_riesgos.pdf';
import '../styles/homestyle.css';

function Home() {
  const userType = useUserType();
  const location = useLocation();
  
  const [numArticulos, setNumArticulos] = useState({});

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  useEffect(() => {
    async function contarArticulos(){
      try {
        const response = await fetch('http://localhost:3001/contarArticulos');
        const result = await response.json();
        setNumArticulos(result);
      } catch (err) {
        console.error('Error fetching article counts:', err);
      }
    }

    contarArticulos();
  }, []);

  let isAdmin = userType === "admin";

  return (
    <>
      <DefaultNavbar />
      <div className="home-container">
        {/* Sección Hero */}
        <section id="home" className="hero-section">
          <Container>
            <Row className="align-items-center justify-content-center">
              <Col xs={12} className="text-center">
                {/* Logo aniversario - visible solo en desktop */}
                <div className="anniversary-logo">
                  <Image src={aniv} fluid />
                </div>
                
                {/* Logo principal */}
                <Image 
                  src={logo} 
                  className="main-logo"
                  fluid
                />
                
                {/* Texto principal */}
                <h1 className="hero-title">
                  Sistema armonizado<br />
                  identificación y comunicación<br />
                  riesgos y peligros sustancias peligrosas<br />
                  NOM-018-STPS-2015<br />
                </h1>
                
                {/* Flecha hacia abajo */}
                <a href="#objetivo" className="scroll-down">
                  <FaChevronDown className="scroll-icon" />
                </a>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Sección Objetivo */}
        <section id="objetivo" className="page-section">
          <Container>
            <Row className="justify-content-center">
              <Col xs={12} className="text-center">
                <h1 className="section-title">
                  OBJETIVO
                </h1>
                <div className="section-content">
                  <div className="divider-line" />
                  <p className="description-text">
                    Establecer los requisitos para disponer en los centros de trabajo del sistema armonizado de identificación y comunicación de peligros y riesgos por sustancias químicas peligrosas, a fin de prevenir daños a los trabajadores y al personal que actúa en caso de emergencia.
                  </p>
                  <div className="divider-line" />
                  <Image 
                    src={peligro} 
                    className="danger-image"
                    fluid
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Divisor naranja */}
        <div className="divider-line" />

        {/* Sección Áreas */}
        <section id="areas" className="page-section">
          <Container>
            <Row className="justify-content-center">
              <Col xs={12} className="text-center">
                <h1 className="section-title">
                  ÁREAS
                </h1>
                <div className="section-content">
                  <div className="divider-line" />
                  <p className="description-text">
                    Selecciona el área que deseas.
                  </p>
                  <div className="divider-line" />
                  
                  {/* Grid de áreas */}
                  <Row className="areas-grid">
                    <Col xs={12} sm={6} md={6} lg={3} className="area-column">
                      <BtnArea 
                        img={imgServiciosGenerales} 
                        nombreArea={"Servicios Generales"} 
                        ruta={'/ServiciosGenerales'}
                        hoverText={"Total de Objetos: " + numArticulos.serviciosGenerales}
                        userType={userType}
                      />
                    </Col>
                    <Col xs={12} sm={6} md={6} lg={3} className="area-column">
                      <BtnArea 
                        img={imgCafeteria} 
                        nombreArea={"Cafetería"} 
                        ruta={'/Cafeteria'}
                        hoverText={"Total de Objetos: " + numArticulos.cafeteria}
                        userType={userType}
                      />
                    </Col>
                  </Row>
                  <Row className="areas-grid">
                    <Col xs={12} sm={6} md={6} lg={3} className="area-column">
                      <BtnArea 
                        img={imgGastronomia} 
                        nombreArea={"Gastronomía"} 
                        ruta={"/Gastronomia"}
                        hoverText={"Total de Objetos: " + numArticulos.gastronomia}
                        userType={userType}
                      />
                    </Col>
                    <Col xs={12} sm={6} md={6} lg={3} className="area-column">
                      <BtnArea 
                        img={imgMedicina} 
                        nombreArea={"Medicina"} 
                        ruta={"/Medicina"}
                        hoverText={"Total de Objetos: " + numArticulos.medicina}
                        userType={userType}
                      />
                    </Col>
                  </Row>
                </div>
                {isAdmin && 
                  <Row>
                    <Col className="mt-5">
                      <span className="fs-5" style={{color:"grey"}}>Total de sustancias y productos: {numArticulos.total}</span>
                    </Col>
                  </Row>
                }
              </Col>
            </Row>
          </Container>
        </section>

        {/* Divisor naranja */}
        <div className="divider-line" />

        {/* Sección Infografía */}
        <section className="infographic-section page-section d-flex align-items-center" id="comunicadores">
          <Container>
            <Row className="justify-content-center">
              <Col xs={12} className="text-center">
                <h1 className="section-title">COMUMICADORES GRÁFICOS</h1>
                <Image 
                  src={imgRiesgosInfog} 
                  className="infographic-image mt-5"
                  fluid
                />
              </Col>
            </Row>
          </Container>
        </section>

        {/* Divisor naranja */}
        <div className="divider-line" />

        {/* Sección Análisis de Riesgos */}
        <section id="analisis" className="risk-analysis-section">
          <Container>
            <Row className="justify-content-center">
              <Col xs={12} className="text-center">
                <h1 className="section-title">
                  ANÁLISIS DE RIESGOS
                </h1>
                <div className="analysis-table-container">
                  <Image 
                    src={imgTablaAnalisis} 
                    className="analysis-image"
                    onClick={() => window.open(AnalisisDeRiesgos, '_blank')}
                    fluid
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Footer */}
        <footer className="footer-section">
          <Container>
            <Row>
              <Col xs={12} className="text-center">
                <p className="footer-text">
                  © {new Date().getFullYear()} IEST Anáhuac. Todos los derechos reservados.
                </p>
              </Col>
            </Row>
          </Container>
        </footer>
      </div>
    </>
  );
}

export default Home;
