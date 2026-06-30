import React, { useMemo, useState } from 'react';
import { ClienteResponse } from '../types/ClienteResponse';
import FiltrosBusqueda from './Busqueda';

type ClienteLocal = ClienteResponse["clientes"][0];

interface TableClientesProps {
  clientes: ClienteLocal[];
  cargando: boolean;
  refrescar: () => void;
  onSelect?: (cliente: ClienteLocal) => void;
  onEdit?: (cliente: ClienteLocal) => void;
  onToggleEstado?: (cliente: ClienteLocal) => void;
}

export const TableClientes: React.FC<TableClientesProps> = ({ clientes, cargando, refrescar, onSelect, onEdit, onToggleEstado }) => {
  const [consultaBusqueda, setConsultaBusqueda] = useState('');
  const safeClientes = Array.isArray(clientes) ? clientes : [];

  const clientesFiltrados = useMemo(() => {
    if (!consultaBusqueda.trim()) return safeClientes;
    const query = consultaBusqueda.toLowerCase();
    return safeClientes.filter(
      (cliente) =>
        cliente.nombres.toLowerCase().includes(query) ||
        cliente.apellidos.toLowerCase().includes(query) ||
        cliente.cedula.toLowerCase().includes(query) ||
        (cliente.email && cliente.email.toLowerCase().includes(query)) ||
        (cliente.telefono && cliente.telefono.toLowerCase().includes(query))
    );
  }, [safeClientes, consultaBusqueda]);

  const mostrarColumnaAcciones = !!onSelect || !!onEdit;

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <div className='flex justify-between items-center gap-4 mx-3 my-3'>
        <div className='flex-1'>
          <FiltrosBusqueda search={consultaBusqueda} setSearch={setConsultaBusqueda} />
        </div>
        <button
          onClick={refrescar}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold shadow transition-all">
          Refrescar Lista
        </button>
      </div>

      <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Cédula/RUC</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombres</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Apellidos</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Teléfono</th>
            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
            {mostrarColumnaAcciones && (
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {cargando ? (
            <tr>
              <td colSpan={mostrarColumnaAcciones ? 7 : 6} className="px-6 py-12 text-center text-gray-500">
                <p className="text-lg font-medium text-gray-900">Cargando clientes...</p>
              </td>
            </tr>
          ) : clientesFiltrados.length === 0 ? (
            <tr>
              <td colSpan={mostrarColumnaAcciones ? 7 : 6} className="px-6 py-12 text-center text-gray-500">
                <p className="text-lg font-medium text-gray-900">
                  {safeClientes.length === 0 ? 'No hay clientes registrados' : 'No hay resultados para la búsqueda'}
                </p>
              </td>
            </tr>
          ) : (
            clientesFiltrados.map((cliente) => (
              <tr key={cliente.id_cliente} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{cliente.cedula}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{cliente.nombres || 'No registrado'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{cliente.apellidos || 'No registrado'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{cliente.email || 'No registrado'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{cliente.telefono || 'No registrado'}</td>

                {/* Columna Estado - toggle switch igual que en usuarios */}
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {onToggleEstado ? (
                    <>
                      <button
                        onClick={() => onToggleEstado(cliente)}
                        className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 ${
                          cliente.estado ? 'bg-emerald-500' : 'bg-gray-300'
                        }`}
                      >
                        <span className="sr-only">Cambiar estado</span>
                        <span
                          aria-hidden="true"
                          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                            cliente.estado ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                      <div className={`text-[10px] mt-1 font-semibold uppercase ${cliente.estado ? 'text-emerald-600' : 'text-gray-500'}`}>
                        {cliente.estado ? 'Activo' : 'Inactivo'}
                      </div>
                    </>
                  ) : (
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${cliente.estado ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                      {cliente.estado ? 'Activo' : 'Inactivo'}
                    </span>
                  )}
                </td>

                {/* Columna Acciones - igual estilo que usuarios */}
                {mostrarColumnaAcciones && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      {onSelect && (
                        <button
                          onClick={() => onSelect(cliente)}
                          className="text-emerald-600 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1 font-semibold"
                        >
                          Seleccionar
                        </button>
                      )}
                      {onEdit && (
                        <button
                          onClick={() => onEdit(cliente)}
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
  );
};
