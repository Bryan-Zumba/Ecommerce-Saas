import React from 'react';
import { useNavigate } from 'react-router-dom';

const opciones = [
  {
    id: 'solicitar-compra',
    icon: '+',
    titulo: 'Solicitar registro de compra',
    descripcion: 'Crea una nueva solicitud de compra seleccionando un proveedor y los productos a ingresar.',
    path: '/compras/solicitar',
    colorDesde: 'from-emerald-500',
    colorHasta: 'to-teal-400',
    badge: null,
  },
  {
    id: 'historial-compras',
    icon: 'H',
    titulo: 'Historial de compras',
    descripcion: 'Consulta todas las solicitudes registradas, su estado y detalle de cada operación.',
    path: '/compras/historial',
    colorDesde: 'from-blue-500',
    colorHasta: 'to-indigo-400',
    badge: null,
  },
  {
    id: 'aprobacion-compras',
    icon: 'A',
    titulo: 'Aprobación de compras',
    descripcion: 'Revisa y aprueba o rechaza las solicitudes de compra pendientes.',
    path: null,
    colorDesde: 'from-amber-500',
    colorHasta: 'to-orange-400',
    badge: 'Próximamente',
  },
];

export const PageCompras: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50/50 animate-in fade-in duration-500">
      <main className="max-w-7xl mx-auto p-6 lg:p-10">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            Gestión de compras
          </h1>
          <p className="text-gray-500 mt-1 font-medium text-sm">
            Administra las solicitudes, historial y aprobaciones de compras a proveedores.
          </p>
        </div>

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
                <div className={`h-28 bg-gradient-to-br ${opcion.colorDesde} ${opcion.colorHasta} flex items-center justify-center relative`}>
                  <span className="text-5xl font-black text-white drop-shadow-sm">{opcion.icon}</span>
                  {opcion.badge && (
                    <span className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-white/30">
                      {opcion.badge}
                    </span>
                  )}
                  {esActivo && (
                    <span className="absolute bottom-3 right-4 text-white/70 text-xl font-black transition-transform duration-200 group-hover:translate-x-1">
                      -&gt;
                    </span>
                  )}
                </div>

                <div className="bg-white p-6">
                  <h2 className="text-base font-extrabold text-gray-900 mb-2 leading-tight">
                    {opcion.titulo}
                  </h2>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">
                    {opcion.descripcion}
                  </p>
                  {esActivo && (
                    <div className="mt-4 flex items-center gap-1.5">
                      <span className="text-[10px] font-extrabold text-emerald-600">
                        Ir al módulo
                      </span>
                      <span className="text-emerald-600 text-xs transition-transform duration-200 group-hover:translate-x-1">
                        -&gt;
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


