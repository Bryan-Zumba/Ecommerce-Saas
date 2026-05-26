import React from 'react';
import { Bodega } from '../../domain/Bodega';

interface TarjetasBodegasProps {
  bodegas: Bodega[];
  onToggleEstado: (id: number, nombre: string, estado: boolean) => void;
  onEditar: (bodega: Bodega) => void;
  onEliminar: (bodega: Bodega) => void;
}

export const TarjetasBodegas: React.FC<TarjetasBodegasProps> = ({
  bodegas,
  onToggleEstado,
  onEditar,
  onEliminar,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
      {bodegas.map((bodega) => (
        <div
          key={bodega.id_bodega}
          className="bg-white rounded-[2.5rem] border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between group relative overflow-hidden text-left"
        >
          {/* ID de Bodega de fondo sutil */}
          <div className="absolute right-6 top-6 text-7xl font-black text-gray-50 opacity-40 select-none group-hover:scale-110 transition-transform pointer-events-none">
            #{bodega.id_bodega}
          </div>

          <div>
            {/* Encabezado Tarjeta */}
            <div className="flex items-start justify-between mb-4">
              <span className="text-3xl bg-emerald-50 p-3 rounded-2xl text-emerald-600 shadow-sm block">🏬</span>
              
              {/* Glowing Pulse para estado activo */}
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                <span className={`w-2.5 h-2.5 rounded-full ${bodega.estado ? 'bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]' : 'bg-gray-400'}`}></span>
                <span className="text-[10px] font-extrabold uppercase text-gray-500 tracking-wider">
                  {bodega.estado ? 'Activa' : 'Inactiva'}
                </span>
              </div>
            </div>

            {/* Título y Descripción */}
            <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-emerald-600 transition-colors pr-8">
              {bodega.nombre}
            </h3>

            <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6 min-h-[40px]">
              {bodega.descripcion || <span className="italic text-gray-300">Sin descripción registrada.</span>}
            </p>

            <div className="h-px bg-gray-50 mb-4"></div>

            {/* Ubicación y Fecha */}
            <div className="space-y-2 text-xs font-semibold text-gray-400">
              <div className="flex items-center gap-2">
                <span className="text-sm">📍</span>
                <span className="text-gray-600 truncate" title={bodega.ubicacion}>
                  {bodega.ubicacion || <span className="italic text-gray-300">Sin ubicación asignada</span>}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">📅</span>
                <span>Registrada: <span className="text-gray-600">{bodega.fecha_registro}</span></span>
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-50 my-4"></div>

          {/* Acciones e Interruptor en Tarjeta */}
          <div className="flex items-center justify-between">
            {/* Interruptor de Estado Rápido */}
            <div className="flex items-center gap-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={bodega.estado}
                  onChange={() => onToggleEstado(bodega.id_bodega, bodega.nombre, bodega.estado)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
              <span className="text-[10px] font-bold text-gray-400">Estado rápido</span>
            </div>

            {/* Botones de acción */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEditar(bodega)}
                className="w-9 h-9 rounded-xl border border-gray-100 bg-white hover:bg-emerald-50 hover:text-emerald-600 transition-colors flex items-center justify-center text-gray-500 shadow-sm"
                title="Editar bodega"
              >
                ✏️
              </button>
              <button
                onClick={() => onEliminar(bodega)}
                className="w-9 h-9 rounded-xl border border-gray-100 bg-white hover:bg-red-50 hover:text-red-600 transition-colors flex items-center justify-center text-gray-500 shadow-sm"
                title="Eliminar bodega"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
