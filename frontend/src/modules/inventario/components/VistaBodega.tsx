import React from 'react';
import { Bodega } from '../types/BodegaTypes';

interface VistaBodegaProps {
  bodega: Bodega;
  onEditar: () => void;
}

export const VistaBodega: React.FC<VistaBodegaProps> = ({ bodega, onEditar }) => {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 px-8 py-10 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/20 rounded-full" />
          <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-emerald-400/10 rounded-full" />

          <div className="relative z-10 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">🏬</span>
              </div>
              <h2 className="text-2xl lg:text-3xl font-black text-white mb-1">
                {bodega.nombre}
              </h2>
              <p className="text-emerald-50/70 text-sm font-medium">
                Bodega registrada el {bodega.fecha_registro}
              </p>
            </div>

            <button
              onClick={onEditar}
              className="bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white px-5 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2 border border-white/20"
            >
              <span>✏️</span> Editar
            </button>
          </div>
        </div>

        <div className="p-8 lg:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2">
              <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-2 block">
                Descripción
              </label>
              <div className="bg-gray-50/80 rounded-2xl px-5 py-4 border border-gray-100">
                <p className="text-sm font-medium text-gray-700 leading-relaxed">
                  {bodega.descripcion || <span className="italic text-gray-300">Sin descripción registrada.</span>}
                </p>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-2 block">
                📍 Ubicación física
              </label>
              <div className="bg-gray-50/80 rounded-2xl px-5 py-4 border border-gray-100">
                <p className="text-sm font-semibold text-gray-700">
                  {bodega.ubicacion || <span className="italic text-gray-300">Sin ubicación asignada</span>}
                </p>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-2 block">
                📅 Fecha de registro
              </label>
              <div className="bg-gray-50/80 rounded-2xl px-5 py-4 border border-gray-100">
                <p className="text-sm font-semibold text-gray-700">
                  {bodega.fecha_registro}
                </p>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-2 block">
                🏢 ID Empresa
              </label>
              <div className="bg-gray-50/80 rounded-2xl px-5 py-4 border border-gray-100">
                <p className="text-sm font-semibold text-gray-700">
                  #{bodega.id_empresa}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
