import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Página de Inicio (Dashboard)
 * Proporciona un punto de entrada amigable y accesos rápidos a los módulos.
 */
function Home() {
  const navigate = useNavigate();

  const accesosRapidos = [
    { 
      titulo: 'Vender Productos', 
      desc: 'Realiza ventas rápidas y genera tickets.', 
      icon: '🛒', 
      path: '/productos', 
      clase: 'bg-emerald-50 text-emerald-600' 
    },
    { 
      titulo: 'Gestionar Clientes', 
      desc: 'Registro y edición de la base de clientes.', 
      icon: '👥', 
      path: '/clientes', 
      clase: 'bg-blue-50 text-blue-600' 
    },
    { 
      titulo: 'Ingreso de Stock', 
      desc: 'Solicita reposición de mercadería al supervisor.', 
      icon: '📦', 
      path: '/ingreso-stock', 
      clase: 'bg-orange-50 text-orange-600' 
    },
    { 
      titulo: 'Mi Historial', 
      desc: 'Revisa tus ventas y movimientos del día.', 
      icon: '📜', 
      path: '/historial', 
      clase: 'bg-purple-50 text-purple-600' 
    },
  ];

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

        {/* Rejilla de Accesos Rápidos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {accesosRapidos.map((item, idx) => (
            <button
              key={idx}
              onClick={() => navigate(item.path)}
              className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:scale-105 transition-all duration-300 text-left group"
            >
              <div className={`w-16 h-16 ${item.clase} rounded-3xl flex items-center justify-center text-3xl mb-6 group-hover:rotate-12 transition-transform`}>
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{item.titulo}</h3>
              <p className="text-sm text-gray-400 font-medium leading-relaxed">{item.desc}</p>
            </button>
          ))}
        </div>

        {/* Sección de Resumen o Banner Informativo */}
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-xl text-left">
            <h2 className="text-3xl font-black mb-4">Control total en tus manos</h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Recuerda que ahora puedes filtrar tus ventas por fecha y código desde tu nuevo historial personal.
            </p>
            <button 
              onClick={() => navigate('/historial')}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
            >
              Explorar mi Historial →
            </button>
          </div>
          
          {/* Decoración Estética */}
          <div className="absolute right-[-50px] bottom-[-50px] text-[15rem] opacity-10 select-none pointer-events-none grayscale">
            🚀
          </div>
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
