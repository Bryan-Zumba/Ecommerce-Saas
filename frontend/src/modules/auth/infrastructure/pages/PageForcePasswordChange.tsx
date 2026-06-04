import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const PageForcePasswordChange: React.FC = () => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Validaciones
  const hasMinLength = newPassword.length >= 8;
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const match = newPassword === confirmPassword && confirmPassword !== '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasMinLength || !hasUpperCase || !hasNumber) {
      setError('La nueva contraseña no cumple con todas las políticas de seguridad.');
      return;
    }

    if (!match) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    // Simulación de guardado exitoso
    setSuccess(true);
    setError('');
    setTimeout(() => {
      // Redirigir al panel principal
      navigate('/');
    }, 2000);
  };

  return (
    <div className="bg-gray-50 flex justify-center items-center min-h-screen p-6 font-sans">
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl w-[500px] max-w-full overflow-hidden animate-in fade-in duration-500">
        
        {/* Header con gradiente */}
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 px-10 py-8 text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/20 rounded-full" />
          <div className="relative z-10">
            <h1 className="text-2xl font-black text-white mb-2">Primer Acceso Obligatorio</h1>
            <p className="text-emerald-50/80 font-medium text-xs">
              Por tu seguridad, debes cambiar tu contraseña temporal antes de ingresar al sistema
            </p>
          </div>
        </div>

        {success ? (
          <div className="p-10 text-center animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              <i className="fas fa-check-circle" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">¡Contraseña Actualizada!</h2>
            <p className="text-sm text-gray-500">
              Redirigiéndote al sistema, por favor espera...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-10 py-8">
            
            {error && (
              <div className="mb-4 p-3.5 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-semibold rounded-r-xl">
                <i className="fas fa-exclamation-circle mr-2" />
                {error}
              </div>
            )}

            {/* Contraseña Temporal */}
            <div className="mb-4">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                Contraseña Temporal
              </label>
              <div className="relative">
                <i className="fas fa-lock-open absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  placeholder="Introduce la contraseña temporal"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="bg-gray-50 border border-gray-100 rounded-xl py-3.5 pr-4 pl-12 w-full text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            {/* Nueva Contraseña */}
            <div className="mb-4">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                Nueva Contraseña
              </label>
              <div className="relative">
                <i className="fas fa-key absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-gray-50 border border-gray-100 rounded-xl py-3.5 pr-4 pl-12 w-full text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            {/* Confirmar Nueva Contraseña */}
            <div className="mb-6">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                Confirmar Nueva Contraseña
              </label>
              <div className="relative">
                <i className="fas fa-shield-alt absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  placeholder="Repite la contraseña exactamente"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-gray-50 border border-gray-100 rounded-xl py-3.5 pr-4 pl-12 w-full text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            {/* Políticas de Seguridad */}
            <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100">
              <p className="text-xs font-bold text-gray-500 mb-2">Políticas de seguridad:</p>
              <ul className="space-y-2">
                <li className={`text-xs flex items-center font-medium ${hasMinLength ? 'text-emerald-600' : 'text-gray-400'}`}>
                  <i className={`fas ${hasMinLength ? 'fa-check-circle' : 'fa-circle'} mr-2`} />
                  Al menos 8 caracteres de longitud
                </li>
                <li className={`text-xs flex items-center font-medium ${hasUpperCase ? 'text-emerald-600' : 'text-gray-400'}`}>
                  <i className={`fas ${hasUpperCase ? 'fa-check-circle' : 'fa-circle'} mr-2`} />
                  Al menos una letra mayúscula (A-Z)
                </li>
                <li className={`text-xs flex items-center font-medium ${hasNumber ? 'text-emerald-600' : 'text-gray-400'}`}>
                  <i className={`fas ${hasNumber ? 'fa-check-circle' : 'fa-circle'} mr-2`} />
                  Al menos un número (0-9)
                </li>
                <li className={`text-xs flex items-center font-medium ${match ? 'text-emerald-600' : 'text-gray-400'}`}>
                  <i className={`fas ${match ? 'fa-check-circle' : 'fa-circle'} mr-2`} />
                  Las contraseñas coinciden
                </li>
              </ul>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold py-3.5 px-8 transition-colors shadow-lg shadow-emerald-600/20 active:scale-[0.98]"
            >
              ESTABLECER CONTRASEÑA
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PageForcePasswordChange;
