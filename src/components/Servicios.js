import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

function Servicios() {
  return (
    <Container id="servicios" className="my-5">
      {/* Título y subtítulo alineados a la izquierda, como en la imagen */}
      <div className="text-start mb-4">
        <h2 className="mb-0">Servicios</h2>
        <p className="text-muted">Estudio energético, instalación certificada, monitoreo y mantención.</p>
      </div>

      {/* Grilla responsive:
        - 1 columna en móvil
        - 4 columnas en pantallas medianas y grandes (para coincidir con la imagen)
      */}
      <Row className="row-cols-1 row-cols-md-4 g-4">

        {/* Servicio 1: Estudio energético */}
        <Col>
          <Card className="h-100 p-3 shadow-sm border-0">
            <Card.Body>
              <div className="d-flex align-items-center mb-2">
                {/* Icono de placeholder (reemplazar) */}
                <img 
                  src="https://placehold.co/40x40/dcf7f2/179282?text=⚡" 
                  alt="Icono Estudio" 
                  className="rounded me-3" 
                  style={{ backgroundColor: '#dcf7f2', padding: '5px' }}
                />
                <Card.Title className="mb-0 fs-5">Estudio energético</Card.Title>
              </div>
              <Card.Text className="text-muted small">
                Análisis de consumo y propuesta ajustada a tu perfil.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        {/* Servicio 2: Instalación certificada */}
        <Col>
          <Card className="h-100 p-3 shadow-sm border-0">
            <Card.Body>
              <div className="d-flex align-items-center mb-2">
                {/* Icono de placeholder (reemplazar) */}
                <img 
                  src="https://placehold.co/40x40/dcf7f2/179282?text=🔧" 
                  alt="Icono Instalación" 
                  className="rounded me-3" 
                  style={{ backgroundColor: '#dcf7f2', padding: '5px' }}
                />
                <Card.Title className="mb-0 fs-5">Instalación certificada</Card.Title>
              </div>
              <Card.Text className="text-muted small">
                Ejecutada por personal acreditado y normativa SEC vigente.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        {/* Servicio 3: Monitoreo */}
        <Col>
          <Card className="h-100 p-3 shadow-sm border-0">
            <Card.Body>
              <div className="d-flex align-items-center mb-2">
                {/* Icono de placeholder (reemplazar) */}
                <img 
                  src="https://placehold.co/40x40/dcf7f2/179282?text=📊" 
                  alt="Icono Monitoreo" 
                  className="rounded me-3" 
                  style={{ backgroundColor: '#dcf7f2', padding: '5px' }}
                />
                <Card.Title className="mb-0 fs-5">Monitoreo</Card.Title>
              </div>
              <Card.Text className="text-muted small">
                Seguimiento de rendimiento y alertas preventivas.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        {/* Servicio 4: Mantención */}
        <Col>
          <Card className="h-100 p-3 shadow-sm border-0">
            <Card.Body>
              <div className="d-flex align-items-center mb-2">
                {/* Icono de placeholder (reemplazar) */}
                <img 
                  src="https://placehold.co/40x40/dcf7f2/179282?text=🛠️" 
                  alt="Icono Mantención" 
                  className="rounded me-3" 
                  style={{ backgroundColor: '#dcf7f2', padding: '5px' }}
                />
                <Card.Title className="mb-0 fs-5">Mantención</Card.Title>
              </div>
              <Card.Text className="text-muted small">
                Planes periódicos para extender la vida útil del sistema.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
export default Servicios;