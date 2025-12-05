import React from 'react';
// Importa los componentes de React-Bootstrap que necesitas
import { Navbar, Nav, Container } from 'react-bootstrap';

// Uso "AppNavbar" para que no choque con el nombre "Navbar" de la librería
function AppNavbar() {
  return (
    // fixed="top" y expand="lg" como pide el brief [cite: 30, 32]
    <Navbar bg="light" expand="lg" fixed="top" collapseOnSelect>
      <Container>
        <Navbar.Brand href="#inicio">HelioAndes Energía</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* ms-auto alinea los links a la derecha */}
          <Nav className="ms-auto">
            {/* Estos son los enlaces solicitados [cite: 31] */}
            <Nav.Link href="#inicio">Inicio</Nav.Link>
            <Nav.Link href="#servicios">Servicios</Nav.Link>
            <Nav.Link href="#soluciones">Soluciones</Nav.Link>
            <Nav.Link href="#calculadorademo">DEMO</Nav.Link> {/* [cite: 33] */}
            <Nav.Link href="#planes">Planes</Nav.Link>
            <Nav.Link href="#testimonios">Testimonios</Nav.Link>
            <Nav.Link href="#faq">FAQ</Nav.Link>
            <Nav.Link href="#contacto">Contacto</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;