import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthService } from '../../../../core/AuthService';

export const PageResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;
  const isPasswordValid = hasMinLength && hasUpperCase && hasNumber;
  const isPreviewMode = !token;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!token) {
      setError('El enlace de recuperación no es válido o no tiene token.');
      return;
    }

    if (!isPasswordValid) {
      setError('La contraseña no cumple con los requisitos de seguridad.');
      return;
    }

    if (!passwordsMatch) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await AuthService.resetPassword(token, password);
      setSuccess(response.message || 'Contraseña actualizada correctamente.');
      setTimeout(() => navigate('/auth'), 1800);
    } catch (err: any) {
      setError(err.message || 'No se pudo restablecer la contraseña.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 flex justify-center items-center min-h-screen p-4 sm:p-6 font-sans">
      <div className="bg-white rounded-3xl md:rounded-[2.5rem] border border-gray-100 shadow-xl w-full max-w-[520px] overflow-hidden animate-in fade-in duration-500">
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 px-5 py-8 sm:px-10 text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/20 rounded-full" />
          <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-emerald-400/10 rounded-full" />
          <div className="relative z-10">
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">Restablecer contraseña</h1>
            <p className="text-emerald-50/80 font-medium text-sm">
              Ingresa una nueva contraseña para recuperar el acceso a tu cuenta.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-8 sm:px-10">
          {!token && (
            <div className="mb-5 p-4 bg-amber-50 border-l-4 border-amber-500 text-amber-700 text-xs font-semibold rounded-r-xl">
              <i className="fas fa-exclamation-circle mr-2" />
              El enlace no contiene un token válido. Solicita un nuevo correo de recuperación.
            </div>
          )}

          {error && (
            <div className="mb-5 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-semibold rounded-r-xl">
              <i className="fas fa-exclamation-circle mr-2" />
              {error}
            </div>
          )}

          {success && (
            <div className="mb-5 p-4 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 text-xs font-semibold rounded-r-xl">
              <i className="fas fa-check-circle mr-2" />
              {success}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
              Nueva contraseña
            </label>
            <div className="relative">
              <i className="fas fa-key absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                placeholder="Mínimo 8 caracteres"
                className="bg-gray-50 border border-gray-300 rounded-xl py-3.5 pr-12 pl-12 w-full text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-600 transition-colors"
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
              </button>
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
              Confirmar contraseña
            </label>
            <div className="relative">
              <i className="fas fa-shield-alt absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                placeholder="Repite la contraseña"
                className="bg-gray-50 border border-gray-300 rounded-xl py-3.5 pr-12 pl-12 w-full text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-600 transition-colors"
              >
                <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
              </button>
            </div>
          </div>

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
              <li className={`text-xs flex items-center font-medium ${passwordsMatch ? 'text-emerald-600' : 'text-gray-400'}`}>
                <i className={`fas ${passwordsMatch ? 'fa-check-circle' : 'fa-circle'} mr-2`} />
                Las contraseñas coinciden
              </li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !token}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:shadow-none text-white rounded-xl font-bold py-3.5 px-8 transition-colors shadow-lg shadow-emerald-600/20 active:scale-[0.98]"
          >
            
            {isSubmitting ? 'GUARDANDO...' : 'GUARDAR CONTRASEÑA'}
          </button>

          <Link
            to="/auth"
            className="block text-center mt-5 text-emerald-700 hover:text-emerald-800 text-sm font-bold transition-colors"
          >
            Volver al login
          </Link>
        </form>
      </div>
    </div>
  );
};

export default PageResetPassword;
