import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

function Testimonios() {
  return (
    <Container id="testimonios" className="my-5 bg-light p-5 rounded">
      <h2 className="text-center mb-4">Qué dicen nuestros clientes</h2>

      <Row className="row-cols-1 row-cols-sm-3 g-4">

      {/* Testimonio 1 */}
        <Col>
          {/* Añadimos h-100 para que todas las tarjetas tengan la misma altura */}
          <Card className="h-100"> 
            <Card.Body>
             <Card.Text>"Excelente servicio y muy profesionales. La atención al cliente fue de primera."</Card.Text>
             </Card.Body> {/* <-- El Body se cierra aquí */}

            {/* El Footer va AFUERA del Body */}
           <Card.Footer>— Juan Pérez, Santiago</Card.Footer> 
          </Card>
        </Col>

      {/* Testimonio 2 */}
        <Col>
          <Card className="h-100">
            <Card.Body>
            <Card.Text>"¡Muy confiables! La instalación fue rápida y el equipo funciona perfecto."</Card.Text>
            </Card.Body>
            <Card.Footer>— María González, Valparaíso</Card.Footer>
          </Card>
        </Col>
    
     {/* Testimonio 3 */}
        <Col>
          <Card className="h-100">
           <Card.Body>
             <Card.Text>"El soporte técnico resolvió todas mis dudas al instante. ¡Totalmente recomendados!"</Card.Text>
           </Card.Body>
           <Card.Footer>— Carlos Silva, Concepción</Card.Footer>
         </Card>
        </Col>

      </Row>
    </Container>
  );
}
export default Testimonios;