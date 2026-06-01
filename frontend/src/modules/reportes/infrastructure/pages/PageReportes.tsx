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
    ejecutarCierrePeriodo,
    reiniciarValoresPrueba
  } = useReportes();

  const [modalAbierto, setModalAbierto] = useState(false);
  const balance = obtenerBalanceConsolidado();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col gap-6 p-4 md:p-8 animate-in fade-in duration-500">
      
      {/* CABECERA (No imprimible completa o adaptada) */}
      <header className="max-w-8xl mx-auto w-full flex flex-col md:flex-row md:justify-between md:items-center gap-4 text-left border-b border-gray-250/20 pb-4 no-print">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/50">
            📊 Auditoría Contable y Liquidación
          </span>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mt-2 flex items-center gap-2">
            Balance del Bar
          </h1>
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
            🖨️ Imprimir Balance
          </button>

          {/* Botón de Cierre de Periodo */}
          <button
            onClick={() => setModalAbierto(true)}
            className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs rounded-xl shadow-sm hover:shadow transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            🔒 Cerrar Periodo Contable
          </button>
        </div>
      </header>

      {/* PLANTILLA DE IMPRESIÓN (Solo visible al imprimir) */}
      <div className="print-only text-left text-gray-800 font-mono flex flex-col gap-4 border-b-2 border-gray-800 pb-4 mb-2">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold uppercase tracking-tight">SISTEMA DE INVENTARIO Y BALANCE DEL BAR</h1>
            <p className="text-sm font-bold mt-0.5">PERIODO: {periodoActual}</p>
          </div>
          <div className="text-right text-[10px]">
            <p>FECHA IMPRESIÓN: {new Date().toLocaleDateString('es-ES')}</p>
            <p>FISCALIZADO POR: Yolanda Bravo</p>
          </div>
        </div>
      </div>

      {/* CUERPO DEL BALANCE: GRID EN DOS COLUMNAS */}
      <main className="max-w-8xl mx-auto w-full grid grid-cols-12 gap-6 items-start">
        
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

      </main>

      {/* SECCIÓN DE HISTORIAL DE AUDITORÍAS (Fondo de página, oculta al imprimir) */}
      <section className="max-w-8xl mx-auto w-full mt-4">
        <HistorialAuditorias cierres={cierres} />
      </section>

      {/* MODAL DE CIERRE DE PERIODO CONTABLE */}
      <ModalConfirmarCierre
        abierto={modalAbierto}
        onCerrar={() => setModalAbierto(false)}
        balance={balance}
        periodoActual={periodoActual}
        onConfirmarCierre={ejecutarCierrePeriodo}
      />

    </div>
  );
};
