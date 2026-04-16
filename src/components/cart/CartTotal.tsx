type CartTotalProps = {
  subtotal: number;
  iva: number;
  total: number;
};

function CartTotal({ subtotal, iva, total }: CartTotalProps) {
  return (
    <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 mt-2 shadow-sm">
      <div className="space-y-1 mb-2">
        <div className="flex justify-between text-[10px] text-emerald-800">
          <span>Base 85%</span>
          <span className="font-semibold">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-[10px] text-emerald-800">
          <span>IVA 15%</span>
          <span className="font-semibold">${iva.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="flex justify-between font-bold text-sm text-gray-900 border-t border-emerald-200 pt-2">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>

      <button 
        className="mt-3 w-full bg-emerald-600 text-white py-2 rounded-lg font-bold hover:bg-emerald-700 transition-colors shadow-md active:scale-[0.98] text-[13px]"
        onClick={() => alert("¡Gracias por su compra!")}
      >
        Pagar Ahora
      </button>
    </div>
  );
}

export default CartTotal;