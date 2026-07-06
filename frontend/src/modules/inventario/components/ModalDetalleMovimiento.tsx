import React from 'react';
import { MovimientoInventario } from '../types/MovimientoInventarioTypes';

interface ModalDetalleMovimientoProps {
  movimiento: MovimientoInventario;
  onClose: () => void;
}

const formatDate = (value: string) => {
  return new Intl.DateTimeFormat('es-EC', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
};

const getReferencia = (movimiento: MovimientoInventario) => {
  if (movimiento.id_compra) return `Compra #${movimiento.id_compra}`;
  if (movimiento.id_venta) return `Venta #${movimiento.id_venta}`;
  return 'Sin referencia';
};

export const ModalDetalleMovimiento: React.FC<ModalDetalleMovimientoProps> = ({
  movimiento,
  onClose,
}) => {
  const esEntrada = movimiento.tipo_movimiento === 'Compra' || movimiento.tipo_movimiento === 'Devolucion';

  return (
    <div className="fixed inset-0 bg-gray-900/45 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-100">
        <div className="px-7 py-5 bg-emerald-600 flex items-center justify-between">
          <div>
            <p className="text-white font-extrabold uppercase tracking-widest text-[10px]">
              Detalle de Movimiento
            </p>
            <p className="text-white/80 text-xs mt-1">
              #{movimiento.id_movimiento_inventario} | {formatDate(movimiento.fecha_movimiento)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/15 text-white hover:bg-white/25 transition-colors font-black"
            aria-label="Cerrar"
          >
            x
          </button>
        </div>

        <div className="p-7">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-1">
                Producto
              </p>
              <p className="text-sm font-black text-gray-900">
                {movimiento.item?.nombre ?? `Item #${movimiento.id_item}`}
              </p>
              <p className="text-xs text-gray-500 mt-1">ID: {movimiento.id_item}</p>
            </div>

            <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-1">
                Bodega
              </p>
              <p className="text-sm font-black text-gray-900">
                {movimiento.bodega?.nombre ?? `Bodega #${movimiento.id_bodega}`}
              </p>
              <p className="text-xs text-gray-500 mt-1">ID: {movimiento.id_bodega}</p>
            </div>

            <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-1">
                Tipo
              </p>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black border ${
                  esEntrada
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                {movimiento.tipo_movimiento}
              </span>
            </div>

            <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-1">
                Referencia
              </p>
              <p className="text-sm font-black text-gray-900">{getReferencia(movimiento)}</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-gray-100 p-4 text-center">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">
                Anterior
              </p>
              <p className="text-xl font-black text-gray-900 mt-1">{movimiento.stock_anterior}</p>
            </div>
            <div className="rounded-2xl border border-gray-100 p-4 text-center">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">
                Movimiento
              </p>
              <p className={`text-xl font-black mt-1 ${esEntrada ? 'text-emerald-700' : 'text-amber-700'}`}>
                {esEntrada ? '+' : '-'}{movimiento.cantidad}
              </p>
            </div>
            <div className="rounded-2xl border border-gray-100 p-4 text-center">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">
                Nuevo
              </p>
              <p className="text-xl font-black text-gray-900 mt-1">{movimiento.stock_nuevo}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
