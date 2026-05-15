import React, { useState, useEffect } from 'react';

/**
 * FormularioCliente - Modal para crear o editar un cliente.
 */
const ModalFormularioCliente = ({ isOpen, onClose, onSave, initialData }) => {
  const esEditando = Boolean(initialData);

  const [datosFormulario, setDatosFormulario] = useState({
    id: '',
    nombre: '',
    email: '',
    telefono: '',
  });

  const [error, setError] = useState('');

  // Sincronizar estado cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setDatosFormulario(initialData);
      } else {
        setDatosFormulario({ id: '', nombre: '', email: '', telefono: '' });
      }
      setError('');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setDatosFormulario((prev) => ({ ...prev, [name]: value }));
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    if (!datosFormulario.id || !datosFormulario.nombre) {
        setError('Cédula y Nombre son obligatorios');
        return;
    }
    setError('');
    
    const resultado = await onSave(datosFormulario);
    if (resultado?.error) {
      setError(resultado.error);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800">
            {esEditando ? 'Editar Cliente' : 'Nuevo Cliente'}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 font-bold p-1 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <form onSubmit={manejarEnvio} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-xs font-bold p-3 rounded-xl border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-1 text-left">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Cédula / RUC</label>
            <input
              required
              type="text"
              name="id"
              value={datosFormulario.id}
              onChange={manejarCambio}
              disabled={esEditando}
              placeholder="17xxxxxxxx"
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-400"
            />
          </div>

          <div className="space-y-1 text-left">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Nombre Completo</label>
            <input
              required
              type="text"
              name="nombre"
              value={datosFormulario.nombre}
              onChange={manejarCambio}
              placeholder="Juan Pérez"
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-1 text-left">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Email</label>
            <input
              type="email"
              name="email"
              value={datosFormulario.email}
              onChange={manejarCambio}
              placeholder="juan@ejemplo.com"
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-1 text-left">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={datosFormulario.telefono}
              onChange={manejarCambio}
              placeholder="099xxxxxxx"
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>

          <div className="pt-4 flex gap-3">
             <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-gray-200 text-gray-500 text-sm font-bold rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all flex-1 text-center"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2.5 rounded-xl transition-all active:scale-95 shadow-sm shadow-emerald-200"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalFormularioCliente;
