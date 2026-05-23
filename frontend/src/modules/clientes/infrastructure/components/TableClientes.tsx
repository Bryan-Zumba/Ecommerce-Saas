import React from 'react';
import { Cliente } from '../../domain/Cliente';

interface TableClientesProps {
  clientes: Cliente[];
  cargando: boolean;
}

export const TableClientes: React.FC<TableClientesProps> = ({ clientes, cargando }) => {
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
      <div className="text-center py-8 text-gray-500 font-medium">No hay clientes.</div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
        <thead className="bg-gray-50 font-semibold text-gray-700">
          <tr>
            <th className="px-6 py-4">Cédula</th>
            <th className="px-6 py-4">Nombres</th>
            <th className='px-6 py-4'>Apellidos</th>
            <th className="px-6 py-4">Email</th>
            <th className="px-6 py-4">Teléfono</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white text-gray-600">
          {clientes.map((cliente) => (
            <tr key={cliente.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 font-medium text-gray-900">{cliente.cedula}</td>
              <td className="px-6 py-4">{cliente.nombres}</td>
              <td className="px-6 py-4">{cliente.apellidos}</td>
              <td className="px-6 py-4">{cliente.email || 'No registrado'}</td>
              <td className="px-6 py-4">{cliente.telefono || 'No registrado'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
