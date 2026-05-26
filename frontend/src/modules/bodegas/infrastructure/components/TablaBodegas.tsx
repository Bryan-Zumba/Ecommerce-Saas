import React from 'react';
import { Bodega } from '../../domain/Bodega';

interface TablaBodegasProps {
  bodegas: Bodega[];
  onToggleEstado: (id: number, nombre: string, estado: boolean) => void;
  onEditar: (bodega: Bodega) => void;
  onEliminar: (bodega: Bodega) => void;
}

export const TablaBodegas: React.FC<TablaBodegasProps> = ({
  bodegas,
  onToggleEstado,
  onEditar,
  onEliminar,
}) => {
  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden animate-in fade-in duration-300">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">ID</th>
              <th className="p-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Nombre / Descripción</th>
              <th className="p-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Ubicación</th>
              <th className="p-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Registro</th>
              <th className="p-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Estado rápido</th>
              <th className="p-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {bodegas.map((bodega) => (
              <tr key={bodega.id_bodega} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-5 text-sm font-extrabold text-gray-400">#{bodega.id_bodega}</td>
                <td className="p-5">
                  <div className="font-bold text-gray-800 text-base">{bodega.nombre}</div>
                  <div className="text-xs text-gray-400 font-medium max-w-xs truncate">
                    {bodega.descripcion || "Sin descripción"}
                  </div>
                </td>
                <td className="p-5 text-sm font-semibold text-gray-500">
                  <span className="mr-1.5">📍</span>
                  {bodega.ubicacion || <span className="italic text-gray-300">No asignada</span>}
                </td>
                <td className="p-5 text-xs font-semibold text-gray-400">{bodega.fecha_registro}</td>
                <td className="p-5">
                  <div className="flex items-center gap-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={bodega.estado}
                        onChange={() => onToggleEstado(bodega.id_bodega, bodega.nombre, bodega.estado)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                      bodega.estado ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {bodega.estado ? 'ACTIVO' : 'INACTIVO'}
                    </span>
                  </div>
                </td>
                <td className="p-5 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEditar(bodega)}
                      className="w-9 h-9 rounded-xl border border-gray-100 bg-white hover:bg-emerald-50 hover:text-emerald-600 transition-colors flex items-center justify-center text-gray-500 shadow-sm"
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => onEliminar(bodega)}
                      className="w-9 h-9 rounded-xl border border-gray-100 bg-white hover:bg-red-50 hover:text-red-600 transition-colors flex items-center justify-center text-gray-500 shadow-sm"
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
