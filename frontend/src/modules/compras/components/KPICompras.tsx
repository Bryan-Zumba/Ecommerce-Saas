import React from 'react';
import { CompraEmpresa } from '../types/CompraTypes';

interface Props {
  compras: CompraEmpresa[];
}

const toNumber = (value: number | string) => Number(value) || 0;

export const KPICompras: React.FC<Props> = ({ compras }) => {
  const pendientes = compras.filter((compra) => compra.estado_compra === 'Pendiente').length;
  const completadas = compras.filter((compra) => compra.estado_compra === 'Completada').length;
  const canceladas = compras.filter((compra) => compra.estado_compra === 'Cancelada').length;
  const totalCompletadas = compras
    .filter((compra) => compra.estado_compra === 'Completada')
    .reduce((acc, compra) => acc + toNumber(compra.total), 0);

  const items = [
    { label: 'Solicitudes', value: compras.length, accent: 'border-emerald-500' },
    { label: 'Pendientes', value: pendientes, accent: 'border-amber-500' },
    { label: 'Completadas', value: completadas, accent: 'border-blue-500', helper: `$${totalCompletadas.toFixed(2)}` },
    { label: 'Canceladas', value: canceladas, accent: 'border-red-500' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {items.map((item) => (
        <div key={item.label} className={`bg-white border border-gray-100 border-l-4 ${item.accent} rounded-2xl p-5 shadow-sm`}>
          <p className="text-[10px] font-extrabold text-gray-400">{item.label}</p>
          <div className="flex items-end justify-between gap-3 mt-1">
            <p className="text-2xl font-black text-gray-900">{item.value}</p>
            {item.helper && <p className="text-xs font-black text-emerald-600">{item.helper}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

