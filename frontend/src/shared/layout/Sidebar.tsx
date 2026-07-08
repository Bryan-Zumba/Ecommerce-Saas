import { AuthService } from '@/modules/auth/services/AuthService';
import { supabase } from '@/supabase';
import React, { useState, useRef, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/shared/context/auth/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario, logout } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const primerNombre = usuario?.nombres?.split(' ')[0] || '';
  const primerApellido = usuario?.apellidos?.split(' ')[0] || '';
  const initiales = `${primerNombre.charAt(0)}${primerApellido.charAt(0)}`.toUpperCase();


  const menuGroups = [
    {
      title: 'Ventas y caja',
      items: [
        { id: 'catalogo', label: 'Catálogo de Ventas (NUEVO)', icon: '✨', path: '/ventas/catalogo' },
        { id: 'items', label: 'Tienda de items (VIEJO)', icon: '🛒', path: '/items' },
        { id: 'historial', label: 'Historial personal', icon: '📜', path: '/historial' },
      ]
    },
    {
      title: 'Inventario y stock',
      items: [
        { id: 'gestion-items', label: 'Gestión de items', icon: '🛠️', path: '/gestion-items' },
        { id: 'gestion-categorias', label: 'Gestión categorías', icon: '📂', path: '/gestion-categorias' },
        { id: 'bodega', label: 'Configuración de bodega', icon: '🏬', path: '/bodega' },
        { id: 'inventario', label: 'Existencias (Inventario)', icon: '📦', path: '/inventario' },
        { id: 'monitoreo-inventario', label: 'Monitoreo de inventario', icon: '📋', path: '/monitoreo-inventario' },
        { id: 'solicitar-compra', label: 'Compras', icon: '🛒', path: '/compras' },
      ]
    },
    {
      title: 'Finanzas y balance',
      items: [
        { id: 'reportes', label: 'Balance y reportes', icon: '📊', path: '/reportes' },
        { id: 'movimientos-caja', label: 'Movimientos de caja', icon: '💸', path: '/movimientos-caja' },
      ]
    },
    {
      title: 'Administración',
      items: [
        { id: 'proveedores', label: 'Gestión de proveedores', icon: '🚚', path: '/proveedores' },
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
              <h2 className="text-[16px] font-bold text-gray-800 leading-tight">SaaS Ecommerce</h2>
              <span className="text-[12px] text-emerald-600 font-bold">
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

        <nav className="flex-1 p-3 flex flex-col gap-3 overflow-y-auto custom-scrollbar">
          <button
                    key={'inicio'}
                    onClick={() => {
                      navigate('/');
                      setIsOpen(false);
                    }}
                    className={`
                      flex items-center gap-3 px-3 py-1.5 rounded-xl font-bold transition-all duration-200 cursor-pointer text-left
                      ${location.pathname === '/'
                        ? 'bg-emerald-50 text-emerald-700 shadow-xs'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
                    `}
                  >
                    <span className="text-lg">{'🏠'}</span>
                    <span className="text-[12px]">{'Inicio'}</span>
                    {location.pathname === '/' && <div className="ml-auto w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />}
                  </button>
          {menuGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="flex flex-col gap-1">
              <p className="text-[12px] font-bold text-gray-400 px-3 mb-1.5 text-left border-l-2 border-emerald-500/30 pl-2">
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
                      flex items-center gap-3 px-3 py-1.5 rounded-xl font-bold transition-all duration-200 cursor-pointer text-left
                      ${isActive
                        ? 'bg-emerald-50 text-emerald-700 shadow-xs'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
                    `}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-[12px]">{item.label}</span>
                    {isActive && <div className="ml-auto w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-50 no-print relative" ref={menuRef}>
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="w-full bg-gray-50 rounded-2xl p-4 flex items-center gap-3 hover:bg-gray-100 transition-colors cursor-pointer text-left"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold shrink-0">
              {initiales}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-bold text-gray-800 truncate">{primerNombre} {primerApellido}</p>
              <p className="text-[12px] text-gray-500 truncate">{usuario?.email || 'Admin Account'}</p>
            </div>
            <div className="text-gray-400 shrink-0">
              <i className={`fas fa-chevron-${isProfileMenuOpen ? 'down' : 'up'} text-xs`}></i>
            </div>
          </button>

          {/* Menú Desplegable */}
          <div className={`
            absolute bottom-full left-4 right-4 mb-2 bg-white border border-gray-100 shadow-xl rounded-xl overflow-hidden z-[60]
            transition-all duration-200 origin-bottom
            ${isProfileMenuOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}
          `}>
            <div className="flex flex-col py-2">
              <button
                onClick={() => {
                  navigate('/perfil');
                  setIsProfileMenuOpen(false);
                  setIsOpen(false);
                }}
                className="px-4 py-2.5 text-left text-[14px] text-gray-700 hover:bg-gray-50 hover:text-emerald-700 transition-colors flex items-center gap-2 font-medium"
              >
                <i className="fas fa-user w-5 text-center text-gray-400"></i> Mi perfil
              </button>
              
              <button
                onClick={() => {
                  navigate('/perfil');
                  setIsProfileMenuOpen(false);
                  setIsOpen(false);
                }}
                className="px-4 py-2.5 text-left text-[14px] text-gray-700 hover:bg-gray-50 hover:text-emerald-700 transition-colors flex items-center gap-2 font-medium"
              >
                <i className="fas fa-edit w-5 text-center text-gray-400"></i> Editar información personal
              </button>
              
              <button
                onClick={() => {
                  navigate('/cambiar-contrasena');
                  setIsProfileMenuOpen(false);
                  setIsOpen(false);
                }}
                className="px-4 py-2.5 text-left text-[14px] text-gray-700 hover:bg-gray-50 hover:text-emerald-700 transition-colors flex items-center gap-2 font-medium"
              >
                <i className="fas fa-key w-5 text-center text-gray-400"></i> Cambiar contraseña
              </button>
              
              <div className="h-px bg-gray-100 my-1"></div>
              
              <button
                onClick={async () => {
                  setIsProfileMenuOpen(false);
                  await logout();
                  navigate('/auth');
                }}
                className="px-4 py-2.5 text-left text-[14px] text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 font-medium"
              >
                <i className="fas fa-sign-out-alt w-5 text-center"></i> Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
