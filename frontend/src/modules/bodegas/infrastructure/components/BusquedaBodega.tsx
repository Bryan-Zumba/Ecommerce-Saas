import React from 'react';

interface BusquedaBodegaProps {
  busqueda: string;
  setBusqueda: (val: string) => void;
  ordenarPor: 'nombre' | 'fecha_reciente' | 'id';
  setOrdenarPor: (val: 'nombre' | 'fecha_reciente' | 'id') => void;
  vista: 'tarjetas' | 'tabla';
  setVista: (val: 'tarjetas' | 'tabla') => void;
  filtroEstado: 'todos' | 'activas' | 'inactivas';
  setFiltroEstado: (val: 'todos' | 'activas' | 'inactivas') => void;
  counts: { todas: number; activas: number; inactivas: number };
}

export const BusquedaBodega: React.FC<BusquedaBodegaProps> = ({
  busqueda,
  setBusqueda,
  ordenarPor,
  setOrdenarPor,
  vista,
  setVista,
  filtroEstado,
  setFiltroEstado,
  counts,
}) => {
  return (
    <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 mb-8 flex flex-col gap-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Buscador de Texto */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 text-sm">🔍</span>
          <input
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="block w-full pl-11 pr-4 py-3 border border-gray-100 rounded-2xl bg-gray-50/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-sm font-medium"
            placeholder="Buscar bodega por nombre, ubicación o descripción..."
          />
        </div>

        {/* Alternar Vistas y Ordenamiento */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Dropdown de Orden */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ordenar:</span>
            <select
              value={ordenarPor}
              onChange={(e: any) => setOrdenarPor(e.target.value)}
              className="bg-gray-50 border border-gray-100 text-gray-700 py-2 px-4 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="nombre">Nombre (A-Z)</option>
              <option value="fecha_reciente">Fecha de Registro</option>
              <option value="id">ID Bodega</option>
            </select>
          </div>

          <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

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

      <div className="h-px bg-gray-100"></div>

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
      </div>
    </div>
  );
};
