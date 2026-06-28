import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      
      {/* El Sidebar (fijo en escritorio, oculto en móvil) */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Área de Contenido Principal */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64 transition-all duration-300">
        
        {/* Header Móvil (solo visible en < lg) */}
        <header className="lg:hidden bg-white border-b border-gray-100 h-16 flex items-center px-6 sticky top-0 z-30">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
          >
            ☰
          </button>
          <div className="ml-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">S</div>
            <h1 className="font-bold text-gray-800 tracking-tight">SaaS Pro</h1>
          </div>
        </header>

        {/* Contenido de la Página */}
        <main className="flex-1">
          <Outlet />
        </main>
        
      </div>
    </div>
  );
}

export default MainLayout;
