import React from 'react';
import { Categoria } from '../../domain/Categoria';

type ListaCategoriasProps = {
  categorias: Categoria[];
  onEditar: (c: Categoria) => void;
  onEliminar: (c: Categoria) => void;
};

export const ListaCategorias: React.FC<ListaCategoriasProps> = ({ categorias, onEditar, onEliminar }) => {
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
              <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-5 text-sm font-extrabold text-gray-400">#{cat.id}</td>
                <td className="p-5">
                  <div className="font-bold text-gray-800 text-base">{cat.nombre}</div>
                </td>
                <td className="p-5">
                  <div className="text-sm text-gray-500 max-w-md truncate" title={cat.descripcion || "Sin descripción detallada"}>
                    {cat.descripcion || "Sin descripción detallada"}
                  </div>
                </td>
                <td className="p-5">
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                      cat.estado !== false ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {cat.estado !== false ? 'ACTIVO' : 'INACTIVO'}
                    </span>
                  </div>
                </td>
                <td className="p-5 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEditar(cat)}
                      className="w-9 h-9 rounded-xl border border-gray-100 bg-white hover:bg-emerald-50 hover:text-emerald-600 transition-colors flex items-center justify-center text-gray-500 shadow-sm"
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => onEliminar(cat)}
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
