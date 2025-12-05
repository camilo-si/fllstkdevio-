import React from 'react';
import { NavLink } from 'react-router-dom'; // IMPORTANTE: Usamos NavLink en lugar de <a>

function Sidemenu() {
    return (
        <aside className="main-sidebar sidebar-dark-primary elevation-4" style={{ minHeight: '100vh' }}>
            {/* Logo de la marca */}
            <NavLink to="/dashboard" className="brand-link text-decoration-none">
                <img 
                    src="/logo192.png" 
                    alt="HelioAndes Logo" 
                    className="brand-image img-circle elevation-3" 
                    style={{ opacity: '.8' }} 
                />
                <span className="brand-text font-weight-light">HelioAndes Admin</span>
            </NavLink>

            {/* Sidebar */}
            <div className="sidebar">
                {/* Panel de usuario */}
                <div className="user-panel mt-3 pb-3 mb-3 d-flex">
                    <div className="image">
                        <img 
                            src="https://ui-avatars.com/api/?name=Admin+User&background=random" 
                            className="img-circle elevation-2" 
                            alt="User Image" 
                        />
                    </div>
                    <div className="info">
                        <a href="#" className="d-block text-decoration-none">Administrador</a>
                    </div>
                </div>

                {/* Menú Lateral */}
                <nav className="mt-2">
                    <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                        
                        {/* 1. DASHBOARD (Inicio) */}
                        <li className="nav-item">
                            {/* 'end' asegura que este botón solo se active en /dashboard exacto, no en sub-rutas */}
                            <NavLink 
                                to="/dashboard" 
                                end 
                                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            >
                                <i className="nav-icon fas fa-tachometer-alt" />
                                <p>Dashboard</p>
                            </NavLink>
                        </li>
                        
                        <li className="nav-header">GESTIÓN</li>

                        {/* 2. GESTIÓN DE SERVICIOS */}
                        <li className="nav-item">
                            {/* La ruta debe coincidir con App.js: /dashboard/servicios */}
                            <NavLink 
                                to="/dashboard/servicios" 
                                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            >
                                <i className="nav-icon fas fa-concierge-bell" />
                                <p>Servicios</p>
                            </NavLink>
                        </li>

                        {/* 3. GESTIÓN DE PLANES */}
                        <li className="nav-item">
                            {/* La ruta debe coincidir con App.js: /dashboard/planes */}
                            <NavLink 
                                to="/dashboard/planes" 
                                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            >
                                <i className="nav-icon fas fa-clipboard-list" />
                                <p>Planes</p>
                            </NavLink>
                        </li>

                    </ul>
                </nav>
            </div>
        </aside>
    );
}

export default Sidemenu;