import ItemOrden from "./ItemOrden";
import TotalOrden from "./TotalOrden";
import { useOrdenVenta } from "@/modules/ventas/hooks/useOrdenVenta";

/**
 * PanelOrden - Contenedor interno del Drawer de la orden de venta.
 */
function PanelOrden() {
    const { orden, subtotal, iva, total } = useOrdenVenta();
    
    return (
      <div className="h-full flex flex-col bg-gray-50/50">
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {orden.length > 0 ? (
            orden.map((item) => (<ItemOrden key={item.id} item={item}/>))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60">
              <span className="text-5xl mb-4 grayscale opacity-50">🛒</span>
              <h3 className="font-bold text-gray-500 mb-1">Orden Vacía</h3>
              <p className="text-xs text-center px-4">Agrega productos o servicios desde el catálogo para empezar.</p>
            </div>
          )}
        </div>

        {orden.length > 0 && (
          <div className="p-4 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)] z-10 shrink-0">
            <TotalOrden subtotal={subtotal} iva={iva} total={total}/>
          </div>
        )}
      </div>
    );
}

export default PanelOrden;
