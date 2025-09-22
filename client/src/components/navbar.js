import {Button, Modal, Container, Nav, Navbar, NavDropdown, Row, Col, Image} from 'react-bootstrap';
import ClickableNav from './ClickableNav.js';
import { useState } from 'react';
import { IoLogOutSharp } from 'react-icons/io5';
import LogicTitleModal from '../components/LogicTitleBodyModal.js';
import ClickableImg from '../components/ClickableImg.js';
import imgMatrizComp from '../assets/matrizCompQuimica.avif';
import imgMatrizIncomp from '../assets/matrizIncompQuimica.avif';
import pdfMatrizComp from '../assets/matrizCompatibilidad.pdf';
import pdfMatrizIncomp from '../assets/matrizIncompatibilidad.pdf';
import { Link } from 'react-router-dom';
import Home from '../pages/home';
import "../styles/styles.css";
import { useLocation } from 'react-router-dom';
import useUserType from '../hooks/useUserType.js';

function DefaultNavbar(props){
  const userType = useUserType();

  const [showModal, setShowModal] = useState(false);
  const location = useLocation();
  const currentHash = location.hash;

  const handleLogout = async () => {
    try {
      const res = await fetch('http://localhost:3001/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (res.ok) {

        console.log('Session ended');
        window.location.href = '/login';
      } else {
        console.error('Logout failed');
      }
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  const isAdmin = userType === 'admin';

  const closeModal = () => setShowModal(false);
  const openModal = () => setShowModal(true);

  function openFile(url) {
    window.open(url, '_blank');
  }

  return (
     <>
       <Navbar fixed="top" expand="lg" className="bg-body-tertiary">
         <Container>
           <Navbar.Brand className="fw-bold" href="/home#home" style={{ color: "#f56a0f"}}>IEST Anáhuac</Navbar.Brand>
           <Navbar.Toggle aria-controls="basic-navbar-nav" />
           <Navbar.Collapse id="basic-navbar-nav">
             <Nav className="ms-auto text-end">
               <Nav.Link as={Link} to="/home#home" className={`text-hover ${currentHash === '#home' ? 'active-link' : ''}`}>Inicio</Nav.Link>
               <Nav.Link as={Link} to="/home#objetivo" className={`text-hover ${currentHash === '#objetivo' ? 'active-link' : ''}`}>Objetivo</Nav.Link>
               <Nav.Link as={Link} to="/home#areas" className={`text-hover ${currentHash === '#areas' ? 'active-link' : ''}`}>Áreas</Nav.Link>
               <Nav.Link as={Link} to="/home#analisis" className={`text-hover ${currentHash === '#analisis' ? 'active-link' : ''}`}>Análisis De Riesgos</Nav.Link>
               <Nav.Link onClick={openModal} className="text-hover" style={{cursor: 'pointer'}}>Matrices</Nav.Link>
               <NavDropdown title="Más" id="basic-nav-dropdown">
                 <NavDropdown.Item href="/home#comunicadores">Comunicadores Gráficos</NavDropdown.Item>
                 {isAdmin && <NavDropdown.Item href="/register">Registrar Personal</NavDropdown.Item>}
               </NavDropdown>
               <Nav.Link onClick={handleLogout} className="text-hover">
                 <IoLogOutSharp className="fs-3 ms-5"/>
               </Nav.Link>
             </Nav>
           </Navbar.Collapse>
         </Container>
       </Navbar>
       <LogicTitleModal 
         show={showModal}
         onClose={closeModal}
         modalSize="xl"
         modalTitle="Matrices"
         modalBody={
           <div className="p-2 p-md-3">
             <Row className="py-3 mx-0 mx-md-3 text-center border border-dark align-items-center">
               <Col xs={12} md={3} className="mb-3 mb-md-0">
                 <h4 className="fs-5 fs-md-4 m-0 px-2">Matriz de Compatibilidad Química</h4>
               </Col>
               <Col xs={12} md={9}>
                 <ClickableImg 
                   imgSource={imgMatrizComp} 
                   className="d-block border mx-auto img-fluid"
                   onClick={() => openFile(pdfMatrizComp)}
                   style={{ maxHeight: "50vh", width: "100%" }}
                 />
               </Col>
             </Row>
             <Row className="my-3 py-3 mx-0 mx-md-3 text-center border border-dark align-items-center">
               <Col xs={12} md={3} className="mb-3 mb-md-0">
                 <h4 className="fs-5 fs-md-4 m-0 px-2">Matriz de Incompatibilidad Química</h4>
               </Col>
               <Col xs={12} md={9}>
                 <ClickableImg 
                   imgSource={imgMatrizIncomp} 
                   className="d-block border mx-auto img-fluid"
                   onClick={() => openFile(pdfMatrizIncomp)}
                   style={{ maxHeight: "50vh", width: "100%" }}
                 />
             </Col>
           </Row>
           </div>
         }
       />
    </>
  );
}

export default DefaultNavbar;
