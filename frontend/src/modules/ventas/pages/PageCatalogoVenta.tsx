import React, { useMemo, useState } from 'react';
import { useCatalogoVenta } from '../hooks/useCatalogoVenta';
import TarjetaItemCatalogo from '../components/TarjetaItemCatalogo';
import PanelOrden from '../components/PanelOrden';
import { useOrdenVenta } from '@/modules/ventas/hooks/useOrdenVenta';

export const PageCatalogoVenta: React.FC = () => {
  const { catalogo, loading, error } = useCatalogoVenta();
  const { orden, limpiarOrden } = useOrdenVenta();
  const hayItemsEnCarrito = orden.length > 0;
  const cantidadCarrito = orden.reduce((acc, item) => acc + item.quantity, 0);
  const [estaCarritoAbierto, setEstaCarritoAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [ordenamiento, setOrdenamiento] = useState<'nombre-asc' | 'nombre-desc' | 'precio-asc' | 'precio-desc'>('nombre-asc');

  const catalogoFiltrado = useMemo(() => {
    let result = catalogo;

    if (busqueda.trim()) {
      const query = busqueda.toLowerCase();
      result = catalogo.filter(
        (inv) =>
          inv.item.nombre.toLowerCase().includes(query) ||
          inv.item.tipo_item.toLowerCase().includes(query) ||
          (inv.item.categoria?.nombre || '').toLowerCase().includes(query)
      );
    }

    return [...result].sort((a, b) => {
      if (ordenamiento === 'nombre-asc') return a.item.nombre.localeCompare(b.item.nombre);
      if (ordenamiento === 'nombre-desc') return b.item.nombre.localeCompare(a.item.nombre);
      if (ordenamiento === 'precio-asc') return Number(a.item.precio) - Number(b.item.precio);
      if (ordenamiento === 'precio-desc') return Number(b.item.precio) - Number(a.item.precio);
      return 0;
    });
  }, [catalogo, busqueda, ordenamiento]);

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-x-hidden relative">
      <div className="flex-1 p-6 w-full">
        <div className="max-w-7xl mx-auto">
          {/* Encabezado */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 text-left">
            <div>
              <h1 className="text-3xl font-black text-gray-800 tracking-tight">Catálogo de Ventas</h1>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">
                Productos y servicios disponibles
              </p>
            </div>
            {/* Botón Carrito Escritorio */}
            <button
              id="btn-carrito-escritorio"
              onClick={() => setEstaCarritoAbierto(true)}
              className="hidden lg:flex items-center gap-3 bg-white border border-gray-200 px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
            >
              <div className="relative flex items-center justify-center">
                <span className="text-xl">🛒</span>
                {hayItemsEnCarrito && (
                  <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                    {cantidadCarrito}
                  </span>
                )}
              </div>
              <span className="font-bold text-gray-700 text-sm">Ver Orden Actual</span>
            </button>
          </div>

          {/* Buscador y ordenamiento */}
          <div className="mb-10 flex flex-col sm:flex-row gap-4 items-start sm:items-center text-left">
            <div className="relative flex-1 max-w-md w-full">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">🔍</span>
              <input
                type="search"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-100 rounded-2xl bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm text-sm"
                placeholder="Buscar item por nombre, tipo o categoría..."
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Ordenar:</label>
              <select
                value={ordenamiento}
                onChange={(e) => setOrdenamiento(e.target.value as typeof ordenamiento)}
                className="bg-white border border-gray-100 rounded-xl py-2.5 px-3 text-xs font-bold text-gray-750 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm cursor-pointer"
              >
                <option value="nombre-asc">Nombre (A-Z)</option>
                <option value="nombre-desc">Nombre (Z-A)</option>
                <option value="precio-asc">Precio (Menor a Mayor)</option>
                <option value="precio-desc">Precio (Mayor a Menor)</option>
              </select>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl font-medium text-left">
              {error}
            </div>
          )}

          {/* Estados: loading, vacío, con resultados */}
          {loading ? (
            <div className="bg-white rounded-[2.5rem] p-12 text-center border border-gray-100 shadow-sm">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500 mb-2"></div>
              <p className="text-gray-400 text-sm font-medium">Cargando catálogo...</p>
            </div>
          ) : catalogoFiltrado.length === 0 ? (
            <div className="bg-white rounded-[2.5rem] p-12 text-center border border-gray-100 shadow-sm">
              <div className="text-5xl mb-4">📭</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No hay items disponibles</h3>
              <p className="text-gray-400 max-w-sm mx-auto text-sm font-medium">
                Prueba buscando otro item o vuelve más tarde.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {catalogoFiltrado.map((itemCatalogo) => (
                <TarjetaItemCatalogo key={itemCatalogo.id_inventario} itemCatalogo={itemCatalogo} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Botón flotante del carrito (solo móvil) */}
      <button
        id="btn-carrito-movil"
        onClick={() => setEstaCarritoAbierto(true)}
        className="lg:hidden fixed bottom-6 right-6 bg-emerald-600 text-white px-5 py-3 rounded-full shadow-2xl z-40 flex items-center gap-3 transition-transform active:scale-90 hover:bg-emerald-700 cursor-pointer"
      >
        <div className="relative">
          <span className="text-xl">🛒</span>
          {hayItemsEnCarrito && (
            <span className="absolute -top-3 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
              {cantidadCarrito}
            </span>
          )}
        </div>
        <span className="font-bold text-sm">Orden</span>
      </button>

      {/* Overlay global (Móvil y Desktop) */}
      {estaCarritoAbierto && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300"
          onClick={() => setEstaCarritoAbierto(false)}
        />
      )}

      {/* Barra lateral del carrito tipo Drawer (Móvil y Desktop) */}
      <aside
        className={`
          fixed top-0 right-0 h-screen bg-white shadow-2xl z-50 transition-transform duration-300 ease-in-out
          w-[85%] sm:w-96 flex flex-col
          ${estaCarritoAbierto ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header del Drawer */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-black text-gray-800 flex items-center gap-2 tracking-tight">
              🛒 Orden
              {hayItemsEnCarrito && (
                <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {cantidadCarrito}
                </span>
              )}
            </h2>
          </div>
          <button 
            onClick={() => setEstaCarritoAbierto(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-500 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>
        
        {/* Contenido del Carrito */}
        <div className="flex-1 overflow-hidden">
          <PanelOrden />
        </div>
      </aside>
    </div>
  );
};
