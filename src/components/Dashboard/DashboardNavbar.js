import React from 'react';
import { Link } from 'react-router-dom';

function DashboardNavbar() {
  return (
    // Clase esencial de AdminLTE para el header
    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
      {/* Lado Izquierdo: Botones de navegación */}
      <ul className="navbar-nav">
        <li className="nav-item">
          {/* ESTE ES EL BOTÓN QUE CONTROLA EL SIDEBAR */}
          <a className="nav-link" data-widget="pushmenu" href="#" role="button">
            <i className="fas fa-bars"></i>
          </a>
        </li>
        <li className="nav-item d-none d-sm-inline-block">
          <Link to="/" className="nav-link">Ver Sitio Público</Link>
        </li>
      </ul>

      {/* Lado Derecho: Opciones extra (Notificaciones, etc.) */}
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <a className="nav-link" data-widget="fullscreen" href="#" role="button">
            <i className="fas fa-expand-arrows-alt"></i>
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default DashboardNavbar;