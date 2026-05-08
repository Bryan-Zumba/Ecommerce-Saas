import ItemCarrito from "./ItemCarrito";
import TotalCarrito from "./TotalCarrito";
import { useCarrito } from "../../context/ContextoCarrito";

/**
 * Carrito - Panel lateral que muestra los productos seleccionados.
 */
function Carrito() {
    const { carrito, subtotal, iva, total } = useCarrito();
    return (
      <div className="h-full overflow-y-auto p-4 bg-white flex flex-col gap-6">
        <h2 className="text-lg font-bold text-gray-800 flex items-center justify-between shrink-0">
          Carrito
          {carrito.length > 0 && (
            <span className="bg-emerald-500 text-white text-[9px] px-1.5 py-0.5 rounded-full">
              {carrito.reduce((acc, item) => acc + item.quantity, 0)} items
            </span>
          )}
        </h2>

        <div className="space-y-4">
          {carrito.length > 0 ? (
            carrito.map((item) => (<ItemCarrito key={item.id} item={item}/>))
          ) : (
            <div className="py-10 flex flex-col items-center justify-center text-gray-400 opacity-50">
              <span className="text-4xl mb-2">🛒</span>
              <p className="text-sm">Carrito vacío</p>
            </div>
          )}
        </div>

        <TotalCarrito subtotal={subtotal} iva={iva} total={total}/>
      </div>
    );
}

export default Carrito;
