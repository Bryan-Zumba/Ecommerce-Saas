import React from 'react';
import { MovimientoCaja } from '../types/MovimientoCajaTypes';

interface PanelDetalleMovimientoCajaProps {
  movimiento: MovimientoCaja | null;
  loading: boolean;
  onClose: () => void;
}

const formatFecha = (value?: string) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Sin fecha';
  return new Intl.DateTimeFormat('es-EC', { dateStyle: 'long', timeStyle: 'short' }).format(date);
};

export const PanelDetalleMovimientoCaja: React.FC<PanelDetalleMovimientoCajaProps> = ({
  movimiento,
  loading,
  onClose,
}) => {
  if (!movimiento && !loading) return null;

  return (
    <div className="w-full lg:w-[420px] bg-white border-l border-gray-100 shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-300 text-left">
      {/* Cabecera del Panel */}
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight">Auditoría de Caja</h2>
          <p className="text-xs text-gray-400 font-semibold mt-0.5">ID Movimiento: #{movimiento?.id_movimiento_caja}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="h-9 w-9 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-600 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Contenido */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500 mb-3" />
            <p className="text-xs font-semibold">Cargando detalles...</p>
          </div>
        ) : movimiento ? (
          <>
            {/* Monto y Tipo */}
            <div className="bg-gray-50 rounded-3xl p-5 text-center border border-gray-100">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold mb-2 border ${
                movimiento.tipo_movimiento === 'Ingreso' || movimiento.tipo_movimiento === 'Apertura'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-150'
                  : 'bg-rose-50 text-rose-700 border-rose-150'
              }`}>
                {movimiento.tipo_movimiento}
              </span>
              <div className="text-3xl font-black text-gray-900 tracking-tight">
                ${Number(movimiento.monto).toFixed(2)}
              </div>
              <div className="text-xs text-gray-400 font-semibold mt-1">
                {formatFecha(movimiento.fecha_movimiento)}
              </div>
            </div>

            {/* Responsable */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-400">Responsable del Turno</h3>
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3">
                <div>
                  <div className="text-xs text-gray-400">Usuario</div>
                  <div className="text-sm font-bold text-gray-800">
                    {movimiento.turno_caja?.usuario
                      ? `${movimiento.turno_caja.usuario.nombres} ${movimiento.turno_caja.usuario.apellidos}`
                      : 'N/A'}
                  </div>
                  <div className="text-xs text-gray-500">{movimiento.turno_caja?.usuario?.email}</div>
                </div>
                <hr className="border-gray-50" />
                <div>
                  <div className="text-xs text-gray-400">Caja Asociada</div>
                  <div className="text-sm font-bold text-gray-800">
                    {movimiento.turno_caja?.caja?.nombre || 'General'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {movimiento.turno_caja?.caja?.descripcion || 'Caja física del sistema'}
                  </div>
                </div>
              </div>
            </div>

            {/* Documento Relacionado */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-400">Documento Relacionado</h3>
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3">
                {movimiento.id_compra && movimiento.compra ? (
                  <div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-black uppercase">
                      Compra
                    </span>
                    <div className="text-sm font-bold text-gray-800 mt-2">
                      Código Factura / Transacción:
                    </div>
                    <div className="text-sm font-extrabold text-emerald-600 mt-0.5">{movimiento.referencia}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      Proveedor: {movimiento.compra.proveedor?.nombre || 'General'}
                    </div>
                    <div className="text-xs text-gray-400">
                      Total Compra: ${Number(movimiento.compra.total).toFixed(2)}
                    </div>
                  </div>
                ) : movimiento.id_venta && movimiento.venta ? (
                  <div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-black uppercase">
                      Venta
                    </span>
                    <div className="text-sm font-bold text-gray-800 mt-2">
                      Código Referencia Venta:
                    </div>
                    <div className="text-sm font-extrabold text-emerald-600 mt-0.5">#{movimiento.id_venta}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      Referencia: {movimiento.referencia}
                    </div>
                    <div className="text-xs text-gray-400">
                      Total Venta: ${Number(movimiento.venta.total).toFixed(2)}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 py-2">
                    Movimiento administrativo directo (Apertura o Cierre de Caja). Sin compra/venta asociada.
                  </div>
                )}
              </div>
            </div>

            {/* Referencia */}
            <div className="space-y-1">
              <div className="text-xs text-gray-400">Descripción / Referencia</div>
              <div className="text-sm text-gray-700 bg-gray-50 rounded-xl p-3 border border-gray-100 font-medium">
                {movimiento.referencia}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};
