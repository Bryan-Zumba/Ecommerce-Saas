import CartItem from "./CartItem";
import CartTotal from "./CartTotal";
import { productsData } from "../../data/products";

function Cart() {
  const productos = productsData; 
  const subtotal = productos.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  return (
    <div className="bg-gray-50 p-0.5 rounded-3xl shadow-md sticky top-4  h-[90vh] flex flex-col ">
      <h2 className="text-xl font-bold mb-4 text-center">Carrito</h2>
      
      <div className="flex-1  overflow-y-auto space-y-4">
        {productos.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>

      <CartTotal subtotal={subtotal} />
    </div>
  );
}

export default Cart;