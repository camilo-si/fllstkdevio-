import React from 'react';
import { db, auth, initializeFirebase, getPublicDataCollectionPath } from '../utils/firebaseConfig';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import FormularioServicioModal from './FormularioServicioModal'; 

/* global __app_id, __firebase_config, __initial_auth_token */ // Fix: Suppress no-undef warnings

// Componente principal para la Gestión de Servicios
function AdminServicios() {
    // Estado para almacenar los servicios
    const [servicios, setServicios] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    // Estado para el modal de Crear/Editar servicio
    const [showModal, setShowModal] = React.useState(false);
    // Usamos null para crear, y el objeto de servicio para editar
    const [currentService, setCurrentService] = React.useState(null); 

    // 1. Inicialización de Firebase y Auth
    React.useEffect(() => {
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
        const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
        
        initializeFirebase(firebaseConfig, initialAuthToken, auth, db, setError);
    }, []);

    // Función para obtener la ruta de la colección pública (Servicios es público)
    const getServiciosCollectionPath = () => {
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        return getPublicDataCollectionPath(appId, 'servicios');
    };

    // 2. Carga y escucha en tiempo real de los servicios
    React.useEffect(() => {
        // Asegúrate de que el DB esté inicializado antes de intentar la conexión
        if (!db) return;
        
        const path = getServiciosCollectionPath();
        const serviciosColRef = collection(db, path);

        const unsubscribe = onSnapshot(serviciosColRef, (snapshot) => {
            const fetchedServicios = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setServicios(fetchedServicios);
            setLoading(false);
        }, (err) => {
            console.error("Error al escuchar servicios:", err);
            setError("No se pudieron cargar los servicios.");
            setLoading(false);
        });

        // Limpiar el listener al desmontar el componente
        return () => unsubscribe();
    }, [db]); // Dependencia en 'db' para re-ejecutar si la inicialización se completa

    // 3. Eliminar un servicio
    const handleDelete = async (id) => {
        // Usamos una alerta simple, pero se recomienda un modal personalizado.
        if (!window.confirm("¿Está seguro de que desea eliminar este servicio?")) {
            return;
        }

        setLoading(true);
        try {
            const path = getServiciosCollectionPath();
            await deleteDoc(doc(db, path, id));
        } catch (err) {
            console.error("Error al eliminar el servicio:", err);
            setError("Error al eliminar el servicio.");
        } finally {
            setLoading(false);
        }
    };

    // Funciones de control del Modal
    const openCreateModal = () => {
        // Objeto vacío para crear
        setCurrentService({ id: null, nombre: '', descripcion: '', precioBase: 0, estado: 'Activo' });
        setShowModal(true);
    };

    const openEditModal = (servicio) => {
        // Pasa el servicio completo para edición
        setCurrentService(servicio);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setCurrentService(null); // Limpiar el servicio actual al cerrar
    };


    if (loading && servicios.length === 0) return <div className="p-4 text-center"><i className="fas fa-spinner fa-spin"></i> Cargando servicios...</div>;
    if (error) return <div className="p-4 text-center text-danger">Error: {error}</div>;

    return (
        <div className="content-wrapper">
            {/* Encabezado de la página */}
            <section className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                            <h1>Gestión de Servicios</h1>
                        </div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item"><a href="/dashboard">Dashboard</a></li>
                                <li className="breadcrumb-item active">Servicios</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contenido principal (Listado) */}
            <section className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Listado de Servicios de HelioAndes</h3>
                                    <div className="card-tools">
                                        <button className="btn btn-primary" onClick={openCreateModal}>
                                            <i className="fas fa-plus"></i> Crear Nuevo Servicio
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="card-body">
                                    <table className="table table-bordered table-striped">
                                        <thead>
                                            <tr>
                                                <th>Nombre</th>
                                                <th>Descripción</th>
                                                <th>Precio Base</th>
                                                <th>Estado</th>
                                                <th className="text-center" style={{ width: '150px' }}>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {servicios.length > 0 ? (
                                                servicios.map(servicio => (
                                                    <tr key={servicio.id}>
                                                        <td>{servicio.nombre}</td>
                                                        <td>{servicio.descripcion}</td>
                                                        <td>${servicio.precioBase ? servicio.precioBase.toFixed(2) : '0.00'}</td>
                                                        <td>
                                                            <span className={`badge ${servicio.estado === 'Activo' ? 'bg-success' : 'bg-danger'}`}>
                                                                {servicio.estado}
                                                            </span>
                                                        </td>
                                                        <td className="text-center">
                                                            <button 
                                                                className="btn btn-sm btn-info mr-1" 
                                                                title="Ver Detalle"
                                                                onClick={() => alert(`Detalle de ${servicio.nombre}:\n\n${JSON.stringify(servicio, null, 2)}`)}
                                                            >
                                                                <i className="fas fa-eye"></i>
                                                            </button>
                                                            <button 
                                                                className="btn btn-sm btn-warning mr-1" 
                                                                title="Editar"
                                                                onClick={() => openEditModal(servicio)}
                                                            >
                                                                <i className="fas fa-edit"></i>
                                                            </button>
                                                            <button 
                                                                className="btn btn-sm btn-danger" 
                                                                title="Eliminar"
                                                                onClick={() => handleDelete(servicio.id)}
                                                            >
                                                                <i className="fas fa-trash"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="text-center">No hay servicios registrados.</td>
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
                <FormularioServicioModal
                    showModal={showModal}
                    onClose={closeModal}
                    servicioInicial={currentService}
                />
            )}
        </div>
    );
}

export default AdminServicios;