import React, { useEffect, useState } from 'react';
import { db, auth } from '../utils/firebaseConfig'; // Asumimos que db y auth ya vienen inicializados
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import FormularioServicioModal from './FormularioServicioModal'; 

function AdminServicios() {
    // Estado
    const [servicios, setServicios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentService, setCurrentService] = useState(null); 

    // --- CORRECCIÓN CLAVE ---
    // En lugar de usar funciones complejas para la ruta, definimos la colección directamente.
    // Si tu colección en Firebase se llama "servicios", ponlo tal cual:
    const COLLECTION_NAME = "servicios"; 

    // 1. Carga de datos en tiempo real
    useEffect(() => {
        setLoading(true);
        
        // Verificación de seguridad
        if (!db) {
            console.error("Firebase DB no está inicializado.");
            setError("Error de conexión con la base de datos.");
            setLoading(false);
            return;
        }

        try {
            const serviciosColRef = collection(db, COLLECTION_NAME);

            // Escuchamos cambios en tiempo real
            const unsubscribe = onSnapshot(serviciosColRef, (snapshot) => {
                const fetchedServicios = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                
                console.log("Servicios cargados:", fetchedServicios); // Para depuración
                setServicios(fetchedServicios);
                setLoading(false);
            }, (err) => {
                console.error("Error en onSnapshot:", err);
                setError("No tienes permisos o la conexión falló.");
                setLoading(false);
            });

            return () => unsubscribe();
        } catch (err) {
            console.error("Error general al intentar conectar:", err);
            setError("Error crítico al cargar servicios.");
            setLoading(false);
        }
    }, []);

    // 2. Eliminar servicio
    const handleDelete = async (id) => {
        if (!window.confirm("¿Está seguro de que desea eliminar este servicio?")) return;

        try {
            await deleteDoc(doc(db, COLLECTION_NAME, id));
        } catch (err) {
            console.error("Error al eliminar:", err);
            alert("Error al eliminar el servicio");
        }
    };

    // Funciones del Modal
    const openCreateModal = () => {
        setCurrentService({ id: null, nombre: '', descripcion: '', precioBase: 0, estado: 'Activo' });
        setShowModal(true);
    };

    const openEditModal = (servicio) => {
        setCurrentService(servicio);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setCurrentService(null);
    };

    // Renderizado Condicional
    if (loading) {
        return (
            <div className="content-wrapper p-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Cargando...</span>
                </div>
                <p className="mt-2">Cargando servicios...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="content-wrapper p-5 text-center">
                <div className="alert alert-danger">
                    <i className="fas fa-exclamation-triangle"></i> {error}
                </div>
            </div>
        );
    }

    return (
        <div className="content-wrapper">
            <section className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6"><h1>Gestión de Servicios</h1></div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item"><a href="/dashboard">Dashboard</a></li>
                                <li className="breadcrumb-item active">Servicios</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </section>

            <section className="content">
                <div className="container-fluid">
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Listado de Servicios</h3>
                            <div className="card-tools">
                                <button className="btn btn-primary btn-sm" onClick={openCreateModal}>
                                    <i className="fas fa-plus"></i> Nuevo Servicio
                                </button>
                            </div>
                        </div>
                        
                        <div className="card-body p-0">
                            <table className="table table-striped projects">
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Descripción</th>
                                        <th>Precio</th>
                                        <th>Estado</th>
                                        <th className="text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {servicios.length > 0 ? (
                                        servicios.map(servicio => (
                                            <tr key={servicio.id}>
                                                <td>{servicio.nombre}</td>
                                                <td>{servicio.descripcion}</td>
                                                <td>${servicio.precioBase}</td>
                                                <td>
                                                    <span className={`badge ${servicio.estado === 'Activo' ? 'badge-success' : 'badge-danger'}`}>
                                                        {servicio.estado}
                                                    </span>
                                                </td>
                                                <td className="project-actions text-center">
                                                    <button className="btn btn-info btn-sm mr-1" onClick={() => openEditModal(servicio)}>
                                                        <i className="fas fa-pencil-alt"></i>
                                                    </button>
                                                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(servicio.id)}>
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center py-4">
                                                No hay servicios registrados. ¡Crea uno nuevo!
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
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