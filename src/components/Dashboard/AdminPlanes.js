import React, { useState, useEffect } from 'react';
import { db, auth, initializeFirebase, getPublicDataCollectionPath } from '../../utils/firebaseConfig';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';

// Componente principal para la Gestión de Planes
function AdminPlanes() {
    // Estados principales
    const [planes, setPlanes] = useState([]);
    const [serviciosDisponibles, setServiciosDisponibles] = useState([]); // Para la lista de selección
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Estado para el modal de Crear/Editar
    const [showModal, setShowModal] = useState(false);
    const [currentPlan, setCurrentPlan] = useState({ 
        id: null, 
        nombre: '', 
        descripcion: '', 
        costoMensual: 0,
        serviciosIncluidos: [], // Array de IDs de servicios
        estado: 'Activo'
    });

    // --- RUTA DE COLECCIONES ---
    const getPlanesCollectionPath = () => {
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        return getPublicDataCollectionPath(appId, 'planes');
    };

    const getServiciosCollectionPath = () => {
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        return getPublicDataCollectionPath(appId, 'servicios');
    };

    // 1. Inicialización de Firebase y Auth (Solo se ejecuta una vez)
    useEffect(() => {
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
        const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
        
        initializeFirebase(firebaseConfig, initialAuthToken, auth, db, setError);
    }, []);

    // 2. Carga y escucha de Servicios (Necesarios para el formulario de Planes)
    useEffect(() => {
        if (!db) return;

        const path = getServiciosCollectionPath();
        const serviciosColRef = collection(db, path);

        const unsubscribe = onSnapshot(serviciosColRef, (snapshot) => {
            const fetchedServicios = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            // Almacena los servicios disponibles para usarlos en el modal de creación/edición
            setServiciosDisponibles(fetchedServicios); 
        }, (err) => {
            console.error("Error al escuchar servicios:", err);
            setError("No se pudieron cargar los servicios disponibles.");
        });

        return () => unsubscribe();
    }, [db]);


    // 3. Carga y escucha en tiempo real de los Planes
    useEffect(() => {
        if (!db) return;
        
        const path = getPlanesCollectionPath();
        const planesColRef = collection(db, path);

        const unsubscribe = onSnapshot(planesColRef, (snapshot) => {
            const fetchedPlanes = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPlanes(fetchedPlanes);
            setLoading(false);
        }, (err) => {
            console.error("Error al escuchar planes:", err);
            setError("No se pudieron cargar los planes.");
            setLoading(false);
        });

        return () => unsubscribe();
    }, [db]);

    // Manejar cambios en campos de texto/número
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentPlan(prev => ({ ...prev, [name]: value }));
    };

    // Manejar cambios en la selección múltiple de servicios
    const handleServiceToggle = (serviceId) => {
        setCurrentPlan(prev => {
            const isIncluded = prev.serviciosIncluidos.includes(serviceId);
            return {
                ...prev,
                serviciosIncluidos: isIncluded
                    ? prev.serviciosIncluidos.filter(id => id !== serviceId) // Quitar
                    : [...prev.serviciosIncluidos, serviceId] // Añadir
            };
        });
    };

    // 4. Crear o Actualizar un plan
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!currentPlan.nombre.trim() || currentPlan.serviciosIncluidos.length === 0) {
            alert("El nombre y al menos un servicio son obligatorios.");
            return;
        }

        const dataToSave = {
            nombre: currentPlan.nombre,
            descripcion: currentPlan.descripcion,
            costoMensual: Number(currentPlan.costoMensual),
            serviciosIncluidos: currentPlan.serviciosIncluidos,
            estado: currentPlan.estado
        };

        setLoading(true);
        try {
            const path = getPlanesCollectionPath();
            if (currentPlan.id) {
                // Actualizar
                const planDocRef = doc(db, path, currentPlan.id);
                await updateDoc(planDocRef, dataToSave);
            } else {
                // Crear
                await addDoc(collection(db, path), {
                    ...dataToSave,
                    fechaCreacion: new Date().toISOString()
                });
            }
            setShowModal(false);
            setCurrentPlan({ id: null, nombre: '', descripcion: '', costoMensual: 0, serviciosIncluidos: [], estado: 'Activo' });
        } catch (err) {
            console.error("Error al guardar el plan:", err);
            setError("Error al guardar el plan.");
        } finally {
            setLoading(false);
        }
    };

    // 5. Eliminar un plan
    const handleDelete = async (id) => {
        if (!window.confirm("¿Está seguro de que desea eliminar este plan?")) {
            return;
        }

        setLoading(true);
        try {
            const path = getPlanesCollectionPath();
            await deleteDoc(doc(db, path, id));
        } catch (err) {
            console.error("Error al eliminar el plan:", err);
            setError("Error al eliminar el plan.");
        } finally {
            setLoading(false);
        }
    };

    // Funciones de control del Modal
    const openCreateModal = () => {
        setCurrentPlan({ id: null, nombre: '', descripcion: '', costoMensual: 0, serviciosIncluidos: [], estado: 'Activo' });
        setShowModal(true);
    };

    const openEditModal = (plan) => {
        setCurrentPlan(plan);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setCurrentPlan({ id: null, nombre: '', descripcion: '', costoMensual: 0, serviciosIncluidos: [], estado: 'Activo' });
    };

    // Utilidad para obtener nombres de servicios por ID
    const getServiceNames = (serviceIds) => {
        if (!serviciosDisponibles || serviciosDisponibles.length === 0) return 'Cargando...';
        
        return serviceIds.map(id => {
            const servicio = serviciosDisponibles.find(s => s.id === id);
            return servicio ? servicio.nombre : `[ID Desconocido: ${id}]`;
        }).join(', ');
    };


    if (loading && planes.length === 0) return <div className="p-4 text-center"><i className="fas fa-spinner fa-spin"></i> Cargando planes...</div>;
    if (error) return <div className="p-4 text-center text-danger">Error: {error}</div>;

    return (
        <div className="content-wrapper">
            {/* Encabezado de la página */}
            <section className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                            <h1>Gestión de Planes</h1>
                        </div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item"><a href="/dashboard">Dashboard</a></li>
                                <li className="breadcrumb-item active">Planes</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contenido principal */}
            <section className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Listado de Planes de Suscripción</h3>
                                    <div className="card-tools">
                                        <button className="btn btn-primary" onClick={openCreateModal}>
                                            <i className="fas fa-plus"></i> Crear Nuevo Plan
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="card-body">
                                    <table className="table table-bordered table-striped">
                                        <thead>
                                            <tr>
                                                <th>Nombre</th>
                                                <th>Costo Mensual</th>
                                                <th>Servicios Incluidos</th>
                                                <th>Estado</th>
                                                <th className="text-center" style={{ width: '150px' }}>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {planes.length > 0 ? (
                                                planes.map(plan => (
                                                    <tr key={plan.id}>
                                                        <td>{plan.nombre}</td>
                                                        <td>${plan.costoMensual ? plan.costoMensual.toFixed(2) : '0.00'}</td>
                                                        <td>{getServiceNames(plan.serviciosIncluidos || [])}</td>
                                                        <td>
                                                            <span className={`badge ${plan.estado === 'Activo' ? 'bg-success' : 'bg-danger'}`}>
                                                                {plan.estado}
                                                            </span>
                                                        </td>
                                                        <td className="text-center">
                                                            <button 
                                                                className="btn btn-sm btn-info mr-1" 
                                                                title="Ver Detalle"
                                                                onClick={() => alert(`Detalle de ${plan.nombre}:\n\n${JSON.stringify(plan, null, 2)}`)}
                                                            >
                                                                <i className="fas fa-eye"></i>
                                                            </button>
                                                            <button 
                                                                className="btn btn-sm btn-warning mr-1" 
                                                                title="Editar"
                                                                onClick={() => openEditModal(plan)}
                                                            >
                                                                <i className="fas fa-edit"></i>
                                                            </button>
                                                            <button 
                                                                className="btn btn-sm btn-danger" 
                                                                title="Eliminar"
                                                                onClick={() => handleDelete(plan.id)}
                                                            >
                                                                <i className="fas fa-trash"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="text-center">No hay planes registrados.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Modal de Creación/Edición */}
            {showModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <form onSubmit={handleSubmit}>
                                <div className="modal-header">
                                    <h5 className="modal-title">{currentPlan.id ? 'Editar Plan' : 'Crear Nuevo Plan'}</h5>
                                    <button type="button" className="close" onClick={closeModal} aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label htmlFor="nombre">Nombre del Plan</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="nombre" 
                                            name="nombre" 
                                            value={currentPlan.nombre} 
                                            onChange={handleChange} 
                                            required 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="descripcion">Descripción</label>
                                        <textarea 
                                            className="form-control" 
                                            id="descripcion" 
                                            name="descripcion" 
                                            value={currentPlan.descripcion} 
                                            onChange={handleChange} 
                                            required 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="costoMensual">Costo Mensual ($)</label>
                                        <input 
                                            type="number" 
                                            className="form-control" 
                                            id="costoMensual" 
                                            name="costoMensual" 
                                            value={currentPlan.costoMensual} 
                                            onChange={handleChange} 
                                            min="0"
                                            step="0.01"
                                            required 
                                        />
                                    </div>

                                    {/* SELECCIÓN DE SERVICIOS INCLUIDOS */}
                                    <div className="form-group">
                                        <label>Servicios Incluidos</label>
                                        <div className="border p-2" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                            {serviciosDisponibles.length > 0 ? (
                                                serviciosDisponibles.map(servicio => (
                                                    <div className="form-check" key={servicio.id}>
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id={`servicio-${servicio.id}`}
                                                            checked={currentPlan.serviciosIncluidos.includes(servicio.id)}
                                                            onChange={() => handleServiceToggle(servicio.id)}
                                                        />
                                                        <label className="form-check-label" htmlFor={`servicio-${servicio.id}`}>
                                                            {servicio.nombre} (${servicio.precioBase})
                                                        </label>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-muted">No hay servicios disponibles. Cree servicios primero.</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="estado">Estado</label>
                                        <select
                                            className="form-control" 
                                            id="estado" 
                                            name="estado" 
                                            value={currentPlan.estado} 
                                            onChange={handleChange}
                                        >
                                            <option value="Activo">Activo</option>
                                            <option value="Inactivo">Inactivo</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={closeModal}>Cerrar</button>
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>} {currentPlan.id ? 'Guardar Cambios' : 'Crear Plan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminPlanes;