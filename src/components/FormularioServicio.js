import React, { useState } from 'react';

// Este formulario se usará para CREAR (vacío) o EDITAR (pre-llenado)
function FormularioServicio({ servicioInicial = {}, onSave, onCancel }) {
    
    // Si se pasa un servicioInicial (para editar), usa esos datos. Si no, usa valores vacíos.
    const [formData, setFormData] = useState({
        titulo: servicioInicial.titulo || '',
        descripcion: servicioInicial.descripcion || '',
        costo: servicioInicial.costo || '',
        tipoServicio: servicioInicial.tipoServicio || 'Consultoría',
        // Propiedades adicionales
        detallesTecnicos: servicioInicial.detallesTecnicos || '',
        duracionEstimada: servicioInicial.duracionEstimada || '',
    });

    // Identifica si estamos en modo edición (si tiene ID)
    const isEditMode = !!servicioInicial.id; 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // En una aplicación real, aquí se harían validaciones
        
        // Llama a la función onSave (que manejará la API POST/PUT)
        onSave(formData);
    };

    return (
        <section className="content">
            {/* Tarjeta AdminLTE: verde para crear, naranja para editar */}
            <div className={`card ${isEditMode ? 'card-warning' : 'card-success'}`}> 
                
                <div className="card-header">
                    <h3 className="card-title">
                        {isEditMode ? `Editar Servicio: ${formData.titulo}` : 'Crear Nuevo Servicio'}
                    </h3>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="card-body">
                        
                        {/* Campo: Título del Servicio */}
                        <div className="form-group">
                            <label htmlFor="titulo">Título del Servicio</label>
                            <input
                                type="text"
                                className="form-control"
                                id="titulo"
                                name="titulo"
                                value={formData.titulo}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Campo: Descripción Corta */}
                        <div className="form-group">
                            <label htmlFor="descripcion">Descripción Corta</label>
                            <textarea
                                className="form-control"
                                id="descripcion"
                                name="descripcion"
                                rows="3"
                                value={formData.descripcion}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        
                        {/* Campo: Detalles Técnicos */}
                        <div className="form-group">
                            <label htmlFor="detallesTecnicos">Detalles Técnicos</label>
                            <textarea
                                className="form-control"
                                id="detallesTecnicos"
                                name="detallesTecnicos"
                                rows="5"
                                value={formData.detallesTecnicos}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Campo: Costo (o Tarifa) */}
                        <div className="form-group row">
                            <div className="col-md-6">
                                <label htmlFor="costo">Costo/Tarifa (CLP)</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="costo"
                                    name="costo"
                                    value={formData.costo}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="tipoServicio">Tipo de Servicio</label>
                                <select
                                    className="form-control"
                                    id="tipoServicio"
                                    name="tipoServicio"
                                    value={formData.tipoServicio}
                                    onChange={handleChange}
                                >
                                    <option value="Consultoría">Consultoría</option>
                                    <option value="Ejecución">Ejecución</option>
                                    <option value="Mantención">Mantención</option>
                                </select>
                            </div>
                        </div>

                    </div>
                    
                    {/* Pie de la tarjeta con botones de acción */}
                    <div className="card-footer">
                        <button type="submit" className={`btn ${isEditMode ? 'btn-warning' : 'btn-success'} mr-2`}>
                            <i className="fas fa-save mr-1"></i> {isEditMode ? 'Guardar Cambios' : 'Crear Servicio'}
                        </button>
                        <button type="button" onClick={onCancel} className="btn btn-default">
                            <i className="fas fa-times mr-1"></i> Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}

export default FormularioServicio;