import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AuthService } from '../services/AuthService';

export const PageChangePassword: React.FC = () => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados para visualizar contraseñas
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validaciones
  const hasMinLength = newPassword.length >= 8;
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const match = newPassword === confirmPassword && confirmPassword !== '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasMinLength || !hasUpperCase || !hasNumber) {
      setError('La nueva contraseña no cumple con todas las políticas de seguridad.');
      return;
    }

    if (!match) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await AuthService.cambiarPasswordUsuario(currentPassword, newPassword);
      
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      Swal.fire({
        icon: 'success',
        title: '¡Contraseña Cambiada!',
        text: 'Tu contraseña ha sido actualizada correctamente.',
        confirmButtonColor: '#059669'
      });

      setTimeout(() => {
        setSuccess(false);
        navigate('/');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Error al cambiar la contraseña');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message || 'Error al cambiar la contraseña',
        confirmButtonColor: '#059669'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto py-6 sm:py-10 px-4 sm:px-6 font-sans">
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        
        {/* Header */}
        <div className="border-b border-gray-100 px-5 py-5 sm:px-8 sm:py-6">
          <h1 className="text-xl font-bold text-gray-800">Cambiar Contraseña</h1>
          <p className="text-sm text-gray-500 mt-1">
            Actualiza tus credenciales para mantener tu cuenta segura.
          </p>
        </div>

        {success ? (
          <div className="p-8 text-center animate-in zoom-in duration-300">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 text-xl">
              <i className="fas fa-check-circle" />
            </div>
            <h2 className="text-lg font-bold text-gray-800 mb-1">¡Contraseña Cambiada Exitosamente!</h2>
            <p className="text-xs text-gray-400">
              Las credenciales de acceso se han actualizado de forma encriptada.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-8">
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-semibold rounded-r-xl">
                <i className="fas fa-exclamation-circle mr-2" />
                {error}
              </div>
            )}

            {/* Contraseña Actual */}
            <div className="mb-5">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                Contraseña Actual
              </label>
              <div className="relative">
                <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Tu contraseña actual"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="bg-gray-50 border border-gray-100 rounded-xl py-3 pr-12 pl-11 w-full text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <i className={`fas ${showCurrentPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
                </button>
              </div>
            </div>

            {/* Nueva Contraseña */}
            <div className="mb-5">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                Nueva Contraseña
              </label>
              <div className="relative">
                <i className="fas fa-key absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Elige una nueva contraseña fuerte"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-gray-50 border border-gray-100 rounded-xl py-3 pr-12 pl-11 w-full text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <i className={`fas ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
                </button>
              </div>
            </div>

            {/* Confirmar Nueva Contraseña */}
            <div className="mb-6">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                Confirmar Nueva Contraseña
              </label>
              <div className="relative">
                <i className="fas fa-shield-alt absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repite la contraseña exactamente"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-gray-50 border border-gray-100 rounded-xl py-3 pr-12 pl-11 w-full text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
                </button>
              </div>
            </div>

            {/* Políticas de Seguridad */}
            <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100">
              <p className="text-xs font-bold text-gray-500 mb-2">Requisitos de seguridad:</p>
              <ul className="space-y-2">
                <li className={`text-xs flex items-center font-medium ${hasMinLength ? 'text-emerald-600' : 'text-gray-400'}`}>
                  <i className={`fas ${hasMinLength ? 'fa-check-circle' : 'fa-circle'} mr-2`} />
                  Al menos 8 caracteres
                </li>
                <li className={`text-xs flex items-center font-medium ${hasUpperCase ? 'text-emerald-600' : 'text-gray-400'}`}>
                  <i className={`fas ${hasUpperCase ? 'fa-check-circle' : 'fa-circle'} mr-2`} />
                  Al menos una letra mayúscula
                </li>
                <li className={`text-xs flex items-center font-medium ${hasNumber ? 'text-emerald-600' : 'text-gray-400'}`}>
                  <i className={`fas ${hasNumber ? 'fa-check-circle' : 'fa-circle'} mr-2`} />
                  Al menos un número
                </li>
                <li className={`text-xs flex items-center font-medium ${match ? 'text-emerald-600' : 'text-gray-400'}`}>
                  <i className={`fas ${match ? 'fa-check-circle' : 'fa-circle'} mr-2`} />
                  Las contraseñas coinciden
                </li>
              </ul>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="bg-transparent text-gray-400 hover:text-gray-600 font-bold py-2.5 px-6 rounded-xl transition-all text-sm"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white rounded-xl font-bold py-2.5 px-8 transition-colors shadow-lg shadow-emerald-600/20 active:scale-[0.98] text-sm"
              >
                {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PageChangePassword;
