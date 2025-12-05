import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Alert, Row, Col } from 'react-bootstrap';
// Importación corregida (subiendo dos niveles)
import { db } from '../utils/firebaseConfig';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';

function FormularioPlanModal({ planInicial = {}, showModal, onClose }) {
    
    const COLLECTION_NAME = 'planes';

    // Estado del formulario
    const [formData, setFormData] = useState({
        id: null,
        nombre: '',
        precio: '',
        caracteristicas: '', // Lo manejaremos como texto y luego lo convertiremos si es necesario
        estado: 'Activo'
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const isEditMode = !!(planInicial && planInicial.id);

    // Cargar datos al abrir el modal
    useEffect(() => {
        if (planInicial && planInicial.id) {
            // Si las características vienen como array, las unimos con comas para el input
            let caracteristicasTexto = '';
            if (Array.isArray(planInicial.caracteristicas)) {
                caracteristicasTexto = planInicial.caracteristicas.join(', ');
            } else {
                caracteristicasTexto = planInicial.caracteristicas || '';
            }

            setFormData({
                id: planInicial.id,
                nombre: planInicial.nombre || '',
                precio: planInicial.precio || '',
                caracteristicas: caracteristicasTexto,
                estado: planInicial.estado || 'Activo'
            });
        } else {
            // Resetear para crear nuevo
            setFormData({
                id: null,
                nombre: '',
                precio: '',
                caracteristicas: '',
                estado: 'Activo'
            });
        }
        setError(null);
    }, [planInicial, showModal]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.nombre.trim() || !formData.precio) {
            setError("El nombre y el precio son obligatorios.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Convertir características de texto (separado por comas) a Array
            const featsArray = formData.caracteristicas
                .split(',')
                .map(item => item.trim())
                .filter(item => item !== '');

            const dataToSave = {
                nombre: formData.nombre,
                precio: Number(formData.precio),
                caracteristicas: featsArray, // Guardamos como array en Firebase
                estado: formData.estado,
                fechaActualizacion: new Date().toISOString()
            };

            if (isEditMode) {
                // Actualizar
                const docRef = doc(db, COLLECTION_NAME, formData.id);
                await updateDoc(docRef, dataToSave);
            } else {
                // Crear
                await addDoc(collection(db, COLLECTION_NAME), {
                    ...dataToSave,
                    fechaCreacion: new Date().toISOString()
                });
            }

            onClose();

        } catch (err) {
            console.error("Error al guardar plan:", err);
            setError("Error al guardar. Verifica tu conexión.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={showModal} onHide={onClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{isEditMode ? 'Editar Plan' : 'Crear Nuevo Plan'}</Modal.Title>
            </Modal.Header>
            
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Nombre del Plan</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    placeholder="Ej: Plan Básico"
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Precio ($)</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="precio"
                                    value={formData.precio}
                                    onChange={handleChange}
                                    placeholder="0"
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>Características <small className="text-muted">(Sepáralas con comas)</small></Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="caracteristicas"
                            value={formData.caracteristicas}
                            onChange={handleChange}
                            placeholder="Ej: Mantenimiento incluido, Soporte 24/7, Paneles clase A"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Estado</Form.Label>
                        <Form.Select name="estado" value={formData.estado} onChange={handleChange}>
                            <option value="Activo">Activo</option>
                            <option value="Inactivo">Inactivo</option>
                        </Form.Select>
                    </Form.Group>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? 'Guardando...' : (isEditMode ? 'Actualizar Plan' : 'Crear Plan')}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default FormularioPlanModal;