import React, { useMemo, useState } from "react";
import { useItems } from "../../application/useItems";
import { LocalstorageItemRepository } from "../repositories/LocalstorageItemRepository";
import TarjetaProducto from "../components/TarjetaProducto";
import PanelOrden from "@/modules/ventas/components/PanelOrden";
import { useOrdenVenta } from "@/modules/ventas/hooks/useOrdenVenta";
import { obtenerNombreCategoria } from "../../domain/Item";

const repository = new LocalstorageItemRepository();

export const PageTienda: React.FC = () => {
  const { items, cargando, error } = useItems(repository);
  const { orden } = useOrdenVenta();
  const hayItemsEnCarrito = orden.length > 0;
  const [estaCarritoAbierto, setEstaCarritoAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [ordenamiento, setOrdenamiento] = useState<'nombre-asc' | 'nombre-desc' | 'precio-asc' | 'precio-desc'>('nombre-asc');

  const itemsActivos = useMemo(() => {
    return items.filter((item) => item.estado);
  }, [items]);

  const itemsFiltrados = useMemo(() => {
    let result = itemsActivos;
    if (busqueda.trim()) {
      const query = busqueda.toLowerCase();
      result = itemsActivos.filter(
        (item) =>
          item.nombre.toLowerCase().includes(query) ||
          item.tipo_item.toLowerCase().includes(query) ||
          obtenerNombreCategoria(item.id_categoria).toLowerCase().includes(query)
      );
    }

    return [...result].sort((a, b) => {
      if (ordenamiento === 'nombre-asc') return a.nombre.localeCompare(b.nombre);
      if (ordenamiento === 'nombre-desc') return b.nombre.localeCompare(a.nombre);
      if (ordenamiento === 'precio-asc') return a.precio - b.precio;
      if (ordenamiento === 'precio-desc') return b.precio - a.precio;
      return 0;
    });
  }, [itemsActivos, busqueda, ordenamiento]);

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-x-hidden relative">
      <div className={`flex-1 p-6 transition-all duration-300 ${hayItemsEnCarrito ? "lg:pr-96" : ""}`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 text-left">
            <div>
              <h1 className="text-3xl font-black text-gray-800 tracking-tight">Tienda de Items</h1>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">
                Productos y servicios disponibles
              </p>
            </div>
          </div>

          <div className="mb-10 flex flex-col sm:flex-row gap-4 items-start sm:items-center text-left">
            <div className="relative flex-1 max-w-md w-full">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">🔍</span>
              <input
                type="search"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-100 rounded-2xl bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm text-sm"
                placeholder="Buscar item por nombre, tipo o categoria..."
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Ordenar:</label>
              <select
                value={ordenamiento}
                onChange={(e) => setOrdenamiento(e.target.value as any)}
                className="bg-white border border-gray-100 rounded-xl py-2.5 px-3 text-xs font-bold text-gray-750 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm cursor-pointer"
              >
                <option value="nombre-asc">Nombre (A-Z)</option>
                <option value="nombre-desc">Nombre (Z-A)</option>
                <option value="precio-asc">Precio (Menor a Mayor)</option>
                <option value="precio-desc">Precio (Mayor a Menor)</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl font-medium text-left">
              {error}
            </div>
          )}

          {cargando ? (
            <div className="bg-white rounded-[2.5rem] p-12 text-center border border-gray-100 shadow-sm">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500 mb-2"></div>
              <p className="text-gray-400 text-sm font-medium">Cargando catalogo...</p>
            </div>
          ) : itemsFiltrados.length === 0 ? (
            <div className="bg-white rounded-[2.5rem] p-12 text-center border border-gray-100 shadow-sm">
              <div className="text-5xl mb-4">📭</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No hay items disponibles</h3>
              <p className="text-gray-400 max-w-sm mx-auto text-sm font-medium">
                Prueba buscando otro item o vuelve mas tarde.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {itemsFiltrados.map((item) => (
                <TarjetaProducto key={item.id_item} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>

      {hayItemsEnCarrito && !estaCarritoAbierto && (
        <button
          onClick={() => setEstaCarritoAbierto(true)}
          className="lg:hidden fixed bottom-6 right-6 bg-emerald-600 text-white px-5 py-3 rounded-full shadow-2xl z-40 flex items-center gap-3 transition-transform active:scale-90 hover:bg-emerald-700"
        >
          <div className="relative">
            <span className="text-xl">🛒</span>
            <span className="absolute -top-3 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
              {orden.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          </div>
          <span className="font-bold text-sm">orden</span>
        </button>
      )}

      {hayItemsEnCarrito && estaCarritoAbierto && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setEstaCarritoAbierto(false)}
        />
      )}

      {hayItemsEnCarrito && (
        <aside
          className={`
            fixed top-0 right-0 h-screen bg-white shadow-2xl z-50 transition-transform duration-300 ease-in-out
            w-[85%] sm:w-80 lg:w-96 flex flex-col
            ${estaCarritoAbierto ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
          `}
        >
          <PanelOrden />
        </aside>
      )}
    </div>
  );
};
