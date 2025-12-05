import React from 'react';

const DashboardHome = () => {
  return (
    <div>
      {/* Título de la sección */}
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Resumen General</h2>

      {/* Grid de Tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Tarjeta 1 */}
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
          <p className="text-gray-500 text-sm uppercase font-bold">Clientes</p>
          <p className="text-3xl font-bold text-gray-800">145</p>
        </div>
        
        {/* Tarjeta 2 */}
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
          <p className="text-gray-500 text-sm uppercase font-bold">Ingresos</p>
          <p className="text-3xl font-bold text-gray-800">$4.5M</p>
        </div>

        {/* Tarjeta 3 */}
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
          <p className="text-gray-500 text-sm uppercase font-bold">Servicios</p>
          <p className="text-3xl font-bold text-gray-800">12</p>
        </div>
      </div>

      {/* Espacio extra */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-bold text-lg mb-4">Actividad Reciente</h3>
        <p className="text-gray-600">No hay actividad reciente para mostrar.</p>
      </div>
    </div>
  );
};

export default DashboardHome;