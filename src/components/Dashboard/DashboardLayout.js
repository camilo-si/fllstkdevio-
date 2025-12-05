import React from 'react';
import { Outlet } from 'react-router-dom';
// IMPORTANTE: Cambiamos '../Navbar' por el nuevo './DashboardNavbar'
import DashboardNavbar from './DashboardNavbar'; 
import Sidemenu from './Sidemenu';
import Footer from '../Footer';

function DashboardLayout() {
    return (
        <div className="wrapper">
            {/* 1. Navbar Superior del Dashboard (con botón de menú funcional) */}
            <DashboardNavbar />

            {/* 2. Menú Lateral */}
            <Sidemenu />

            {/* 3. Contenido Principal */}
            <div className="content-wrapper">
                <div className="content-header">
                    <div className="container-fluid">
                       {/* Espacio para títulos o breadcrumbs si se necesita */}
                    </div>
                </div>
                
                {/* Aquí se renderizan AdminServicios, AdminPlanes, etc. */}
                <section className="content">
                    <div className="container-fluid">
                        <Outlet />
                    </div>
                </section>
            </div>

            {/* 4. Footer */}
            <Footer />
        </div>
    );
}

export default DashboardLayout;