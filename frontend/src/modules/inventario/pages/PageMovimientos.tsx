import React, { useState, useMemo } from 'react';
import { mockMovimientos } from '../infrastructure/data/mockData';
import { TipoMovimiento } from '../types/InventarioTypes';

interface PageMovimientosProps {
  isSubcomponent?: boolean;
}

export const PageMovimientos: React.FC<PageMovimientosProps> = ({ isSubcomponent = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTipo, setSelectedTipo] = useState<TipoMovimiento | 'ALL'>('ALL');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  const filteredMovimientos = useMemo(() => {
    return mockMovimientos.filter((mov) => {
      const matchesSearch = mov.producto_nombre.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTipo = selectedTipo === 'ALL' || mov.tipo === selectedTipo;

      let matchesFecha = true;
      const movDate = new Date(mov.fecha);
      if (fechaInicio) {
        matchesFecha = matchesFecha && movDate >= new Date(fechaInicio);
      }
      if (fechaFin) {
        // Añadimos 1 día para incluir todo el día de fin
        const end = new Date(fechaFin);
        end.setDate(end.getDate() + 1);
        matchesFecha = matchesFecha && movDate < end;
      }

      return matchesSearch && matchesTipo && matchesFecha;
    });
  }, [searchTerm, selectedTipo, fechaInicio, fechaFin]);

  const formatDate = (isoString: string) => {
    return new Intl.DateTimeFormat('es-EC', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(isoString));
  };

  return (
    <div className={isSubcomponent ? "" : "p-8 max-w-7xl mx-auto"}>
      {!isSubcomponent && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Movimientos de Inventario</h1>
          <p className="text-gray-500 mt-1">Historial de ingresos y salidas de productos.</p>
        </div>
      )}

      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px] relative">
          <label className="block text-xs font-medium text-gray-700 mb-1">Producto</label>
          <input
            type="text"
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Buscar producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-medium text-gray-700 mb-1">Tipo de Movimiento</label>
          <select
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm cursor-pointer"
            value={selectedTipo}
            onChange={(e) => setSelectedTipo(e.target.value as TipoMovimiento | 'ALL')}
          >
            <option value="ALL">Todos</option>
            <option value="Ingreso">Ingreso</option>
            <option value="Salida">Salida</option>
          </select>
        </div>

        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-medium text-gray-700 mb-1">Fecha Desde</label>
          <input
            type="date"
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-700 cursor-pointer"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
        </div>

        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-medium text-gray-700 mb-1">Fecha Hasta</label>
          <input
            type="date"
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-700 cursor-pointer"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Bodega
                </th>
                <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Cantidad
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Motivo
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMovimientos.length > 0 ? (
                filteredMovimientos.map((mov) => (
                  <tr key={mov.id_movimiento} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(mov.fecha)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{mov.producto_nombre}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">{mov.bodega_nombre}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${mov.tipo === 'Ingreso'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-orange-50 text-orange-700 border border-orange-200'
                        }`}>
                        {mov.tipo === 'Ingreso' ? (
                          <svg className="-ml-0.5 mr-1.5 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                        ) : (
                          <svg className="-ml-0.5 mr-1.5 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                          </svg>
                        )}
                        {mov.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                      {mov.tipo === 'Ingreso' ? '+' : '-'}{mov.cantidad}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {mov.motivo}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="text-lg font-medium text-gray-900">Sin movimientos</p>
                    <p className="text-sm mt-1">No se encontraron movimientos con los filtros aplicados.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
