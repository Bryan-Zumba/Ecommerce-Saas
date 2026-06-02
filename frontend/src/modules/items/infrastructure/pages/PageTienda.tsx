import React, { useState, useMemo } from 'react';
import { useProductos } from '../../application/useProductos';
import { LocalstorageProductoRepository } from '../repositories/LocalstorageProductoRepository';
import TarjetaProducto from '../components/TarjetaProducto';
import Carrito from '@/modules/ventas/infrastructure/components/Carrito';
import { useCarrito } from '@/shared/context/ContextoCarrito';
import { obtenerNombreCategoria } from '../../domain/Producto';

const repository = new LocalstorageProductoRepository();

export const PageTienda: React.FC = () => {
  const { productos, cargando, error } = useProductos(repository);
  const { carrito } = useCarrito();
  const hayProductosEnCarrito = carrito.length > 0;
  const [estaCarritoAbierto, setEstaCarritoAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  // Filtrar solo productos activos y buscar por nombre
  const productosActivos = useMemo(() => {
    return productos.filter(p => p.estado);
  }, [productos]);

  const productosFiltrados = useMemo(() => {
    if (!busqueda.trim()) return productosActivos;
    const query = busqueda.toLowerCase();
    return productosActivos.filter(
      (p) =>
        p.nombre.toLowerCase().includes(query) ||
        obtenerNombreCategoria(p.id_categoria).toLowerCase().includes(query)
    );
  }, [productosActivos, busqueda]);

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-x-hidden relative">
      
      {/* AREA DE PRODUCTOS */}
      <div className={`flex-1 p-6 transition-all duration-300 ${hayProductosEnCarrito ? 'lg:pr-96' : ''}`}>
        <div className="max-w-6xl mx-auto">
          
          {/* Encabezado */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 text-left">
            <div>
              <h1 className="text-3xl font-black text-gray-800 tracking-tight">Tienda de Productos</h1>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">Catálogo de Ventas</p>
            </div>
          </div>

          {/* Buscador */}
          <div className="mb-10 text-left">
            <div className="relative max-w-md">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">🔍</span>
              <input
                type="search"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-100 rounded-2xl bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm text-sm"
                placeholder="Buscar producto por nombre o categoría..."
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl font-medium text-left">
              ⚠️ {error}
            </div>
          )}

          {/* Grid de Productos */}
          {cargando ? (
            <div className="bg-white rounded-[2.5rem] p-12 text-center border border-gray-100 shadow-sm">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500 mb-2"></div>
              <p className="text-gray-400 text-sm font-medium">Cargando catálogo...</p>
            </div>
          ) : productosFiltrados.length === 0 ? (
            <div className="bg-white rounded-[2.5rem] p-12 text-center border border-gray-100 shadow-sm">
              <div className="text-5xl mb-4">📭</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No hay productos disponibles</h3>
              <p className="text-gray-400 max-w-sm mx-auto text-sm font-medium">
                Prueba buscando otro producto o vuelve más tarde.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {productosFiltrados.map((item) => (
                <TarjetaProducto key={item.id_productos} data={item} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* BOTÓN FLOTANTE (Solo móvil) */}
      {hayProductosEnCarrito && !estaCarritoAbierto && (
        <button 
          onClick={() => setEstaCarritoAbierto(true)}
          className="lg:hidden fixed bottom-6 right-6 bg-emerald-600 text-white px-5 py-3 rounded-full shadow-2xl z-40 flex items-center gap-3 transition-transform active:scale-90 hover:bg-emerald-700"
        >
          <div className="relative">
            <span className="text-xl">🛒</span>
            <span className="absolute -top-3 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
              {carrito.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          </div>
          <span className="font-bold text-sm">Carrito</span>
        </button>
      )}

      {/* CAPA DE FONDO (Overlay) */}
      {hayProductosEnCarrito && estaCarritoAbierto && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setEstaCarritoAbierto(false)}
        />
      )}

      {/* BARRA LATERAL DEL CARRITO */}
      {hayProductosEnCarrito && (
      <aside className={`
        fixed top-0 right-0 h-screen bg-white shadow-2xl z-50 transition-transform duration-300 ease-in-out
        w-[85%] sm:w-80 lg:w-96 flex flex-col
        ${estaCarritoAbierto ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        <Carrito />
      </aside>
      )}

    </div>
  );
};
