import React, { useState, useEffect } from 'react';
import { servicioHistorial } from '@/modules/ventas/infrastructure/repositories/servicioHistorial';
import ModalDetalleOperacion from '@/modules/ventas/infrastructure/components/ModalDetalleOperacion';

/**
 * Página principal de Gestión de Historial Personal
 * Implementa HU 1.1, HU 1.2 y HU 2.1
 */
function HistorialPersonal() {
  const [tabActiva, setTabActiva] = useState('hoy'); // 'hoy' o 'todo'
  const [operaciones, setOperaciones] = useState([]);
  const [operacionSeleccionada, setOperacionSeleccionada] = useState(null);
  
  // Estados para filtros (HU 1.1)
  const [filtroCodigo, setFiltroCodigo] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');

  // Carga y filtrado (HU 1.1)
  useEffect(() => {
    let baseData = [];
    if (tabActiva === 'hoy') {
      baseData = servicioHistorial.obtenerVentasDelDia();
    } else {
      baseData = servicioHistorial.obtenerTodo();
    }

    // Aplicar filtros de la HU 1.1
    let filtrados = baseData;
    
    if (filtroCodigo) {
      filtrados = filtrados.filter(op => 
        op.ordenId.toString().toLowerCase().includes(filtroCodigo.toLowerCase())
      );
    }
    
    if (filtroFecha) {
      const fechaFiltro = new Date(filtroFecha).toLocaleDateString();
      filtrados = filtrados.filter(op => 
        new Date(op.fechaRegistro).toLocaleDateString() === fechaFiltro
      );
    }

    setOperaciones(filtrados);
  }, [tabActiva, filtroCodigo, filtroFecha]);

  // Cálculo del total de ventas del día actual
  const totalVentasHoy = servicioHistorial.obtenerVentasDelDia().reduce((acc, op) => acc + (op.total || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 lg:p-12 animate-in fade-in duration-500">
      <div className="max-w-6xl mx-auto">
        
        {/* Cabecera de la Página */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div className="text-left">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
              Historial <span className="text-emerald-600">Personal</span>
            </h1>
            <p className="text-gray-500 font-medium max-w-md">
              Consulta tus ventas del día, el estado de tus solicitudes de stock y revisa el detalle de cada operación.
            </p>
          </div>
          
          {/* Card de Resumen Rápido */}
          <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-gray-100 border border-gray-100 flex items-center gap-5 group transition-all hover:scale-105">
            <div className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-emerald-200 group-hover:rotate-12 transition-transform">
              💰
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Ventas de Hoy</p>
              <p className="text-3xl font-black text-emerald-600 font-mono tracking-tighter">
                ${totalVentasHoy.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        {/* Selectores de Pestaña y Filtros (HU 1.1) */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div className="flex gap-2 p-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <button 
              onClick={() => { setTabActiva('hoy'); setFiltroFecha(''); }}
              className={`px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
                tabActiva === 'hoy' 
                ? 'bg-gray-900 text-white shadow-lg' 
                : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
              }`}
            >
              Ventas de hoy
            </button>
            <button 
              onClick={() => setTabActiva('todo')}
              className={`px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
                tabActiva === 'todo' 
                ? 'bg-gray-900 text-white shadow-lg' 
                : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
              }`}
            >
              Historial Completo
            </button>
          </div>

          {/* Panel de Filtros */}
          <div className="flex flex-wrap gap-4 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-64">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs">🔍</span>
              <input 
                type="text" 
                placeholder="Buscar por código..." 
                value={filtroCodigo}
                onChange={(e) => setFiltroCodigo(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl border border-gray-100 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-sm"
              />
            </div>
            <div className="relative flex-1 lg:w-48">
              <input 
                type="date" 
                value={filtroFecha}
                onChange={(e) => setFiltroFecha(e.target.value)}
                className="w-full px-4 py-3 bg-white rounded-2xl border border-gray-100 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-sm"
              />
            </div>
            {(filtroCodigo || filtroFecha) && (
              <button 
                onClick={() => { setFiltroCodigo(''); setFiltroFecha(''); }}
                className="px-4 py-3 bg-red-50 text-red-500 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-red-100 transition-all"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Listado de Movimientos */}
        <div className="grid grid-cols-1 gap-4">
          {operaciones.length === 0 ? (
            <div className="bg-white p-20 rounded-[2.5rem] border-2 border-dashed border-gray-200 text-center">
              <div className="text-5xl mb-4 opacity-20">📂</div>
              <h3 className="text-lg font-bold text-gray-400">No se encontraron movimientos registrados</h3>
              <p className="text-sm text-gray-300 mt-1">Tus nuevas operaciones aparecerán aquí automáticamente.</p>
            </div>
          ) : (
            operaciones.map((op) => (
              <div 
                key={op.idInterno}
                onClick={() => setOperacionSeleccionada(op)}
                className="bg-white p-6 rounded-3xl border border-gray-100 hover:border-emerald-500 hover:shadow-2xl hover:shadow-emerald-100 transition-all cursor-pointer group flex flex-col sm:flex-row items-center justify-between gap-6"
              >
                <div className="flex items-center gap-6 w-full sm:w-auto">
                  {/* Icono de Tipo */}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110 ${
                    op.tipo === 'venta' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {op.tipo === 'venta' ? '🛒' : '📦'}
                  </div>
                  
                  <div className="text-left flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${
                        op.tipo === 'venta' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-blue-100 text-blue-700'
                      }`}>
                        {op.tipo === 'venta' ? 'Venta Realizada' : 'Ingreso de Stock'}
                      </span>
                      <span className="text-[10px] text-gray-400 font-bold font-mono">#{op.ordenId}</span>
                    </div>
                    <h3 className="font-black text-gray-800 text-lg leading-tight mb-1">
                      {op.tipo === 'venta' ? op.cliente?.nombre : `Factura: ${op.datosFactura?.codigo}`}
                    </h3>
                    <div className="flex items-center gap-3 text-[11px] text-gray-400 font-bold uppercase tracking-wide">
                      <span>🕒 {new Date(op.fechaRegistro).toLocaleTimeString()}</span>
                      {op.tipo === 'stock' && (
                        <span className="flex items-center gap-1 text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md">
                          <span className="animate-pulse">●</span> {op.estado}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-10 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0">
                  <div className="text-right">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1 text-right">Monto Operación</p>
                    <p className={`font-black text-2xl font-mono tracking-tighter ${
                      op.tipo === 'venta' ? 'text-emerald-600' : 'text-blue-600'
                    }`}>
                      ${(op.total || Number(op.datosFactura?.total || 0)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                    →
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal de Detalle de Operación */}
      {operacionSeleccionada && (
        <ModalDetalleOperacion 
          operacion={operacionSeleccionada}
          onClose={() => setOperacionSeleccionada(null)}
        />
      )}
    </div>
  );
}

export default HistorialPersonal;
