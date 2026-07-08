import React from 'react';

interface Operacion {
  tipo: string;
  ordenId: string;
  fechaRegistro: string;
  cajero?: string;
  cliente?: { nombre: string; dni: string };
  datosFactura?: { codigo: string };
  productos: Array<{ nombre: string; quantity?: number; cantidad?: number; precio?: number; costoUnitario?: number }>;
  subtotal: number;
  iva: number;
  total: number;
  estado?: string;
}

interface ModalDetalleOperacionProps {
  operacion: Operacion | null;
  onClose: () => void;
}

/**
 * Modal premium para visualizar el detalle de cualquier operación (Venta o Stock)
 */
function ModalDetalleOperacion({ operacion, onClose }: ModalDetalleOperacionProps) {
  if (!operacion) return null;

  const esVenta = operacion.tipo === 'venta';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        
        {/* Encabezado Dinámico */}
        <div className={`p-6 text-white flex justify-between items-center ${esVenta ? 'bg-emerald-600 shadow-lg shadow-emerald-100' : 'bg-blue-600 shadow-lg shadow-blue-100'}`}>
          <div className="text-left">
            <h2 className="text-xl font-black uppercase tracking-tight">Detalle de {esVenta ? 'Venta' : 'Solicitud de Stock'}</h2>
            <p className="text-xs opacity-80 font-mono">Orden: #{operacion.ordenId}</p>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/20 transition-all active:scale-90 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Contenido del Detalle */}
        <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          
          {/* Información General */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-left">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Fecha de Registro</p>
              <p className="text-sm font-bold text-gray-800">{new Date(operacion.fechaRegistro).toLocaleString()}</p>
              
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-3 mb-1">Cajero Encargado</p>
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-tighter">{operacion.cajero || "No asignado"}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-left">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                {esVenta ? 'Cliente' : 'Referencia Factura'}
              </p>
              <p className="text-sm font-bold text-gray-800">
                {esVenta ? operacion.cliente?.nombre : operacion.datosFactura?.codigo}
              </p>
              {esVenta && <p className="text-[11px] text-gray-500 font-mono">{operacion.cliente?.dni}</p>}
            </div>
          </div>

          {/* Tabla de Productos */}
          <div className="mb-8">
            <h3 className="text-sm font-black text-gray-800 mb-4 flex items-center gap-2 uppercase tracking-wider">
              <span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-base">📦</span> 
              Artículos / Items
            </h3>
            <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-400 font-black text-[10px] uppercase tracking-widest border-b border-gray-100">
                  <tr>
                    <th className="px-5 py-4">Descripción</th>
                    <th className="px-5 py-4 text-center">Cant.</th>
                    <th className="px-5 py-4 text-right">Unitario</th>
                    <th className="px-5 py-4 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {operacion.productos.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4 font-bold text-gray-700">{item.nombre}</td>
                      <td className="px-5 py-4 text-center font-mono text-gray-600">{item.quantity || item.cantidad || 0}</td>
                      <td className="px-5 py-4 text-right font-mono text-gray-600">${(item.precio || item.costoUnitario || 0).toFixed(2)}</td>
                      <td className="px-5 py-4 text-right font-black text-gray-800 font-mono">
                        ${((item.precio || item.costoUnitario || 0) * (item.quantity || item.cantidad || 0)).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Resumen Financiero o Estado */}
          {esVenta ? (
            <div className="bg-gray-50 p-6 rounded-3xl space-y-3 border border-gray-100">
              <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                <span>Subtotal (85%)</span>
                <span className="font-mono text-gray-600">${operacion.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                <span>Impuesto IVA (15%)</span>
                <span className="font-mono text-gray-600">${operacion.iva.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-black text-gray-900 pt-3 border-t border-dashed border-gray-200">
                <span>TOTAL PAGADO</span>
                <span className="text-emerald-600 font-mono">${operacion.total.toFixed(2)}</span>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex items-center justify-between">
              <div className="text-left">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Estado de Reposición</p>
                <p className="text-base font-bold text-blue-800">Enviado al Supervisor</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="bg-blue-600 text-white text-[11px] font-black px-4 py-1.5 rounded-xl uppercase tracking-widest shadow-md shadow-blue-200">
                  {operacion.estado}
                </span>
                <p className="text-[10px] text-blue-400 font-bold italic">Esperando aprobación</p>
              </div>
            </div>
          )}
        </div>

        {/* Botón de Acción de Cierre */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button 
            onClick={onClose} 
            className="px-10 py-3.5 bg-gray-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-xl shadow-gray-200"
          >
            Cerrar Detalle
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalDetalleOperacion;
