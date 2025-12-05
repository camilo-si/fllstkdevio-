import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// 1. COMPONENTES PÚBLICOS
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

// 2. COMPONENTES DE ADMINISTRACIÓN
import DashboardLayout from './components/Dashboard/DashboardLayout'; 
// A. IMPORTAMOS EL NUEVO COMPONENTE AQUÍ 👇
import DashboardHome from './components/Dashboard/DashboardHome'; 
import AdminServicios from './components/Dashboard/AdminServicios'; 
import AdminPlanes from './components/Dashboard/AdminPlanes';       

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
         
         {/* RUTA PÚBLICA */}
         <Route path="/" element={<PublicApp />} />
         
         {/* RUTA PRIVADA (Dashboard) */}
         <Route path="/dashboard" element={<DashboardLayout />}>
           
            {/* B. CORREGIMOS ESTA LÍNEA 👇: Usamos el componente en vez del texto */}
            <Route index element={<DashboardHome />} />

            {/* Sub-rutas */}
            <Route path="servicios" element={<AdminServicios />} /> 
            <Route path="planes" element={<AdminPlanes />} />
           
         </Route>
         
         <Route path="*" element={<h1>404: Página no encontrada</h1>} />

       </Routes>
     </BrowserRouter>
   );
}

export default App;