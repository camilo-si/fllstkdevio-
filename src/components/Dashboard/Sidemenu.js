import React from 'react';

// Componente principal de la barra lateral de AdminLTE
function Sidemenu() {
	return (
		<aside className="main-sidebar sidebar-dark-primary elevation-4">
			{/* Logo de la marca */}
			<a href="/index3.html" className="brand-link">
				<img 
					src="dist/img/AdminLTELogo.png" 
					alt="AdminLTE Logo" 
					className="brand-image img-circle elevation-3" 
					style={{ opacity: '.8' }} 
				/>
				<span className="brand-text font-weight-light">HelioAndes Dashboard</span>
			</a>

			{/* Sidebar */}
			<div className="sidebar">
				{/* Panel de usuario opcional (se mantiene) */}
				<div className="user-panel mt-3 pb-3 mb-3 d-flex">
					{/* ... Código de la imagen y nombre de usuario ... */}
					<div className="image">
						<img src="dist/img/user2-160x160.jpg" className="img-circle elevation-2" alt="User Image" />
					</div>
					<div className="info">
						<a href="#" className="d-block">Alexander Pierce</a>
					</div>
				</div>

				{/* Divisor opcional (se mantiene) */}
				{/* <div className="form-inline">
					... Código del buscador ...
				</div> */}

				{/* Sidebar Menu */}
				<nav className="mt-2">
					<ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
						
						{/* Ítem de Dashboard (Ejemplo) */}
						<li className="nav-item">
							<a href="/dashboard" className="nav-link active">
								<i className="nav-icon fas fa-tachometer-alt" />
								<p>
									Dashboard
								</p>
							</a>
						</li>
						
						{/* ================================================= */}
						{/* NUEVOS ÍTEMS PARA GESTIÓN DE HELIOANDES */}
						{/* ================================================= */}

						{/* 1. GESTIÓN DE SERVICIOS */}
						<li className="nav-item">
							{/* Usaremos '#' temporalmente, en un entorno real sería una ruta de React Router, ej: to="/admin/servicios" */}
							<a href="#/admin/servicios" className="nav-link"> 
								<i className="nav-icon fas fa-cogs" />
								<p>
									Gestión de Servicios
								</p>
							</a>
						</li>

						{/* 2. GESTIÓN DE PLANES */}
						<li className="nav-item">
							{/* Usaremos '#' temporalmente, en un entorno real sería una ruta de React Router, ej: to="/admin/planes" */}
							<a href="#/admin/planes" className="nav-link">
								<i className="nav-icon fas fa-lightbulb" />
								<p>
									Gestión de Planes
								</p>
							</a>
						</li>
					</ul>
				</nav>
			</div>
		</aside>
	);
}

export default Sidemenu;