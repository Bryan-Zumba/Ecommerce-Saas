import React, { useState } from 'react';
import { CierrePeriodo } from '../../domain/CierrePeriodo';

interface HistorialAuditoriasProps {
  cierres: CierrePeriodo[];
}

export const HistorialAuditorias: React.FC<HistorialAuditoriasProps> = ({ cierres }) => {
  const [cierreSeleccionado, setCierreSeleccionado] = useState<CierrePeriodo | null>(null);

  if (cierres.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4 text-left no-print">
      
      <div>
        <h3 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
          <span>📜</span> Historial de Periodos Cerrados (Auditorías)
        </h3>
        <p className="text-xs text-gray-500 font-semibold mt-0.5">
          Consulta los totales financieros y las fotos de inventario tomadas en balances anteriores.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6 items-start">
        
        {/* Lista de cierres */}
        <div className="col-span-12 md:col-span-4 flex flex-col gap-2 max-h-64 overflow-y-auto custom-scrollbar pr-2">
          {cierres.map((c) => {
            const esActivo = cierreSeleccionado?.id === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setCierreSeleccionado(esActivo ? null : c)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all flex flex-col gap-1 cursor-pointer font-semibold ${
                  esActivo 
                    ? 'bg-gray-900 text-white border-gray-900 shadow-md' 
                    : 'bg-gray-50 border-gray-150 hover:bg-gray-100 text-gray-800'
                }`}
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[10px] opacity-75 font-bold uppercase tracking-wider">{c.fechaCierre}</span>
                  <span className="text-[10px] font-mono opacity-80 bg-white/10 px-1.5 py-0.5 rounded">ID: {c.id.substring(0, 7)}</span>
                </div>
                <span className="text-sm font-black truncate">{c.periodo}</span>
                <div className="flex justify-between text-xs mt-1 border-t border-current/10 pt-1.5 opacity-90 font-mono">
                  <span>Neto Caja:</span>
                  <span className="font-extrabold">${c.dineroNetoCaja.toFixed(2)}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detalle del cierre seleccionado */}
        <div className="col-span-12 md:col-span-8 bg-gray-50 border border-gray-150 rounded-2xl p-5 min-h-64 flex flex-col justify-center">
          {!cierreSeleccionado ? (
            <div className="text-center py-12 text-gray-400 font-bold text-xs uppercase tracking-wider flex flex-col gap-2">
              <span className="text-3xl">🔍</span>
              Selecciona un periodo del historial para auditar su detalle contable
            </div>
          ) : (
            <div className="flex flex-col gap-4 text-xs font-semibold text-gray-700 animate-in fade-in duration-200">
              
              <div className="flex justify-between items-start border-b border-gray-200 pb-3">
                <div>
                  <h4 className="text-base font-black text-gray-900">{cierreSeleccionado.periodo}</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Clausurado el {cierreSeleccionado.fechaCierre}</p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase">Cerrado Correctamente</span>
              </div>

              {/* Grid Contable */}
              <div className="grid grid-cols-3 gap-4 font-bold">
                <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-2xs">
                  <span className="text-[9px] text-gray-400 uppercase tracking-widest block mb-0.5">Ingresos Totales</span>
                  <span className="font-mono text-base text-emerald-700">${cierreSeleccionado.totalIngresos.toFixed(2)}</span>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-2xs">
                  <span className="text-[9px] text-gray-400 uppercase tracking-widest block mb-0.5">Egresos Totales</span>
                  <span className="font-mono text-base text-rose-700">${cierreSeleccionado.totalEgresos.toFixed(2)}</span>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-2xs">
                  <span className="text-[9px] text-gray-400 uppercase tracking-widest block mb-0.5">Neto a Caja</span>
                  <span className="font-mono text-base text-indigo-700">${cierreSeleccionado.dineroNetoCaja.toFixed(2)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 font-bold border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Auditoría Fiscal:</span>
                  <span className="font-mono text-gray-800">${cierreSeleccionado.pagoFiscalizacion.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Valor en Perchas:</span>
                  <span className="font-mono text-amber-700">${cierreSeleccionado.valorMercaderiaPercha.toFixed(2)}</span>
                </div>
              </div>

              {/* Foto de inventario */}
              <div className="flex flex-col gap-1.5 mt-2">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-extrabold border-b border-gray-200 pb-1">
                  Foto de Inventario Congelada ({cierreSeleccionado.fotoInventario.length} Productos)
                </span>
                <div className="max-h-36 overflow-y-auto custom-scrollbar flex flex-col gap-1 pr-1 font-mono text-[11px]">
                  {cierreSeleccionado.fotoInventario.map(item => (
                    <div key={item.id_item} className="flex flex-col py-1.5 border-b border-gray-150/40 hover:bg-white/40 px-2 rounded">
                      <div className="flex justify-between">
                        <span className="font-bold text-gray-700 truncate max-w-xs">{item.nombre}</span>
                        <div className="flex gap-3 font-bold">
                          <span className="text-gray-400">Merma: <strong className="text-rose-600">{item.usados}</strong></span>
                          <span className="text-gray-800">Stock: <strong>{item.stockFinal}</strong></span>
                        </div>
                      </div>
                      {item.distribucionBodegas && (
                        <div className="flex gap-4 text-[9px] text-gray-400 pl-2 mt-0.5 font-sans">
                          {item.distribucionBodegas.map((b, bIdx) => (
                            <span key={bIdx} className="flex items-center gap-0.5">
                              🏢 {b.bodega}: <strong className="text-gray-600">{b.cantidad} u</strong>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>

      </div>

    </div>
  );
};
