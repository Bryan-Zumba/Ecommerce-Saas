import React, { useState } from 'react';
import { Operacion } from '@/modules/ventas/infrastructure/repositories/servicioHistorial';

interface ModalDetalleSolicitudStockProps {
  operacion: Operacion;
  onClose: () => void;
  onAprobar: (idInterno: number) => void;
  onRechazar: (idInterno: number, motivo: string) => void;
}

const ModalDetalleSolicitudStock: React.FC<ModalDetalleSolicitudStockProps> = ({
  operacion,
  onClose,
  onAprobar,
  onRechazar
}) => {
  const [rechazando, setRechazando] = useState(false);
  const [motivo, setMotivo] = useState('');
  const [imagenAmpliada, setImagenAmpliada] = useState(false);

  const handleRechazar = () => {
    if (!motivo.trim()) {
      alert("Por favor ingrese un motivo de rechazo");
      return;
    }
    onRechazar(operacion.idInterno!, motivo);
  };

  const calcularTotal = () => {
    if (operacion.productos && operacion.productos.length > 0) {
      return operacion.productos.reduce((acc, p) => acc + (p.cantidad * p.costoUnitario), 0);
    }
    return 0;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">
            Detalle de Solicitud: {operacion.ordenId}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Factura Info */}
          <div className="bg-gray-50 p-4 rounded-xl mb-6">
            <h3 className="font-semibold text-gray-700 mb-3 border-b pb-2">Datos de Factura</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Código Factura</p>
                <p className="font-medium">{operacion.datosFactura?.codigo || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-500">Fecha Factura</p>
                <p className="font-medium">{operacion.datosFactura?.fecha || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-500">Total Factura</p>
                <p className="font-medium">${operacion.datosFactura?.total || '0.00'}</p>
              </div>
              <div>
                <p className="text-gray-500">Bodega Destino</p>
                <p className="font-medium">{operacion.bodegaId}</p>
              </div>
            </div>
            
            {/* Imagen Adjunta */}
            {operacion.datosFactura?.imagenAdjunta && (
              <div className="mt-4 border-t pt-4">
                <p className="text-gray-500 text-sm mb-2">Imagen Adjunta de Factura</p>
                <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl overflow-hidden border">
                    <img src={operacion.datosFactura.imagenAdjunta} alt="thumb" className="w-full h-full object-cover blur-[1px]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">Factura adjunta</p>
                    <p className="text-xs text-gray-400">Click para visualizar</p>
                  </div>
                  <button 
                    onClick={() => setImagenAmpliada(true)}
                    className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors"
                  >
                    Ver Imagen
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Productos Info */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-3 border-b pb-2">Productos a Ingresar</h3>
            <div className="overflow-x-auto rounded-lg border">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Producto ID</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Costo Unit.</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {operacion.productos?.map((p: any, index: number) => (
                    <tr key={index}>
                      <td className="px-4 py-2 text-sm text-gray-900">{p.productoId}</td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-right">{p.cantidad}</td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-right">${Number(p.costoUnitario).toFixed(2)}</td>
                      <td className="px-4 py-2 text-sm font-medium text-gray-900 text-right">
                        ${(p.cantidad * p.costoUnitario).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  {(!operacion.productos || operacion.productos.length === 0) && (
                    <tr>
                      <td colSpan={4} className="px-4 py-4 text-center text-sm text-gray-500">No hay productos registrados</td>
                    </tr>
                  )}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <th colSpan={3} className="px-4 py-3 text-right font-bold text-gray-700">Total Calculado:</th>
                    <th className="px-4 py-3 text-right font-bold text-emerald-600 text-lg">
                      ${calcularTotal().toFixed(2)}
                    </th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Motivo rechazo (solo si esta rechazado o rechazando) */}
          {operacion.estado === 'Rechazado' && (
            <div className="mt-6 bg-red-50 text-red-700 p-4 rounded-xl border border-red-100">
              <p className="font-semibold text-sm">Motivo de Rechazo:</p>
              <p className="text-sm mt-1">{operacion.motivoRechazo}</p>
            </div>
          )}
          
          {rechazando && operacion.estado === 'Pendiente' && (
            <div className="mt-6 bg-orange-50 p-4 rounded-xl border border-orange-100 animate-in fade-in slide-in-from-top-4">
              <label className="block text-sm font-medium text-orange-800 mb-2">
                Motivo del Rechazo
              </label>
              <textarea
                value={motivo}
                onChange={e => setMotivo(e.target.value)}
                className="w-full p-3 border rounded-lg border-orange-200 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                rows={3}
                placeholder="Indique por qué se rechaza este ingreso..."
              />
              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={() => setRechazando(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleRechazar}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                >
                  Confirmar Rechazo
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-xl text-gray-700 font-medium hover:bg-gray-100"
          >
            Cerrar
          </button>
          
          {operacion.estado === 'Pendiente' && !rechazando && (
            <>
              <button
                onClick={() => setRechazando(true)}
                className="px-6 py-2 bg-red-100 text-red-700 rounded-xl font-medium hover:bg-red-200 transition-colors"
              >
                Rechazar
              </button>
              <button
                onClick={() => onAprobar(operacion.idInterno!)}
                className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors shadow-sm"
              >
                Aprobar Ingreso
              </button>
            </>
          )}
        </div>
      </div>

      {/* OVERLAY PARA IMAGEN AMPLIADA */}
      {imagenAmpliada && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setImagenAmpliada(false)}
        >
          <div className="relative max-w-4xl w-full flex justify-center items-center">
            <button 
              onClick={() => setImagenAmpliada(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 bg-white/20 p-2 rounded-full backdrop-blur-md"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img 
              src={operacion.datosFactura.imagenAdjunta} 
              alt="Factura Ampliada" 
              className="max-h-[85vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalDetalleSolicitudStock;
