import React from 'react';
// Asegúrate de que estas rutas sean correctas en tu proyecto
import Navbar from '../Navbar'; 
import Sidemenu from './sidemenu'; 
import Footer from './footer'; 

// Este componente usa { children } para inyectar la vista específica.
function DashboardLayout({ children }) {
    return (
        // 1. El 'wrapper' de AdminLTE es el contenedor principal de todo
        <div className="wrapper"> 
            
            {/* 2. Componentes Fijos de Navegación y Estilo */}
            <Navbar />
            <Sidemenu />

            {/* 3. Área de Contenido Principal (Content Wrapper) */}
            {/* Aquí es donde React inyectará el contenido específico 
               de cada ruta: AdminServicios.js o AdminPlanes.js 
               Estos componentes ya deben usar las clases 'content-wrapper' y 'content' 
            */}
            {children} 

            {/* 4. Footer */}
            <Footer />
            
            {/* 5. Otros elementos fijos del template, como la sidebar de control derecho si aplica */}
            {/* <aside className="control-sidebar control-sidebar-dark"></aside> */}
        </div>
    );
}

export default DashboardLayout;