import React, { useEffect, useState, useMemo } from 'react';
import { useBodegas } from '../hooks/useBodegas';
import { useMovimientosInventario } from '../hooks/useMovimientosInventario';
import { ModalDetalleMovimiento } from '../components/ModalDetalleMovimiento';
import {
  MovimientoInventario,
  TipoMovimientoInventario,
} from '../types/MovimientoInventarioTypes';

interface PageMovimientosProps {
  isSubcomponent?: boolean;
}

type ModoConsulta = 'bodega' | 'item';

const tiposMovimientoInventario: Array<TipoMovimientoInventario | 'ALL'> = [
  'ALL',
  'Compra',
  'Venta',
  'Devolucion',
];

const formatMovimientoDate = (value: string) => {
  return new Intl.DateTimeFormat('es-EC', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
};

const isEntradaInventario = (tipo: TipoMovimientoInventario) => {
  return tipo === 'Compra' || tipo === 'Devolucion';
};

const getProductoNombre = (movimiento: MovimientoInventario) => {
  return movimiento.item?.nombre ?? `Item #${movimiento.id_item}`;
};

const getBodegaNombre = (movimiento: MovimientoInventario) => {
  return movimiento.bodega?.nombre ?? `Bodega #${movimiento.id_bodega}`;
};

const getReferenciaMovimiento = (movimiento: MovimientoInventario) => {
  if (movimiento.id_compra) return `Compra #${movimiento.id_compra}`;
  if (movimiento.id_venta) return `Venta #${movimiento.id_venta}`;
  return 'Sin referencia';
};

const PageMovimientosReal: React.FC<PageMovimientosProps> = ({ isSubcomponent = false }) => {
  const { bodega, loading: cargandoBodega, error: errorBodega, fetchBodegaEmpresa } = useBodegas();
  const {
    movimientos,
    movimientoDetalle,
    loading,
    loadingDetalle,
    error,
    fetchMovimientosBodega,
    fetchHistorialItem,
    fetchMovimientoDetalle,
    limpiarDetalle,
  } = useMovimientosInventario();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTipo, setSelectedTipo] = useState<TipoMovimientoInventario | 'ALL'>('ALL');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [modoConsulta, setModoConsulta] = useState<ModoConsulta>('bodega');
  const [productoHistorial, setProductoHistorial] = useState<string | null>(null);
  const [detalleCargandoId, setDetalleCargandoId] = useState<number | null>(null);

  useEffect(() => {
    fetchBodegaEmpresa();
  }, [fetchBodegaEmpresa]);

  useEffect(() => {
    if (bodega?.id_bodega) {
      fetchMovimientosBodega(bodega.id_bodega);
    }
  }, [bodega?.id_bodega, fetchMovimientosBodega]);

  const filteredMovimientos = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return movimientos.filter((movimiento) => {
      const searchable = [
        getProductoNombre(movimiento),
        getBodegaNombre(movimiento),
        getReferenciaMovimiento(movimiento),
        movimiento.tipo_movimiento,
        String(movimiento.id_movimiento_inventario),
      ].join(' ').toLowerCase();

      const matchesSearch = !query || searchable.includes(query);
      const matchesTipo = selectedTipo === 'ALL' || movimiento.tipo_movimiento === selectedTipo;

      let matchesFecha = true;
      const movDate = new Date(movimiento.fecha_movimiento);
      if (fechaInicio) {
        matchesFecha = matchesFecha && movDate >= new Date(fechaInicio);
      }
      if (fechaFin) {
        const end = new Date(fechaFin);
        end.setDate(end.getDate() + 1);
        matchesFecha = matchesFecha && movDate < end;
      }

      return matchesSearch && matchesTipo && matchesFecha;
    });
  }, [movimientos, searchTerm, selectedTipo, fechaInicio, fechaFin]);

  const totalEntradas = filteredMovimientos.filter((movimiento) => isEntradaInventario(movimiento.tipo_movimiento)).length;
  const totalSalidas = filteredMovimientos.filter((movimiento) => movimiento.tipo_movimiento === 'Venta').length;
  const cargandoInicial = (loading || cargandoBodega) && movimientos.length === 0;

  const cargarMovimientosBodega = async () => {
    if (!bodega?.id_bodega) return;
    setModoConsulta('bodega');
    setProductoHistorial(null);
    await fetchMovimientosBodega(bodega.id_bodega);
  };

  const cargarHistorialProducto = async (movimiento: MovimientoInventario) => {
    setModoConsulta('item');
    setProductoHistorial(getProductoNombre(movimiento));
    await fetchHistorialItem(movimiento.id_item);
  };

  const abrirDetalle = async (id_movimiento_inventario: number) => {
    setDetalleCargandoId(id_movimiento_inventario);
    await fetchMovimientoDetalle(id_movimiento_inventario);
    setDetalleCargandoId(null);
  };

  const limpiarFiltros = () => {
    setSearchTerm('');
    setSelectedTipo('ALL');
    setFechaInicio('');
    setFechaFin('');
  };

  return (
    <div className={isSubcomponent ? '' : 'min-h-screen bg-gray-50/50 p-6 lg:p-10'}>
      <div className={isSubcomponent ? '' : 'max-w-7xl mx-auto'}>
        {!isSubcomponent && (
          <div className="mb-8">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">
              Movimientos de Inventario
            </h1>
            <p className="text-gray-500 mt-1 font-medium">
              Consulta movimientos, historial por producto y detalle operativo.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-5">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">
              Movimientos
            </p>
            <p className="text-3xl font-black text-gray-900 mt-1">{filteredMovimientos.length}</p>
            <p className="text-xs text-gray-500 mt-1">
              {modoConsulta === 'item' ? productoHistorial : bodega?.nombre ?? 'Bodega de la empresa'}
            </p>
          </div>

          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-5">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">
              Entradas
            </p>
            <p className="text-3xl font-black text-emerald-700 mt-1">{totalEntradas}</p>
            <p className="text-xs text-gray-500 mt-1">Compras y devoluciones</p>
          </div>

          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-5">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">
              Salidas
            </p>
            <p className="text-3xl font-black text-amber-700 mt-1">{totalSalidas}</p>
            <p className="text-xs text-gray-500 mt-1">Ventas registradas</p>
          </div>
        </div>

        {(error || errorBodega) && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl font-medium text-sm">
            {error || errorBodega}
          </div>
        )}

        <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col xl:flex-row gap-4">
            <div className="flex-1 min-w-[220px]">
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-gray-500 mb-2">
                Buscar
              </label>
              <input
                type="text"
                className="block w-full px-4 py-3 border border-gray-100 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                placeholder="Producto, bodega, referencia..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="min-w-[170px]">
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-gray-500 mb-2">
                Tipo
              </label>
              <select
                className="block w-full px-4 py-3 border border-gray-100 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm cursor-pointer"
                value={selectedTipo}
                onChange={(e) => setSelectedTipo(e.target.value as TipoMovimientoInventario | 'ALL')}
              >
                {tiposMovimientoInventario.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo === 'ALL' ? 'Todos' : tipo}
                  </option>
                ))}
              </select>
            </div>

            <div className="min-w-[160px]">
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-gray-500 mb-2">
                Desde
              </label>
              <input
                type="date"
                className="block w-full px-4 py-3 border border-gray-100 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-gray-700"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>

            <div className="min-w-[160px]">
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-gray-500 mb-2">
                Hasta
              </label>
              <input
                type="date"
                className="block w-full px-4 py-3 border border-gray-100 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-gray-700"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-3 mt-4">
            <div className="flex flex-wrap items-center gap-2">
              {modoConsulta === 'item' && (
                <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black">
                  Historial: {productoHistorial}
                </span>
              )}
              <button
                type="button"
                onClick={limpiarFiltros}
                className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 text-xs font-bold tracking-wider transition-colors"
              >
                Limpiar filtros
              </button>
            </div>

            <button
              type="button"
              onClick={cargarMovimientosBodega}
              disabled={!bodega?.id_bodega || loading}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold tracking-wider transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {modoConsulta === 'item' ? 'Ver bodega completa' : 'Actualizar'}
            </button>
          </div>
        </div>

        {cargandoInicial ? (
          <div className="bg-white rounded-[2rem] p-12 text-center border border-gray-100 shadow-sm">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500 mb-3" />
            <p className="text-gray-400 text-sm font-medium">Cargando movimientos...</p>
          </div>
        ) : (
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-150">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-extrabold text-gray-500 tracking-wider">Fecha</th>
                    <th className="px-6 py-4 text-left text-sm font-extrabold text-gray-500 tracking-wider">Producto</th>
                    <th className="px-6 py-4 text-left text-sm font-extrabold text-gray-500 tracking-wider">Bodega</th>
                    <th className="px-6 py-4 text-center text-sm font-extrabold text-gray-500 tracking-wider">Tipo</th>
                    <th className="px-6 py-4 text-right text-sm font-extrabold text-gray-500 tracking-wider">Stock</th>
                    <th className="px-6 py-4 text-left text-sm font-extrabold text-gray-500 tracking-wider">Referencia</th>
                    <th className="px-6 py-4 text-right text-sm font-extrabold text-gray-500 tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-50">
                  {filteredMovimientos.length > 0 ? (
                    filteredMovimientos.map((movimiento) => {
                      const entrada = isEntradaInventario(movimiento.tipo_movimiento);

                      return (
                        <tr key={movimiento.id_movimiento_inventario} className="hover:bg-gray-50/70 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatMovimientoDate(movimiento.fecha_movimiento)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-black text-gray-900">{getProductoNombre(movimiento)}</div>
                            <div className="text-xs text-gray-400">ID: {movimiento.id_item}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {getBodegaNombre(movimiento)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black border ${
                              entrada
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              {movimiento.tipo_movimiento}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className={`text-sm font-black ${entrada ? 'text-emerald-700' : 'text-amber-700'}`}>
                              {entrada ? '+' : '-'}{movimiento.cantidad}
                            </div>
                            <div className="text-xs text-gray-400">
                              {movimiento.stock_anterior} -&gt; {movimiento.stock_nuevo}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {getReferenciaMovimiento(movimiento)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => cargarHistorialProducto(movimiento)}
                                className="px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-[10px] font-bold tracking-wider transition-colors"
                              >
                                Historial
                              </button>
                              <button
                                type="button"
                                onClick={() => abrirDetalle(movimiento.id_movimiento_inventario)}
                                disabled={loadingDetalle && detalleCargandoId === movimiento.id_movimiento_inventario}
                                className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold tracking-wider transition-colors disabled:opacity-60"
                              >
                                {loadingDetalle && detalleCargandoId === movimiento.id_movimiento_inventario ? '...' : 'Detalle'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-14 text-center text-gray-500">
                        <p className="text-lg font-black text-gray-900">Sin movimientos</p>
                        <p className="text-sm mt-1">No se encontraron movimientos con los filtros aplicados.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {movimientoDetalle && (
          <ModalDetalleMovimiento movimiento={movimientoDetalle} onClose={limpiarDetalle} />
        )}
      </div>
    </div>
  );
};

export { PageMovimientosReal as PageMovimientos };

/*
const PageMovimientosMock: React.FC<PageMovimientosProps> = ({ isSubcomponent = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTipo, setSelectedTipo] = useState<TipoMovimiento | 'ALL'>('ALL');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  const filteredMovimientos = useMemo(() => {
    return mockMovimientos.filter((mov) => {
      const matchesSearch = mov.producto_nombre.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTipo = selectedTipo === 'ALL' || mov.tipo === selectedTipo;

      let matchesFecha = true;
      const movDate = new Date(mov.fecha);
      if (fechaInicio) {
        matchesFecha = matchesFecha && movDate >= new Date(fechaInicio);
      }
      if (fechaFin) {
        // Añadimos 1 día para incluir todo el día de fin
        const end = new Date(fechaFin);
        end.setDate(end.getDate() + 1);
        matchesFecha = matchesFecha && movDate < end;
      }

      return matchesSearch && matchesTipo && matchesFecha;
    });
  }, [searchTerm, selectedTipo, fechaInicio, fechaFin]);

  const formatDate = (isoString: string) => {
    return new Intl.DateTimeFormat('es-EC', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(isoString));
  };

  return (
    <div className={isSubcomponent ? "" : "p-8 max-w-7xl mx-auto"}>
      {!isSubcomponent && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Movimientos de Inventario</h1>
          <p className="text-gray-500 mt-1">Historial de ingresos y salidas de productos.</p>
        </div>
      )}

      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px] relative">
          <label className="block text-xs font-medium text-gray-700 mb-1">Producto</label>
          <input
            type="text"
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Buscar producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-medium text-gray-700 mb-1">Tipo de Movimiento</label>
          <select
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm cursor-pointer"
            value={selectedTipo}
            onChange={(e) => setSelectedTipo(e.target.value as TipoMovimiento | 'ALL')}
          >
            <option value="ALL">Todos</option>
            <option value="Ingreso">Ingreso</option>
            <option value="Salida">Salida</option>
          </select>
        </div>

        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-medium text-gray-700 mb-1">Fecha Desde</label>
          <input
            type="date"
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-700 cursor-pointer"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
        </div>

        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-medium text-gray-700 mb-1">Fecha Hasta</label>
          <input
            type="date"
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-700 cursor-pointer"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Bodega
                </th>
                <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Cantidad
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Motivo
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMovimientos.length > 0 ? (
                filteredMovimientos.map((mov) => (
                  <tr key={mov.id_movimiento} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(mov.fecha)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{mov.producto_nombre}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">{mov.bodega_nombre}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${mov.tipo === 'Ingreso'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-orange-50 text-orange-700 border border-orange-200'
                        }`}>
                        {mov.tipo === 'Ingreso' ? (
                          <svg className="-ml-0.5 mr-1.5 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                        ) : (
                          <svg className="-ml-0.5 mr-1.5 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                          </svg>
                        )}
                        {mov.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                      {mov.tipo === 'Ingreso' ? '+' : '-'}{mov.cantidad}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {mov.motivo}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="text-lg font-medium text-gray-900">Sin movimientos</p>
                    <p className="text-sm mt-1">No se encontraron movimientos con los filtros aplicados.</p>
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
*/
