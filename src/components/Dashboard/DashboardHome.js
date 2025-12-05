import React from 'react';
import { Link } from 'react-router-dom';

function DashboardHome() {
    return (
        <div className="content-wrapper">
            {/* --- Encabezado --- */}
            <div className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                            <h1 className="m-0">Dashboard General</h1>
                        </div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                <li className="breadcrumb-item active">dashboard</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Contenido Principal --- */}
            <section className="content">
                <div className="container-fluid">
                    
                    {/* Fila de Tarjetas Informativas (Small Boxes) */}
                    <div className="row">
                        
                        {/* Tarjeta: Planes */}
                        <div className="col-lg-3 col-6">
                            <div className="small-box bg-info p-3 rounded text-white shadow-sm position-relative overflow-hidden h-100">
                                <div className="inner">
                                    <h3>3</h3>
                                    <p>Planes Activos</p>
                                </div>
                                <div className="icon position-absolute" style={{ top: '10px', right: '10px', opacity: 0.4, fontSize: '60px' }}>
                                    <i className="fas fa-clipboard-list"></i>
                                </div>
                                {/* CORREGIDO: Ruta apunta a /dashboard/planes */}
                                <Link to="/dashboard/planes" className="small-box-footer text-white text-decoration-none d-block mt-3" style={{ zIndex: 1 }}>
                                    Gestionar Planes <i className="fas fa-arrow-circle-right"></i>
                                </Link>
                            </div>
                        </div>

                        {/* Tarjeta: Servicios */}
                        <div className="col-lg-3 col-6">
                            <div className="small-box bg-success p-3 rounded text-white shadow-sm position-relative overflow-hidden h-100">
                                <div className="inner">
                                    <h3>4</h3>
                                    <p>Servicios Disponibles</p>
                                </div>
                                <div className="icon position-absolute" style={{ top: '10px', right: '10px', opacity: 0.4, fontSize: '60px' }}>
                                    <i className="fas fa-concierge-bell"></i>
                                </div>
                                {/* CORREGIDO: Ruta apunta a /dashboard/servicios */}
                                <Link to="/dashboard/servicios" className="small-box-footer text-white text-decoration-none d-block mt-3">
                                    Gestionar Servicios <i className="fas fa-arrow-circle-right"></i>
                                </Link>
                            </div>
                        </div>

                        {/* Tarjeta: Cotizaciones */}
                        <div className="col-lg-3 col-6">
                            <div className="small-box bg-warning p-3 rounded text-dark shadow-sm position-relative overflow-hidden h-100">
                                <div className="inner">
                                    <h3>12</h3>
                                    <p>Nuevas Cotizaciones</p>
                                </div>
                                <div className="icon position-absolute" style={{ top: '10px', right: '10px', opacity: 0.4, fontSize: '60px' }}>
                                    <i className="fas fa-calculator"></i>
                                </div>
                                <span className="small-box-footer d-block mt-3 small">
                                    Últimos 7 días
                                </span>
                            </div>
                        </div>

                        {/* Tarjeta: Visitas */}
                        <div className="col-lg-3 col-6">
                            <div className="small-box bg-danger p-3 rounded text-white shadow-sm position-relative overflow-hidden h-100">
                                <div className="inner">
                                    <h3>150+</h3>
                                    <p>Visitas al Sitio</p>
                                </div>
                                <div className="icon position-absolute" style={{ top: '10px', right: '10px', opacity: 0.4, fontSize: '60px' }}>
                                    <i className="fas fa-chart-pie"></i>
                                </div>
                                <span className="small-box-footer d-block mt-3 small">
                                    Analytics en tiempo real
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Fila de Paneles de Detalle */}
                    <div className="row mt-4">
                        
                        {/* Panel Izquierdo: Actividad Reciente */}
                        <div className="col-lg-8">
                            <div className="card shadow-sm">
                                <div className="card-header border-0 bg-light">
                                    <h3 className="card-title fw-bold mb-0 text-muted fs-6">
                                        <i className="fas fa-history mr-2"></i> Actividad Reciente
                                    </h3>
                                </div>
                                <div className="card-body table-responsive p-0">
                                    <table className="table table-striped table-valign-middle mb-0">
                                        <thead className="bg-white">
                                            <tr>
                                                <th>Actividad</th>
                                                <th>Usuario</th>
                                                <th>Fecha</th>
                                                <th>Estado</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <i className="fas fa-plus-circle text-success me-2"></i> Nuevo Servicio
                                                </td>
                                                <td>Admin</td>
                                                <td className="text-muted">Hace 2 horas</td>
                                                <td><span className="badge bg-success">Completado</span></td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <i className="fas fa-edit text-warning me-2"></i> Edición Plan Básico
                                                </td>
                                                <td>Admin</td>
                                                <td className="text-muted">Ayer</td>
                                                <td><span className="badge bg-warning text-dark">Pendiente</span></td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <i className="fas fa-envelope text-primary me-2"></i> Consulta de Contacto
                                                </td>
                                                <td>Sistema</td>
                                                <td className="text-muted">Hace 2 días</td>
                                                <td><span className="badge bg-info">Nuevo</span></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Panel Derecho: Accesos Rápidos y Estado */}
                        <div className="col-lg-4">
                            {/* Tarjeta Acciones Rápidas */}
                            <div className="card shadow-sm mb-3">
                                <div className="card-header border-0 bg-light">
                                    <h3 className="card-title fw-bold mb-0 text-muted fs-6">
                                        <i className="fas fa-bolt mr-2"></i> Acciones Rápidas
                                    </h3>
                                </div>
                                <div className="card-body">
                                    <p className="small text-muted mb-3">Seleccione una acción frecuente para comenzar:</p>
                                    <div className="d-grid gap-2">
                                        {/* CORREGIDO: Rutas apuntan a /dashboard/... */}
                                        <Link to="/dashboard/servicios" className="btn btn-outline-primary text-start">
                                            <i className="fas fa-plus me-2"></i> Añadir Nuevo Servicio Solar
                                        </Link>
                                        <Link to="/dashboard/planes" className="btn btn-outline-success text-start">
                                            <i className="fas fa-tags me-2"></i> Crear Oferta o Plan
                                        </Link>
                                        <button className="btn btn-outline-secondary text-start" disabled>
                                            <i className="fas fa-cog me-2"></i> Configuración General
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Widget de Estado del Sistema */}
                            <div className="card bg-primary text-white shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title mb-3"><i className="fas fa-server me-2"></i> Estado del Sistema</h5>
                                    <div className="d-flex justify-content-between border-bottom border-white pb-2 mb-2" style={{ borderColor: 'rgba(255,255,255,0.2) !important' }}>
                                        <span>Base de datos Firebase:</span>
                                        <span className="text-success fw-bold" style={{ textShadow: '0 0 5px rgba(0,0,0,0.5)' }}>Conectada</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span>Versión App:</span>
                                        <span className="fw-bold">v1.0.2</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
}

export default DashboardHome;