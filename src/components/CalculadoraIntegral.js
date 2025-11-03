import React, { useState, useMemo } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Form, 
  Button, 
  Card, 
  Table, 
  Alert, 
  InputGroup 
} from 'react-bootstrap';

// Estado inicial del formulario, basado en los placeholders de tu imagen
const initialState = {
  panelW: 450,
  cantidadPaneles: 8,
  inversorPrecio: 650000,
  bateriaPrecio: 320000,
  cantidadBaterias: 1,
  estructurasPrecio: 190000,
  instalacionBase: 350000,
  pesoKg: 90,
  tipoTecho: 0.05, // Teja/Asfalto (+5%)
  region: 5000, // RM
  complejidad: 0, // Baja
  subsidio: 0, // Sin subsidio
  metodoEnvio: 1.0, // Estándar
  garantia: 0.02, // 12 meses (+2%)
  planPago: "0-1", // Contado (tasa-meses)
  tipoPie: "porcentaje",
  valorPie: 10,
};

// --- Componente Principal ---
function CalculadoraDemo() {
  const [formData, setFormData] = useState(initialState);
  const [copied, setCopied] = useState(false);

  // Helper para formatear a CLP
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(Math.round(value)); // Redondeamos para evitar decimales en CLP
  };

  // --- Lógica de Cálculo ---
  const results = useMemo(() => {
    // Helper para convertir valores del form a números
    const n = (val) => Number(val) || 0;

    const {
      panelW, cantidadPaneles, inversorPrecio, bateriaPrecio, cantidadBaterias,
      estructurasPrecio, instalacionBase, pesoKg, tipoTecho, region,
      complejidad, subsidio, metodoEnvio, garantia, planPago, tipoPie, valorPie
    } = formData;

    // 1. Potencia
    const potenciaEstimada = (n(panelW) * n(cantidadPaneles)) / 1000; // en kW

    // 2. Advertencia
    const advertencia = potenciaEstimada > 7 && n(cantidadBaterias) === 0;

    // 3. Subtotal Equipos
    const subtotalEquipos = n(inversorPrecio) + (n(bateriaPrecio) * n(cantidadBaterias)) + n(estructurasPrecio);

    // 4. Recargo Techo
    const recargoTecho = subtotalEquipos * n(tipoTecho);

    // 5. Instalación
    const instalacionFinal = n(instalacionBase) + (n(instalacionBase) * n(complejidad));

    // 6. Subsidio (se aplica sobre equipos + recargo)
    const baseSubsidio = subtotalEquipos + recargoTecho;
    const montoSubsidio = baseSubsidio * n(subsidio); // subsidio es negativo

    // 7. Costo Equipos Final (con recargo y subsidio)
    const costoEquiposFinal = subtotalEquipos + recargoTecho + montoSubsidio;

    // 8. Garantía (sobre subtotal equipos, antes de subsidio)
    const costoGarantia = subtotalEquipos * n(garantia);

    // 9. IVA (sobre equipos final + instalación)
    const baseIva = costoEquiposFinal + instalacionFinal;
    const iva = baseIva * 0.19;

    // 10. Envío
    const costoEnvioBase = n(region) + (n(pesoKg) * 700);
    const costoEnvioFinal = costoEnvioBase * n(metodoEnvio);

    // 11. Total antes de financiar
    const totalAntesFinanciar = costoEquiposFinal + instalacionFinal + iva + costoEnvioFinal + costoGarantia;

    // 12. Pie
    let montoPie = 0;
    if (tipoPie === 'porcentaje') {
      montoPie = totalAntesFinanciar * (n(valorPie) / 100);
    } else {
      montoPie = n(valorPie);
    }
    // No permitir pie mayor al total
    montoPie = Math.min(montoPie, totalAntesFinanciar); 

    // 13. Financiamiento
    const montoAFinanciar = totalAntesFinanciar - montoPie;
    const [tasaMensualStr, nCuotasStr] = planPago.split('-');
    const tasaMensual = n(tasaMensualStr);
    const nCuotas = n(nCuotasStr);

    // 14. Interés (Simple)
    const interesTotal = montoAFinanciar * tasaMensual * nCuotas;
    
    // 15. Cuota
    const cuotaMensual = nCuotas > 1 ? (montoAFinanciar + interesTotal) / nCuotas : 0;

    // 16. Total Final
    const totalFinal = totalAntesFinanciar + interesTotal;

    return {
      potenciaEstimada,
      advertencia,
      subtotalEquipos,
      recargoTecho,
      montoSubsidio,
      instalacionFinal,
      iva,
      costoEnvioFinal,
      costoGarantia,
      totalAntesFinanciar,
      montoPie,
      interesTotal,
      cuotaMensual,
      totalFinal
    };
  }, [formData]);

  // --- Manejadores de Eventos ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReset = (e) => {
    e.preventDefault();
    setFormData(initialState);
  };

  const handleCopy = (e) => {
    e.preventDefault();
    const summaryText = `
      --- Resumen de Cotización Solar ---
      Potencia estimada: ${results.potenciaEstimada.toFixed(2)} kW
      Subtotal equipos: ${formatCurrency(results.subtotalEquipos)}
      Recargo techo: ${formatCurrency(results.recargoTecho)}
      Subsidio: ${formatCurrency(results.montoSubsidio)}
      Instalación final: ${formatCurrency(results.instalacionFinal)}
      IVA 19%: ${formatCurrency(results.iva)}
      Envío: ${formatCurrency(results.costoEnvioFinal)}
      Garantía: ${formatCurrency(results.costoGarantia)}
      Total antes de financiar: ${formatCurrency(results.totalAntesFinanciar)}
      Pie: ${formatCurrency(results.montoPie)}
      Interés total: ${formatCurrency(results.interesTotal)}
      Cuota (${formData.planPago.split('-')[1]} meses): ${formatCurrency(results.cuotaMensual)}
      --- TOTAL FINAL: ${formatCurrency(results.totalFinal)} ---
    `;
    
    // Usar execCommand para compatibilidad en iframes
    const textArea = document.createElement("textarea");
    textArea.value = summaryText.trim().replace(/ +/g, ' '); // Limpiar espacios
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Mensaje dura 2 seg
    } catch (err) {
      console.error('Error al copiar', err);
    }
    document.body.removeChild(textArea);
  };
  
  // --- Renderizado ---
  return (
    <Container className="my-5">
      <h2 className="text-start mb-0">DEMO calculadora</h2>
      <p className="text-start text-muted">Maquetado de formulario y resumen. (Valores referenciales)</p>

      <Row className="g-4 mt-2">

        {/* --- Columna Izquierda: Formulario --- */}
        <Col xs={12} lg={6}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="p-4">
              <Card.Title as="h5" className="mb-3">Formulario</Card.Title>
              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Potencia del panel (W)</Form.Label>
                      <Form.Control type="number" min="0" name="panelW" value={formData.panelW} onChange={handleChange} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Cantidad de paneles</Form.Label>
                      <Form.Control type="number" min="0" name="cantidadPaneles" value={formData.cantidadPaneles} onChange={handleChange} />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Inversor (precio)</Form.Label>
                      <Form.Control type="number" min="0" name="inversorPrecio" value={formData.inversorPrecio} onChange={handleChange} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Batería (precio unidad)</Form.Label>
                      <Form.Control type="number" min="0" name="bateriaPrecio" value={formData.bateriaPrecio} onChange={handleChange} />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Cantidad baterías</Form.Label>
                      <Form.Control type="number" min="0" name="cantidadBaterias" value={formData.cantidadBaterias} onChange={handleChange} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Estruct./cableado</Form.Label>
                      <Form.Control type="number" min="0" name="estructurasPrecio" value={formData.estructurasPrecio} onChange={handleChange} />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Instalación base</Form.Label>
                      <Form.Control type="number" min="0" name="instalacionBase" value={formData.instalacionBase} onChange={handleChange} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Peso envío (kg)</Form.Label>
                      <Form.Control type="number" min="0" name="pesoKg" value={formData.pesoKg} onChange={handleChange} />
                    </Form.Group>
                  </Col>
                </Row>

                <hr className="my-3" />

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Tipo de techo</Form.Label>
                      <Form.Select name="tipoTecho" value={formData.tipoTecho} onChange={handleChange}>
                        <option value="0.05">Teja/Asfalto (+5%)</option>
                        <option value="0.02">Zinc/Planchas (+2%)</option>
                        <option value="0.07">Hormigón (+7%)</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Región</Form.Label>
                      <Form.Select name="region" value={formData.region} onChange={handleChange}>
                        <option value="5000">RM ($5.000)</option>
                        <option value="9000">Norte ($9.000)</option>
                        <option value="10000">Sur ($10.000)</option>
                        <option value="15000">Austral ($15.000)</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Complejidad instalación</Form.Label>
                      <Form.Select name="complejidad" value={formData.complejidad} onChange={handleChange}>
                        <option value="0">Baja (0%)</option>
                        <option value="0.08">Media (+8%)</option>
                        <option value="0.15">Alta (+15%)</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Subsidio</Form.Label>
                      <Form.Select name="subsidio" value={formData.subsidio} onChange={handleChange}>
                        <option value="0">Sin subsidio (0%)</option>
                        <option value="-0.08">Residencial (-8%)</option>
                        <option value="-0.05">Pyme (-5%)</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Método de envío</Form.Label>
                      <Form.Select name="metodoEnvio" value={formData.metodoEnvio} onChange={handleChange}>
                        <option value="1.0">Estándar (x1.00)</option>
                        <option value="1.2">Exprés (x1.20)</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Garantía</Form.Label>
                      <Form.Select name="garantia" value={formData.garantia} onChange={handleChange}>
                        <option value="0.02">12 meses (+2%)</option>
                        <option value="0.04">24 meses (+4%)</option>
                        <option value="0.06">36 meses (+6%)</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                
                <hr className="my-3" />

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Plan de pago</Form.Label>
                      <Form.Select name="planPago" value={formData.planPago} onChange={handleChange}>
                        <option value="0-1">Contado (Tasa 0%)</option>
                        <option value="0.012-6">6 cuotas (Tasa 1.2%)</option>
                        <option value="0.011-12">12 cuotas (Tasa 1.1%)</option>
                        <option value="0.01-24">24 cuotas (Tasa 1.0%)</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Tipo de pie</Form.Label>
                      <Form.Select name="tipoPie" value={formData.tipoPie} onChange={handleChange}>
                        <option value="porcentaje">Porcentaje</option>
                        <option value="monto">Monto fijo</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Valor de pie</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      {formData.tipoPie === 'porcentaje' ? '%' : '$'}
                    </InputGroup.Text>
                    <Form.Control type="number" min="0" name="valorPie" value={formData.valorPie} onChange={handleChange} />
                  </InputGroup>
                  <Form.Text>
                    {formData.tipoPie === 'porcentaje' ? 'Si es porcentaje, 10 = 10%.' : 'Ingrese un monto fijo en CLP.'}
                  </Form.Text>
                </Form.Group>

                <Row className="mt-4">
                  <Col>
                    <Button variant="outline-secondary" type="button" onClick={handleReset}>
                      Reiniciar
                    </Button>
                  </Col>
                  <Col className="text-end">
                    <Button variant="outline-primary" type="button" onClick={handleCopy}>
                      {copied ? '¡Copiado!' : 'Copiar resumen'}
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* --- Columna Derecha: Resumen --- */}
        <Col xs={12} lg={6}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="p-4">
              <Card.Title as="h5" className="mb-3">Resumen</Card.Title>

              {results.advertencia && (
                <Alert variant="warning" className="small">
                  <b>Advertencia:</b> Potencia estimada ({results.potenciaEstimada.toFixed(2)} kW) es alta. Se recomienda considerar almacenamiento (baterías) para estabilidad del sistema.
                </Alert>
              )}
              
              <Table striped bordered responsive className="align-middle">
                <tbody>
                  <tr>
                    <td>Potencia estimada (kW)</td>
                    <td className="text-end">{results.potenciaEstimada.toFixed(2)} kW</td>
                  </tr>
                  <tr>
                    <td>Subtotal equipos</td>
                    <td className="text-end">{formatCurrency(results.subtotalEquipos)}</td>
                  </tr>
                  <tr>
                    <td>Recargo techo</td>
                    <td className="text-end">{formatCurrency(results.recargoTecho)}</td>
                  </tr>
                  <tr>
                    <td>Subsidio</td>
                    <td className="text-end text-danger">{formatCurrency(results.montoSubsidio)}</td>
                  </tr>
                  <tr>
                    <td>Instalación final</td>
                    <td className="text-end">{formatCurrency(results.instalacionFinal)}</td>
                  </tr>
                  <tr>
                    <td>IVA 19%</td>
                    <td className="text-end">{formatCurrency(results.iva)}</td>
                  </tr>
                  <tr>
                    <td>Envío</td>
                    <td className="text-end">{formatCurrency(results.costoEnvioFinal)}</td>
                  </tr>
                  <tr>
                    <td>Garantía</td>
                    <td className="text-end">{formatCurrency(results.costoGarantia)}</td>
                  </tr>
                  <tr className="fw-bold table-light">
                    <td>Total antes de financiar</td>
                    <td className="text-end">{formatCurrency(results.totalAntesFinanciar)}</td>
                  </tr>
                  <tr>
                    <td>Pie</td>
                    <td className="text-end">{formatCurrency(results.montoPie)}</td>
                  </tr>
                  <tr>
                    <td>Interés total</td>
                    <td className="text-end">{formatCurrency(results.interesTotal)}</td>
                  </tr>
                  <tr>
                    <td>Cuota ({formData.planPago.split('-')[1]} meses)</td>
                    <td className="text-end">{formatCurrency(results.cuotaMensual)}</td>
                  </tr>
                  <tr className="fw-bold table-warning">
                    <td className="fs-5">Total final</td>
                    <td className="text-end fs-5">{formatCurrency(results.totalFinal)}</td>
                  </tr>
                </tbody>
              </Table>
              <p className="text-muted small mt-3">
                Valores referenciales para el prototipo.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default CalculadoraDemo;