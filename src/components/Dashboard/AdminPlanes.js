import React, { useState, useEffect } from 'react';
import { db, auth, initializeFirebase, getPublicDataCollectionPath } from '../utils/firebaseConfig';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore'; 
import FormularioPlanModal from './FormularioPlanModal';

/* global __app_id, __firebase_config, __initial_auth_token */ 

// --- DATOS DE EJEMPLO (Se muestran si no hay datos en Firebase) ---
// Estos coinciden con los planes mostrados en el Home (Planes.js)
const DATOS_EJEMPLO = [
    { 
        id: 'mock-plan-1', 
        nombre: 'Plan Básico', 
        costoMensual: 0, 
        serviciosIncluidos: ['Instalación y configuración', 'Soporte técnico 24/7', '1 visita de mantención al año'], 
        estado: 'Activo',
        descripcion: 'Ideal para empezar a monitorear y mantener tus equipos.'
    },
    { 
        id: 'mock-plan-2', 
        nombre: 'Plan Optimizado', 
        costoMensual: 25000, // Valor referencial
        serviciosIncluidos: ['Todo lo del Plan Básico', 'Monitoreo proactivo', 'Mantenciones ilimitadas', 'Reportes mensuales'], 
        estado: 'Activo',
        descripcion: 'La solución completa para una operación sin preocupaciones.'
    },
    { 
        id: 'mock-plan-3', 
        nombre: 'Plan Autónomo', 
        costoMensual: 45000, // Valor referencial
        serviciosIncluidos: ['Todo lo del Plan Optimizado', 'Gestión de repuestos', 'Asesoría personalizada'], 
        estado: 'Activo',
        descripcion: 'Delegas la gestión completa de tus equipos en expertos.'
    },
];

// Componente principal para la Gestión de Planes
function AdminPlanes() {
    // Estados principales
    const [planes, setPlanes] = useState([]);
    const [serviciosDisponibles, setServiciosDisponibles] = useState([]); // Para la lista de selección
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Estado para el modal de Crear/Editar
    const [showModal, setShowModal] = useState(false);
    const [currentPlan, setCurrentPlan] = useState(null); // Usamos null o el objeto para edición

    // --- RUTA DE COLECCIONES ---
    const getPlanesCollectionPath = () => {
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        return getPublicDataCollectionPath(appId, 'planes');
    };

    const getServiciosCollectionPath = () => {
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        return getPublicDataCollectionPath(appId, 'servicios');
    };

    // 1. Inicialización de Firebase y Auth
    useEffect(() => {
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
        const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
        
        initializeFirebase(firebaseConfig, initialAuthToken, auth, db, setError);
    }, []);

    // 2. Carga y escucha de Servicios
    useEffect(() => {
        if (!db) return;

        const path = getServiciosCollectionPath();
        const serviciosColRef = collection(db, path);

        const unsubscribe = onSnapshot(serviciosColRef, (snapshot) => {
            const fetchedServicios = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setServiciosDisponibles(fetchedServicios); 
        }, (err) => {
            console.error("Error al escuchar servicios:", err);
            // No mostramos error fatal para no bloquear la UI si solo fallan los servicios
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
            // Si falla la carga (ej: permisos o colección vacía al inicio), quitamos loading para mostrar datos mock
            setLoading(false); 
        });

        return () => unsubscribe();
    }, [db]);


    // 4. Eliminar un plan
    const handleDelete = async (id) => {
        // Protección para datos de ejemplo
        if (id.toString().startsWith('mock-')) {
            alert("No puedes eliminar un plan de ejemplo. Crea uno real primero.");
            return;
        }

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
        if (plan.id.toString().startsWith('mock-')) {
            alert("Estás viendo un plan de ejemplo. Para editar, crea un registro real.");
            return;
        }
        setCurrentPlan(plan);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setCurrentPlan(null);
    };

    // Utilidad para obtener nombres de servicios por ID (Maneja strings y arrays)
    const getServiceNames = (serviciosIncluidos) => {
        // Si es el dato mock, ya viene como un array de strings con nombres
        if (Array.isArray(serviciosIncluidos) && serviciosIncluidos.length > 0 && typeof serviciosIncluidos[0] === 'string' && serviciosIncluidos[0].includes(' ')) {
             return serviciosIncluidos.join(', ');
        }

        // Si son IDs de Firebase
        if (!serviciosDisponibles || serviciosDisponibles.length === 0) return 'Cargando...';
        
        return (serviciosIncluidos || []).map(id => {
            const servicio = serviciosDisponibles.find(s => s.id === id);
            return servicio ? servicio.nombre : '';
        }).filter(Boolean).join(', ');
    };

    // --- LÓGICA DE VISUALIZACIÓN ---
    const listaParaMostrar = (planes.length > 0) ? planes : DATOS_EJEMPLO;
    const esModoEjemplo = (planes.length === 0);

    if (loading && planes.length === 0) return <div className="p-4 text-center"><i className="fas fa-spinner fa-spin"></i> Cargando planes...</div>;

    return (
        <div className="content-wrapper">
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

            <section className="content">
                <div className="container-fluid">
                    
                    {/* Alerta de Modo Ejemplo */}
                    {esModoEjemplo && (
                        <div className="alert alert-info alert-dismissible">
                            <button type="button" className="close" data-dismiss="alert" aria-hidden="true">×</button>
                            <h5><i className="icon fas fa-info"></i> ¡Modo Demostración!</h5>
                            Actualmente no hay planes en la base de datos. Estás viendo <b>planes de ejemplo</b> (los mismos del Home).
                        </div>
                    )}

                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Listado de Planes</h3>
                                    <div className="card-tools">
                                        <button className="btn btn-primary" onClick={openCreateModal}>
                                            <i className="fas fa-plus"></i> Crear Nuevo Plan
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="card-body table-responsive p-0">
                                    <table className="table table-hover text-nowrap">
                                        <thead>
                                            <tr>
                                                <th>Nombre</th>
                                                <th>Descripción</th>
                                                <th>Costo Mensual</th>
                                                <th>Servicios Incluidos</th>
                                                <th>Estado</th>
                                                <th className="text-center" style={{ width: '150px' }}>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {listaParaMostrar.map(plan => (
                                                <tr key={plan.id}>
                                                    <td><strong>{plan.nombre}</strong></td>
                                                    <td style={{maxWidth: '200px', whiteSpace: 'normal'}} className="small text-muted">{plan.descripcion}</td>
                                                    <td>
                                                        {plan.costoMensual 
                                                            ? `$${Number(plan.costoMensual).toLocaleString('es-CL')}` 
                                                            : 'A cotizar'}
                                                    </td>
                                                    <td style={{maxWidth: '300px', whiteSpace: 'normal'}}>
                                                        <small>{getServiceNames(plan.serviciosIncluidos)}</small>
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${plan.estado === 'Activo' ? 'bg-success' : 'bg-secondary'}`}>
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
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {showModal && (
                <FormularioPlanModal
                    showModal={showModal}
                    onClose={closeModal}
                    planInicial={currentPlan}
                    serviciosDisponibles={serviciosDisponibles}
                />
            )}
        </div>
    );
}

export default AdminPlanes;