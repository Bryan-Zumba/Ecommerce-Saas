import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const PageAuth: React.FC = () => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const navigate = useNavigate();

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simular login exitoso
    navigate('/');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simular registro exitoso — redirigir al onboarding de empresa
    navigate('/onboarding');
  };

  return (
    <div className="bg-gray-50 flex justify-center items-center min-h-screen p-6 font-sans">
      <div
        className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl relative overflow-hidden w-[900px] max-w-full min-h-[600px] animate-in fade-in duration-500"
      >
        {/* Sign Up Container */}
        <div
          className={`absolute top-0 h-full transition-all duration-700 ease-in-out left-0 w-1/2 ${
            isRightPanelActive
              ? 'translate-x-[100%] opacity-100 z-50 animate-[showAuth_0.6s]'
              : 'translate-x-0 opacity-0 z-10'
          }`}
        >
          <form
            onSubmit={handleRegisterSubmit}
            className="bg-white flex items-center justify-center flex-col px-12 h-full text-center"
          >
            <h1 className="font-black text-gray-800 mb-2 text-3xl">Crear Empresa</h1>
            <span className="text-sm text-gray-500 mb-8 font-medium">Registra tu negocio en la plataforma en un paso. Se te creara con rol de adminsitrador y podras crear supervisores y cajeros para tu empresa</span>

            <div className="relative w-full my-2">
              <i className="fas fa-briefcase absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Nombre de tu Negocio / Empresa"
                required
                className="bg-gray-50 border border-gray-100 rounded-xl py-3.5 pr-4 pl-12 w-full text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
            <div className="relative w-full my-2">
              <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input
                type="email"
                placeholder="Correo electrónico"
                required
                className="bg-gray-50 border border-gray-100 rounded-xl py-3.5 pr-4 pl-12 w-full text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
            <div className="relative w-full my-2">
              <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input
                type="password"
                placeholder="Contraseña segura"
                required
                className="bg-gray-50 border border-gray-100 rounded-xl py-3.5 pr-4 pl-12 w-full text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>

            <button
              type="submit"
              className="mt-8 w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold py-3.5 px-8 transition-colors shadow-lg shadow-emerald-600/20 active:scale-[0.98]"
            >
              CREAR EMPRESA
            </button>
          </form>
        </div>

        {/* Sign In Container */}
        <div
          className={`absolute top-0 h-full transition-all duration-700 ease-in-out left-0 w-1/2 ${
            isRightPanelActive ? 'translate-x-[100%] opacity-0 z-10' : 'translate-x-0 opacity-100 z-20'
          }`}
        >
          <form
            onSubmit={handleLoginSubmit}
            className="bg-white flex items-center justify-center flex-col px-12 h-full text-center"
          >
            <h1 className="font-black text-gray-800 mb-2 text-3xl">Bienvenido</h1>
            <span className="text-sm text-gray-500 mb-8 font-medium">Ingresa al panel de administración</span>

            <div className="relative w-full my-2">
              <i className="fas fa-user-circle absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Correo electrónico"
                required
                className="bg-gray-50 border border-gray-100 rounded-xl py-3.5 pr-4 pl-12 w-full text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
            <div className="relative w-full my-2">
              <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input
                type="password"
                placeholder="Contraseña"
                required
                className="bg-gray-50 border border-gray-100 rounded-xl py-3.5 pr-4 pl-12 w-full text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>

            <a
              href="#"
              className="text-emerald-600 hover:text-emerald-700 text-sm font-semibold my-4 transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </a>
            <button
              type="submit"
              className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold py-3.5 px-8 transition-colors shadow-lg shadow-emerald-600/20 active:scale-[0.98]"
            >
              INICIAR SESIÓN
            </button>
          </form>
        </div>

        {/* Overlay Container */}
        <div
          className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-700 ease-in-out z-[100] ${
            isRightPanelActive ? '-translate-x-[100%]' : 'translate-x-0'
          }`}
        >
          <div
            className={`bg-gradient-to-br from-emerald-600 to-emerald-800 text-white relative -left-[100%] h-full w-[200%] transition-transform duration-700 ease-in-out ${
              isRightPanelActive ? 'translate-x-[50%]' : 'translate-x-0'
            }`}
          >
            {/* Overlay Left */}
            <div
              className={`absolute flex items-center justify-center flex-col pl-12 pr-32 text-center top-0 h-full w-1/2 transition-transform duration-700 ease-in-out 
              before:content-[''] before:absolute before:-top-[10%] before:w-[300px] before:h-[120%] before:bg-white before:rounded-[50%] before:-z-20 before:-right-[200px]
              ${isRightPanelActive ? 'translate-x-0' : '-translate-x-[20%]'}`}
            >
              <h2 className="text-4xl font-black mb-4">¡Hola de nuevo!</h2>
              <p className="text-emerald-50/90 font-medium leading-relaxed mb-8">
                Si ya tienes una cuenta, ingresa con tu correo electronico para continuar donde te quedaste.
              </p>
              <button
                onClick={() => setIsRightPanelActive(false)}
                className="bg-transparent border-2 border-white/80 hover:border-white hover:bg-white/10 text-white rounded-xl font-bold py-3 px-10 transition-all active:scale-[0.98]"
              >
                IR AL LOGIN
              </button>
            </div>

            {/* Overlay Right */}
            <div
              className={`absolute flex items-center justify-center flex-col pl-32 pr-12 text-center top-0 h-full w-1/2 transition-transform duration-700 ease-in-out right-0 
              before:content-[''] before:absolute before:-top-[10%] before:w-[300px] before:h-[120%] before:bg-white before:rounded-[50%] before:-z-10 before:-left-[200px]
              ${isRightPanelActive ? 'translate-x-[20%]' : 'translate-x-0'}`}
            >
              <h2 className="text-4xl font-black mb-4">¿Eres Nuevo?</h2>
              <p className="text-emerald-50/90 font-medium leading-relaxed mb-8">
                Regístrate y automatiza tu inventario, ventas y facturación en minutos.
              </p>
              <button
                onClick={() => setIsRightPanelActive(true)}
                className="bg-white text-emerald-700 hover:bg-emerald-50 hover:shadow-lg rounded-xl font-bold py-3 px-10 transition-all shadow-emerald-900/20 active:scale-[0.98]"
              >
                REGISTRAR EMPRESA
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageAuth;
