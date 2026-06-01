import React, { useState } from 'react';
import { BalanceConsolidado } from '../../domain/BalanceConsolidado';

interface ModalConfirmarCierreProps {
  abierto: boolean;
  onCerrar: () => void;
  balance: BalanceConsolidado;
  periodoActual: string;
  onConfirmarCierre: (nuevoNombrePeriodo: string) => void;
}

export const ModalConfirmarCierre: React.FC<ModalConfirmarCierreProps> = ({
  abierto,
  onCerrar,
  balance,
  periodoActual,
  onConfirmarCierre
}) => {
  const [nuevoPeriodo, setNuevoPeriodo] = useState('');
  const [confirmadoCheck, setConfirmadoCheck] = useState(false);
  const [errorInput, setErrorInput] = useState('');

  if (!abierto) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoPeriodo.trim()) {
      setErrorInput('Por favor ingrese el nombre del nuevo mes/periodo.');
      return;
    }
    if (!confirmadoCheck) {
      setErrorInput('Debe confirmar que ha verificado el stock físico en percha.');
      return;
    }

    setErrorInput('');
    onConfirmarCierre(nuevoPeriodo.trim());
    setNuevoPeriodo('');
    setConfirmadoCheck(false);
    onCerrar();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200 text-left">
        
        {/* Cabecera */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-6 relative">
          <button 
            onClick={onCerrar} 
            className="absolute top-5 right-5 text-gray-300 hover:text-white transition-colors cursor-pointer text-lg"
          >
            ✕
          </button>
          <div className="flex items-center gap-3">
            <span className="text-3xl">🔒</span>
            <div>
              <h3 className="text-xl font-bold tracking-tight">Ejecutar Cierre Contable</h3>
              <p className="text-xs text-gray-400 font-semibold mt-0.5 uppercase tracking-wider">Rendición de Cuentas y Apertura</p>
            </div>
          </div>
        </div>

        {/* Cuerpo */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          
          {/* Advertencia Informativa */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex gap-3 text-amber-800 text-xs font-semibold leading-relaxed">
            <span className="text-lg">⚠️</span>
            <div>
              <p className="font-bold mb-0.5">Acción Crítica del Periodo</p>
              <p className="text-amber-700/90 font-medium">
                Al cerrar el periodo <strong className="text-amber-900">"{periodoActual}"</strong>, el sistema guardará una foto del inventario y las finanzas. 
                El stock disponible actual en <strong>"Percha"</strong> se convertirá de forma automática en el <strong>"Ingreso Total" (Stock Inicial)</strong> del nuevo mes contable.
              </p>
            </div>
          </div>

          {/* Resumen de Caja a Congelar */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex flex-col gap-1.5 text-xs text-gray-600 font-bold">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-1 border-b border-gray-200/50 pb-1">Valores a Congelar</p>
            <div className="flex justify-between">
              <span>Dinero Entrante (Ventas)</span>
              <span className="font-mono text-emerald-700">${balance.totalIngresos.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Egresos Consolidados (Facturas + Ayudante)</span>
              <span className="font-mono text-rose-700">${balance.totalEgresos.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200/50 pt-1 text-gray-800 font-extrabold">
              <span>Ingreso Neto a Caja</span>
              <span className="font-mono text-indigo-700">${balance.dineroNetoCaja.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Capital en Percha (Heredado)</span>
              <span className="font-mono text-amber-700">${balance.valorMercaderiaPercha.toFixed(2)}</span>
            </div>
          </div>

          {/* Nombre del nuevo Periodo */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="nuevoPeriodo" className="text-xs font-bold text-gray-700 uppercase tracking-wide">
              Nombre del Nuevo Periodo Contable
            </label>
            <input
              type="text"
              id="nuevoPeriodo"
              value={nuevoPeriodo}
              onChange={(e) => setNuevoPeriodo(e.target.value)}
              placeholder="Ej: Junio 2026 - Julio 2026"
              className="px-4 py-2.5 border border-gray-200 rounded-xl font-bold bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-gray-800/20 focus:border-gray-800"
            />
          </div>

          {/* Checklist de Confirmación */}
          <label className="inline-flex items-start gap-2.5 cursor-pointer text-xs font-bold text-gray-700 select-none">
            <input
              type="checkbox"
              checked={confirmadoCheck}
              onChange={(e) => setConfirmadoCheck(e.target.checked)}
              className="mt-0.5 rounded border-gray-300 text-gray-900 focus:ring-gray-900 cursor-pointer w-4 h-4"
            />
            <span>
              He verificado físicamente el inventario en estantería y confirmo que las columnas de "Usados" y "Perchas" en la grilla coinciden al 100% con la realidad.
            </span>
          </label>

          {/* Error feedback */}
          {errorInput && (
            <p className="text-rose-600 text-xs font-bold text-center">
              ⚠️ {errorInput}
            </p>
          )}

          {/* Acciones */}
          <div className="flex gap-3 mt-2 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={onCerrar}
              className="flex-1 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold rounded-xl transition-all cursor-pointer text-center text-xs"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-all shadow cursor-pointer text-center text-xs"
            >
              Confirmar Cierre y Abrir Periodo
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
