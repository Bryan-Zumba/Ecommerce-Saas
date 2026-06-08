import React, { useState, useEffect } from 'react';
import { Bodega } from '../../domain/Bodega';

interface FormularioBodegaProps {
  bodegaAEditar?: Bodega | null;
  onGuardar: (datos: { nombre: string; descripcion: string; ubicacion: string }) => void;
  onCancelar?: () => void;
  modo: 'registro' | 'edicion';
}

export const FormularioBodega: React.FC<FormularioBodegaProps> = ({
  bodegaAEditar,
  onGuardar,
  onCancelar,
  modo,
}) => {
  const [formNombre, setFormNombre] = useState('');
  const [formDescripcion, setFormDescripcion] = useState('');
  const [formUbicacion, setFormUbicacion] = useState('');

  useEffect(() => {
    if (bodegaAEditar && modo === 'edicion') {
      setFormNombre(bodegaAEditar.nombre);
      setFormDescripcion(bodegaAEditar.descripcion);
      setFormUbicacion(bodegaAEditar.ubicacion);
    } else {
      setFormNombre('');
      setFormDescripcion('');
      setFormUbicacion('');
    }
  }, [bodegaAEditar, modo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGuardar({
      nombre: formNombre.trim(),
      descripcion: formDescripcion.trim(),
      ubicacion: formUbicacion.trim(),
    });
  };

  const esRegistro = modo === 'registro';

  return (
    <div className="animate-in fade-in duration-400">
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">

        {/* Cabecera */}
        <div className={`p-6 lg:p-8 border-b border-gray-50 ${esRegistro ? 'bg-gradient-to-r from-emerald-50 to-teal-50' : 'bg-gradient-to-r from-amber-50 to-orange-50'}`}>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{esRegistro ? '🏬' : '✏️'}</span>
            <div>
              <h3 className="text-xl font-extrabold text-gray-900">
                {esRegistro ? 'Registrar Información de Bodega' : 'Editar Información de Bodega'}
              </h3>
              <p className="text-xs text-gray-400 font-semibold mt-1">
                {esRegistro
                  ? 'Ingresa los datos de la bodega donde se almacenará y controlará el inventario.'
                  : 'Modifica la información de la bodega para corregir o actualizar sus datos.'}
              </p>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 lg:p-8 space-y-5">

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
                placeholder="Ej. Bodega Central"
              />
            </div>

            {/* Ubicación (Máx 30) */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Ubicación física *</label>
                <span className={`text-[10px] font-bold ${formUbicacion.length > 30 ? 'text-red-500' : 'text-gray-400'}`}>
                  {formUbicacion.length}/30 caract.
                </span>
              </div>
              <input
                type="text"
                required
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

          </div>

          {/* Pie de Formulario */}
          <div className="p-6 lg:p-8 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
            {onCancelar && (
              <button
                type="button"
                onClick={onCancelar}
                className="bg-white border border-gray-100 hover:bg-gray-100 text-gray-700 px-5 py-3 rounded-2xl font-extrabold text-xs uppercase tracking-widest transition-all active:scale-95 shadow-sm"
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-md shadow-emerald-600/10"
            >
              {esRegistro ? 'Registrar Bodega' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
