import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

function Planes() {
  return (
    <Container id="planes" className="my-5">
      <h2 className="text-center mb-4">Nuestros Planes</h2>
      
      {/* Esta grilla es responsive: 1 columna en móvil, 3 en pantallas medianas y grandes */}
      <Row className="row-cols-1 row-cols-md-3 g-4">
        
        {/* Plan Básico */}
        <Col>
          <Card className="h-100 text-center">
            <Card.Header as="h5">Plan Básico</Card.Header>
            <Card.Body>
              <Card.Text>
                Ideal para empezar a monitorear y mantener tus equipos.
              </Card.Text>
              <ul className="list-unstyled mb-4">
                <li>✓ Instalación y configuración</li>
                <li>✓ Soporte técnico 24/7</li>
                <li>✓ 1 visita de mantención al año</li>
              </ul>
              <Button variant="outline-primary">Solicitar evaluación</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Plan Optimizado (Recomendado) */}
        <Col>
          {/* Añadimos un borde y estilos para destacarlo */}
          <Card className="h-100 text-center border-primary shadow">
            <Card.Header as="h5" className="bg-primary text-white">Plan Optimizado</Card.Header>
            <Card.Body>
              <Card.Text>
                La solución completa para una operación sin preocupaciones.
              </Card.Text>
              <ul className="list-unstyled mb-4">
                <li>✓ Todo lo del Plan Básico</li>
                <li>✓ Monitoreo proactivo de fallas</li>
                <li>✓ Mantenciones ilimitadas</li>
                <li>✓ Reportes mensuales</li>
              </ul>
              <Button variant="primary">Solicitar evaluación</Button>
            </Card.Body>
          </Card>
         </Col>

         {/* Plan Autónomo */}
         <Col>
          <Card className="h-100 text-center">
            <Card.Header as="h5">Plan Autónomo</Card.Header>
            <Card.Body>
               <Card.Text>
                Delegas la gestión completa de tus equipos en expertos.
              </Card.Text>
              <ul className="list-unstyled mb-4">
                <li>✓ Todo lo del Plan Optimizado</li>
                <li>✓ Gestión y compra de repuestos</li>
                <li>✓ Asesoría personalizada</li>
              </ul>
              <Button variant="outline-primary">Solicitar evaluación</Button>
            </Card.Body>
          </Card>
        </Col>

      </Row>
    </Container>
  );
}
export default Planes;
