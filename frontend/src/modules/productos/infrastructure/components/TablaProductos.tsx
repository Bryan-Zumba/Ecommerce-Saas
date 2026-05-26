import React from 'react';
import { Producto, obtenerNombreCategoria } from '../../domain/Producto';

interface TablaProductosProps {
  productos: Producto[];
  onToggleEstado: (id: number, nombre: string, estado: boolean) => void;
  onEditar: (producto: Producto) => void;
  onEliminar: (producto: Producto) => void;
}

export const TablaProductos: React.FC<TablaProductosProps> = ({
  productos,
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
              <th className="p-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Categoría</th>
              <th className="p-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Precio</th>
              <th className="p-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Stock</th>
              <th className="p-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Estado</th>
              <th className="p-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {productos.map((producto) => (
              <tr key={producto.id_productos} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-5 text-sm font-extrabold text-gray-400">#{producto.id_productos}</td>
                <td className="p-5">
                  <img
                    src={producto.imagen || '/assets/coca_cola_sin_azu_300ml.png'}
                    alt={producto.nombre}
                    className="w-12 h-12 object-cover rounded-xl border border-gray-100"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/coca_cola_sin_azu_300ml.png';
                    }}
                  />
                </td>
                <td className="p-5">
                  <div className="font-bold text-gray-800 text-base">{producto.nombre}</div>
                  <div className="text-xs text-gray-400 font-medium max-w-xs truncate">
                    {producto.descripción || "Sin descripción"}
                  </div>
                </td>
                <td className="p-5 text-sm font-semibold text-gray-500">
                  <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full text-xs font-bold">
                    {obtenerNombreCategoria(producto.id_categoria)}
                  </span>
                </td>
                <td className="p-5 text-sm font-bold text-emerald-600">
                  ${producto.precio.toFixed(2)}
                </td>
                <td className="p-5">
                  <span className={`text-sm font-bold ${
                    producto.stock === 0 ? 'text-red-500' : producto.stock <= 5 ? 'text-amber-500' : 'text-gray-700'
                  }`}>
                    {producto.stock} uds
                  </span>
                </td>
                <td className="p-5">
                  <div className="flex items-center gap-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={producto.estado}
                        onChange={() => onToggleEstado(producto.id_productos, producto.nombre, producto.estado)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                      producto.estado ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {producto.estado ? 'ACTIVO' : 'INACTIVO'}
                    </span>
                  </div>
                </td>
                <td className="p-5 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEditar(producto)}
                      className="w-9 h-9 rounded-xl border border-gray-100 bg-white hover:bg-emerald-50 hover:text-emerald-600 transition-colors flex items-center justify-center text-gray-500 shadow-sm"
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => onEliminar(producto)}
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
