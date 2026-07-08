import React from 'react';
import { MovimientoCaja, TipoMovimientoCaja } from '../types/MovimientoCajaTypes';

interface TablaMovimientosCajaProps {
  movimientos: MovimientoCaja[];
  onVerDetalle: (id: number) => void;
  idSeleccionado?: number;
}

const getBadgeStyles = (tipo: TipoMovimientoCaja) => {
  switch (tipo) {
    case 'Ingreso':
      return 'bg-emerald-50 text-emerald-700 border-emerald-150 border';
    case 'Egreso':
      return 'bg-rose-50 text-rose-700 border-rose-150 border';
    case 'Apertura':
      return 'bg-blue-50 text-blue-700 border-blue-150 border';
    case 'Cierre':
      return 'bg-purple-50 text-purple-700 border-purple-150 border';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-150 border';
  }
};

const formatFecha = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Sin fecha';
  return new Intl.DateTimeFormat('es-EC', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
};

export const TablaMovimientosCaja: React.FC<TablaMovimientosCajaProps> = ({
  movimientos,
  onVerDetalle,
  idSeleccionado,
}) => {
  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden animate-in fade-in duration-300">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th scope="col" className="p-5 text-sm font-extrabold text-gray-500 tracking-wider">
                Fecha
              </th>
              <th scope="col" className="p-5 text-sm font-extrabold text-gray-500 tracking-wider">
                Responsable
              </th>
              <th scope="col" className="p-5 text-sm font-extrabold text-gray-500 tracking-wider text-center">
                Tipo
              </th>
              <th scope="col" className="p-5 text-sm font-extrabold text-gray-500 tracking-wider text-right">
                Monto
              </th>
              <th scope="col" className="p-5 text-sm font-extrabold text-gray-500 tracking-wider">
                Referencia
              </th>
              <th scope="col" className="p-5 text-sm font-extrabold text-gray-500 tracking-wider text-center">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {movimientos.map((mov) => {
              const esIngreso = mov.tipo_movimiento === 'Ingreso' || mov.tipo_movimiento === 'Apertura';

              return (
                <tr
                  key={mov.id_movimiento_caja}
                  className={`hover:bg-gray-50/50 transition-colors ${
                    idSeleccionado === mov.id_movimiento_caja ? 'bg-emerald-50/20' : ''
                  }`}
                >
                  <td className="p-5 text-sm text-gray-600 whitespace-nowrap">
                    {formatFecha(mov.fecha_movimiento)}
                  </td>
                  <td className="p-5">
                    <div className="text-base font-bold text-gray-800">
                      {mov.turno_caja?.usuario
                        ? `${mov.turno_caja.usuario.nombres} ${mov.turno_caja.usuario.apellidos}`
                        : 'Responsable no asignado'}
                    </div>
                    <div className="text-xs text-gray-400 font-semibold mt-0.5">
                      Caja: {mov.turno_caja?.caja?.nombre || 'General'}
                    </div>
                  </td>
                  <td className="p-5 text-center whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getBadgeStyles(mov.tipo_movimiento)}`}>
                      {mov.tipo_movimiento}
                    </span>
                  </td>
                  <td className={`p-5 text-right whitespace-nowrap text-sm font-extrabold ${esIngreso ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {esIngreso ? '+' : '-'}${Number(mov.monto).toFixed(2)}
                  </td>
                  <td className="p-5 text-sm text-gray-600 max-w-xs truncate">
                    {mov.referencia}
                  </td>
                  <td className="p-5 text-center whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onVerDetalle(mov.id_movimiento_caja)}
                      className={`px-4 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
                        idSeleccionado === mov.id_movimiento_caja
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      }`}
                    >
                      Detalle
                    </button>
                  </td>
                </tr>
              );
            })}
            {movimientos.length === 0 && (
              <tr>
                <td colSpan={6} className="p-12 text-center text-gray-400 text-sm font-medium">
                  No se encontraron movimientos de caja.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
