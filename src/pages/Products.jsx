/**
 * Componente Principal: Products
 * Maneja la estructura global de la sección de productos.
 */
import ProductCard from "../components/products/ProductCard";
import { productsData } from "../data/products";

function Products() {
  // Datos de prueba con la estructura List<Map<String, Object>> que prefieres
  // const listData = [
  //   { id: 1, nombre: "Coca Cola", precio: 1.50, stock: 10, categoria: "Bebidas" , imagen: "https://static.vecteezy.com/system/resources/previews/054/314/897/non_2x/bottles-and-can-coca-cola-free-png.png"},
  //   { id: 2, nombre: "Hambuguesa Yogurt", precio: 3.50, stock: 5, categoria: "Comida" },
  //   { id: 3, nombre: "Papas Fritas", precio: 1.25, stock: 20, categoria: "Snacks" }
  // ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Encabezado con Jerarquía Visual */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            Gestión de Productos
          </h1>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-md active:scale-95">
            + Agregar Producto
          </button>
        </div>

        {/* Buscador Optimizado */}
        <div className="mb-10">
          <div className="relative max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              🔍
            </span>
            <input 
              type="search" 
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-sm"
              placeholder="Buscar producto por nombre..."
              aria-label="Buscar producto"
            />
          </div>
        </div>

        {/* Grid de Cards: Se ajusta automáticamente al contenido */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {productsData.length > 0 ? (
            productsData.map((item) => (
              <ProductCard key={item.id} data={item} />
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center py-10">
              No se encontraron productos disponibles.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Sub-componente: ProductCard
 * Responsabilidad Única: Renderizar la información de un producto individual.
 */
// function ProductCard({ data }) {
//   // Lógica simple para color de stock (Psicología del color)
//   const stockColor = data.stock < 10 ? 'text-orange-500 font-bold' : 'text-gray-900';

//   return (
//     <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300 flex flex-col justify-between">
//       <div>
//         <img 
//           src={data.imagen} 
//           alt={data.nombre}
//           className="w-full h-40 object-cover rounded-xl mb-4"
//         />
//         {/* Badge de Categoría */}
//         <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 mb-4">
//           {data.categoria}
//         </span>
        
//         <h3 className="text-xl font-bold text-gray-900 mb-2">{data.nombre}</h3>
        
//         {/* Detalles del Producto */}
//         <div className="space-y-1 text-sm text-gray-600">
//           <p className="flex justify-between border-b border-gray-50 pb-1">
//             <span>Precio:</span>
//             <span className="font-bold text-gray-900">${data.precio.toFixed(2)}</span>
//           </p>
//           <p className="flex justify-between pt-1">
//             <span>Stock:</span>
//             <span className={`font-medium ${stockColor}`}>
//               {data.stock} unidades
//             </span>
//           </p>
//         </div>
//       </div>
      
      {/* Microinteracciones en Botones de Acción */}
      {/* <div className="mt-6 pt-4 border-t border-gray-50 flex gap-3">
        <button 
          className="flex-1 text-sm font-semibold text-blue-600 hover:bg-blue-50 py-2 rounded-lg transition-colors border border-transparent hover:border-blue-100"
          onClick={() => console.log("Editando:", data.id)}
        >
          Editar
        </button>
        <button 
          className="flex-1 text-sm font-semibold text-red-600 hover:bg-red-50 py-2 rounded-lg transition-colors border border-transparent hover:border-red-100"
          onClick={() => console.log("Eliminando:", data.id)}
        >
          Eliminar
        </button>
      </div> }
    </div>
  );*/
}

export default Products;