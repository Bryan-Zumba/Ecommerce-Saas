import { useOrdenVenta } from "@/modules/ventas/hooks/useOrdenVenta";
import { obtenerNombreCategoria } from "../../domain/Producto";

/**
 * TarjetaProducto - Muestra la información de un producto individual.
 */
function TarjetaProducto({ data }: { data: any }) {
    const { agregarItem } = useOrdenVenta();

    // Mapeamos el producto de la estructura de base de datos a lo que espera el orden
    const productoParaCarrito = {
        id: data.id_productos,
        nombre: data.nombre,
        precio: data.precio,
        stock: data.stock,
        categoria: obtenerNombreCategoria(data.id_categoria),
        imagen: data.imagen || '/assets/coca_cola_sin_azu_300ml.png',
    };

    return (
      <div 
        onClick={() => agregarItem(productoParaCarrito)} 
        className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:scale-[1.01] active:scale-95 transition-all duration-200 flex flex-col text-left"
      >
        <span className="bg-emerald-50 text-emerald-700 font-semibold text-[10px] px-2 py-0.5 rounded-full self-start mb-2">
          {obtenerNombreCategoria(data.id_categoria)}
        </span>
        
        <img 
          src={data.imagen || '/assets/coca_cola_sin_azu_300ml.png'} 
          alt={data.nombre} 
          className="w-full h-40 object-cover rounded-xl mb-4"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/assets/coca_cola_sin_azu_300ml.png';
          }}
        />
        
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">{data.nombre}</h3>
          <p className="font-bold text-emerald-600">
            <span>$</span>
            <span>{data.precio.toFixed(2)}</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            <span>Stock: </span>
            <span className="font-semibold">{data.stock} unidades</span>
          </p>
        </div>
      </div>
    );
}

export default TarjetaProducto;
