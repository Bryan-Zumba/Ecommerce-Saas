import React from 'react';
import { EstadoCompra } from '../types/CompraTypes';

interface Props {
  estado: EstadoCompra;
}

const estilos: Record<EstadoCompra, string> = {
  Pendiente: 'bg-amber-50 text-amber-700 border-amber-200',
  Completada: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Cancelada: 'bg-red-50 text-red-700 border-red-200',
};

export const EstadoCompraBadge: React.FC<Props> = ({ estado }) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full border text-[10px] font-extrabold ${estilos[estado]}`}>
      {estado}
    </span>
  );
};

