import React, { useMemo, useState } from 'react';
import { Cliente } from '../../domain/Cliente';
import FiltrosBusqueda from './Busqueda';

interface TableClientesProps {
  clientes: Cliente[];
  cargando: boolean;
  refrescar: () => void;
  onSelect?: (cliente: Cliente) => void;
  onEdit?: (cliente: Cliente) => void;
  onDelete?: (cliente: Cliente) => void;
}

export const TableClientes: React.FC<TableClientesProps> = ({ clientes, cargando, refrescar, onSelect, onEdit, onDelete }) => {
  const mostrarAcciones = !!onSelect || !!onEdit || !!onDelete;
  const [consultaBusqueda, setConsultaBusqueda] = useState('');
  const safeClientes = Array.isArray(clientes) ? clientes : [];

  const clientesFiltrados = useMemo(()=>{

    if(!consultaBusqueda.trim()) return safeClientes;
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
  
  if (cargando) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        <span className="ml-3 text-gray-500 font-medium">Cargando datos...</span>
      </div>
    );
  }

  if (clientes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 font-medium">No hay clientes registrados.</div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <div className='flex justify-between items-center gap-4 mx-3 my-3'>
        <div className='flex-1'>
          <FiltrosBusqueda
          search={consultaBusqueda}
          setSearch={setConsultaBusqueda}
          />
        </div>
        <button
          onClick={refrescar}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold shadow transition-all">
          Refrescar Lista
        </button>
      </div>
      <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
        <thead className="bg-gray-50 font-semibold text-gray-600">
          <tr>
            <th className="px-6 py-4">Cédula/RUC</th>
            <th className="px-6 py-4">Nombres</th>
            <th className='px-6 py-4'>Apellidos</th>
            <th className="px-6 py-4">Email</th>
            <th className="px-6 py-4">Teléfono</th>
            {mostrarAcciones && (
            <th className="px-6 py-4">Acciones</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white text-gray-600">
          {clientesFiltrados.length === 0 ? (
            <tr>
              <td colSpan={mostrarAcciones ? 6 : 5} className="px-6 py-8 text-center text-gray-500 font-medium">
                No hay resultados para la búsqueda.
              </td>
            </tr>
          ) : 
          clientesFiltrados.map((cliente) => (
            <tr key={cliente.id_cliente} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 font-medium text-gray-900">{cliente.cedula}</td>
              <td className="px-6 py-4">{cliente.nombres || 'No registrado'}</td>
              <td className="px-6 py-4">{cliente.apellidos || 'No registrado'}</td>
              <td className="px-6 py-4">{cliente.email || 'No registrado'}</td>
              <td className="px-6 py-4">{cliente.telefono || 'No registrado'}</td>
              {mostrarAcciones && (
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  {onSelect && (
                    <button
                      onClick={() => onSelect(cliente)}
                      className="px-3 py-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold shadow transition-all"
                    >
                      Seleccionar
                    </button>
                  )}
                  {onEdit && (
                    <button
                      onClick={() => onEdit(cliente)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow transition-all"
                    >
                      Editar
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(cliente)}
                      className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold shadow transition-all"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </td>
            )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
