import React from 'react';
import { Categoria } from '../../domain/Categoria';

type ListaCategoriasProps = {
  categorias: Categoria[];
  onEditar: (c: Categoria) => void;
  onEliminar: (c: Categoria) => void;
};

export const ListaCategorias: React.FC<ListaCategoriasProps> = ({ categorias, onEditar, onEliminar }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
      <table className="w-full text-left table-auto">
        <thead className="bg-emerald-50 text-emerald-700">
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((cat) => (
            <tr key={cat.id} className="border-b border-gray-50 hover:bg-gray-50/30">
              <td className="px-4 py-2">{cat.id}</td>
              <td className="px-4 py-2">{cat.nombre}</td>
              <td className="px-4 py-2 text-right space-x-2">
                <button
                  onClick={() => onEditar(cat)}
                  className="text-emerald-600 hover:underline"
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={() => onEliminar(cat)}
                  className="text-red-600 hover:underline"
                >
                  🗑️ Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
