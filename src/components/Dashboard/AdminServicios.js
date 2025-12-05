import React from 'react';
import { db, auth, initializeFirebase, getPublicDataCollectionPath } from '../../utils/firebaseConfig';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';

// Componente principal para la Gestión de Servicios
function AdminServicios() {
    // Estado para almacenar los servicios
    const [servicios, setServicios] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    // Estado para el modal de Crear/Editar servicio
    const [showModal, setShowModal] = React.useState(false);
    const [currentService, setCurrentService] = React.useState({ 
        id: null, 
        nombre: '', 
        descripcion: '', 
        precioBase: 0,
        estado: 'Activo' // Nuevo campo para demostrar la edición
    });

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

    // Manejar cambios en el formulario del modal
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentService(prev => ({ ...prev, [name]: value }));
    };

    // 3. Crear o Actualizar un servicio
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validación simple
        if (!currentService.nombre.trim() || !currentService.descripcion.trim()) {
            alert("El nombre y la descripción son obligatorios.");
            return;
        }

        const dataToSave = {
            nombre: currentService.nombre,
            descripcion: currentService.descripcion,
            precioBase: Number(currentService.precioBase),
            estado: currentService.estado
        };

        setLoading(true);
        try {
            const path = getServiciosCollectionPath();
            if (currentService.id) {
                // Actualizar
                const serviceDocRef = doc(db, path, currentService.id);
                await updateDoc(serviceDocRef, dataToSave);
            } else {
                // Crear
                await addDoc(collection(db, path), {
                    ...dataToSave,
                    fechaCreacion: new Date().toISOString()
                });
            }
            setShowModal(false);
            setCurrentService({ id: null, nombre: '', descripcion: '', precioBase: 0, estado: 'Activo' });
        } catch (err) {
            console.error("Error al guardar el servicio:", err);
            setError("Error al guardar el servicio.");
        } finally {
            setLoading(false);
        }
    };

    // 4. Eliminar un servicio
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

    // Funciones para el modal
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
        setCurrentService({ id: null, nombre: '', descripcion: '', precioBase: 0, estado: 'Activo' });
    };


    if (loading) return <div className="p-4 text-center"><i className="fas fa-spinner fa-spin"></i> Cargando...</div>;
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

            {/* Contenido principal */}
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

            {/* Modal de Creación/Edición */}
            {showModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <form onSubmit={handleSubmit}>
                                <div className="modal-header">
                                    <h5 className="modal-title">{currentService.id ? 'Editar Servicio' : 'Crear Nuevo Servicio'}</h5>
                                    <button type="button" className="close" onClick={closeModal} aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label htmlFor="nombre">Nombre del Servicio</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="nombre" 
                                            name="nombre" 
                                            value={currentService.nombre} 
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
                                            value={currentService.descripcion} 
                                            onChange={handleChange} 
                                            required 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="precioBase">Precio Base ($)</label>
                                        <input 
                                            type="number" 
                                            className="form-control" 
                                            id="precioBase" 
                                            name="precioBase" 
                                            value={currentService.precioBase} 
                                            onChange={handleChange} 
                                            min="0"
                                            step="0.01"
                                            required 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="estado">Estado</label>
                                        <select
                                            className="form-control" 
                                            id="estado" 
                                            name="estado" 
                                            value={currentService.estado} 
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
                                        {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>} {currentService.id ? 'Guardar Cambios' : 'Crear Servicio'}
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

export default AdminServicios;