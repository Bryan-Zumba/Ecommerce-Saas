import React from 'react';

interface BusquedaBodegaProps {
  vista: 'tarjetas' | 'tabla';
  setVista: (val: 'tarjetas' | 'tabla') => void;
  filtroEstado: 'todos' | 'activas' | 'inactivas';
  setFiltroEstado: (val: 'todos' | 'activas' | 'inactivas') => void;
  counts: { todas: number; activas: number; inactivas: number };
}

export const BusquedaBodega: React.FC<BusquedaBodegaProps> = ({
  vista,
  setVista,
  filtroEstado,
  setFiltroEstado,
  counts,
}) => {
  return (
    <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 mb-8 flex flex-col gap-5">

      {/* Píldoras de Filtro por Estado */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2">Filtro de Estado:</span>
        <button
          onClick={() => setFiltroEstado('todos')}
          className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all border ${
            filtroEstado === 'todos'
              ? 'bg-emerald-500 border-emerald-500 text-white shadow-md'
              : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50'
          }`}
        >
          Todas ({counts.todas})
        </button>
        <button
          onClick={() => setFiltroEstado('activas')}
          className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all border ${
            filtroEstado === 'activas'
              ? 'bg-emerald-500 border-emerald-500 text-white shadow-md'
              : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50'
          }`}
        >
          Activas ({counts.activas})
        </button>
        <button
          onClick={() => setFiltroEstado('inactivas')}
          className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all border ${
            filtroEstado === 'inactivas'
              ? 'bg-gray-600 border-gray-600 text-white shadow-md'
              : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50'
          }`}
        >
          Inactivas ({counts.inactivas})
        </button>
        
        {/* Alternar Vistas y Ordenamiento */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Botón Selector Vista Tarjetas / Tabla */}
          <div className="bg-gray-100 p-1 rounded-xl flex items-center gap-1">
            <button
              onClick={() => setVista('tarjetas')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                vista === 'tarjetas' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              🎴 Tarjetas
            </button>
            <button
              onClick={() => setVista('tabla')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                vista === 'tabla' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              📊 Tabla
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
