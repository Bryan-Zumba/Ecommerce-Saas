import React from "react";
import { useCarrito } from "@/shared/context/ContextoCarrito";
import { obtenerStockDisponiblePorItem } from "../../application/inventarioItems";
import { Item, obtenerNombreCategoria } from "../../domain/Item";

function TarjetaProducto({ item }: { item: Item }) {
  const { agregarAlCarrito } = useCarrito();
  const esServicio = item.tipo_item === "Servicio";
  const stockDisponible = esServicio ? null : obtenerStockDisponiblePorItem(item.id_item);
  const estaDisponible = item.estado && (esServicio || (stockDisponible ?? 0) > 0);

  const handleAgregar = () => {
    if (!estaDisponible) return;

    agregarAlCarrito({
      id: item.id_item,
      id_item: item.id_item,
      nombre: item.nombre,
      precio: item.precio,
      stock: stockDisponible,
      categoria: obtenerNombreCategoria(item.id_categoria),
      tipo_item: item.tipo_item,
      imagen: item.imagen || "/assets/coca_cola_sin_azu_300ml.png",
    });
  };

  return (
    <div
      onClick={handleAgregar}
      className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 transition-all duration-200 flex flex-col justify-between text-left h-full ${
        estaDisponible
          ? "cursor-pointer hover:shadow-md hover:scale-[1.01] active:scale-[0.98]"
          : "opacity-60 cursor-not-allowed"
      }`}
    >
      <div>
        <div className="flex items-center gap-2 self-start mb-2">
          <span className="bg-emerald-50 text-emerald-700 font-semibold text-[10px] px-2 py-0.5 rounded-full">
            {obtenerNombreCategoria(item.id_categoria)}
          </span>
          <span className="bg-gray-100 text-gray-600 font-semibold text-[10px] px-2 py-0.5 rounded-full">
            {item.tipo_item}
          </span>
        </div>

        <img
          src={item.imagen || "/assets/coca_cola_sin_azu_300ml.png"}
          alt={item.nombre}
          className="w-full h-40 object-cover rounded-xl mb-4"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/assets/coca_cola_sin_azu_300ml.png";
          }}
        />

        <div>
          <h3 className="text-base font-bold text-gray-800 mb-1 leading-snug">{item.nombre}</h3>
          <p className="font-bold text-emerald-600 text-sm">
            <span>$</span>
            <span>{item.precio.toFixed(2)}</span>
          </p>
        </div>
      </div>

      <div className="mt-3 border-t border-gray-50 pt-2 flex justify-between items-center text-xs">
        {esServicio ? (
          <span className="text-emerald-600 font-semibold">Servicio disponible</span>
        ) : (
          <>
            <span className="text-gray-400 font-semibold">Stock disponible:</span>
            <span className={`font-black font-mono ${(stockDisponible ?? 0) === 0 ? 'text-rose-500' : 'text-gray-800'}`}>
              {(stockDisponible ?? 0) === 0 ? '0 u (Agotado)' : `${stockDisponible} u`}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

export default TarjetaProducto;
