import React, { useState } from 'react';
import { useReportes } from '../../application/useReportes';
import { TablaInventarioBar } from '../components/TablaInventarioBar';
import { PanelLiquidacionCaja } from '../components/PanelLiquidacionCaja';
import { ModalConfirmarCierre } from '../components/ModalConfirmarCierre';
import { HistorialAuditorias } from '../components/HistorialAuditorias';

export const PageReportes: React.FC = () => {
  const {
    items,
    egresos,
    cierres,
    periodoActual,
    pagoFiscalizacion,
    setPagoFiscalizacion,
    ajustarUsados,
    obtenerBalanceConsolidado,
    cerrarPeriodoContable,
    abrirNuevoPeriodo,
    registrarEgreso,
    reiniciarValoresPrueba,
    periodoActualEstado,
    setPeriodoActualEstado,
    turnosActivos,
    setTurnosActivos
  } = useReportes();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [activeTab, setActiveTab] = useState<'balance' | 'egresos' | 'historial'>('balance');
  const [egresoFiltro, setEgresoFiltro] = useState<'Todos' | 'Stock' | 'Operativo'>('Todos');
  
  // Gasto Operativo Form state
  const [gastoMonto, setGastoMonto] = useState('');
  const [gastoDesc, setGastoDesc] = useState('');
  const [gastoFecha, setGastoFecha] = useState(new Date().toISOString().split('T')[0]);

  const balance = obtenerBalanceConsolidado();

  const handlePrint = () => {
    window.print();
  };

  const handleRegistrarGasto = (e: React.FormEvent) => {
    e.preventDefault();
    const montoNum = parseFloat(gastoMonto);
    if (isNaN(montoNum) || montoNum <= 0) return;
    registrarEgreso(montoNum, gastoDesc, gastoFecha, 'GastoOperativo');
    setGastoMonto('');
    setGastoDesc('');
  };

  // Filtrado de egresos
  const egresosFiltrados = egresos.filter(e => {
    if (egresoFiltro === 'Stock') {
      return e.tipo === 'FacturaProveedor' || e.tipo === 'CompraStock';
    }
    if (egresoFiltro === 'Operativo') {
      return e.tipo === 'GastoExtra' || e.tipo === 'PagoPersonal' || e.tipo === 'GastoOperativo';
    }
    return true;
  });

  const totalEgresosFiltrados = egresosFiltrados.reduce((sum, e) => sum + e.monto, 0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col gap-6 p-4 md:p-8 animate-in fade-in duration-500">
      
      {/* Banner de periodo cerrado */}
      {periodoActualEstado === 'cerrado' && (
        <div className="max-w-8xl mx-auto w-full bg-rose-50 border-l-4 border-rose-500 p-4 rounded-xl flex items-center gap-3 text-rose-800 text-xs font-bold shadow-xs no-print">
          <span>⚠️</span>
          <p>
            El periodo contable actual <strong>"{periodoActual}"</strong> se encuentra <strong>CERRADO</strong>. Las mermas e inventario se han congelado y no se permiten modificaciones ni nuevos egresos.
          </p>
        </div>
      )}

      {/* CABECERA */}
      <header className="max-w-8xl mx-auto w-full flex flex-col md:flex-row md:justify-between md:items-center gap-4 text-left border-b border-gray-200/50 pb-4 no-print">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/50">
            📊 Auditoría Contable y Liquidación
          </span>
          <div className="flex items-center gap-3 mt-2">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              Balance del Bar
            </h1>
            <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
              periodoActualEstado === 'abierto'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-250/30'
                : 'bg-rose-50 text-rose-700 border-rose-250/30'
            }`}>
              {periodoActualEstado === 'abierto' ? '🟢 Abierto' : '🔴 Cerrado'}
            </span>
          </div>
          <p className="text-xs text-gray-500 font-semibold mt-1">
            Revisión en tiempo real de inventarios, ingresos brutos, gastos de facturas, sueldos de ayudantes y neto a caja.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Botón de Reset de Prueba */}
          <button
            onClick={reiniciarValoresPrueba}
            title="Restaurar base de datos simulada con los valores exactos del Excel de bar para auditoría rápida"
            className="px-3.5 py-2 border border-dashed border-gray-300 hover:border-gray-500 text-gray-500 hover:text-gray-700 bg-white font-bold text-xs rounded-xl shadow-2xs hover:shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            🔄 Reset Excel Mock
          </button>

          {/* Botón Imprimir PDF */}
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 hover:text-gray-900 font-bold text-xs rounded-xl shadow-2xs hover:shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            𖖅 Imprimir Balance
          </button>

          {/* Botón de Cierre de Periodo */}
          <button
            onClick={() => setModalAbierto(true)}
            className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs rounded-xl shadow-sm hover:shadow transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            {periodoActualEstado === 'abierto' ? '🔒 Cerrar Periodo Contable' : '🔑 Abrir Nuevo Periodo'}
          </button>
        </div>
      </header>

      {/* PLANTILLA DE IMPRESIÓN (Solo visible al imprimir) */}
      <div className="print-only text-left text-gray-800 font-mono flex flex-col gap-4 border-b-2 border-gray-800 pb-4 mb-2">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold uppercase tracking-tight">SISTEMA DE INVENTARIO Y BALANCE DEL BAR</h1>
            <p className="text-sm font-bold mt-0.5">PERIODO: {periodoActual} ({periodoActualEstado === 'abierto' ? 'ABIERTO' : 'CERRADO'})</p>
          </div>
          <div className="text-right text-[10px]">
            <p>FECHA IMPRESIÓN: {new Date().toLocaleDateString('es-ES')}</p>
            <p>FISCALIZADO POR: Yolanda Bravo</p>
          </div>
        </div>
      </div>

      {/* PESTAÑAS DE NAVEGACIÓN */}
      <div className="max-w-8xl mx-auto w-full flex border-b border-gray-250/60 mb-2 no-print">
        <button
          onClick={() => setActiveTab('balance')}
          className={`py-3 px-6 font-bold text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'balance'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          📊 Balance e Inventario
        </button>
        <button
          onClick={() => setActiveTab('egresos')}
          className={`py-3 px-6 font-bold text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'egresos'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          💸 Egresos y Gastos
        </button>
        <button
          onClick={() => setActiveTab('historial')}
          className={`py-3 px-6 font-bold text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'historial'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          📜 Historial de Auditorías {cierres.length > 0 && (
            <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-[10px] font-black">{cierres.length}</span>
          )}
        </button>
      </div>

      {/* CUERPO SEGÚN LA PESTAÑA SELECCIONADA */}
      <div className="max-w-8xl mx-auto w-full">
        {activeTab === 'balance' && (
          <div className="grid grid-cols-12 gap-6 items-start animate-in fade-in duration-200">
            {/* Columna Izquierda: La gran grilla del bar contable */}
            <div className="col-span-12 xl:col-span-9 flex flex-col gap-4">
              <div className="flex justify-between items-center no-print">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                  <span>📋</span> Inventario Físico y Ventas en el Periodo
                </h3>
                <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded font-mono font-bold">
                  PERIODO ACTIVO: {periodoActual}
                </span>
              </div>
              
              <TablaInventarioBar 
                items={items} 
                onAjustarUsados={ajustarUsados} 
                estaCerrado={periodoActualEstado === 'cerrado'}
              />
            </div>

            {/* Columna Derecha: Paneles de liquidación de caja */}
            <div className="col-span-12 xl:col-span-3 flex flex-col gap-4">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider text-left flex items-center gap-2 no-print">
                <span>💰</span> Liquidación Financiera
              </h3>
              <PanelLiquidacionCaja 
                balance={balance} 
                onCambiarFiscalizacion={setPagoFiscalizacion} 
              />
            </div>
          </div>
        )}

        {activeTab === 'egresos' && (
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col gap-6 text-left no-print animate-in fade-in duration-200">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <h3 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
                  <span>💸</span> Gastos y Egresos del Periodo
                </h3>
                <p className="text-xs text-gray-500 font-semibold mt-0.5">
                  Registra gastos operativos del negocio (luz, transporte, mantenimiento) y filtra por origen.
                </p>
              </div>

              {/* Filtros de egresos */}
              <div className="flex bg-gray-100 p-1 rounded-xl gap-1">
                {(['Todos', 'Stock', 'Operativo'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setEgresoFiltro(filter)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      egresoFiltro === filter
                        ? 'bg-white text-gray-800 shadow-2xs'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    {filter === 'Todos' ? 'Todos' : filter === 'Stock' ? 'Compras de Stock' : 'Gastos Operativos'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
              {/* Formulario para registrar gasto operativo */}
              <div className="col-span-12 md:col-span-4 border-r border-gray-100 pr-0 md:pr-6">
                <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">
                  Registrar Gasto Operativo
                </h4>
                {periodoActualEstado === 'cerrado' ? (
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl text-center text-xs text-gray-400 font-bold">
                    🚫 El periodo está cerrado. No se admiten registros.
                  </div>
                ) : (
                  <form onSubmit={handleRegistrarGasto} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">
                        Monto del Gasto ($)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Ej: 45.50"
                        required
                        value={gastoMonto}
                        onChange={(e) => setGastoMonto(e.target.value)}
                        className="px-3.5 py-2 border border-gray-200 rounded-xl text-sm font-bold bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">
                        Descripción
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: Pago de Luz local, pasajes..."
                        required
                        value={gastoDesc}
                        onChange={(e) => setGastoDesc(e.target.value)}
                        className="px-3.5 py-2 border border-gray-200 rounded-xl text-sm font-bold bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">
                        Fecha
                      </label>
                      <input
                        type="date"
                        required
                        value={gastoFecha}
                        onChange={(e) => setGastoFecha(e.target.value)}
                        className="px-3.5 py-2 border border-gray-200 rounded-xl text-sm font-bold bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-sm hover:shadow active:scale-95 cursor-pointer text-xs"
                    >
                      Añadir Gasto
                    </button>
                  </form>
                )}
              </div>

              {/* Lista filtrada de egresos */}
              <div className="col-span-12 md:col-span-8 flex flex-col gap-4">
                <div className="flex justify-between items-center text-xs font-bold text-gray-500 uppercase tracking-wide">
                  <span>Listado de Egresos Registrados</span>
                  <span className="text-gray-800">
                    Suma: <strong className="font-mono text-rose-700">${totalEgresosFiltrados.toFixed(2)}</strong>
                  </span>
                </div>

                <div className="max-h-[300px] overflow-y-auto custom-scrollbar border border-gray-100 rounded-2xl divide-y divide-gray-100">
                  {egresosFiltrados.length === 0 ? (
                    <div className="p-8 text-center text-xs text-gray-400 font-bold uppercase tracking-wider">
                      No se encontraron egresos bajo este filtro.
                    </div>
                  ) : (
                    egresosFiltrados.map((eg) => {
                      const esStock = eg.tipo === 'FacturaProveedor' || eg.tipo === 'CompraStock';
                      return (
                        <div key={eg.id} className="p-3.5 flex justify-between items-center hover:bg-gray-50/50 transition-colors">
                          <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-800 text-sm">{eg.descripcion}</span>
                              <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                                esStock 
                                  ? 'bg-blue-50 text-blue-700 border-blue-100' 
                                  : 'bg-amber-50 text-amber-700 border-amber-100'
                              }`}>
                                {esStock ? 'Compra Stock' : 'Gasto Operativo'}
                              </span>
                            </div>
                            <span className="text-[10px] text-gray-400 font-bold font-mono">{eg.fecha}</span>
                          </div>
                          <span className="font-mono font-bold text-rose-700 text-sm">
                            -${eg.monto.toFixed(2)}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'historial' && (
          <div className="animate-in fade-in duration-200">
            <HistorialAuditorias cierres={cierres} />
          </div>
        )}
      </div>

      {/* MODAL DE CIERRE Y APERTURA DE PERIODO */}
      <ModalConfirmarCierre
        abierto={modalAbierto}
        onCerrar={() => setModalAbierto(false)}
        balance={balance}
        periodoActual={periodoActual}
        onCerrarPeriodo={cerrarPeriodoContable}
        onConfirmarApertura={abrirNuevoPeriodo}
        turnosActivos={turnosActivos}
        setTurnosActivos={setTurnosActivos}
        periodoActualEstado={periodoActualEstado}
      />

    </div>
  );
};
