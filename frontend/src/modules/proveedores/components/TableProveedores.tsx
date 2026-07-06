import React, { useMemo, useState } from 'react';
import { ProveedorResponse } from '../types/ProveedorTypes';

// We might want to create a generic Busqueda component or copy FiltrosBusqueda
// For now, I'll put a simple search input in the table or assume we have a Busqueda component.
// Let's create a simple inline search for now to avoid missing dependencies.

type ProveedorLocal = ProveedorResponse["proveedores"][0];

interface TableProveedoresProps {
  proveedores: ProveedorLocal[];
  cargando: boolean;
  refrescar: () => void;
  onSelect?: (proveedor: ProveedorLocal) => void;
  onEdit?: (proveedor: ProveedorLocal) => void;
  onToggleEstado?: (proveedor: ProveedorLocal) => void;
}

export const TableProveedores: React.FC<TableProveedoresProps> = ({ 
  proveedores, cargando, refrescar, onSelect, onEdit, onToggleEstado 
}) => {
  const [consultaBusqueda, setConsultaBusqueda] = useState('');
  const safeProveedores = Array.isArray(proveedores) ? proveedores : [];

  const proveedoresFiltrados = useMemo(() => {
    if (!consultaBusqueda.trim()) return safeProveedores;
    const query = consultaBusqueda.toLowerCase();
    return safeProveedores.filter(
      (proveedor) =>
        proveedor.nombre.toLowerCase().includes(query) ||
        (proveedor.email && proveedor.email.toLowerCase().includes(query)) ||
        (proveedor.telefono && proveedor.telefono.toLowerCase().includes(query))
    );
  }, [safeProveedores, consultaBusqueda]);

  const mostrarColumnaAcciones = !!onSelect || !!onEdit;

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden animate-in fade-in duration-300">
      <div className='flex justify-between items-center gap-4 p-5 pb-2'>
        <div className='flex-1 relative'>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm shadow-sm"
            placeholder="Buscar proveedor por nombre, email o teléfono..."
            value={consultaBusqueda}
            onChange={(e) => setConsultaBusqueda(e.target.value)}
          />
        </div>
        <button
          onClick={refrescar}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold shadow transition-all">
          Refrescar Lista
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Nombre</th>
              <th className="p-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Email</th>
              <th className="p-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Teléfono</th>
              <th className="p-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Dirección</th>
              <th className="p-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">Estado</th>
              {mostrarColumnaAcciones && (
                <th className="p-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">Acciones</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
          {cargando ? (
            <tr>
              <td colSpan={mostrarColumnaAcciones ? 6 : 5} className="px-6 py-12 text-center text-gray-500">
                <p className="text-lg font-medium text-gray-900">Cargando proveedores...</p>
              </td>
            </tr>
          ) : proveedoresFiltrados.length === 0 ? (
            <tr>
              <td colSpan={mostrarColumnaAcciones ? 6 : 5} className="px-6 py-12 text-center text-gray-500">
                <p className="text-lg font-medium text-gray-900">
                  {safeProveedores.length === 0 ? 'No hay proveedores registrados' : 'No hay resultados para la búsqueda'}
                </p>
              </td>
            </tr>
          ) : (
            proveedoresFiltrados.map((proveedor) => (
              <tr key={proveedor.id_proveedor} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-5 font-bold text-gray-800 text-base">{proveedor.nombre}</td>
                <td className="p-5 text-sm font-semibold text-gray-500">{proveedor.email || 'N/A'}</td>
                <td className="p-5 text-sm font-semibold text-gray-500">{proveedor.telefono || 'N/A'}</td>
                <td className="p-5 text-sm font-semibold text-gray-500 max-w-[200px] truncate">{proveedor.direccion || 'N/A'}</td>

                {/* Columna Estado - toggle switch igual que en clientes */}
                <td className="p-5 text-center">
                  {onToggleEstado ? (
                    <>
                      <button
                        onClick={() => onToggleEstado(proveedor)}
                        className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 ${
                          proveedor.estado ? 'bg-emerald-500' : 'bg-gray-300'
                        }`}
                      >
                        <span className="sr-only">Cambiar estado</span>
                        <span
                          aria-hidden="true"
                          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                            proveedor.estado ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                      <div className={`text-[10px] mt-1 font-semibold uppercase ${proveedor.estado ? 'text-emerald-600' : 'text-gray-500'}`}>
                        {proveedor.estado ? 'Activo' : 'Inactivo'}
                      </div>
                    </>
                  ) : (
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${proveedor.estado ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                      {proveedor.estado ? 'Activo' : 'Inactivo'}
                    </span>
                  )}
                </td>

                {/* Columna Acciones - igual estilo */}
                {mostrarColumnaAcciones && (
                  <td className="p-5 text-center">
                    <div className="flex justify-center gap-2">
                      {onSelect && (
                        <button
                          onClick={() => onSelect(proveedor)}
                          className="text-emerald-600 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1 font-semibold"
                        >
                          Seleccionar
                        </button>
                      )}
                      {onEdit && (
                        <button
                          onClick={() => onEdit(proveedor)}
                          className="text-emerald-600 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 p-2 rounded-lg transition-colors inline-flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          Editar
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
};
