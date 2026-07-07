import React from 'react';
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
  if (loading && compras.length === 0) {
    return (
      <div className="bg-white rounded-[2rem] p-12 text-center border border-gray-100 shadow-sm">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500 mb-3" />
        <p className="text-gray-400 text-sm font-medium">Cargando compras...</p>
      </div>
    );
  }

  if (compras.length === 0) {
    return (
      <div className="bg-white rounded-[2rem] p-12 text-center border border-gray-100 shadow-sm">
        <p className="text-gray-400 text-sm font-bold">No se encontraron compras.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-[10px] font-extrabold">
              <th className="px-5 py-4">Factura</th>
              <th className="px-4 py-4">Proveedor</th>
              <th className="px-4 py-4">Fecha</th>
              <th className="px-4 py-4">Estado</th>
              <th className="px-5 py-4 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {compras.map((compra) => {
              const activa = compraSeleccionada?.id_compra === compra.id_compra;
              return (
                <tr
                  key={compra.id_compra}
                  onClick={() => onSeleccionar(compra)}
                  className={`cursor-pointer transition-colors ${activa ? 'bg-emerald-50/80' : 'hover:bg-gray-50'}`}
                >
                  <td className="px-5 py-4">
                    <p className="text-xs font-black text-gray-900">{compra.codigo_factura}</p>
                    <p className="text-[10px] text-gray-400 font-bold mt-0.5">Compra #{compra.id_compra}</p>
                  </td>
                  <td className="px-4 py-4 text-xs font-bold text-gray-600">Proveedor #{compra.id_proveedor}</td>
                  <td className="px-4 py-4 text-xs text-gray-500 font-medium whitespace-nowrap">{formatDate(compra.fecha_compra)}</td>
                  <td className="px-4 py-4"><EstadoCompraBadge estado={compra.estado_compra} /></td>
                  <td className="px-5 py-4 text-right text-sm font-black text-gray-900">{formatCurrency(compra.total)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

