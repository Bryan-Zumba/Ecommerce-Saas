/**
 * Componente Principal: Products
 * Maneja la estructura global de la sección de productos.
 */
import ProductCard from "../components/products/ProductCard";
import Cart from "../components/cart/Cart"; 

import { productsData } from "../data/products";

function Products() {

  return (
    <div className="max-h-screen bg-gray-50 p-6">
  <div className="max-w-7xl mx-auto flex gap-6">
    
    {/* PRODUCTOS*/}
    <div className="flex-1">
      
      {/* Encabezado */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold">Gestión de Productos</h1>
        <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg">
          + Agregar Producto
        </button>
      </div>

        {/* Buscador Optimizado */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
            🔍
          </span>
          <input 
            type="search"
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
            placeholder="Buscar producto por nombre..."
          />
        </div>
      </div>

      {/* Grid de Cards: Se ajusta automáticamente al contenido */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {productsData.map((item) => (
          <ProductCard key={item.id} data={item} />
        ))}
      </div>
    </div>

    {/* CARRITO - 1/4 */}
    <div className="w-100">
      <Cart />
    </div>

  </div>
</div>
); } export default Products;