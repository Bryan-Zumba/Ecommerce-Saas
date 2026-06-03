import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Página de Inicio (Dashboard)
 * Proporciona un punto de entrada amigable y accesos rápidos a los módulos.
 */
function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 lg:p-12 animate-in fade-in duration-700">
      <div className="max-w-6xl mx-auto">
        
        {/* Cabecera de Bienvenida */}
        <header className="mb-12 text-left">
          <h1 className="text-5xl font-black text-gray-900 tracking-tight mb-4">
            Bienvenido, <span className="text-emerald-600">Bryan</span>
          </h1>
          <p className="text-xl text-gray-500 font-medium max-w-2xl leading-relaxed">
            Tu sistema SaaS de Ecommerce está listo. ¿Qué tarea deseas realizar hoy para potenciar tu negocio?
          </p>
        </header>

          {/* Decoración Estética */}
          <div className="absolute right-[0px] bottom-[0px] text-[30rem] opacity-10 select-none pointer-events-none grayscale">
            🚀
          </div>
        {/* Espacio para que el usuario llene más info luego */}
        <footer className="mt-20 py-8 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-400 font-medium italic">
            "SaaS Ecommerce - Tu aliado en la transformación digital"
          </p>
        </footer>
      </div>
    </div>
  );
}

export default Home;
