import React from 'react';
import { Categoria } from '../types/CategoriaTypes';

type ListaCategoriasProps = {
  categorias: Categoria[];
  onEditar: (c: Categoria) => void;
  onToggleEstado: (c: Categoria) => void;
};

export const ListaCategorias: React.FC<ListaCategoriasProps> = ({ categorias, onEditar, onToggleEstado }) => {
  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden animate-in fade-in duration-300">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">ID</th>
              <th className="p-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Nombre</th>
              <th className="p-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Descripción</th>
              <th className="p-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Estado</th>
              <th className="p-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {categorias.map((cat) => (
              <tr key={cat.id_categoria} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-5 text-sm font-extrabold text-gray-400">#{cat.id_categoria}</td>
                <td className="p-5">
                  <div className="font-bold text-gray-800 text-base">{cat.nombre}</div>
                </td>
                <td className="p-5">
                  <div className="text-sm text-gray-500 max-w-md truncate" title={cat.descripcion || "Sin descripción detallada"}>
                    {cat.descripcion || "Sin descripción detallada"}
                  </div>
                </td>
                <td className="p-5 text-center">
                  <button
                    onClick={() => onToggleEstado(cat)}
                    className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 ${cat.estado ? 'bg-emerald-500' : 'bg-gray-300'}`}
                  >
                    <span className="sr-only">Cambiar estado</span>
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${cat.estado ? 'translate-x-5' : 'translate-x-0'}`}
                    />
                  </button>
                  <div className={`text-[10px] mt-1 font-semibold uppercase ${cat.estado ? 'text-emerald-600' : 'text-gray-500'}`}>
                    {cat.estado ? 'Activo' : 'Inactivo'}
                  </div>
                </td>
                <td className="p-5 text-center">
                  <button
                    onClick={() => onEditar(cat)}
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
        {categorias.length === 0 && (
          <div className="p-10 text-center text-gray-500 text-sm font-medium">
            No hay categorías registradas.
          </div>
        )}
      </div>
    </div>
  );
};
