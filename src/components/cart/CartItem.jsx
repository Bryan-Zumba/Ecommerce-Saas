import { useCart } from "../../context/CartContext";
function CartItem({ item }) {
    const { updateQuantity, removeFromCart } = useCart();
    return (<div className="flex items-center gap-2 bg-white p-2.5 rounded-2xl shadow-sm border border-gray-100">
      <img src={item.imagen} alt={item.nombre} className="w-12 h-12 object-cover rounded-lg flex-shrink-0"/>
      
      <div className="flex-1 min-w-0 py-0.5">
        <h4 className="font-bold text-gray-800 text-[13px] leading-tight break-words pr-2">
          {item.nombre}
        </h4>
        <p className="text-emerald-600 font-bold text-xs mt-1">
          ${(item.precio * item.quantity).toFixed(2)}
        </p>
        
        <div className="flex items-center gap-2 mt-1.5">
          <div className="flex items-center bg-gray-50 rounded-lg p-0.5 border border-gray-100">
            <button onClick={() => updateQuantity(item.id, -1)} className="w-5 h-5 flex items-center justify-center rounded-md hover:bg-gray-200 text-gray-600 transition-colors font-bold text-xs">
              -
            </button>
            <span className="w-6 text-center text-[10px] font-black text-gray-700">
              {item.quantity}
            </span>
            <button onClick={() => updateQuantity(item.id, 1)} className="w-5 h-5 flex items-center justify-center rounded-md hover:bg-gray-200 text-gray-600 transition-colors font-bold text-xs">
              +
            </button>
          </div>
        </div>
      </div>

      <button onClick={() => removeFromCart(item.id)} className="p-1.5 text-gray-300 hover:text-red-500 transition-colors flex-shrink-0" aria-label="Eliminar">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6h18"></path>
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
        </svg>
      </button>
    </div>);
}
export default CartItem;
