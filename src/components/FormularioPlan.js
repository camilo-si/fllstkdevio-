import React, { useState } from 'react';

// Este formulario se usará para CREAR (vacío) o EDITAR (pre-llenado)
function FormularioPlan({ planInicial = {}, onSave, onCancel }) {
    
    // Si se pasa un planInicial (para editar), usa esos datos. Si no, usa valores vacíos.
    const [formData, setFormData] = useState({
        nombre: planInicial.nombre || '',
        tipoCliente: planInicial.tipoCliente || 'Residencial',
        capacidadKW: planInicial.capacidadKW || 5, // Asumimos un valor inicial
        tarifaMensualCLP: planInicial.tarifaMensualCLP || 0,
        descripcionDetalle: planInicial.descripcionDetalle || '',
        incluyeMonitoreo: planInicial.incluyeMonitoreo || false,
        ...planInicial
    });

    // Identifica si estamos en modo edición (si tiene ID)
    const isEditMode = !!planInicial.id; 

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Llama a la función onSave (que manejará la API POST/PUT)
        onSave(formData);
    };

    return (
        <section className="content">
            {/* Tarjeta AdminLTE: morado para crear, naranja para editar */}
            <div className={`card ${isEditMode ? 'card-warning' : 'card-purple'}`}> 
                
                <div className="card-header">
                    <h3 className="card-title">
                        {isEditMode ? `Editar Plan: ${formData.nombre}` : 'Crear Nuevo Plan'}
                    </h3>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="card-body">
                        
                        {/* Campo: Nombre del Plan */}
                        <div className="form-group">
                            <label htmlFor="nombre">Nombre del Plan</label>
                            <input
                                type="text"
                                className="form-control"
                                id="nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Fila de Capacidad y Tarifa */}
                        <div className="form-group row">
                            <div className="col-md-6">
                                <label htmlFor="capacidadKW">Capacidad (KW)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="capacidadKW"
                                    name="capacidadKW"
                                    value={formData.capacidadKW}
                                    onChange={handleChange}
                                    min="1"
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="tarifaMensualCLP">Tarifa Mensual (CLP)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="tarifaMensualCLP"
                                    name="tarifaMensualCLP"
                                    value={formData.tarifaMensualCLP}
                                    onChange={handleChange}
                                    min="0"
                                />
                            </div>
                        </div>

                        {/* Campo: Tipo de Cliente y Monitoreo */}
                        <div className="form-group row">
                            <div className="col-md-6">
                                <label htmlFor="tipoCliente">Dirigido a</label>
                                <select
                                    className="form-control"
                                    id="tipoCliente"
                                    name="tipoCliente"
                                    value={formData.tipoCliente}
                                    onChange={handleChange}
                                >
                                    <option value="Residencial">Residencial</option>
                                    <option value="Comercial">Comercial (PyME)</option>
                                    <option value="Industrial">Industrial</option>
                                </select>
                            </div>
                            <div className="col-md-6 d-flex align-items-center">
                                <div className="form-check mt-4">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="incluyeMonitoreo"
                                        name="incluyeMonitoreo"
                                        checked={formData.incluyeMonitoreo}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="incluyeMonitoreo">Incluye Monitoreo Remoto</label>
                                </div>
                            </div>
                        </div>

                        {/* Campo: Descripción Detallada */}
                        <div className="form-group">
                            <label htmlFor="descripcionDetalle">Descripción Detallada</label>
                            <textarea
                                className="form-control"
                                id="descripcionDetalle"
                                name="descripcionDetalle"
                                rows="4"
                                value={formData.descripcionDetalle}
                                onChange={handleChange}
                            />
                        </div>

                    </div>
                    
                    {/* Pie de la tarjeta con botones de acción */}
                    <div className="card-footer">
                        <button type="submit" className={`btn ${isEditMode ? 'btn-warning' : 'btn-purple'} mr-2`}>
                            <i className="fas fa-save mr-1"></i> {isEditMode ? 'Guardar Cambios' : 'Crear Plan'}
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

export default FormularioPlan;