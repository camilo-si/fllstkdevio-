import React from 'react';
import { Container, Accordion } from 'react-bootstrap';

function FAQ() {
  return (
    <Container id="faq" className="my-5" style={{ maxWidth: '800px' }}>
      <h2 className="text-center mb-4">Preguntas Frecuentes</h2>
      <Accordion defaultActiveKey="0"> {/* [cite: 124] */}
        <Accordion.Item eventKey="0">
          <Accordion.Header>¿Qué garantía tienen los equipos?</Accordion.Header>
          <Accordion.Body>
            Todos nuestros equipos cuentan con una garantía limitada de 12 meses (un año) a partir de la fecha original de compra. Esta garantía cubre exclusivamente defectos de fabricación y fallas de componentes que no se deban al desgaste normal por el uso. Para hacerla efectiva, es indispensable presentar el comprobante de compra. La garantía no cubre daños causados por mal uso, accidentes, caídas o reparaciones realizadas por personal no autorizado.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>¿Cómo funciona la mantención?</Accordion.Header>
          <Accordion.Body>
            Ofrecemos dos modalidades de servicio: mantención preventiva y mantención correctiva. Ofrecemos dos modalidades de servicio: mantención preventiva y mantención correctiva.<br />
            Preventiva: Se agenda de forma periódica (recomendamos cada 6 meses) para revisar el equipo, realizar limpiezas técnicas y asegurar su óptimo funcionamiento, previniendo futuras fallas.<br />
            Correctiva: Se solicita cuando el equipo ya presenta una falla o un problema específico.<br />
            Puedes optar por un plan de mantención anual (que incluye visitas preventivas programadas) o solicitar servicios por visita individual cuando lo necesites. Para agendar, solo contacta a nuestra área de soporte técnico.
          </Accordion.Body>
        </Accordion.Item>
        {/* ... Repetir para más preguntas[cite: 124]... */}
      </Accordion>
    </Container>
  );
}
export default FAQ;