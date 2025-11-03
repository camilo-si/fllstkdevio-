import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

function Soluciones() {
  return (
    <Container id="soluciones" className="my-5">
      <div className="text-start mb-4"> {/* Cambiado a text-start */}
        <h2 className="mb-0">Soluciones</h2> {/* mb-0 para ajustar espacio */}
        <p className="text-muted">Kits residenciales, Pyme, off-grid con baterías e híbridos.</p>
      </div>

      <Row className="row-cols-1 row-cols-md-3 g-4"> {/* Cambiado a 3 columnas en md */}

        {/* Kit Hogar */}
        <Col>
          <Card className="h-100 p-3 shadow-sm border-0"> {/* Añadimos padding y sombra, sin borde */}
            <Card.Body>
              {/* Contenedor flex para el icono y el título */}
              <div className="d-flex align-items-center mb-2">
                {/* Icono de placeholder, reemplazar con SVG/PNG real */}
                <img 
                  src="https://placehold.co/40x40/dcf7f2/179282?text=🏠" 
                  alt="Icono Hogar" 
                  className="rounded me-3" 
                  style={{ backgroundColor: '#dcf7f2', padding: '5px' }} // Fondo del icono como en la imagen
                />
                <Card.Title className="mb-0 fs-5">Hogar 3–5 kW</Card.Title> {/* fs-5 para tamaño de fuente */}
              </div>
              <Card.Text className="text-muted small">
                Balance ideal entre costo y ahorro mensual.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Kit Pyme */}
        <Col>
          <Card className="h-100 p-3 shadow-sm border-0">
            <Card.Body>
              <div className="d-flex align-items-center mb-2">
                {/* Icono de placeholder */}
                <img 
                  src="https://placehold.co/40x40/dcf7f2/179282?text=🏢" 
                  alt="Icono Pyme" 
                  className="rounded me-3" 
                  style={{ backgroundColor: '#dcf7f2', padding: '5px' }}
                />
                <Card.Title className="mb-0 fs-5">PyME 10–20 kW</Card.Title>
              </div>
              <Card.Text className="text-muted small">
                Para operación diurna con buena irradiación.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Kit Off-grid */}
        <Col>
          <Card className="h-100 p-3 shadow-sm border-0">
            <Card.Body>
              <div className="d-flex align-items-center mb-2">
                {/* Icono de placeholder */}
                <img 
                  src="https://placehold.co/40x40/dcf7f2/179282?text=🔋" 
                  alt="Icono Off-grid" 
                  className="rounded me-3" 
                  style={{ backgroundColor: '#dcf7f2', padding: '5px' }}
                />
                <Card.Title className="mb-0 fs-5">Off-grid con baterías</Card.Title>
              </div>
              <Card.Text className="text-muted small">
                Autonomía en zonas sin red eléctrica.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Kit Híbrido (Si quieres las 4, solo descomenta este) */}
        <Col>
          <Card className="h-100 p-3 shadow-sm border-0">
            <Card.Body>
              <div className="d-flex align-items-center mb-2">
                {/* Icono de placeholder */}
                <img 
                  src="https://placehold.co/40x40/dcf7f2/179282?text=⚡" 
                  alt="Icono Híbrido" 
                  className="rounded me-3" 
                  style={{ backgroundColor: '#dcf7f2', padding: '5px' }}
                />
                <Card.Title className="mb-0 fs-5">Híbridos</Card.Title>
              </div>
              <Card.Text className="text-muted small">
                Lo mejor de ambos mundos, con respaldo y ahorro.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

      </Row>
    </Container>
  );
}
export default Soluciones;