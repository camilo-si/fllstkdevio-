import React, { useState, useEffect } from 'react';
import FormularioPlan from '../FormularioPlan'; // Importamos el nuevo formulario

function AdminPlanes() {
    // 1. Estados para la gestión de datos y UI
    const [planes, setPlanes] = useState([]); 
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // 2. Estados para la gestión de vistas (CRUD)
    const [modoVista, setModoVista] = useState('listado'); // 'listado', 'detalle', 'crear', 'editar'
    const [planSeleccionado, setPlanSeleccionado] = useState(null); // Usado para detalle y edición

    // =========================================================
    // CONEXIÓN A LA API (Carga de datos)
    // =========================================================
    useEffect(() => {
        const fetchPlanes = async () => {
            setIsLoading(true); 
            setError(null);    

            try {
                // Simulación de datos (debe ser reemplazado por tu API real)
                const mockData = [
                    { id: 'PLAN10K', nombre: 'Plan Hogar Básico 10 KW', tipoCliente: 'Residencial', capacidadKW: 10, tarifaMensualCLP: 120000, estado: 'Disponible', descripcionDetalle: 'Ideal para hogares con consumo moderado.', incluyeMonitoreo: true },
                    { id: 'PLAN20K', nombre: 'Plan PyME Plus 20 KW', tipoCliente: 'Comercial', capacidadKW: 20, tarifaMensualCLP: 350000, estado: 'Disponible', descripcionDetalle: 'Diseñado para pequeñas y medianas empresas.', incluyeMonitoreo: true },
                    { id: 'PLAN05K', nombre: 'Plan Básico 5 KW', tipoCliente: 'Residencial', capacidadKW: 5, tarifaMensualCLP: 65000, estado: 'Agotado', descripcionDetalle: 'Opción económica para consumos mínimos.', incluyeMonitoreo: false }
                ];

                // Simular el fetch
                await new Promise(resolve => setTimeout(resolve, 500)); 
                setPlanes(mockData);

            } catch (err) {
                console.error("Error al obtener planes:", err);
                setError('No se pudieron cargar los planes. Verifique la conexión con el servidor.');

            } finally {
                setIsLoading(false); 
            }
        };

        fetchPlanes();
    }, [modoVista]); // Recarga si volvemos al listado

    // =========================================================
    // LÓGICA CRUD (Funciones Placeholder)
    // =========================================================

    const handleSave = (data) => {
        console.log(`Guardando Plan (${data.id ? 'Edición' : 'Creación'}):`, data);
        // Aquí iría la llamada fetch con POST (crear) o PUT (editar)
        // Por ahora, solo volvemos al listado
        setModoVista('listado');
        setPlanSeleccionado(null);
    };

    const handleDelete = (planId) => {
        // Usamos una notificación de alerta simple para la confirmación.
        // En un proyecto real, se usaría un modal de AdminLTE.
        if (window.confirm(`¿Está seguro de eliminar el plan ${planId}?`)) {
            console.log(`Eliminando plan: ${planId}`);
            // Aquí iría la llamada fetch con método DELETE
            setModoVista('listado');
            setPlanSeleccionado(null);
        }
    };

    // =========================================================
    // LÓGICA DE NAVEGACIÓN
    // =========================================================

    const handleVerDetalle = (plan) => {
        setPlanSeleccionado(plan);
        setModoVista('detalle');
    };
    
    const handleEditar = (plan) => {
        setPlanSeleccionado(plan);
        setModoVista('editar');
    };

    const handleVolver = () => {
        setModoVista('listado');
        setPlanSeleccionado(null);
    };


    // 1. RENDERIZAR VISTA CREAR/EDITAR (Formulario)
    if (modoVista === 'crear' || modoVista === 'editar') {
        return (
            <div className="content-wrapper p-3">
                <FormularioPlan 
                    planInicial={modoVista === 'editar' ? planSeleccionado : {}}
                    onSave={handleSave}
                    onCancel={handleVolver}
                />
            </div>
        );
    }
    
    // 2. RENDERIZAR VISTA DE DETALLE
    if (modoVista === 'detalle') {
        return (
            <div className="content-wrapper p-3">
                <section className="content">
                    <div className="card card-info"> 
                        <div className="card-header">
                            <h3 className="card-title">Detalle del Plan: {planSeleccionado.nombre}</h3>
                            <div className="card-tools">
                                <button onClick={handleVolver} className="btn btn-sm btn-light">
                                    ← Volver a la Lista
                                </button>
                            </div>
                        </div>
                        <div className="card-body">
                            <p><strong>ID del Plan:</strong> {planSeleccionado.id}</p>
                            <p><strong>Capacidad Instalada:</strong> {planSeleccionado.capacidadKW} KW</p>
                            <p><strong>Tarifa Mensual:</strong> ${planSeleccionado.tarifaMensualCLP ? planSeleccionado.tarifaMensualCLP.toLocaleString('es-CL') : 'N/A'}</p>
                            <p><strong>Tipo de Cliente:</strong> {planSeleccionado.tipoCliente}</p>
                            <p><strong>Monitoreo Remoto:</strong> {planSeleccionado.incluyeMonitoreo ? 'Sí, incluido' : 'No incluido'}</p>
                            <hr/>
                            <h5>Descripción Detallada:</h5>
                            <p>{planSeleccionado.descripcionDetalle}</p>
                            
                            <div className="mt-4">
                                <button onClick={() => handleEditar(planSeleccionado)} className="btn btn-info mr-2">
                                    <i className="fas fa-edit mr-1"></i> Editar Plan
                                </button>
                                <button onClick={() => handleDelete(planSeleccionado.id)} className="btn btn-danger">
                                    <i className="fas fa-trash mr-1"></i> Eliminar Plan
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }

    // 3. RENDERIZAR VISTA DE LISTADO (Por defecto)
    return (
        <div className="content-wrapper p-3">
            <section className="content">
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Listado de Planes Registrados</h3>
                        <div className="card-tools">
                            <button onClick={() => setModoVista('crear')} className="btn btn-success btn-sm">
                                <i className="fas fa-plus"></i> Crear Nuevo Plan
                            </button>
                        </div>
                    </div>

                    <div className="card-body p-0">
                        
                        {isLoading && (
                            <p className="text-center p-4"><i className="fas fa-spinner fa-spin mr-2"></i> Cargando planes...</p>
                        )}
                        {error && (
                            <div className="alert alert-danger p-3 m-3"><i className="fas fa-exclamation-triangle mr-2"></i> {error}</div>
                        )}

                        {!isLoading && !error && (
                            planes.length > 0 ? (
                                <table className="table table-striped table-valign-middle">
                                    <thead>
                                        <tr>
                                            <th style={{ width: '15%' }}>ID</th>
                                            <th>Nombre del Plan</th>
                                            <th>Capacidad (KW)</th>
                                            <th style={{ width: '20%' }}>Tarifa Mensual</th>
                                            <th style={{ width: '10%' }}>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {planes.map(plan => (
                                            <tr key={plan.id}>
                                                <td>{plan.id}</td>
                                                <td>{plan.nombre}</td>
                                                <td>{plan.capacidadKW}</td>
                                                <td>${plan.tarifaMensualCLP ? plan.tarifaMensualCLP.toLocaleString('es-CL') : 'N/A'}</td>
                                                <td>
                                                    <button 
                                                        onClick={() => handleVerDetalle(plan)} 
                                                        className="btn btn-sm btn-primary mr-1"
                                                    >
                                                        <i className="fas fa-eye"></i>
                                                    </button>
                                                    <button 
                                                        onClick={() => handleEditar(plan)} 
                                                        className="btn btn-sm btn-info"
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-center p-4">No hay planes registrados en la base de datos.</p>
                            )
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default AdminPlanes;