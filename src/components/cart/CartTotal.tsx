type CartTotalProps = {
  subtotal: number;
};

function CartTotal({ subtotal }: CartTotalProps) {
  return (
    <div className="bg-sky-50 p-4 rounded-xl shadow-md mt-4">
      <div className="flex justify-between text-sm mb-2">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between font-bold text-md">
        <span>Total</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-900">
        Pagar
      </button>
    </div>
  );
}

export default CartTotal;