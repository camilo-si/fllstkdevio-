import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// =========================================================
// 1. COMPONENTES PÚBLICOS (Landing Page)
// =========================================================
// Todos los imports deben ir aquí, al inicio del archivo.
import AppNavbar from './components/Navbar'; 
import Hero from './components/Hero';
import Servicios from './components/Servicios';
import Soluciones from './components/Soluciones';
import CalculadoraIntegral from './components/CalculadoraIntegral';
import Planes from './components/Planes';
import Testimonios from './components/Testimonios';
import FAQ from './components/FAQ';
import Contacto from './components/Contacto';
import Footer from './components/Footer';

// =========================================================
// 2. COMPONENTES DE ADMINISTRACIÓN (Dashboard AdminLTE)
// =========================================================
import DashboardLayout from './components/Dashboard/DashboardLayout'; 
import AdminServicios from './components/Dashboard/AdminServicios'; 
import AdminPlanes from './components/Dashboard/AdminPlanes';       


// Componente que agrupa la página pública completa (DEFINICIÓN DE COMPONENTE)
const PublicApp = () => (
  <div className="App">
    <AppNavbar />
    <Hero />
    <Servicios />
    <Soluciones />
    <CalculadoraIntegral />
    <Planes />
    <Testimonios />
    <FAQ />
    <Contacto />
    <Footer />
  </div>
);

function App() {
   return (
     <BrowserRouter>
       <Routes>
         
         {/* RUTA PRINCIPAL: La Landing Page */}
         <Route path="/" element={<PublicApp />} />
         
         {/* RUTA DE ADMINISTRACIÓN: Usa el Layout AdminLTE */}
         <Route path="/admin" element={<DashboardLayout />}>
           
           {/* Vistas inyectadas dentro del DashboardLayout */}
           <Route path="servicios" element={<AdminServicios />} /> 
           <Route path="planes" element={<AdminPlanes />} />

           {/* Ruta de índice para /admin */}
           <Route index element={<h1>Bienvenido al Dashboard AdminLTE</h1>} />
           
         </Route>
         
         <Route path="*" element={<h1>404: Página no encontrada</h1>} />

       </Routes>
     </BrowserRouter>
   );
}

export default App;