import React from 'react';
import { useNavigate } from 'react-router-dom';

// ─── Definición de las opciones del menú de Compras ───────────────────────────
const opciones = [
  {
    id: 'solicitar-compra',
    icon: '🧾',
    titulo: 'Solicitar Registro de Compra',
    descripcion: 'Crea una nueva solicitud de compra seleccionando un proveedor y los productos a ingresar.',
    path: '/compras/solicitar',
    colorDesde: 'from-emerald-500',
    colorHasta: 'to-teal-400',
    badge: null,
  },
  {
    id: 'historial-compras',
    icon: '📋',
    titulo: 'Historial de Compras',
    descripcion: 'Consulta todas las solicitudes registradas, su estado y detalle de cada operación.',
    path: null, // próximamente
    colorDesde: 'from-blue-500',
    colorHasta: 'to-indigo-400',
    badge: 'Próximamente',
  },
  {
    id: 'aprobacion-compras',
    icon: '✅',
    titulo: 'Aprobación de Compras',
    descripcion: 'Revisa y aprueba o rechaza las solicitudes de compra pendientes.',
    path: null,
    colorDesde: 'from-amber-500',
    colorHasta: 'to-orange-400',
    badge: 'Próximamente',
  },
];

// ══════════════════════════════════════════════════════════════════════════════
export const PageCompras: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50/50 animate-in fade-in duration-500">
      <main className="max-w-7xl mx-auto p-6 lg:p-10">

        {/* ── Cabecera ── */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            🛒 Gestión de Compras
          </h1>
          <p className="text-gray-500 mt-1 font-medium text-sm">
            Administra las solicitudes, historial y aprobaciones de compras a proveedores.
          </p>
        </div>

        {/* ── Grid de tarjetas ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {opciones.map((opcion) => {
            const esActivo = opcion.path !== null;
            return (
              <button
                key={opcion.id}
                onClick={() => esActivo && navigate(opcion.path!)}
                disabled={!esActivo}
                className={`
                  relative text-left rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm
                  transition-all duration-200 group
                  ${esActivo
                    ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer'
                    : 'opacity-60 cursor-not-allowed'}
                `}
              >
                {/* Gradiente superior */}
                <div className={`h-28 bg-gradient-to-br ${opcion.colorDesde} ${opcion.colorHasta} flex items-center justify-center relative`}>
                  <span className="text-5xl drop-shadow-sm">{opcion.icon}</span>
                  {/* Badge próximamente */}
                  {opcion.badge && (
                    <span className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full border border-white/30">
                      {opcion.badge}
                    </span>
                  )}
                  {/* Flecha animada al hover */}
                  {esActivo && (
                    <span className="absolute bottom-3 right-4 text-white/70 text-xl font-black transition-transform duration-200 group-hover:translate-x-1">
                      →
                    </span>
                  )}
                </div>

                {/* Contenido */}
                <div className="bg-white p-6">
                  <h2 className="text-base font-extrabold text-gray-900 mb-2 leading-tight">
                    {opcion.titulo}
                  </h2>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">
                    {opcion.descripcion}
                  </p>
                  {esActivo && (
                    <div className="mt-4 flex items-center gap-1.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600">
                        Ir al módulo
                      </span>
                      <span className="text-emerald-600 text-xs transition-transform duration-200 group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
};
