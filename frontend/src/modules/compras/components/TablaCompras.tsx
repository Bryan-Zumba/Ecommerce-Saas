import React, { useState, useMemo } from 'react';
import { CompraEmpresa } from '../types/CompraTypes';
import { EstadoCompraBadge } from './EstadoCompraBadge';

interface Props {
  compras: CompraEmpresa[];
  compraSeleccionada: CompraEmpresa | null;
  loading: boolean;
  onSeleccionar: (compra: CompraEmpresa) => void;
}

const formatCurrency = (value: number | string) => `$${(Number(value) || 0).toFixed(2)}`;

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Sin fecha';
  return new Intl.DateTimeFormat('es-EC', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
};

export const TablaCompras: React.FC<Props> = ({ compras, compraSeleccionada, loading, onSeleccionar }) => {
  const [sortField, setSortField] = useState<'codigo_factura' | 'proveedor' | 'fecha_compra' | 'total' | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: 'codigo_factura' | 'proveedor' | 'fecha_compra' | 'total') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedCompras = useMemo(() => {
    if (!sortField) return compras;
    return [...compras].sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (sortField === 'proveedor') {
        valA = a.proveedor?.nombre || `Proveedor #${a.id_proveedor}`;
        valB = b.proveedor?.nombre || `Proveedor #${b.id_proveedor}`;
      }

      if (sortField === 'total') {
        valA = Number(a.total) || 0;
        valB = Number(b.total) || 0;
      }

      if (sortField === 'fecha_compra') {
        valA = new Date(a.fecha_compra).getTime();
        valB = new Date(b.fecha_compra).getTime();
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [compras, sortField, sortDirection]);

  const renderSortIcon = (field: 'codigo_factura' | 'proveedor' | 'fecha_compra' | 'total') => {
    if (sortField !== field) return <span className="text-gray-500 font-extrabold ml-1.5 text-xs select-none">↕</span>;
    return sortDirection === 'asc' ? (
      <span className="text-emerald-600 font-black ml-1.5 text-xs">▲</span>
    ) : (
      <span className="text-emerald-600 font-black ml-1.5 text-xs">▼</span>
    );
  };

  if (loading && compras.length === 0) {
    return (
      <div className="bg-white rounded-[2rem] p-12 text-center border border-gray-100 shadow-sm w-full">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500 mb-3" />
        <p className="text-gray-400 text-sm font-medium">Cargando compras...</p>
      </div>
    );
  }

  if (compras.length === 0) {
    return (
      <div className="bg-white rounded-[2rem] p-12 text-center border border-gray-100 shadow-sm w-full">
        <p className="text-gray-400 text-sm font-bold">No se encontraron compras.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden w-full flex-1">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-sm font-extrabold tracking-wider border-b border-gray-100">
              <th
                className="px-5 py-4 cursor-pointer hover:bg-gray-100/70 select-none transition-colors"
                onClick={() => handleSort('codigo_factura')}
              >
                <div className="flex items-center gap-1.5">
                  Factura {renderSortIcon('codigo_factura')}
                </div>
              </th>
              <th
                className="px-4 py-4 cursor-pointer hover:bg-gray-100/70 select-none transition-colors"
                onClick={() => handleSort('proveedor')}
              >
                <div className="flex items-center gap-1.5">
                  Proveedor {renderSortIcon('proveedor')}
                </div>
              </th>
              <th
                className="px-4 py-4 cursor-pointer hover:bg-gray-100/70 select-none transition-colors"
                onClick={() => handleSort('fecha_compra')}
              >
                <div className="flex items-center gap-1.5">
                  Fecha {renderSortIcon('fecha_compra')}
                </div>
              </th>
              <th className="px-4 py-4 w-28 select-none">Estado</th>
              <th
                className="px-5 py-4 text-right cursor-pointer hover:bg-gray-100/70 select-none transition-colors"
                onClick={() => handleSort('total')}
              >
                <div className="flex items-center justify-end gap-1.5">
                  Total {renderSortIcon('total')}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sortedCompras.map((compra) => {
              const activa = compraSeleccionada?.id_compra === compra.id_compra;
              return (
                <tr
                  key={compra.id_compra}
                  onClick={() => onSeleccionar(compra)}
                  className={`cursor-pointer transition-colors ${activa ? 'bg-emerald-50/80' : 'hover:bg-gray-50'}`}
                >
                  <td className="px-5 py-4 whitespace-nowrap">
                    <p className="text-xs font-black text-gray-900">{compra.codigo_factura}</p>
                    <p className="text-[10px] text-gray-400 font-bold mt-0.5">Compra #{compra.id_compra}</p>
                  </td>
                  <td className="px-4 py-4 text-xs font-bold text-gray-600">
                    {compra.proveedor?.nombre ?? `Proveedor #${compra.id_proveedor}`}
                  </td>
                  <td className="px-4 py-4 text-xs text-gray-500 font-medium whitespace-nowrap">
                    {formatDate(compra.fecha_compra)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap w-28">
                    <EstadoCompraBadge estado={compra.estado_compra} />
                  </td>
                  <td className="px-5 py-4 text-right text-sm font-black text-gray-900 whitespace-nowrap">
                    {formatCurrency(compra.total)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

