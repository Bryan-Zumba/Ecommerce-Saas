import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EstadoCompra } from '../types/CompraTypes';
import { useCompras } from '../hooks/useCompras';
import { KPICompras } from '../components/KPICompras';
import { TablaCompras } from '../components/TablaCompras';
import { PanelDetalleCompra } from '../components/PanelDetalleCompra';

const estados: Array<EstadoCompra | 'Todos'> = ['Todos', 'Pendiente', 'Completada', 'Cancelada'];

export const PageHistorialCompras: React.FC = () => {
  const navigate = useNavigate();
  const {
    compras,
    comprasFiltradas,
    detalleCompra,
    compraSeleccionada,
    loading,
    loadingDetalle,
    error,
    busqueda,
    estadoFiltro,
    setBusqueda,
    setEstadoFiltro,
    fetchCompras,
    seleccionarCompra,
  } = useCompras();

  useEffect(() => {
    fetchCompras();
  }, [fetchCompras]);

  return (
    <div className="min-h-screen bg-gray-50/50 animate-in fade-in duration-500">
      <main className="max-w-[1500px] mx-auto p-6 lg:p-10">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-8">
          <div>
            <button
              type="button"
              onClick={() => navigate('/compras')}
              className="text-xs font-black text-emerald-600 mb-3"
            >
              Volver a compras
            </button>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Historial de compras</h1>
            <p className="text-gray-500 mt-1 font-medium text-sm lg:text-base">
              Revisa las solicitudes registradas y consulta su detalle sin salir del listado.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
            <div className="relative flex-1 xl:w-72">
              <input
                type="text"
                className="block w-full px-4 py-3 border border-gray-100 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm shadow-sm"
                placeholder="Buscar factura, compra o proveedor..."
                value={busqueda}
                onChange={(event) => setBusqueda(event.target.value)}
              />
            </div>
            <select
              value={estadoFiltro}
              onChange={(event) => setEstadoFiltro(event.target.value as EstadoCompra | 'Todos')}
              className="px-4 py-3 border border-gray-100 rounded-xl bg-white text-sm font-bold text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
            >
              {estados.map((estado) => (
                <option key={estado} value={estado}>{estado}</option>
              ))}
            </select>
          </div>
        </div>

        <KPICompras compras={compras} />

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl font-medium text-left">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_420px] gap-6 items-start">
          <TablaCompras
            compras={comprasFiltradas}
            compraSeleccionada={compraSeleccionada}
            loading={loading}
            onSeleccionar={seleccionarCompra}
          />
          <PanelDetalleCompra
            compra={compraSeleccionada}
            detalles={detalleCompra}
            loading={loadingDetalle}
          />
        </div>
      </main>
    </div>
  );
};


