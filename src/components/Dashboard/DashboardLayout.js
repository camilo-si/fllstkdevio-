import React from 'react';
import { Outlet } from 'react-router-dom'; // Import Outlet for nested routing
// Importaciones corregidas
import AppNavbar from '../Navbar'; 
import Sidemenu from './Sidemenu'; // Fix: Corrected filename casing from './sidemenu'
import Footer from '../Footer'; // Fix: Corrected path from './footer' to '../Footer' (main app footer)

// Componente de Layout para AdminLTE
function DashboardLayout() {
    return (
        // 1. El 'wrapper' de AdminLTE es el contenedor principal de todo
        <div className="wrapper"> 
            
            {/* 2. Componentes Fijos de Navegación y Estilo */}
            <AppNavbar /> {/* Using the actual component name from Navbar.js */}
            <Sidemenu />

            {/* 3. Área de Contenido Principal (Content Wrapper) */}
            <div className="content-wrapper">
                {/* Outlet renderiza los componentes de ruta anidados (AdminServicios, AdminPlanes, etc.) */}
                <Outlet /> 
            </div>

            {/* 4. Footer */}
            <Footer />
            
            {/* 5. Otros elementos fijos del template... */}
        </div>
    );
}

export default DashboardLayout;