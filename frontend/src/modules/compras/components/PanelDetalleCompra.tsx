import React from 'react';
import { CompraEmpresa, DetalleCompra } from '../types/CompraTypes';
import { EstadoCompraBadge } from './EstadoCompraBadge';

interface Props {
  compra: CompraEmpresa | null;
  detalles: DetalleCompra[];
  loading: boolean;
}

const formatCurrency = (value: number | string) => `$${(Number(value) || 0).toFixed(2)}`;

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Sin fecha';
  return new Intl.DateTimeFormat('es-EC', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
};

export const PanelDetalleCompra: React.FC<Props> = ({ compra, detalles, loading }) => {
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
            <p className="text-[10px] font-extrabold text-white/70">Factura</p>
            <h2 className="text-xl font-black mt-1 break-words">{compra.codigo_factura}</h2>
          </div>
          <EstadoCompraBadge estado={compra.estado_compra} />
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-gray-400 font-extrabold text-[10px]">Proveedor</p>
            <p className="text-gray-900 font-black mt-1">#{compra.id_proveedor}</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-gray-400 font-extrabold text-[10px]">Total</p>
            <p className="text-emerald-700 font-black mt-1">{formatCurrency(compra.total)}</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4 col-span-2">
            <p className="text-gray-400 font-extrabold text-[10px]">Fecha</p>
            <p className="text-gray-700 font-bold mt-1">{formatDate(compra.fecha_compra)}</p>
          </div>
        </div>

        {compra.observacion && (
          <div>
            <p className="text-[10px] font-extrabold text-gray-400 mb-2">Observación</p>
            <p className="text-sm text-gray-600 bg-gray-50 rounded-2xl p-4">{compra.observacion}</p>
          </div>
        )}

        {compra.imagen_url && (
          <div>
            <p className="text-[10px] font-extrabold text-gray-400 mb-2">Factura adjunta</p>
            <a href={compra.imagen_url} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
              <img src={compra.imagen_url} alt={`Factura ${compra.codigo_factura}`} className="w-full h-44 object-cover" />
            </a>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-extrabold text-gray-400">Productos</p>
            <span className="text-[10px] font-black text-gray-400">{detalles.length}</span>
          </div>

          {loading ? (
            <div className="py-8 text-center text-gray-400 text-sm font-medium">Cargando detalle...</div>
          ) : detalles.length === 0 ? (
            <div className="py-8 text-center text-gray-400 text-sm font-medium">Sin productos registrados.</div>
          ) : (
            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {detalles.map((detalle) => (
                <div key={detalle.id_detalle_compra} className="border border-gray-100 rounded-2xl p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-black text-gray-900">{detalle.item?.nombre ?? `Item #${detalle.id_item}`}</p>
                      <p className="text-[10px] text-gray-400 font-bold mt-1">Bodega #{detalle.bodega?.id_bodega ?? detalle.id_bodega}</p>
                    </div>
                    <p className="text-sm font-black text-gray-900">{formatCurrency(detalle.subtotal)}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    {detalle.cantidad} x {formatCurrency(detalle.costo_unitario)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};


