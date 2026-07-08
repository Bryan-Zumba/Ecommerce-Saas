import { useNavigate } from "react-router-dom";
import { useOrdenVenta } from "@/modules/ventas/hooks/useOrdenVenta";
import Swal from 'sweetalert2';

interface TotalOrdenProps {
  subtotal: number;
  iva: number;
  total: number;
}

/**
 * TotalOrden - Muestra el desglose de subtotal, IVA y total.
 */
function TotalOrden({ subtotal, iva, total }: TotalOrdenProps) {
    const navigate = useNavigate();
    const { limpiarOrden } = useOrdenVenta();
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

        <div className="mt-3 flex gap-2">
          <button 
            className="flex-1 bg-rose-50 text-rose-600 py-2 rounded-lg font-bold hover:bg-rose-100 transition-colors shadow-sm active:scale-[0.98] text-[13px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => {
              Swal.fire({
                title: '¿Vaciar carrito?',
                text: "Se eliminarán todos los productos.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#10b981',
                cancelButtonColor: '#ef4444',
                confirmButtonText: 'Sí, vaciar',
                cancelButtonText: 'Cancelar'
              }).then((result) => {
                if (result.isConfirmed) {
                  limpiarOrden();
                }
              });
            }}
            disabled={total === 0}
          >
            Vaciar
          </button>
          <button 
            className="flex-[2] bg-emerald-600 text-white py-2 rounded-lg font-bold hover:bg-emerald-700 transition-colors shadow-md active:scale-[0.98] text-[13px] cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed" 
            onClick={() => {
              Swal.fire({
                title: '¿Ir a la caja?',
                text: `Vas a procesar el cobro por un total de $${total.toFixed(2)}`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#10b981',
                cancelButtonColor: '#ef4444',
                confirmButtonText: 'Sí, ir a cobrar',
                cancelButtonText: 'Cancelar'
              }).then((result) => {
                if (result.isConfirmed) {
                  navigate("/ventas/generar-orden");
                }
              });
            }}
            disabled={total === 0}
          >
            Confirmar Orden
          </button>
        </div>
      </div>
    );
}

export default TotalOrden;
