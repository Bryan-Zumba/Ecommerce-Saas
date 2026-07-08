import React from 'react';
import { CompraEmpresa, DetalleCompra } from '../types/CompraTypes';
import { EstadoCompraBadge } from './EstadoCompraBadge';

interface Props {
  compra: CompraEmpresa | null;
  detalles: DetalleCompra[];
  loading: boolean;
  onAprobar?: (id_compra: number) => void;
  onRechazar?: (id_compra: number) => void;
  onCerrar?: () => void;
}

const formatCurrency = (value: number | string) => `$${(Number(value) || 0).toFixed(2)}`;

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Sin fecha';
  return new Intl.DateTimeFormat('es-EC', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
};

export const PanelDetalleCompra: React.FC<Props> = ({ compra, detalles, loading, onAprobar, onRechazar, onCerrar }) => {
  if (!compra) {
    return (
      <aside className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 min-h-[460px] flex items-center justify-center text-center">
        <div>
          <p className="text-[10px] font-extrabold text-gray-400">Detalle de compra</p>
          <p className="text-gray-500 text-sm font-medium mt-2">Selecciona una compra para revisar sus productos y factura.</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden lg:sticky lg:top-6">
      <div className="px-6 py-5 bg-emerald-600 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-white/80">Factura</p>
            <h2 className="text-xl font-black mt-1 break-words">{compra.codigo_factura}</h2>
          </div>
          <div className="flex items-center gap-3">
            <EstadoCompraBadge estado={compra.estado_compra} />
            {onCerrar && (
              <button
                type="button"
                onClick={onCerrar}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/35 transition-colors font-bold text-white text-xs"
                title="Cerrar panel"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-gray-400 font-bold text-xs">ID Compra</p>
            <p className="text-gray-900 font-black mt-1 text-sm">#{compra.id_compra}</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-gray-400 font-bold text-xs">Proveedor</p>
            <p className="text-gray-900 font-black mt-1 text-sm">
              {compra.proveedor?.nombre ?? `#${compra.id_proveedor}`}
            </p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-gray-400 font-bold text-xs">Total</p>
            <p className="text-emerald-700 font-black mt-1 text-sm">{formatCurrency(compra.total)}</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-gray-400 font-bold text-xs">Fecha</p>
            <p className="text-gray-700 font-bold mt-1 text-sm">{formatDate(compra.fecha_compra)}</p>
          </div>
        </div>

        {compra.observacion && (
          <div>
            <p className="text-xs font-bold text-gray-400 mb-1.5">Observación</p>
            <p className="text-sm text-gray-600 bg-gray-50 rounded-2xl p-4">{compra.observacion}</p>
          </div>
        )}

        {compra.imagen_url && (
          <div>
            <p className="text-xs font-bold text-gray-400 mb-1.5">Factura adjunta</p>
            <a href={compra.imagen_url} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
              <img src={compra.imagen_url} alt={`Factura ${compra.codigo_factura}`} className="w-full h-44 object-cover" />
            </a>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-gray-400">Productos</p>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-bold px-2.5 py-0.5 rounded-full">{detalles.length}</span>
          </div>

          {loading ? (
            <div className="py-8 text-center text-gray-400 text-sm font-medium">Cargando detalle...</div>
          ) : detalles.length === 0 ? (
            <div className="py-8 text-center text-gray-400 text-sm font-medium">Sin productos registrados.</div>
          ) : (
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {detalles.map((detalle) => (
                <div key={detalle.id_detalle_compra} className="border border-gray-100 rounded-2xl p-4 flex items-center gap-3 bg-white shadow-sm hover:shadow transition-shadow">
                  {detalle.item?.imagen_url ? (
                    <img
                      src={detalle.item.imagen_url}
                      alt={detalle.item.nombre}
                      className="w-12 h-12 object-cover rounded-xl border border-gray-100 shadow-sm flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 border border-gray-100 flex flex-col items-center justify-center gap-0.5 flex-shrink-0">
                      <span className="text-base leading-none">📷</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-gray-900 truncate">
                          {detalle.item?.nombre ?? `Producto #${detalle.id_item}`}
                        </div>
                        <div className="text-[10px] text-gray-400 font-semibold mt-0.5">
                          ID Item: #{detalle.id_item}  ·  Bodega #{detalle.bodega?.id_bodega ?? detalle.id_bodega}
                        </div>
                      </div>
                      <div className="text-sm font-black text-gray-900 whitespace-nowrap">
                        {formatCurrency(detalle.subtotal)}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 font-medium mt-2 flex items-center justify-between">
                      <span>
                        Cantidad: <span className="font-extrabold text-gray-800">{detalle.cantidad}</span>
                      </span>
                      <span>
                        Costo: <span className="font-extrabold text-gray-800">{formatCurrency(detalle.costo_unitario)}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {compra.estado_compra === 'Pendiente' && (onAprobar || onRechazar) && (
          <div className="pt-4 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-3">
              {onRechazar && (
                <button
                  type="button"
                  onClick={() => onRechazar(compra.id_compra)}
                  className="py-3 bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-600 font-extrabold uppercase tracking-widest text-xs rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center"
                >
                  Rechazar
                </button>
              )}
              {onAprobar && (
                <button
                  type="button"
                  onClick={() => onAprobar(compra.id_compra)}
                  className="py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold uppercase tracking-widest text-xs rounded-2xl transition-all shadow-md shadow-emerald-600/10 hover:shadow-emerald-600/20 active:scale-[0.98] flex items-center justify-center"
                >
                  Aprobar Compra
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};


