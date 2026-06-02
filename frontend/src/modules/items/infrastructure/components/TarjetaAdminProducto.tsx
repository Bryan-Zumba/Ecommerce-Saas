import React from 'react';
import { calcularStockDisponible } from '../../application/inventarioItems';
import { Item, obtenerNombreCategoria } from '../../domain/Item';

interface TarjetaAdminProductoProps {
  item: Item;
  onToggleEstado: (id: number, nombre: string, estado: boolean) => void;
  onEditar: (item: Item) => void;
  onEliminar: (item: Item) => void;
}

export const TarjetaAdminProducto: React.FC<TarjetaAdminProductoProps> = ({
  item,
  onToggleEstado,
  onEditar,
  onEliminar,
}) => {
  const stockDisponible = calcularStockDisponible(item);
  const esServicio = item.tipo_item === 'Servicio';

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between group relative overflow-hidden text-left">
      <div className="absolute right-6 top-6 text-7xl font-black text-gray-50 opacity-40 select-none group-hover:scale-110 transition-transform pointer-events-none">
        #{item.id_item}
      </div>

      <div>
        <div className="flex items-start justify-between mb-4">
          <img
            src={item.imagen || '/assets/coca_cola_sin_azu_300ml.png'}
            alt={item.nombre}
            className="w-16 h-16 object-cover rounded-2xl border border-gray-100 shadow-sm"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/coca_cola_sin_azu_300ml.png';
            }}
          />

          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
            <span className={`w-2.5 h-2.5 rounded-full ${item.estado ? 'bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]' : 'bg-gray-400'}`}></span>
            <span className="text-[10px] font-extrabold uppercase text-gray-500 tracking-wider">
              {item.estado ? 'Activo' : 'Inactivo'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
            {obtenerNombreCategoria(item.id_categoria)}
          </span>
          <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
            {item.tipo_item}
          </span>
        </div>

        <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-emerald-600 transition-colors pr-8">
          {item.nombre}
        </h3>

        <p className="text-xs text-gray-500 font-medium leading-relaxed mb-4 min-h-[32px]">
          {item.descripción || <span className="italic text-gray-300">Sin descripcion registrada.</span>}
        </p>

        <div className="h-px bg-gray-50 mb-4"></div>

        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Precio</p>
            <p className="text-lg font-black text-emerald-600">${item.precio.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {esServicio ? 'Tipo' : 'Stock'}
            </p>
            <p className={`text-sm font-bold ${!esServicio && stockDisponible === 0 ? 'text-red-500' : 'text-gray-700'}`}>
              {esServicio ? 'Servicio' : `${stockDisponible} unidades`}
            </p>
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-50 my-4"></div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={item.estado}
              onChange={() => onToggleEstado(item.id_item, item.nombre, item.estado)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
          </label>
          <span className="text-[10px] font-bold text-gray-400">Estado</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEditar(item)}
            className="w-9 h-9 rounded-xl border border-gray-100 bg-white hover:bg-emerald-50 hover:text-emerald-600 transition-colors flex items-center justify-center text-gray-500 shadow-sm"
            title="Editar item"
          >
            ✏️
          </button>
          <button
            onClick={() => onEliminar(item)}
            className="w-9 h-9 rounded-xl border border-gray-100 bg-white hover:bg-red-50 hover:text-red-600 transition-colors flex items-center justify-center text-gray-500 shadow-sm"
            title="Eliminar item"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};
