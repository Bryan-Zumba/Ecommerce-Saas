import CartItem from "./CartItem";
import CartTotal from "./CartTotal";
import { useCart } from "../../context/CartContext";

function Cart() {
  const { cart, subtotal, iva, total } = useCart();

  return (
    <div className="h-full overflow-y-auto p-4 bg-white flex flex-col gap-6">
      {/* Encabezado compacto */}
      <h2 className="text-lg font-bold text-gray-800 flex items-center justify-between shrink-0">
        Carrito
        {cart.length > 0 && (
          <span className="bg-emerald-500 text-white text-[9px] px-1.5 py-0.5 rounded-full">
            {cart.reduce((acc, item) => acc + item.quantity, 0)} items
          </span>
        )}
      </h2>

      {/* Listado de Productos - Ahora fluye naturalmente */}
      <div className="space-y-4">
        {cart.length > 0 ? (
          cart.map((item) => (
            <CartItem key={item.id} item={item} />
          ))
        ) : (
          <div className="py-10 flex flex-col items-center justify-center text-gray-400 opacity-50">
            <span className="text-4xl mb-2">🛒</span>
            <p className="text-sm">Carrito vacío</p>
          </div>
        )}
      </div>

      {/* Totales - Ahora al final de la lista, sin empujar a nadie */}
      <CartTotal subtotal={subtotal} iva={iva} total={total} />
    </div>
  );
}

export default Cart;