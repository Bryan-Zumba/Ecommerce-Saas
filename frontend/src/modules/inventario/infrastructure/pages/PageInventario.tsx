import React, { useState, useMemo } from 'react';
import { mockInventario } from '../data/mockData';

interface PageInventarioProps {
  isSubcomponent?: boolean;
}

export const PageInventario: React.FC<PageInventarioProps> = ({ isSubcomponent = false }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInventario = useMemo(() => {
    return mockInventario.filter((item) => {
      const matchesSearch = item.producto_nombre.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [searchTerm]);

  return (
    <div className={isSubcomponent ? "" : "p-8 max-w-7xl mx-auto"}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        {!isSubcomponent ? (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Inventario (Existencias)</h1>
            <p className="text-gray-500 mt-1">Consulta el stock de productos de la bodega de la empresa.</p>
          </div>
        ) : (
          <div className="hidden md:block"></div>
        )}
        
        <div className={`flex flex-col sm:flex-row gap-3 w-full ${isSubcomponent ? 'md:w-full justify-between' : 'md:w-auto'}`}>
          <div className="relative flex-1 md:max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors shadow-sm"
              placeholder="Buscar producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Bodega
                </th>
                <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Stock Físico
                </th>
                <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Stock Disponible
                </th>
                <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInventario.length > 0 ? (
                filteredInventario.map((item) => (
                  <tr key={item.id_inventario} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.producto_nombre}</div>
                      <div className="text-xs text-gray-400">ID: {item.id_item}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">{item.bodega_nombre}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900 font-medium">{item.stock_actual}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900 font-medium">{item.stock_disponible}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {item.stock_disponible > 10 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Suficiente
                        </span>
                      ) : item.stock_disponible > 0 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Stock Bajo
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Agotado
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="text-lg font-medium text-gray-900">No hay resultados</p>
                    <p className="text-sm mt-1">No se encontraron productos con los filtros seleccionados.</p>
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
