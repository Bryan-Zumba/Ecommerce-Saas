import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/shared/context/auth/AuthContext";
import { useOrdenVenta } from "@/modules/ventas/hooks/useOrdenVenta";

/**
 * Página de Éxito (Confirmación de Venta)
 * Muestra el ticket de venta.
 */
const PageVentaExitosa: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Obtener los datos del contexto
    const { orden, total, subtotal, iva, limpiarOrden } = useOrdenVenta();
    
    const auth = useAuth();
    const empresa = auth?.usuario?.empresa;
    
    const [ordenId] = useState(() => Math.floor(100000 + Math.random() * 900000));
    const [fecha] = useState(new Date().toLocaleString());

    const manejarNuevaVenta = () => {
        limpiarOrden();
        navigate("/ventas/catalogo"); // Volver al catálogo
    };

    const manejarImprimir = () => {
        window.print();
    };

    return (
      <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center animate-in fade-in duration-500">
        
        {/* MENSAJE DE ÉXITO (Oculto al imprimir) */}
        <div className="print:hidden w-full max-w-md text-center mb-8">
          <div className="bg-emerald-100 text-emerald-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-sm">
            ✓
          </div>
          <h1 className="text-3xl font-black text-gray-800 mb-2 tracking-tight">¡Venta confirmada!</h1>
          <p className="text-gray-500 font-medium">La orden ha sido registrada correctamente en el sistema.</p>
        </div>

        {/* Estilos específicos para impresión de ticket de 80mm */}
        <style>
          {`
            @media print {
              @page {
                margin: 0;
                size: 80mm auto;
              }
              body {
                background: white;
                margin: 0;
                padding: 0;
              }
              .printable-ticket {
                width: 80mm !important;
                max-width: 80mm !important;
                box-shadow: none !important;
                border: none !important;
                border-radius: 0 !important;
                padding: 5mm !important;
                margin: 0 auto;
              }
            }
          `}
        </style>

        {/* TICKET DE VENTA (Capa impresa) */}
        <div className="bg-white w-full max-w-[400px] shadow-2xl p-8 border border-gray-200 printable-ticket relative overflow-hidden rounded-3xl lg:rounded-none">
          <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 print:hidden"/>

          <div className="text-center border-b-2 border-dashed border-gray-100 pb-6 mb-6">
            {empresa?.logo_url && (
              <img src={empresa.logo_url} alt="Logo Empresa" className="h-16 mx-auto mb-3 object-contain" />
            )}
            <h2 className="text-xl font-black text-gray-900 tracking-tighter mb-1">Comprobante de venta</h2>
            <p className="text-[12px] text-gray-700 font-bold tracking-widest leading-none mb-1">
              {empresa?.nombre || "SaaS Ecommerce Solution"}
            </p>
            {empresa?.ruc && (
              <p className="text-[10px] text-gray-500 font-medium">RUC: {empresa.ruc}</p>
            )}
            {empresa?.direccion && (
              <p className="text-[10px] text-gray-500 font-medium">{empresa.direccion}</p>
            )}
            <div className="mt-4 flex justify-between text-[11px] font-mono text-gray-600">
              <span>Orden: #{ordenId}</span>
              <span>{fecha}</span>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between text-[11px] font-bold text-gray-500 border-b border-gray-50 pb-2">
              <span>Producto / Cant.</span>
              <span>Total</span>
            </div>
            {orden.map((item) => (
              <div key={item.id} className="flex justify-between items-start text-sm">
                <div className="text-left font-medium text-gray-700 leading-tight">
                  <p>{item.nombre}</p>
                  <p className="text-[11px] text-gray-400">{item.quantity} x ${item.precio.toFixed(2)}</p>
                </div>
                <span className="font-bold text-gray-900">${(item.precio * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t-2 border-dashed border-gray-100 pt-6 space-y-2">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Subtotal (85%)</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-550">
              <span>IVA (15%)</span>
              <span>${iva.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-l font-black text-gray-900 pt-2">
              <span>Total a pagar</span>
              <span className="text-emerald-600">${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-50 text-center">
            <p className="text-[10px] text-gray-400 font-medium mb-1 italic">"Gracias por preferir nuestro sistema"</p>
            <div className="w-full bg-gray-100 h-12 flex items-center justify-center rounded-lg mt-4 opacity-30 select-none font-mono text-[8px] overflow-hidden grayscale">
              || | ||| | || |||| | || | ||| | || |||| | || | ||| | || ||||
            </div>
          </div>
        </div>

        {/* ACCIONES */}
        <div className="print:hidden mt-8 flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <button onClick={manejarImprimir} className="flex-1 bg-gray-800 hover:bg-black text-white py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
             Imprimir ticket
          </button>
          <button onClick={manejarNuevaVenta} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95 shadow-emerald-200">
            + Nueva venta
          </button>
        </div>
      </div>
    );
}

export default PageVentaExitosa;
