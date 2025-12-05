import React, { useState, useEffect } from 'react';
import { db, auth, initializeFirebase, getPublicDataCollectionPath } from '../utils/firebaseConfig';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore'; 
import FormularioPlanModal from './FormularioPlanModal';

/* global __app_id, __firebase_config, __initial_auth_token */ // Fix: Suppress no-undef warnings

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

    // 1. Inicialización de Firebase y Auth (Solo se ejecuta una vez)
    useEffect(() => {
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
        const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
        
        // Se pasa setError a initializeFirebase para manejar errores de conexión/autenticación
        initializeFirebase(firebaseConfig, initialAuthToken, auth, db, setError);
    }, []);

    // 2. Carga y escucha de Servicios (Necesarios para el formulario de Planes)
    useEffect(() => {
        // Esta lógica es para cargar los servicios disponibles y no necesita la lógica del modal aquí
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


    // 4. Eliminar un plan
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
        // Objeto vacío para crear
        setCurrentPlan({ id: null, nombre: '', descripcion: '', costoMensual: 0, serviciosIncluidos: [], estado: 'Activo' });
        setShowModal(true);
    };

    const openEditModal = (plan) => {
        // Pasa el plan completo para edición
        setCurrentPlan(plan);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setCurrentPlan(null); // Limpiar el plan actual al cerrar
    };

    // Utilidad para obtener nombres de servicios por ID
    const getServiceNames = (serviceIds) => {
        if (!serviciosDisponibles || serviciosDisponibles.length === 0) return 'Cargando...';
        
        return (serviceIds || []).map(id => {
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

            {/* Invocación del Modal de Creación/Edición */}
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