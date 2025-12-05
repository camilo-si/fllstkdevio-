import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Alert, Col, Row } from 'react-bootstrap'; // Fix: Added Col and Row
import { db, getPublicDataCollectionPath } from '../utils/firebaseConfig';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';

/* global __app_id */ // Fix: Suppress no-undef warnings

/**
 * Componente Modal para crear o editar un Plan.
 * Reutiliza la lógica de Firebase para interactuar con la colección 'planes'.
 * * @param {object} props
 * @param {object | null} props.planInicial - Datos del plan a editar, o null/objeto vacío para crear.
 * @param {boolean} props.showModal - Controla la visibilidad del modal.
 * @param {function} props.onClose - Cierra el modal y resetea el estado del plan.
 * @param {object[]} props.serviciosDisponibles - Lista de servicios para incluir en el plan.
 */
function FormularioPlanModal({ planInicial = {}, showModal, onClose, serviciosDisponibles = [] }) {
    
    // Si se pasa un planInicial (para editar), usa esos datos. Si no, usa valores vacíos.
    const [formData, setFormData] = useState({
        id: planInicial.id || null, // Se mantiene el ID para el modo edición
        nombre: planInicial.nombre || '',
        descripcion: planInicial.descripcion || '',
        costoMensual: planInicial.costoMensual || 0,
        serviciosIncluidos: planInicial.serviciosIncluidos || [], // Array de IDs de servicios
        estado: planInicial.estado || 'Activo',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const isEditMode = !!formData.id;

    // Sincroniza el estado local del formulario cuando planInicial cambia (al abrir/cambiar de edición)
    useEffect(() => {
        setFormData({
            id: planInicial.id || null,
            nombre: planInicial.nombre || '',
            descripcion: planInicial.descripcion || '',
            costoMensual: planInicial.costoMensual || 0,
            serviciosIncluidos: planInicial.serviciosIncluidos || [],
            estado: planInicial.estado || 'Activo',
        });
        setError(null);
    }, [planInicial, showModal]);

    const getPlanesCollectionPath = () => {
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        return getPublicDataCollectionPath(appId, 'planes');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleServiceToggle = (serviceId) => {
        setFormData(prev => {
            const isIncluded = prev.serviciosIncluidos.includes(serviceId);
            return {
                ...prev,
                serviciosIncluidos: isIncluded
                    ? prev.serviciosIncluidos.filter(id => id !== serviceId) // Quitar
                    : [...prev.serviciosIncluidos, serviceId] // Añadir
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.nombre.trim() || formData.serviciosIncluidos.length === 0) {
            setError("El nombre y al menos un servicio son obligatorios.");
            return;
        }
        
        setError(null);
        setLoading(true);

        // Datos a guardar, excluyendo el ID temporal
        const { id, ...dataToSave } = {
            ...formData,
            costoMensual: Number(formData.costoMensual),
        };

        try {
            const path = getPlanesCollectionPath();
            if (id) {
                // Actualizar
                const planDocRef = doc(db, path, id);
                await updateDoc(planDocRef, dataToSave);
            } else {
                // Crear
                await addDoc(collection(db, path), {
                    ...dataToSave,
                    fechaCreacion: new Date().toISOString()
                });
            }
            onClose(); // Cierra el modal al completar
        } catch (err) {
            console.error("Error al guardar el plan:", err);
            setError(`Error al guardar el plan: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={showModal} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{isEditMode ? 'Editar Plan' : 'Crear Nuevo Plan'}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    
                    {/* Nombre del Plan */}
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="nombre">Nombre del Plan</Form.Label>
                        <Form.Control 
                            type="text" 
                            id="nombre" 
                            name="nombre" 
                            value={formData.nombre} 
                            onChange={handleChange} 
                            required 
                        />
                    </Form.Group>

                    {/* Descripción */}
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="descripcion">Descripción</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            rows={3}
                            id="descripcion" 
                            name="descripcion" 
                            value={formData.descripcion} 
                            onChange={handleChange} 
                            required 
                        />
                    </Form.Group>
                    
                    <Row>
                        {/* Costo Mensual */}
                        <Form.Group as={Col} md={6} className="mb-3">
                            <Form.Label htmlFor="costoMensual">Costo Mensual ($)</Form.Label>
                            <Form.Control 
                                type="number" 
                                id="costoMensual" 
                                name="costoMensual" 
                                value={formData.costoMensual} 
                                onChange={handleChange} 
                                min="0"
                                step="0.01"
                                required 
                            />
                        </Form.Group>
                        
                        {/* Estado */}
                        <Form.Group as={Col} md={6} className="mb-3">
                            <Form.Label htmlFor="estado">Estado</Form.Label>
                            <Form.Select
                                id="estado" 
                                name="estado" 
                                value={formData.estado} 
                                onChange={handleChange}
                            >
                                <option value="Activo">Activo</option>
                                <option value="Inactivo">Inactivo</option>
                            </Form.Select>
                        </Form.Group>
                    </Row>

                    {/* SELECCIÓN DE SERVICIOS INCLUIDOS */}
                    <Form.Group className="mb-3">
                        <Form.Label>Servicios Incluidos</Form.Label>
                        <div className="border p-2" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                            {serviciosDisponibles.length > 0 ? (
                                serviciosDisponibles.map(servicio => (
                                    <Form.Check
                                        type="checkbox"
                                        id={`servicio-${servicio.id}`}
                                        key={servicio.id}
                                        label={`${servicio.nombre} ($${servicio.precioBase})`}
                                        checked={formData.serviciosIncluidos.includes(servicio.id)}
                                        onChange={() => handleServiceToggle(servicio.id)}
                                    />
                                ))
                            ) : (
                                <p className="text-muted small">No hay servicios disponibles. Cree servicios primero.</p>
                            )}
                        </div>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose} disabled={loading}>
                        Cerrar
                    </Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>} {isEditMode ? 'Guardar Cambios' : 'Crear Plan'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default FormularioPlanModal;