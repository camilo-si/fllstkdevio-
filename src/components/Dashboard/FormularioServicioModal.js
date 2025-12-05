import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Alert, Col, Row } from 'react-bootstrap';
// 1. IMPORTACIÓN CORREGIDA: Solo necesitamos 'db'
import { db } from '../utils/firebaseConfig';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';

/**
 * Componente Modal para crear o editar un Servicio.
 */
function FormularioServicioModal({ servicioInicial = {}, showModal, onClose }) {
    
    // Nombre de la colección (Igual que en AdminServicios.js)
    const COLLECTION_NAME = 'servicios';

    // Estado local del formulario
    const [formData, setFormData] = useState({
        id: null, 
        nombre: '', 
        descripcion: '', 
        precioBase: 0,
        estado: 'Activo' 
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Determinamos si es modo edición si hay un ID válido
    const isEditMode = !!(servicioInicial && servicioInicial.id);

    // Sincronizar estado cuando abre el modal
    useEffect(() => {
        if (servicioInicial) {
            setFormData({
                id: servicioInicial.id || null,
                nombre: servicioInicial.nombre || '',
                descripcion: servicioInicial.descripcion || '',
                precioBase: servicioInicial.precioBase || 0,
                estado: servicioInicial.estado || 'Activo',
            });
        } else {
            // Resetear si no hay datos iniciales
            setFormData({
                id: null, nombre: '', descripcion: '', precioBase: 0, estado: 'Activo'
            });
        }
        setError(null);
    }, [servicioInicial, showModal]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.nombre.trim() || !formData.descripcion.trim()) {
            setError("El nombre y la descripción son obligatorios.");
            return;
        }

        setError(null);
        setLoading(true);

        // Preparamos los datos (excluyendo el ID para que no se guarde dentro del documento)
        const { id, ...dataToSave } = {
            ...formData,
            precioBase: Number(formData.precioBase), // Asegurar que sea número
        };

        try {
            // 2. LÓGICA DE GUARDADO SIMPLIFICADA
            if (id) {
                // MODO ACTUALIZAR
                const serviceDocRef = doc(db, COLLECTION_NAME, id);
                await updateDoc(serviceDocRef, dataToSave);
            } else {
                // MODO CREAR
                await addDoc(collection(db, COLLECTION_NAME), {
                    ...dataToSave,
                    fechaCreacion: new Date().toISOString()
                });
            }
            
            // Cerrar modal al terminar
            onClose(); 
            
        } catch (err) {
            console.error("Error al guardar:", err);
            setError("Error de conexión al guardar. Inténtalo de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={showModal} onHide={onClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{isEditMode ? 'Editar Servicio' : 'Crear Nuevo Servicio'}</Modal.Title>
            </Modal.Header>
            
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    
                    {/* Fila 1: Nombre */}
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="nombre">Nombre del Servicio</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="nombre" 
                            value={formData.nombre} 
                            onChange={handleChange} 
                            placeholder="Ej. Instalación de Paneles Solares"
                            required 
                            autoFocus
                        />
                    </Form.Group>

                    {/* Fila 2: Descripción */}
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="descripcion">Descripción</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            rows={3}
                            name="descripcion" 
                            value={formData.descripcion} 
                            onChange={handleChange} 
                            placeholder="Describe los detalles del servicio..."
                            required 
                        />
                    </Form.Group>
                    
                    {/* Fila 3: Precio y Estado */}
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="precioBase">Precio Base ($)</Form.Label>
                                <Form.Control 
                                    type="number" 
                                    name="precioBase" 
                                    value={formData.precioBase} 
                                    onChange={handleChange} 
                                    min="0"
                                    step="0.01"
                                    required 
                                />
                            </Form.Group>
                        </Col>
                        
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="estado">Estado</Form.Label>
                                <Form.Select
                                    name="estado" 
                                    value={formData.estado} 
                                    onChange={handleChange}
                                >
                                    <option value="Activo">Activo</option>
                                    <option value="Inactivo">Inactivo</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Guardando...
                            </>
                        ) : (
                            isEditMode ? 'Guardar Cambios' : 'Crear Servicio'
                        )}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default FormularioServicioModal;