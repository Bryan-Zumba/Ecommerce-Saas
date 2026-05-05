import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/products/ProductCard";
import Cart from "../components/cart/Cart";
import { useCart } from "../context/CartContext";
import { productsData } from "../data/products";

function Products() {
  const { cart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-x-hidden relative">
      
      {/* AREA DE PRODUCTOS */}
      <div className="flex-1 p-6 lg:pr-96 transition-all duration-300">
        <div className="max-w-6xl mx-auto">
          
          {/* Encabezado */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <h1 className="text-3xl font-bold text-gray-800">Gestión de Productos</h1>
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => navigate('/clientes')}
                className="bg-white border border-gray-200 hover:border-emerald-500 text-gray-700 hover:text-emerald-700 px-6 py-2.5 rounded-xl font-medium transition-all shadow-sm active:scale-95"
              >
                👥 Gestionar Clientes
              </button>
              <button 
                onClick={() => navigate('/ingreso-stock')}
                className="bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-800 px-6 py-2.5 rounded-xl font-medium transition-all shadow-sm active:scale-95 flex items-center gap-2"
              >
                📦 Solicitar Ingreso Stock
              </button>
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-md active:scale-95">
                + Agregar Producto
              </button>
            </div>
          </div>

          {/* Buscador */}
          <div className="mb-10">
            <div className="relative max-w-md">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">🔍</span>
              <input
                type="search"
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
                placeholder="Buscar producto por nombre..."
              />
            </div>
          </div>

          {/* Grid de Productos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {productsData.map((item) => (
              <ProductCard key={item.id} data={item} />
            ))}
          </div>
        </div>
      </div>

      {/* BOTÓN FLOTANTE (Solo móvil) */}
      {!isCartOpen && (
        <button 
          onClick={() => setIsCartOpen(true)}
          className="lg:hidden fixed bottom-6 right-6 bg-emerald-600 text-white px-5 py-3 rounded-full shadow-2xl z-40 flex items-center gap-3 transition-transform active:scale-90 hover:bg-emerald-700"
        >
          <div className="relative">
            <span className="text-xl">🛒</span>
            <span className="absolute -top-3 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
              {cart.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          </div>
          <span className="font-bold text-sm">Carrito</span>
        </button>
      )}

      {/* CAPA DE FONDO (Overlay para cerrar en móvil) */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      {/* BARRA LATERAL DEL CARRITO - FIJA A LA DERECHA */}
      <aside className={`
        fixed top-0 right-0 h-screen bg-white shadow-2xl z-50 transition-transform duration-300 ease-in-out
        w-[85%] sm:w-80 lg:w-96 flex flex-col
        ${isCartOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        <Cart />
      </aside>

    </div>
  );
}

export default Products;