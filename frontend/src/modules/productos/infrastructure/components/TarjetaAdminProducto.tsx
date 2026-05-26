import React from 'react';
import { Producto, obtenerNombreCategoria } from '../../domain/Producto';

interface TarjetaAdminProductoProps {
  producto: Producto;
  onToggleEstado: (id: number, nombre: string, estado: boolean) => void;
  onEditar: (producto: Producto) => void;
  onEliminar: (producto: Producto) => void;
}

export const TarjetaAdminProducto: React.FC<TarjetaAdminProductoProps> = ({
  producto,
  onToggleEstado,
  onEditar,
  onEliminar,
}) => {
  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between group relative overflow-hidden text-left">
      {/* ID */}
      <div className="absolute right-6 top-6 text-7xl font-black text-gray-50 opacity-40 select-none group-hover:scale-110 transition-transform pointer-events-none">
        #{producto.id_productos}
      </div>

      <div>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <img
            src={producto.imagen || '/assets/coca_cola_sin_azu_300ml.png'}
            alt={producto.nombre}
            className="w-16 h-16 object-cover rounded-2xl border border-gray-100 shadow-sm"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/coca_cola_sin_azu_300ml.png';
            }}
          />
          
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
            <span className={`w-2.5 h-2.5 rounded-full ${producto.estado ? 'bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]' : 'bg-gray-400'}`}></span>
            <span className="text-[10px] font-extrabold uppercase text-gray-500 tracking-wider">
              {producto.estado ? 'Activo' : 'Inactivo'}
            </span>
          </div>
        </div>

        {/* Categoria */}
        <span className="bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-block mb-3">
          {obtenerNombreCategoria(producto.id_categoria)}
        </span>

        {/* Titulo */}
        <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-emerald-600 transition-colors pr-8">
          {producto.nombre}
        </h3>

        {/* Descripcion */}
        <p className="text-xs text-gray-500 font-medium leading-relaxed mb-4 min-h-[32px]">
          {producto.descripción || <span className="italic text-gray-300">Sin descripción registrada.</span>}
        </p>

        <div className="h-px bg-gray-50 mb-4"></div>

        {/* Precio & Stock */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Precio</p>
            <p className="text-lg font-black text-emerald-600">${producto.precio.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Stock</p>
            <p className={`text-sm font-bold ${producto.stock === 0 ? 'text-red-500' : 'text-gray-700'}`}>
              {producto.stock} unidades
            </p>
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-50 my-4"></div>

      {/* Footer Acciones */}
      <div className="flex items-center justify-between">
        {/* Toggle rapido */}
        <div className="flex items-center gap-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={producto.estado}
              onChange={() => onToggleEstado(producto.id_productos, producto.nombre, producto.estado)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
          </label>
          <span className="text-[10px] font-bold text-gray-400">Estado</span>
        </div>

        {/* Botones */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEditar(producto)}
            className="w-9 h-9 rounded-xl border border-gray-100 bg-white hover:bg-emerald-50 hover:text-emerald-600 transition-colors flex items-center justify-center text-gray-500 shadow-sm"
            title="Editar producto"
          >
            ✏️
          </button>
          <button
            onClick={() => onEliminar(producto)}
            className="w-9 h-9 rounded-xl border border-gray-100 bg-white hover:bg-red-50 hover:text-red-600 transition-colors flex items-center justify-center text-gray-500 shadow-sm"
            title="Eliminar producto"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};
