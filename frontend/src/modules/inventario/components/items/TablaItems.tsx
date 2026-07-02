import React from 'react';
import { Item } from '../../types/ItemTypes';

interface TablaItemsProps {
  items: Item[];
  onToggleEstado: (item: Item) => void;
  onEditar: (item: Item) => void;
}

export const TablaItems: React.FC<TablaItemsProps> = ({
  items,
  onToggleEstado,
  onEditar,
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
                  {item.imagen_url ? (
                    <img
                      src={item.imagen_url}
                      alt={item.nombre}
                      className="w-12 h-12 object-cover rounded-xl border border-gray-100"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 border border-gray-100 flex flex-col items-center justify-center gap-0.5">
                      <span className="text-base leading-none">📷</span>
                      <span className="text-[7px] font-bold text-gray-400 uppercase tracking-wider">Sin foto</span>
                    </div>
                  )}
                </td>
                <td className="p-5">
                  <div className="font-bold text-gray-800 text-base">{item.nombre}</div>
                  <div className="text-xs text-gray-400 font-medium max-w-xs truncate">
                    {item.descripcion || "Sin descripción"}
                  </div>
                </td>
                <td className="p-5 text-sm font-semibold text-gray-500">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${item.tipo_item === 'Producto' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                    {item.tipo_item}
                  </span>
                </td>
                <td className="p-5 text-sm font-semibold text-gray-500">
                  <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full text-xs font-bold">
                    Cat. #{item.id_categoria}
                  </span>
                </td>
                <td className="p-5 text-sm font-bold text-emerald-600">
                  ${Number(item.precio).toFixed(2)}
                </td>
                <td className="p-5 text-center">
                  <button
                    onClick={() => onToggleEstado(item)}
                    className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 ${item.estado ? 'bg-emerald-500' : 'bg-gray-300'}`}
                  >
                    <span className="sr-only">Cambiar estado</span>
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${item.estado ? 'translate-x-5' : 'translate-x-0'}`}
                    />
                  </button>
                  <div className={`text-[10px] mt-1 font-semibold uppercase ${item.estado ? 'text-emerald-600' : 'text-gray-500'}`}>
                    {item.estado ? 'Activo' : 'Inactivo'}
                  </div>
                </td>
                <td className="p-5 text-center">
                  <button
                    onClick={() => onEditar(item)}
                    className="text-emerald-600 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 p-2 rounded-lg transition-colors inline-flex items-center gap-1"
                    title="Editar"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && (
          <div className="p-10 text-center text-gray-500 text-sm font-medium">
            No hay items registrados.
          </div>
        )}
      </div>
    </div>
  );
};
