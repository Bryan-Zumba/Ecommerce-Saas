import { useOrdenVenta, ItemOrdenType } from "@/modules/ventas/hooks/useOrdenVenta";

interface ItemCarritoProps {
  item: ItemOrdenType;
}

/**
 * ItemCarrito - Muestra un producto individual dentro de la orden.
 */
function ItemCarrito({ item }: ItemCarritoProps) {
    const { actualizarCantidadItem, eliminarItem } = useOrdenVenta();
    return (
      <div className="flex items-center gap-2 bg-white p-2.5 rounded-2xl shadow-sm border border-gray-100">
        <div className="w-12 h-12 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex items-center justify-center text-xl">
          {item.imagen && item.imagen.trim() !== '' ? (
             <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover" />
          ) : (
             <span title={item.nombre}>{item.nombre.charAt(0).toUpperCase()}</span>
          )}
        </div>
        
        <div className="flex-1 min-w-0 py-0.5 text-left">
          <h4 className="font-bold text-gray-800 text-sm leading-tight break-words pr-2">
            {item.nombre}
          </h4>
          <p className="text-emerald-600 font-bold text-sm mt-1">
            ${(item.precio * item.quantity).toFixed(2)}
          </p>
          
          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex items-center bg-gray-50 rounded-lg p-0.5 border border-gray-100">
              <button onClick={() => actualizarCantidadItem(item.id, -1)} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-200 text-gray-600 transition-colors font-bold text-sm cursor-pointer">
                -
              </button>
              <span className="w-8 text-center text-xs font-black text-gray-700">
                {item.quantity}
              </span>
              <button onClick={() => actualizarCantidadItem(item.id, 1)} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-200 text-gray-600 transition-colors font-bold text-sm cursor-pointer">
                +
              </button>
            </div>
          </div>
        </div>

        <button onClick={() => eliminarItem(item.id)} className="p-1.5 text-gray-300 hover:text-red-500 transition-colors flex-shrink-0 cursor-pointer" aria-label="Eliminar">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18"></path>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    );
}

export default ItemCarrito;
