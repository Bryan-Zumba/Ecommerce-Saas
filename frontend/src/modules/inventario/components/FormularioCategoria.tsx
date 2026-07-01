import React, { useState, useEffect } from 'react';
import { Categoria, CategoriaRequest, CategoriaUpdate } from '../types/CategoriaTypes';

interface FormularioCategoriaProps {
  isOpen: boolean;
  categoriaAEditar: Categoria | null;
  onClose: () => void;
  onGuardar: (datos: CategoriaRequest | CategoriaUpdate) => void;
  idEmpresa: number;
}

export const FormularioCategoria: React.FC<FormularioCategoriaProps> = ({
  isOpen,
  categoriaAEditar,
  onClose,
  onGuardar,
  idEmpresa
}) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');

  useEffect(() => {
    if (categoriaAEditar) {
      setNombre(categoriaAEditar.nombre);
      setDescripcion(categoriaAEditar.descripcion || '');
    } else {
      setNombre('');
      setDescripcion('');
    }
  }, [categoriaAEditar, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (categoriaAEditar) {
      onGuardar({ nombre: nombre.trim(), descripcion: descripcion.trim() });
    } else {
      onGuardar({ id_empresa: idEmpresa, nombre: nombre.trim(), descripcion: descripcion.trim() });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-50 bg-gradient-to-r from-emerald-50 to-white flex items-center justify-between">
          <div>
            <h3 className="text-xl font-extrabold text-gray-900">
              {categoriaAEditar ? '✏️ Editar Categoría' : '📂 Crear Nueva Categoría'}
            </h3>
            <p className="text-xs text-gray-400 font-semibold mt-1">
              Ingrese los detalles de la categoría.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-400 font-bold transition-colors flex items-center justify-center text-sm"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                  Nombre de la categoría *
                </label>
                <span className={`text-[10px] font-bold ${nombre.length > 100 ? 'text-red-500' : 'text-gray-400'}`}>
                  {100 - nombre.length} caracteres restantes
                </span>
              </div>
              <input
                type="text"
                required
                maxLength={100}
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="block w-full px-4 py-2.5 border border-gray-100 rounded-xl bg-gray-50/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-sm font-semibold text-gray-800 transition-all"
                placeholder="Ej. Postres"
              />
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                  Descripción (Opcional)
                </label>
                <span className={`text-[10px] font-bold ${descripcion.length > 500 ? 'text-red-500' : 'text-gray-400'}`}>
                  {500 - descripcion.length} caracteres restantes
                </span>
              </div>
              <textarea
                maxLength={500}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="block w-full px-4 py-2.5 border border-gray-100 rounded-xl bg-gray-50/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-sm font-semibold text-gray-800 transition-all resize-none"
                placeholder="Descripción breve..."
                rows={3}
              />
            </div>
          </div>

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
              {categoriaAEditar ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
