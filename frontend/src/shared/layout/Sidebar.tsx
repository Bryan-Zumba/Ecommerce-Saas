import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'inicio', label: 'Inicio', icon: '🏠', path: '/' },
    { id: 'productos', label: 'Tienda de Productos', icon: '🛒', path: '/productos' },
    { id: 'gestion-productos', label: 'Gestión Productos', icon: '🛠️', path: '/gestion-productos' },
    { id: 'clientes', label: 'Gestión de Clientes', icon: '👥', path: '/clientes' },
    { id: 'bodegas', label: 'Gestión de Bodegas', icon: '🏬', path: '/bodegas' },
    { id: 'stock', label: 'Ingreso de Stock', icon: '📦', path: '/ingreso-stock' },
    { id: 'historial', label: 'Historial Personal', icon: '📜', path: '/historial' },
  { id: 'gestion-categorias', label: 'Gestión Categorías', icon: '📂', path: '/gestion-categorias' },
];

  return (
    <>
      {/* Overlay para móviles cuando el sidebar está abierto */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Principal */}
      <aside className={`
        fixed top-0 left-0 h-screen bg-white border-r border-gray-100 z-50 transition-all duration-300 ease-in-out
        w-64 flex flex-col shadow-xl lg:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Logo / Header */}
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <span className="text-xl font-bold">S</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800 leading-tight">SaaS Ecommerce</h2>
              <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Maneja tu negocio en la Nube</span>
            </div>
          </div>
          
          {/* Botón cerrar en móvil */}
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400"
          >
            ✕
          </button>
        </div>

        {/* Navegación */}
        <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-2">Menú Principal</p>
          
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.id}
                onClick={() => {
                  navigate(item.path);
                  setIsOpen(false);
                }}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-emerald-50 text-emerald-700 shadow-sm' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
                `}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm">{item.label}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 bg-emerald-500 rounded-full" />}
              </button>
            );
          })}
        </nav>

        {/* Footer del Sidebar */}
        <div className="p-4 border-t border-gray-50">
          <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold">
              BZ
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-800 truncate">Bryan Zumba</p>
              <p className="text-[10px] text-gray-500 truncate">Admin Account</p>
            </div>
            <button className="text-gray-400 hover:text-red-500 transition-colors">
              ↪️
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
