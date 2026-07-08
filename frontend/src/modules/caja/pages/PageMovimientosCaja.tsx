import React from 'react';
import { useMovimientosCaja } from '../hooks/useMovimientosCaja';
import { TablaMovimientosCaja } from '../components/TablaMovimientosCaja';
import { PanelDetalleMovimientoCaja } from '../components/PanelDetalleMovimientoCaja';
import { TipoMovimientoCaja } from '../types/MovimientoCajaTypes';

export const PageMovimientosCaja: React.FC = () => {
  const {
    movimientos,
    loading,
    error,
    movimientoSeleccionado,
    loadingDetalle,
    searchTerm,
    setSearchTerm,
    tipoFiltro,
    setTipoFiltro,
    fechaInicio,
    setFechaInicio,
    fechaFin,
    setFechaFin,
    fetchMovimientos,
    selectMovimiento,
    setMovimientoSeleccionado,
    limpiarFiltros,
  } = useMovimientosCaja();

  const handleVerDetalle = (id: number) => {
    selectMovimiento(id);
  };

  const handleCerrarDetalle = () => {
    setMovimientoSeleccionado(null);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex animate-in fade-in duration-500">
      <div className="flex-1 flex flex-col min-w-0">
        <main className="max-w-[1600px] mx-auto p-6 lg:p-10 flex-1 w-full text-left">
          {/* Cabecera */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                💸 Auditoría de caja
              </h1>
              <p className="text-gray-500 mt-1 font-medium text-sm lg:text-base">
                Monitorea los ingresos, egresos y transacciones de caja de la empresa.
              </p>
            </div>
            <button
              type="button"
              onClick={fetchMovimientos}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md shadow-emerald-600/10 active:scale-[0.98]"
            >
              Actualizar
            </button>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm mb-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Buscador */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400">Buscar</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-9 pr-3 py-2.5 border border-gray-100 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm shadow-sm"
                    placeholder="Referencia o responsable..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Tipo de Movimiento */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400">Tipo de movimiento</label>
                <select
                  value={tipoFiltro}
                  onChange={(e) => setTipoFiltro(e.target.value as TipoMovimientoCaja | 'Todos')}
                  className="block w-full px-3 py-2.5 border border-gray-100 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm shadow-sm"
                >
                  <option value="Todos">Todos los tipos</option>
                  <option value="Ingreso">Ingreso</option>
                  <option value="Egreso">Egreso</option>
                  <option value="Apertura">Apertura</option>
                  <option value="Cierre">Cierre</option>
                </select>
              </div>

              {/* Fecha Inicio */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400">Desde</label>
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="block w-full px-3 py-2.5 border border-gray-100 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm shadow-sm"
                />
              </div>

              {/* Fecha Fin */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400">Hasta</label>
                <input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="block w-full px-3 py-2.5 border border-gray-100 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm shadow-sm"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={limpiarFiltros}
                className="px-4 py-2 border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 rounded-xl font-bold text-xs tracking-wider transition-colors"
              >
                Limpiar filtros
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl font-medium">
              ⚠️ {error}
            </div>
          )}

          {/* Tabla de Movimientos */}
          {loading && movimientos.length === 0 ? (
            <div className="bg-white rounded-[2.5rem] p-12 text-center border border-gray-100 shadow-sm">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500 mb-3" />
              <p className="text-gray-400 text-sm font-medium">Cargando movimientos de caja...</p>
            </div>
          ) : (
            <TablaMovimientosCaja
              movimientos={movimientos}
              onVerDetalle={handleVerDetalle}
              idSeleccionado={movimientoSeleccionado?.id_movimiento_caja}
            />
          )}
        </main>
      </div>

      {/* Panel de Detalle */}
      <PanelDetalleMovimientoCaja
        movimiento={movimientoSeleccionado}
        loading={loadingDetalle}
        onClose={handleCerrarDetalle}
      />
    </div>
  );
};
