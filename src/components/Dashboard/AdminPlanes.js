import React, { useEffect, useState } from 'react';
// IMPORTACIÓN DIRECTA DE LA BASE DE DATOS (Ya no importamos initializeFirebase)
import { db } from '../utils/firebaseConfig'; 
import { collection, onSnapshot, deleteDoc, doc, addDoc, updateDoc } from 'firebase/firestore';
import FormularioPlanModal from './FormularioPlanModal'; 

function AdminPlanes() {
    // Estado
    const [planes, setPlanes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentPlan, setCurrentPlan] = useState(null); 

    // Nombre de la colección en Firebase
    const COLLECTION_NAME = "planes"; 

    // 1. Carga de datos en tiempo real
    useEffect(() => {
        setLoading(true);
        
        if (!db) {
            setError("Error: No se pudo conectar a la base de datos.");
            setLoading(false);
            return;
        }

        try {
            const planesColRef = collection(db, COLLECTION_NAME);

            const unsubscribe = onSnapshot(planesColRef, (snapshot) => {
                const fetchedPlanes = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setPlanes(fetchedPlanes);
                setLoading(false);
            }, (err) => {
                console.error("Error al cargar planes:", err);
                setError("Error de permisos o conexión.");
                setLoading(false);
            });

            return () => unsubscribe();
        } catch (err) {
            console.error("Error general:", err);
            setError("Error crítico al cargar planes.");
            setLoading(false);
        }
    }, []);

    // 2. Eliminar plan
    const handleDelete = async (id) => {
        if (!window.confirm("¿Estás seguro de eliminar este plan?")) return;

        try {
            await deleteDoc(doc(db, COLLECTION_NAME, id));
        } catch (err) {
            console.error("Error al eliminar:", err);
            alert("Hubo un error al eliminar el plan.");
        }
    };

    // Funciones del Modal
    const openCreateModal = () => {
        setCurrentPlan(null); // null significa "Crear nuevo"
        setShowModal(true);
    };

    const openEditModal = (plan) => {
        setCurrentPlan(plan); // Pasar objeto significa "Editar"
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setCurrentPlan(null);
    };

    if (loading) return <div className="p-5 text-center">Cargando planes...</div>;
    if (error) return <div className="p-5 text-center text-danger">{error}</div>;

    return (
        <div className="content-wrapper">
            <section className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6"><h1>Gestión de Planes</h1></div>
                    </div>
                </div>
            </section>

            <section className="content">
                <div className="container-fluid">
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Listado de Planes</h3>
                            <div className="card-tools">
                                <button className="btn btn-primary btn-sm" onClick={openCreateModal}>
                                    <i className="fas fa-plus"></i> Nuevo Plan
                                </button>
                            </div>
                        </div>
                        
                        <div className="card-body p-0">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Precio</th>
                                        <th>Características</th>
                                        <th className="text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {planes.length > 0 ? (
                                        planes.map(plan => (
                                            <tr key={plan.id}>
                                                <td>{plan.nombre}</td>
                                                <td>${plan.precio}</td>
                                                <td>
                                                    <small>
                                                        {(plan.caracteristicas || []).length} características
                                                    </small>
                                                </td>
                                                <td className="text-center">
                                                    <button className="btn btn-info btn-sm mr-1" onClick={() => openEditModal(plan)}>
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(plan.id)}>
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="text-center py-4">No hay planes registrados.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            {showModal && (
                <FormularioPlanModal
                    showModal={showModal}
                    onClose={closeModal}
                    planInicial={currentPlan}
                />
            )}
        </div>
    );
}

export default AdminPlanes;