import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Alert, Col, Row } from 'react-bootstrap';
import { db, getPublicDataCollectionPath } from '../utils/firebaseConfig';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';

/* global __app_id */ 

/**
 * Componente Modal para crear o editar un Servicio.
 * Reutiliza la lógica de Firebase para interactuar con la colección 'servicios'.
 * * @param {object} props
 * @param {object | null} props.servicioInicial - Datos del servicio a editar, o null/objeto vacío para crear.
 * @param {boolean} props.showModal - Controla la visibilidad del modal.
 * @param {function} props.onClose - Cierra el modal y resetea el estado.
 */
function FormularioServicioModal({ servicioInicial = {}, showModal, onClose }) {
    
    // Sincroniza el estado local del formulario
    const [formData, setFormData] = useState({
        id: servicioInicial?.id || null, 
        nombre: servicioInicial?.nombre || '', 
        descripcion: servicioInicial?.descripcion || '', 
        precioBase: servicioInicial?.precioBase || 0,
        estado: servicioInicial?.estado || 'Activo' 
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const isEditMode = !!formData.id;

    // Sincroniza el estado local del formulario cuando servicioInicial cambia
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
            setFormData({
                id: null, nombre: '', descripcion: '', precioBase: 0, estado: 'Activo'
            });
        }
        setError(null);
    }, [servicioInicial, showModal]);

    // Función para obtener la ruta de la colección
    const getServiciosCollectionPath = () => {
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        return getPublicDataCollectionPath(appId, 'servicios');
    };

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
            // Obtenemos la ruta correcta de la colección usando tu función existente
            const COLLECTION_NAME = getServiciosCollectionPath();

            // -----------------------------------------------------
            // 1. INTEGRACIÓN DEL TIEMPO DE CARGA (DELAY ARTIFICIAL)
            // Esto pausará la ejecución por 2 segundos (2000 ms)
            // -----------------------------------------------------
            await new Promise(resolve => setTimeout(resolve, 2000));

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
                    
                    {/* Nombre del Servicio */}
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="nombre">Nombre del Servicio</Form.Label>
                        <Form.Control 
                            type="text" 
                            id="nombre" 
                            name="nombre" 
                            value={formData.nombre} 
                            onChange={handleChange} 
                            required 
                            autoFocus
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
                        {/* Precio Base */}
                        <Form.Group as={Col} md={6} className="mb-3">
                            <Form.Label htmlFor="precioBase">Precio Base ($)</Form.Label>
                            <Form.Control 
                                type="number" 
                                id="precioBase" 
                                name="precioBase" 
                                value={formData.precioBase} 
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
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose} disabled={loading}>
                        Cerrar
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