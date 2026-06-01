import React from 'react';
import { BalanceConsolidado } from '../../domain/BalanceConsolidado';

interface PanelLiquidacionCajaProps {
  balance: BalanceConsolidado;
  onCambiarFiscalizacion: (monto: number) => void;
}

export const PanelLiquidacionCaja: React.FC<PanelLiquidacionCajaProps> = ({ 
  balance, 
  onCambiarFiscalizacion 
}) => {
  const facturas = balance.egresos.filter(e => e.tipo === 'FacturaProveedor');
  const gastosExtras = balance.egresos.filter(e => e.tipo === 'GastoExtra');
  
  // Suma total de facturas de proveedores
  const totalFacturasCalculado = facturas.reduce((sum, e) => sum + e.monto, 0);
  
  // Suma total de gastos extras
  const totalGastosExtrasCalculado = gastosExtras.reduce((sum, e) => sum + e.monto, 0);

  return (
    <div className="flex flex-col gap-6 text-sm">
      
      {/* 1. INGRESO CONTABLE */}
      <div className="bg-white border border-emerald-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="bg-emerald-600 text-white px-4 py-2 font-bold flex justify-between items-center">
          <span>Ingreso</span>
          <span className="text-xs bg-emerald-700/80 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">Venta de Bar</span>
        </div>
        <div className="p-4 divide-y divide-gray-100 font-medium">
          <div className="flex justify-between py-1.5">
            <span className="text-gray-500">Dinero entrante (Total PVP)</span>
            <span className="font-mono font-bold text-gray-800">${balance.totalIngresos.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 text-emerald-700 font-extrabold bg-emerald-50/20 -mx-4 px-4 mt-1 border-t border-emerald-100">
            <span>Total Ingresos</span>
            <span className="font-mono text-base">${balance.totalIngresos.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* 2. REGISTRO DE FACTURAS (COMPRAS DE STOCK) */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="bg-gray-800 text-white px-4 py-2 font-bold flex justify-between items-center">
          <span>Registro de Facturas</span>
          <span className="text-[10px] bg-gray-700 px-2 py-0.5 rounded font-mono">STOCK COMPRAS</span>
        </div>
        <div className="p-4">
          <div className="max-h-48 overflow-y-auto custom-scrollbar pr-1 flex flex-col gap-1 text-xs font-mono font-semibold">
            <div className="grid grid-cols-12 border-b border-gray-100 pb-1 text-gray-400 font-bold uppercase text-[9px] tracking-widest">
              <span className="col-span-2">N°</span>
              <span className="col-span-6">Detalle / Fecha</span>
              <span className="col-span-4 text-right">Valor</span>
            </div>
            {facturas.map((e, index) => (
              <div key={e.id} className="grid grid-cols-12 py-1 text-gray-600 border-b border-gray-50 hover:bg-gray-50/50">
                <span className="col-span-2 text-gray-400 font-bold">{index + 1}</span>
                <span className="col-span-6 text-left truncate" title={e.descripcion}>
                  {e.descripcion} <span className="text-[9px] text-gray-400 block">{e.fecha}</span>
                </span>
                <span className="col-span-4 text-right font-bold text-gray-800">${e.monto.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between py-2 text-gray-700 font-bold bg-gray-50 -mx-4 px-4 mt-3 border-t border-gray-200">
            <span>Total Facturas</span>
            <span className="font-mono text-gray-900">${totalFacturasCalculado.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* 3. DESGLOSE EXPLICATIVO / GASTOS EXTRAS */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="bg-sky-600 text-white px-4 py-2 font-bold flex justify-between items-center">
          <span>Gastos Extras / Operativos</span>
          <span className="text-[10px] bg-sky-700 px-2 py-0.5 rounded font-semibold uppercase">Desglose</span>
        </div>
        <div className="p-4">
          <div className="max-h-40 overflow-y-auto custom-scrollbar pr-1 flex flex-col gap-1 text-xs font-mono font-semibold">
            <div className="grid grid-cols-12 border-b border-gray-100 pb-1 text-gray-400 font-bold uppercase text-[9px] tracking-widest">
              <span className="col-span-2">N°</span>
              <span className="col-span-6">Nombre del Gasto</span>
              <span className="col-span-4 text-right">Valor</span>
            </div>
            {gastosExtras.length === 0 ? (
              <div className="text-center text-gray-400 py-4 font-bold text-[10px] uppercase">Ningún gasto registrado</div>
            ) : (
              gastosExtras.map((e, index) => (
                <div key={e.id} className="grid grid-cols-12 py-1 text-gray-600 border-b border-gray-50 hover:bg-gray-50/50">
                  <span className="col-span-2 text-gray-400 font-bold">{index + 1}</span>
                  <span className="col-span-6 text-left truncate">{e.descripcion}</span>
                  <span className="col-span-4 text-right font-bold text-gray-800">${e.monto.toFixed(2)}</span>
                </div>
              ))
            )}
          </div>
          <div className="flex justify-between py-2 text-sky-700 font-bold bg-sky-50/30 -mx-4 px-4 mt-3 border-t border-gray-200">
            <span>Total Gastos Extras</span>
            <span className="font-mono text-sky-900">${totalGastosExtrasCalculado.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* 4. RESUMEN DE EGRESOS */}
      <div className="bg-white border border-rose-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="bg-rose-600 text-white px-4 py-2 font-bold flex justify-between items-center">
          <span>Resumen de Egresos</span>
          <span className="text-[10px] bg-rose-700/80 px-2 py-0.5 rounded font-mono font-bold">TOTALES</span>
        </div>
        <div className="p-4 divide-y divide-gray-100 font-medium">
          <div className="flex justify-between py-1.5">
            <span className="text-gray-500">Total Facturas (Stock + Pasajes)</span>
            <span className="font-mono text-gray-800">${totalFacturasCalculado.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-gray-500">Gastos Extras / Operativos</span>
            <span className="font-mono text-gray-800">${totalGastosExtrasCalculado.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-gray-500">Personal & Auditorías</span>
            <span className="font-mono text-gray-800">${balance.totalPagoPersonal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 text-rose-700 font-extrabold bg-rose-50/20 -mx-4 px-4 mt-1 border-t border-rose-100">
            <span>Total Egresos</span>
            <span className="font-mono text-base">${balance.totalEgresos.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* 5. DINERO RESTANTE (NETO FINAL A CAJA) */}
      <div className="bg-white border border-indigo-200 rounded-[2rem] shadow-md overflow-hidden ring-4 ring-indigo-50/30">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-5 py-3 font-bold flex justify-between items-center">
          <span className="text-sm tracking-tight">Dinero Restante</span>
          <span className="text-[10px] bg-indigo-500/80 px-2.5 py-0.5 rounded-full font-extrabold uppercase tracking-wide">Caja Liquidación</span>
        </div>
        <div className="p-5 divide-y divide-gray-100 font-semibold text-gray-700">
          <div className="flex justify-between py-2">
            <span className="text-gray-500">Ingreso (Ventas PVP)</span>
            <span className="font-mono text-emerald-600">+${balance.totalIngresos.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-500">Egreso (Consolidado)</span>
            <span className="font-mono text-rose-600">-${balance.totalEgresos.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-3 text-indigo-700 font-black bg-indigo-50 -mx-5 px-5 mt-1 border-t border-indigo-100">
            <span className="text-sm">Total Neto a Caja</span>
            <span className="font-mono text-lg">${balance.dineroNetoCaja.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* 6. DINERO EN PRODUCTO EN PERCHA (ACTIVO EN ESTANTERÍAS) */}
      <div className="bg-gradient-to-tr from-amber-500 to-amber-600 text-white rounded-2xl p-4 shadow-sm relative overflow-hidden">
        <div className="absolute right-3 bottom-0 text-7xl opacity-10">📦</div>
        <div className="flex flex-col gap-1 relative z-10">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-100">Capital Físico / Inventario</span>
          <span className="text-xs font-bold text-amber-50">Dinero en producto en Percha</span>
          <span className="text-2xl font-black font-mono mt-1">${balance.valorMercaderiaPercha.toFixed(2)}</span>
        </div>
      </div>

    </div>
  );
};
