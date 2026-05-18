import React, { useMemo } from 'react';
import { TableClientes } from './TableClientes';
import { ApiClienteRepository } from '../ApiClienteRepository';
import { useClientesApi } from '../../application/useClientesApi';


export const PageClientes: React.FC = () => {
  const repository = useMemo(() => new ApiClienteRepository(), []);
  const { clientes, cargando, error, refrescar } = useClientesApi(repository);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Gestión de Clientes</h1>
          <p className="text-gray-500">Módulo modular conectado a la API real.</p>
        </div>
        <button
          onClick={refrescar}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold shadow transition-all"
        >
          Refrescar Lista
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl font-medium">
          ⚠️ {error}
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <TableClientes clientes={clientes} cargando={cargando} />
      </div>
    </div>
  );
};
