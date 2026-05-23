import React, { useMemo } from 'react';
import { TableClientes } from '../components/TableClientes';
import { ApiClienteRepository } from '../ApiClienteRepository';
import { useClientesApi } from '../../application/useClientesApi';
import FiltrosBusqueda from '../components/Busqueda';
import FiltrosClientes from '../components/FiltrosClientes';
// import { useNavigate } from 'react-router-dom';

export const PageClientes: React.FC = () => {
  // const navigate = useNavigate();
  const repository = useMemo(() => new ApiClienteRepository(), []);
  const { clientes, cargando, error, refrescar } = useClientesApi(repository);

  return (
    <div className="min-h-screen bg-gray-50 animate-in fade-in duration-500">
      {/* <nav className="bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-emerald-600 transition-colors font-medium"
          >
            <span className="mr-2">←</span> Ir a la Tienda
          </button>
          <div className="font-bold text-xl text-emerald-600 italic tracking-tighter">SaaS Ecommerce</div>
        </div>
      </nav> */}

      <main className="max-w-7xl mx-auto p-6 lg:p-12">
        <div className="flex justify-between items-center">
          <div className="flex flex-col mb-8 text-left">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Gestión de Clientes</h1>
            <p className="text-gray-500 mt-1 font-medium">Administra tu cartera de clientes, añade nuevos o edita los existentes.</p>
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

        <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <FiltrosBusqueda/>
          {/*<FiltrosClientes/>*/}
          <TableClientes clientes={clientes} cargando={cargando} />
        </div>
      </main>
    </div>

  );
};
