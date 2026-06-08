import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuGroups = [
    {
      title: 'Ventas y caja',
      items: [
        { id: 'items', label: 'Tienda de items', icon: '🛒', path: '/items' },
        { id: 'historial', label: 'Historial personal', icon: '📜', path: '/historial' },
      ]
    },
    {
      title: 'Inventario y stock',
      items: [
        { id: 'gestion-items', label: 'Gestión de items', icon: '🛠️', path: '/gestion-items' },
        { id: 'gestion-categorias', label: 'Gestión categorías', icon: '📂', path: '/gestion-categorias' },
        { id: 'bodega', label: 'Configuración de bodega', icon: '🏬', path: '/bodega' },
        { id: 'stock', label: 'Gestión de stock', icon: '📦', path: '/ingreso-stock' },
        { id: 'monitoreo-inventario', label: 'Monitoreo de inventario', icon: '📋', path: '/monitoreo-inventario' },
      ]
    },
    {
      title: 'Finanzas y balance',
      items: [
        { id: 'reportes', label: 'Balance y reportes', icon: '📊', path: '/reportes' },
      ]
    },
    {
      title: 'Administración',
      items: [
        { id: 'clientes', label: 'Gestión de clientes', icon: '👥', path: '/clientes' },
        { id: 'usuarios', label: 'Gestión de usuarios', icon: '🧑‍💻', path: '/usuarios/gestion' },
        { id: 'roles', label: 'Consulta de roles', icon: '🛡️', path: '/roles/consulta' },
        { id: 'cambiar-contrasena', label: 'Cambiar contraseña', icon: '🔑', path: '/cambiar-contrasena' },
      ]
    }
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-screen bg-white border-r border-gray-100 z-50 transition-all duration-300 ease-in-out
          w-64 flex flex-col shadow-xl lg:shadow-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <span className="text-xl font-bold">S</span>
            </div>
            <div className="text-left">
              <h2 className="text-lg font-bold text-gray-800 leading-tight">SaaS Ecommerce</h2>
              <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                Maneja tu negocio en la nube
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 cursor-pointer"
          >
            ×
          </button>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-5 overflow-y-auto custom-scrollbar">
          <button
                    key={'inicio'}
                    onClick={() => {
                      navigate('/');
                      setIsOpen(false);
                    }}
                    className={`
                      flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold transition-all duration-200 cursor-pointer text-left
                      ${location.pathname === '/'
                        ? 'bg-emerald-50 text-emerald-700 shadow-xs'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
                    `}
                  >
                    <span className="text-lg">{'🏠'}</span>
                    <span className="text-xs">{'Inicio'}</span>
                    {location.pathname === '/' && <div className="ml-auto w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />}
                  </button>
          {menuGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="flex flex-col gap-1">
              <p className="text-[10px] font-extrabold text-gray-450 px-3 mb-1.5 text-left border-l-2 border-emerald-500/30 pl-2">
                {group.title}
              </p>

              {group.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      navigate(item.path);
                      setIsOpen(false);
                    }}
                    className={`
                      flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold transition-all duration-200 cursor-pointer text-left
                      ${isActive
                        ? 'bg-emerald-50 text-emerald-700 shadow-xs'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
                    `}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-xs">{item.label}</span>
                    {isActive && <div className="ml-auto w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-50 no-print">
          <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold">
              BZ
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-bold text-gray-800 truncate">Bryan Zumba</p>
              <p className="text-[10px] text-gray-500 truncate">Admin Account</p>
              <a href="/auth/primer-acceso" className="text-[9px] text-emerald-600 hover:text-emerald-700 font-bold block mt-0.5">
                [Probar primer acceso]
              </a>
            </div>
            <a href="/auth">
              <button className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                ↪️
              </button>
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
