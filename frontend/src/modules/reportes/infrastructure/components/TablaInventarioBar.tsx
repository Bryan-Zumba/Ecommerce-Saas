import React from 'react';
import { ItemReporte } from '../../domain/ItemReporte';

interface TablaInventarioBarProps {
  items: ItemReporte[];
  onAjustarUsados: (id_item: number, incremento: number) => void;
}

export const TablaInventarioBar: React.FC<TablaInventarioBarProps> = ({ items, onAjustarUsados }) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm custom-scrollbar">
      <table className="min-w-full table-fixed border-collapse divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50/75 sticky top-0 backdrop-blur-sm z-10 font-semibold text-gray-700">
          <tr className="divide-x divide-gray-200">
            <th scope="col" className="w-12 px-3 py-3 text-center">N°</th>
            <th scope="col" className="w-64 px-4 py-3 text-left">Descripción / Producto</th>
            <th scope="col" className="w-24 px-3 py-3 text-right">Ingreso Total</th>
            <th scope="col" className="w-28 px-3 py-3 text-right">Inversión Ref.</th>
            <th scope="col" className="w-24 px-3 py-3 text-right">Costo Fact.</th>
            <th scope="col" className="w-24 px-3 py-3 text-right">P.V.P</th>
            <th scope="col" className="w-24 px-3 py-3 text-right">Venta Und.</th>
            <th scope="col" className="w-28 px-3 py-3 text-right">Venta P.V.P</th>
            <th scope="col" className="w-28 px-3 py-3 text-right">Venta Fact.</th>
            <th scope="col" className="w-28 px-3 py-3 text-right">Utilidad</th>
            <th scope="col" className="w-24 px-3 py-3 text-right">Percha</th>
            <th scope="col" className="w-32 px-3 py-3 text-center">Usados</th>
            <th scope="col" className="w-24 px-3 py-3 text-right">Pérdida</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white text-gray-600 font-medium">
          {items.map((item, index) => {
            const esStockCritico = item.percha <= 3;
            return (
              <tr 
                key={item.id_item} 
                className={`divide-x divide-gray-200 transition-colors duration-150 hover:bg-emerald-50/30 ${
                  esStockCritico ? 'bg-amber-50/20' : ''
                }`}
              >
                {/* N° */}
                <td className="px-3 py-2.5 text-center text-gray-400 text-xs font-mono">{index + 1}</td>
                
                {/* Descripción */}
                <td className="px-4 py-2.5 text-left font-bold text-gray-800 truncate" title={item.nombre}>
                  {item.nombre}
                </td>
                
                {/* Ingreso Total */}
                <td className="px-3 py-2.5 text-right font-mono text-gray-800">{item.ingresoTotal}</td>
                
                {/* Inversión Referencial */}
                <td className="px-3 py-2.5 text-right font-mono text-gray-500">${item.inversionReferencial.toFixed(2)}</td>
                
                {/* Costo Factura */}
                <td className="px-3 py-2.5 text-right font-mono text-gray-500">${item.precioFactura.toFixed(2)}</td>
                
                {/* PVP */}
                <td className="px-3 py-2.5 text-right font-mono text-gray-800 font-semibold">${item.pvp.toFixed(2)}</td>
                
                {/* Venta Unidades */}
                <td className="px-3 py-2.5 text-right font-mono text-emerald-700 bg-emerald-50/10 font-bold">{item.ventaUnidades}</td>
                
                {/* Total Venta PVP */}
                <td className="px-3 py-2.5 text-right font-mono text-emerald-800 bg-emerald-50/20 font-bold">${item.totalVentaPvp.toFixed(2)}</td>
                
                {/* Total Venta Factura */}
                <td className="px-3 py-2.5 text-right font-mono text-gray-400">${item.totalVentaFactura.toFixed(2)}</td>
                
                {/* Utilidad */}
                <td className="px-3 py-2.5 text-right font-mono text-indigo-700 bg-indigo-50/15 font-extrabold">${item.utilidad.toFixed(2)}</td>
                
                {/* Percha */}
                <td className={`px-3 py-2.5 text-right font-mono font-bold ${
                  esStockCritico ? 'text-rose-600 bg-rose-50/30' : 'text-gray-900'
                }`}>
                  {item.percha}
                </td>
                
                {/* Usados (Mermas / Control interactivo) */}
                <td className="px-3 py-1.5 text-center no-print">
                  <div className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg p-0.5 shadow-sm">
                    <button
                      onClick={() => onAjustarUsados(item.id_item, -1)}
                      disabled={item.usados <= 0}
                      className="w-6 h-6 flex items-center justify-center rounded bg-white text-gray-500 border border-gray-100 hover:bg-gray-100 hover:text-gray-800 active:scale-95 transition-all disabled:opacity-40 disabled:scale-100 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-7 font-mono font-bold text-gray-700 text-xs text-center">{item.usados}</span>
                    <button
                      onClick={() => onAjustarUsados(item.id_item, 1)}
                      disabled={item.percha <= 0}
                      className="w-6 h-6 flex items-center justify-center rounded bg-white text-gray-500 border border-gray-100 hover:bg-gray-100 hover:text-gray-800 active:scale-95 transition-all disabled:opacity-40 disabled:scale-100 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </td>
                
                {/* Pérdida */}
                <td className={`px-3 py-2.5 text-right font-mono ${
                  item.usados > 0 ? 'text-rose-700 bg-rose-50/10 font-bold' : 'text-gray-400'
                }`}>
                  {item.usados > 0 ? `-$${item.perdidaMonto.toFixed(2)}` : '$0.00'}
                </td>
              </tr>
            );
          })}

          {/* FILA DE SUMAS TOTALES (Fiel a tu Excel del Bar) */}
          <tr className="bg-gray-100/90 font-black text-gray-900 border-t-2 border-gray-300 divide-x divide-gray-200">
            <td className="px-3 py-3 text-center text-xs font-mono">-</td>
            <td className="px-4 py-3 text-left font-black tracking-tight text-gray-950 uppercase text-xs">Total General</td>
            
            {/* Ingreso Total */}
            <td className="px-3 py-3 text-right font-mono text-gray-900">
              {items.reduce((sum, item) => sum + item.ingresoTotal, 0)}
            </td>
            
            {/* Inversión Referencial */}
            <td className="px-3 py-3 text-right font-mono text-gray-950">
              ${items.reduce((sum, item) => sum + item.inversionReferencial, 0).toFixed(2)}
            </td>
            
            {/* Costo Factura (Vacío) */}
            <td className="px-3 py-3 text-right font-mono text-gray-400">-</td>
            
            {/* PVP (Vacío) */}
            <td className="px-3 py-3 text-right font-mono text-gray-400">-</td>
            
            {/* Venta Unidades */}
            <td className="px-3 py-3 text-right font-mono text-emerald-800 bg-emerald-50/20">
              {items.reduce((sum, item) => sum + item.ventaUnidades, 0)}
            </td>
            
            {/* Total Venta PVP */}
            <td className="px-3 py-3 text-right font-mono text-emerald-950 bg-emerald-100/40">
              ${items.reduce((sum, item) => sum + item.totalVentaPvp, 0).toFixed(2)}
            </td>
            
            {/* Total Venta Factura */}
            <td className="px-3 py-3 text-right font-mono text-gray-600">
              ${items.reduce((sum, item) => sum + item.totalVentaFactura, 0).toFixed(2)}
            </td>
            
            {/* Utilidad */}
            <td className="px-3 py-3 text-right font-mono text-indigo-950 bg-indigo-150/20">
              ${items.reduce((sum, item) => sum + item.utilidad, 0).toFixed(2)}
            </td>
            
            {/* Percha */}
            <td className="px-3 py-3 text-right font-mono text-gray-950">
              {items.reduce((sum, item) => sum + item.percha, 0)}
            </td>
            
            {/* Usados */}
            <td className="px-3 py-3 text-center font-mono text-rose-900 bg-rose-50/10">
              {items.reduce((sum, item) => sum + item.usados, 0)}
            </td>
            
            {/* Pérdida */}
            <td className="px-3 py-3 text-right font-mono text-rose-950 bg-rose-50/20">
              -${items.reduce((sum, item) => sum + item.perdidaMonto, 0).toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
