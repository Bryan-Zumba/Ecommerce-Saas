import React from 'react';
import { Bodega } from '../../domain/Bodega';

interface ConfirmacionEliminarProps {
  bodegaAEliminar: Bodega | null;
  onClose: () => void;
  onConfirmar: () => void;
}

export const ConfirmacionEliminar: React.FC<ConfirmacionEliminarProps> = ({
  bodegaAEliminar,
  onClose,
  onConfirmar,
}) => {
  if (!bodegaAEliminar) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera Modal Eliminar */}
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-600 text-3xl mx-auto mb-4 animate-bounce">
            ⚠️
          </div>
          <h3 className="text-xl font-extrabold text-gray-900 mb-2">
            ¿Eliminar Bodega Permanente?
          </h3>
          <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-xs mx-auto">
            ¿Estás seguro de que deseas eliminar <span className="font-extrabold text-gray-800">"{bodegaAEliminar.nombre}"</span>? Esta acción no se puede deshacer.
          </p>
        </div>

        {/* Acciones */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="bg-white border border-gray-100 hover:bg-gray-100 text-gray-700 px-5 py-3 rounded-2xl font-extrabold text-xs uppercase tracking-widest transition-all active:scale-95 shadow-sm"
          >
            No, Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirmar}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-md shadow-red-600/10"
          >
            Sí, Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};
