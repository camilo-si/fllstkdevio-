import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // 1. IMPORTANTE: Importamos Link
import { db, auth, getPublicDataCollectionPath } from '../utils/firebaseConfig';
import FormularioServicioModal from './FormularioServicioModal'; 
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';

/* global __app_id, __firebase_config, __initial_auth_token */

// --- DATOS DE EJEMPLO (Se muestran si no hay datos en Firebase) ---
const DATOS_EJEMPLO = [
    { id: 'mock-1', nombre: 'Instalación Residencial 3kW', descripcion: 'Sistema ON-Grid llave en mano para hogares.', precioBase: 2990000, estado: 'Activo' },
    { id: 'mock-2', nombre: 'Limpieza de Paneles', descripcion: 'Limpieza técnica con agua desmineralizada (hasta 10 paneles).', precioBase: 45000, estado: 'Activo' },
    { id: 'mock-3', nombre: 'Tramitación TE4', descripcion: 'Gestión y declaración SEC para Netbilling.', precioBase: 180000, estado: 'Activo' },
    { id: 'mock-4', nombre: 'Diagnóstico en Terreno', descripcion: 'Visita técnica para evaluación de factibilidad (RM).', precioBase: 35000, estado: 'Inactivo' },
];

function AdminServicios() {
    // Estado para almacenar los servicios
    const [servicios, setServicios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estado para el modal de Crear/Editar servicio
    const [showModal, setShowModal] = useState(false);
    const [currentService, setCurrentService] = useState(null); 

    // 1. Inicialización de Firebase y Auth (Opcional si ya está global)
    useEffect(() => {
        // Lógica de inicialización si es necesaria
    }, []);

    // Ruta de la colección
    const getServiciosCollectionPath = () => {
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        return getPublicDataCollectionPath(appId, 'servicios');
    };

    // 2. Carga y escucha en tiempo real
    useEffect(() => {
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
            // No mostramos error en UI para que se vean los datos de ejemplo si falla la carga
            setLoading(false);
        });

        return () => unsubscribe();
    }, [db]);

    // 3. Eliminar un servicio
    const handleDelete = async (id) => {
        // Evitar borrar datos de ejemplo
        if (id.toString().startsWith('mock-')) {
            alert("No puedes eliminar un dato de ejemplo. Crea un servicio real primero.");
            return;
        }

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

    // Funciones del Modal
    const openCreateModal = () => {
        setCurrentService({ id: null, nombre: '', descripcion: '', precioBase: 0, estado: 'Activo' });
        setShowModal(true);
    };

    const openEditModal = (servicio) => {
        if (servicio.id.toString().startsWith('mock-')) {
            alert("Estás viendo un dato de ejemplo. Para editar, primero crea un registro real.");
            return;
        }
        setCurrentService(servicio);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setCurrentService(null);
    };

    // --- LÓGICA DE VISUALIZACIÓN ---
    // Si hay datos reales, úsalos. Si no, usa los de ejemplo.
    const listaParaMostrar = (servicios.length > 0) ? servicios : DATOS_EJEMPLO;
    const esModoEjemplo = (servicios.length === 0);

    if (loading && servicios.length === 0) return <div className="p-4 text-center"><i className="fas fa-spinner fa-spin"></i> Cargando servicios...</div>;

    return (
        <div className="content-wrapper">
            <section className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                            <h1>Gestión de Servicios</h1>
                        </div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
                                <li className="breadcrumb-item active">Servicios</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </section>

            <section className="content">
                <div className="container-fluid">
                    {/* Alerta si estamos viendo datos de ejemplo */}
                    {esModoEjemplo && (
                        <div className="alert alert-info alert-dismissible">
                            <button type="button" className="close" data-dismiss="alert" aria-hidden="true">×</button>
                            <h5><i className="icon fas fa-info"></i> ¡Modo Demostración!</h5>
                            Actualmente no hay datos en la base de datos. Estás viendo <b>datos de ejemplo</b>.
                        </div>
                    )}

                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Listado de Servicios</h3>
                                    <div className="card-tools">
                                        <button className="btn btn-primary" onClick={openCreateModal}>
                                            <i className="fas fa-plus"></i> Crear Nuevo Servicio
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="card-body table-responsive p-0">
                                    <table className="table table-hover text-nowrap">
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
                                            {listaParaMostrar.map(servicio => (
                                                <tr key={servicio.id}>
                                                    <td><strong>{servicio.nombre}</strong></td>
                                                    <td style={{ maxWidth: '300px', whiteSpace: 'normal' }}>
                                                        {servicio.descripcion}
                                                    </td>
                                                    <td>
                                                        {servicio.precioBase 
                                                            ? `$${Number(servicio.precioBase).toLocaleString('es-CL')}` 
                                                            : 'A cotizar'}
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${servicio.estado === 'Activo' ? 'bg-success' : 'bg-secondary'}`}>
                                                            {servicio.estado}
                                                        </span>
                                                    </td>
                                                    <td className="text-center">
                                                        
                                                        {/* 2. BOTÓN VER DETALLE (Nuevo) */}
                                                        <Link 
                                                            to={`/dashboard/servicios/${servicio.id}`} 
                                                            className="btn btn-sm btn-info mr-1" 
                                                            title="Ver Detalle API"
                                                        >
                                                            <i className="fas fa-eye"></i>
                                                        </Link>

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