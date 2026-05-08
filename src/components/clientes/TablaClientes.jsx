import React from 'react';

/**
 * TablaClientes - Tabla que muestra la lista de clientes con acciones.
 */
const TablaClientes = ({ data, onEdit, onDelete, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 border border-dashed border-gray-200 rounded-3xl">
        <h3 className="text-gray-500 font-medium">No se encontraron clientes</h3>
        <p className="text-sm text-gray-400 mt-1">Crea uno nuevo para empezar</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
      <table className="w-full text-left text-sm text-gray-600">
        <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-bold">
          <tr>
            <th scope="col" className="px-6 py-4">Cédula / RUC</th>
            <th scope="col" className="px-6 py-4">Nombre</th>
            <th scope="col" className="px-6 py-4">Contacto</th>
            <th scope="col" className="px-6 py-4 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((cliente) => (
            <tr key={cliente.id} className="hover:bg-emerald-50/30 transition-colors">
              <td className="px-6 py-4 font-mono text-gray-900">{cliente.id}</td>
              <td className="px-6 py-4 font-bold text-gray-800">{cliente.nombre}</td>
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="text-gray-900">{cliente.email || '—'}</span>
                  <span className="text-xs text-gray-400">{cliente.telefono || '—'}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(cliente)}
                    className="px-3 py-1.5 text-xs font-bold bg-white border border-gray-200 text-gray-600 rounded-lg hover:border-emerald-400 hover:text-emerald-600 transition-all"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      if(window.confirm(`¿Seguro que deseas eliminar a ${cliente.nombre}?`)) {
                        onDelete(cliente.id);
                      }
                    }}
                    className="px-3 py-1.5 text-xs font-bold bg-white border border-gray-200 text-red-500 rounded-lg hover:border-red-200 hover:bg-red-50 transition-all"
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaClientes;
