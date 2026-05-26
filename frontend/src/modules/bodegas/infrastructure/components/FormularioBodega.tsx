import React, { useState, useEffect } from 'react';
import { Bodega } from '../../domain/Bodega';

interface FormularioBodegaProps {
  isOpen: boolean;
  onClose: () => void;
  bodegaAEditar: Bodega | null;
  onGuardar: (datos: { nombre: string; descripcion: string; ubicacion: string; estado: boolean }) => void;
}

export const FormularioBodega: React.FC<FormularioBodegaProps> = ({
  isOpen,
  onClose,
  bodegaAEditar,
  onGuardar,
}) => {
  const [formNombre, setFormNombre] = useState('');
  const [formDescripcion, setFormDescripcion] = useState('');
  const [formUbicacion, setFormUbicacion] = useState('');
  const [formEstado, setFormEstado] = useState(true);

  useEffect(() => {
    if (bodegaAEditar) {
      setFormNombre(bodegaAEditar.nombre);
      setFormDescripcion(bodegaAEditar.descripcion);
      setFormUbicacion(bodegaAEditar.ubicacion);
      setFormEstado(bodegaAEditar.estado);
    } else {
      setFormNombre('');
      setFormDescripcion('');
      setFormUbicacion('');
      setFormEstado(true);
    }
  }, [bodegaAEditar, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGuardar({
      nombre: formNombre.trim(),
      descripcion: formDescripcion.trim(),
      ubicacion: formUbicacion.trim(),
      estado: formEstado,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera Modal */}
        <div className="p-6 border-b border-gray-50 bg-gradient-to-r from-emerald-50 to-white flex items-center justify-between">
          <div>
            <h3 className="text-xl font-extrabold text-gray-900">
              {bodegaAEditar ? "✏️ Editar Bodega" : "🏬 Registrar Nueva Bodega"}
            </h3>
            <p className="text-xs text-gray-400 font-semibold mt-1">
              Introduce los campos correspondientes respetando las longitudes de la base de datos.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-400 font-bold transition-colors flex items-center justify-center text-sm"
          >
            ✕
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-5">
            
            {/* Nombre (Máx 30) */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Nombre de la Bodega *</label>
                <span className={`text-[10px] font-bold ${formNombre.length > 30 ? 'text-red-500' : 'text-gray-400'}`}>
                  {formNombre.length}/30 caract.
                </span>
              </div>
              <input
                type="text"
                required
                maxLength={30}
                value={formNombre}
                onChange={(e) => setFormNombre(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-100 rounded-xl bg-gray-50/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-sm font-semibold text-gray-800 transition-all"
                placeholder="Ej. Bodega Matriz Guayaquil"
              />
            </div>

            {/* Ubicación (Máx 30) */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Ubicación física</label>
                <span className={`text-[10px] font-bold ${formUbicacion.length > 30 ? 'text-red-500' : 'text-gray-400'}`}>
                  {formUbicacion.length}/30 caract.
                </span>
              </div>
              <input
                type="text"
                maxLength={30}
                value={formUbicacion}
                onChange={(e) => setFormUbicacion(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-100 rounded-xl bg-gray-50/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-sm font-semibold text-gray-800 transition-all"
                placeholder="Ej. Av. De la República N-45"
              />
            </div>

            {/* Descripción (Máx 50) */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Descripción del Almacén</label>
                <span className={`text-[10px] font-bold ${formDescripcion.length > 50 ? 'text-red-500' : 'text-gray-400'}`}>
                  {formDescripcion.length}/50 caract.
                </span>
              </div>
              <textarea
                maxLength={50}
                value={formDescripcion}
                onChange={(e) => setFormDescripcion(e.target.value)}
                rows={3}
                className="block w-full px-4 py-3 border border-gray-100 rounded-xl bg-gray-50/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-sm font-semibold text-gray-800 transition-all resize-none"
                placeholder="Escribe detalles breves sobre el almacenamiento..."
              />
            </div>

            {/* Estado Toggle */}
            <div className="space-y-1.5 pt-2 flex flex-col">
              <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">Estado Activo</label>
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formEstado}
                    onChange={(e) => setFormEstado(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
                <span className="text-sm font-bold text-gray-700">
                  {formEstado ? "Bodega Activa 🟢" : "Bodega Inactiva 🔴"}
                </span>
              </div>
            </div>

          </div>

          {/* Pie de Formulario */}
          <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-white border border-gray-100 hover:bg-gray-100 text-gray-700 px-5 py-3 rounded-2xl font-extrabold text-xs uppercase tracking-widest transition-all active:scale-95 shadow-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-md shadow-emerald-600/10"
            >
              {bodegaAEditar ? "Actualizar" : "Registrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
