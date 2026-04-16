import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Success() {
  const navigate = useNavigate();
  const { cart, total, subtotal, iva, clearCart } = useCart();
  
  // Guardamos una copia local de los datos antes de limpiar el carrito (opcional)
  // En una app real, traeríamos esto de una base de datos o estado global
  const [orderId] = useState(() => Math.floor(100000 + Math.random() * 900000));
  const [date] = useState(new Date().toLocaleString());

  // Al presionar "Nueva Venta", limpiamos y volvemos al inicio
  const handleNuevaVenta = () => {
    clearCart();
    navigate("/");
  };

  const handleImprimir = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      
      {/* MENSAJE DE ÉXITO (Oculto al imprimir) */}
      <div className="print:hidden w-full max-w-md text-center mb-8">
        <div className="bg-emerald-100 text-emerald-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-sm">
          ✓
        </div>
        <h1 className="text-3xl font-black text-gray-800 mb-2">¡Venta Confirmada!</h1>
        <p className="text-gray-500">La orden ha sido registrada correctamente en el sistema.</p>
      </div>

      {/* TICKET DE VENTA (Lo que se imprime) */}
      <div className="bg-white w-full max-w-[400px] shadow-2xl p-8 border border-gray-200 printable-ticket relative overflow-hidden">
        
        {/* Decoración superior estética */}
        <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 print:hidden" />

        {/* Encabezado del Ticket */}
        <div className="text-center border-b-2 border-dashed border-gray-100 pb-6 mb-6">
          <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter mb-1">Comprobante Interno</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">Ecommerce SaaS Solution</p>
          <div className="mt-4 flex justify-between text-[11px] font-mono text-gray-600">
            <span>ORDEN: #{orderId}</span>
            <span>{date}</span>
          </div>
        </div>

        {/* Detalle de Productos */}
        <div className="space-y-4 mb-8">
          <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase border-b border-gray-50 pb-2">
            <span>Producto / Cant.</span>
            <span>Total</span>
          </div>
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between items-start text-sm">
              <div className="text-left font-medium text-gray-700 leading-tight">
                <p>{item.nombre}</p>
                <p className="text-[11px] text-gray-400">{item.quantity} x ${item.precio.toFixed(2)}</p>
              </div>
              <span className="font-bold text-gray-900">${(item.precio * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* Desglose de Totales */}
        <div className="border-t-2 border-dashed border-gray-100 pt-6 space-y-2">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Subtotal (85%)</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>IVA (15%)</span>
            <span>${iva.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xl font-black text-gray-900 pt-2">
            <span>TOTAL</span>
            <span className="text-emerald-600">${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Pie del Ticket */}
        <div className="mt-10 pt-6 border-t border-gray-50 text-center">
          <p className="text-[10px] text-gray-400 font-medium mb-1 italic">"Gracias por preferir nuestro sistema"</p>
          <div className="w-full bg-gray-100 h-12 flex items-center justify-center rounded-lg mt-4 opacity-30 select-none font-mono text-[8px] overflow-hidden grayscale">
            || | ||| | || |||| | || | ||| | || |||| | || | ||| | || ||||
          </div>
        </div>
      </div>

      {/* ACCIONES (Oculto al imprimir) */}
      <div className="print:hidden mt-8 flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <button 
          onClick={handleImprimir}
          className="flex-1 bg-gray-800 hover:bg-black text-white py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
        >
          🖨️ Imprimir Ticket
        </button>
        <button 
          onClick={handleNuevaVenta}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95 shadow-emerald-200"
        >
          + Nueva Venta
        </button>
      </div>

    </div>
  );
}

export default Success;
