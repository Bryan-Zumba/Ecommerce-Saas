import React, { useState, useMemo, useEffect } from 'react';
import { useInventario } from '../hooks/useInventario';

interface PageInventarioProps {
  isSubcomponent?: boolean;
}

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Sin fecha';
  return new Intl.DateTimeFormat('es-EC', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
};

export const PageInventario: React.FC<PageInventarioProps> = ({ isSubcomponent = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { inventario, loading, error, fetchInventario } = useInventario();

  useEffect(() => {
    fetchInventario();
  }, [fetchInventario]);

  const filteredInventario = useMemo(() => {
    return inventario.filter((item) => {
      const matchesSearch = item.item?.nombre.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [searchTerm, inventario]);

  return (
    <div className={isSubcomponent ? "" : "p-8 max-w-[1500px] mx-auto animate-in fade-in duration-500 text-left"}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        {!isSubcomponent ? (
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              📦 Existencias en inventario
            </h1>
            <p className="text-gray-500 mt-1 font-medium text-sm lg:text-base">
              Consulta las cantidades reales, reservadas y disponibles de tu mercadería.
            </p>
          </div>
        ) : (
          <div className="hidden md:block"></div>
        )}

        <div className={`flex flex-col sm:flex-row gap-3 w-full ${isSubcomponent ? 'md:w-full justify-between' : 'md:w-auto'}`}>
          <div className="relative flex-1 md:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-100 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm shadow-sm"
              placeholder="Buscar producto por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={fetchInventario}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs tracking-wider rounded-xl transition-all shadow-md shadow-emerald-600/10 hover:shadow-emerald-600/20 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Refrescar
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl font-medium">
          ⚠️ {error}
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th scope="col" className="p-5 text-sm font-extrabold text-gray-500 tracking-wider">
                  Imagen
                </th>
                <th scope="col" className="p-5 text-sm font-extrabold text-gray-500 tracking-wider">
                  Producto
                </th>
                <th scope="col" className="p-5 text-sm font-extrabold text-gray-500 tracking-wider text-center">
                  Stock físico
                </th>
                <th scope="col" className="p-5 text-sm font-extrabold text-gray-500 tracking-wider text-center">
                  Disponible
                </th>
                <th scope="col" className="p-5 text-sm font-extrabold text-gray-500 tracking-wider text-center">
                  Reservado
                </th>
                <th scope="col" className="p-5 text-sm font-extrabold text-gray-500 tracking-wider text-left">
                  Última actualización
                </th>
                <th scope="col" className="p-5 text-sm font-extrabold text-gray-500 tracking-wider text-center">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading && filteredInventario.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-gray-400 text-sm font-medium">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500 mb-3" />
                    <p>Cargando inventario...</p>
                  </td>
                </tr>
              ) : filteredInventario.length > 0 ? (
                filteredInventario.map((item) => (
                  <tr key={item.id_inventario} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-5">
                      {item.item?.imagen_url ? (
                        <img
                          src={item.item.imagen_url}
                          alt={item.item.nombre}
                          className="w-12 h-12 object-cover rounded-xl border border-gray-100 shadow-sm"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 border border-gray-100 flex flex-col items-center justify-center gap-0.5">
                          <span className="text-base leading-none">📷</span>
                          <span className="text-[7px] font-bold text-gray-400 uppercase tracking-wider">Sin foto</span>
                        </div>
                      )}
                    </td>
                    <td className="p-5">
                      <div className="text-base font-bold text-gray-800">{item.item?.nombre}</div>
                      <div className="text-xs text-gray-400 font-medium mt-0.5">ID: #{item.item?.id_item}</div>
                    </td>
                    <td className="p-5 text-center whitespace-nowrap text-sm font-extrabold text-gray-800">
                      {item.stock_actual}
                    </td>
                    <td className="p-5 text-center whitespace-nowrap text-sm font-extrabold text-gray-800">
                      {item.stock_disponible}
                    </td>
                    <td className="p-5 text-center whitespace-nowrap text-sm font-semibold text-gray-500">
                      {item.stock_reservado}
                    </td>
                    <td className="p-5 whitespace-nowrap text-xs text-gray-500 font-medium">
                      {formatDate(item.fecha_ultima_actualizacion)}
                    </td>
                    <td className="p-5 whitespace-nowrap text-center">
                      {item.stock_disponible > 10 ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                          Suficiente
                        </span>
                      ) : item.stock_disponible > 0 ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
                          Stock Bajo
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-100 animate-pulse">
                          Agotado
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-14 text-center text-gray-500">
                    <svg className="mx-auto h-12 w-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="text-base font-black text-gray-900">No hay existencias</p>
                    <p className="text-xs text-gray-400 mt-1">No se encontraron registros de inventario o productos en tu catálogo.</p>
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
