import React from 'react';
import { Item, obtenerNombreCategoria } from '../../domain/Item';

interface TablaItemsProps {
  items: Item[];
  onToggleEstado: (id: number, nombre: string, estado: boolean) => void;
  onEditar: (item: Item) => void;
  onEliminar: (item: Item) => void;
}

export const TablaItems: React.FC<TablaItemsProps> = ({
  items,
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
              <th className="p-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Imagen</th>
              <th className="p-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Nombre / Descripción</th>
              <th className="p-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Tipo</th>
              <th className="p-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Categoría</th>
              <th className="p-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Precio</th>
              <th className="p-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Estado</th>
              <th className="p-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {items.map((item) => (
              <tr key={item.id_item} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-5 text-sm font-extrabold text-gray-400">#{item.id_item}</td>
                <td className="p-5">
                  <img
                    src={item.imagen || '/assets/coca_cola_sin_azu_300ml.png'}
                    alt={item.nombre}
                    className="w-12 h-12 object-cover rounded-xl border border-gray-100"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/coca_cola_sin_azu_300ml.png';
                    }}
                  />
                </td>
                <td className="p-5">
                  <div className="font-bold text-gray-800 text-base">{item.nombre}</div>
                  <div className="text-xs text-gray-400 font-medium max-w-xs truncate">
                    {item.descripción || "Sin descripción"}
                  </div>
                </td>
                <td className="p-5 text-sm font-semibold text-gray-500">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${item.tipo_item === 'Producto' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                    {item.tipo_item}
                  </span>
                </td>
                <td className="p-5 text-sm font-semibold text-gray-500">
                  <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full text-xs font-bold">
                    {obtenerNombreCategoria(item.id_categoria)}
                  </span>
                </td>
                <td className="p-5 text-sm font-bold text-emerald-600">
                  ${item.precio.toFixed(2)}
                </td>
                <td className="p-5">
                  <div className="flex items-center gap-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.estado}
                        onChange={() => onToggleEstado(item.id_item, item.nombre, item.estado)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                      item.estado ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {item.estado ? 'ACTIVO' : 'INACTIVO'}
                    </span>
                  </div>
                </td>
                <td className="p-5 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEditar(item)}
                      className="w-9 h-9 rounded-xl border border-gray-100 bg-white hover:bg-emerald-50 hover:text-emerald-600 transition-colors flex items-center justify-center text-gray-500 shadow-sm"
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => onEliminar(item)}
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
