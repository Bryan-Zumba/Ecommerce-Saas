import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/AuthService';
import { supabase } from '../../../supabase';
import { useAuth } from '@/shared/context/auth/AuthContext';

export const PageAuth: React.FC = () => {
  const { login } = useAuth();

  //Estados para inicio de sesion
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isRecoveringPassword, setIsRecoveringPassword] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryMessage, setRecoveryMessage] = useState('');
  const [recoveryError, setRecoveryError] = useState('');
  const [isSendingRecovery, setIsSendingRecovery] = useState(false);
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);

  //Estados para registro
  const [registerStep, setRegisterStep] = useState<'code' | 'form'>('code');
  const [accessCode, setAccessCode] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [apellidoUsuario, setApellidoUsuario] = useState('');
  const [telefonoUsuario, setTelefonoUsuario] = useState('');
  const [emailRegister, setEmailRegister] = useState('');
  const [passwordRegister, setPasswordRegister] = useState('');
  //estado confirmacion de contraseña
  const [confirmPasswordRegister, setConfirmPasswordRegister] = useState('');
  const [showConfirmPasswordRegister, setShowConfirmPasswordRegister] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  //estado mostrar y ocultar contraseña
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [codeError, setCodeError] = useState('');
  const navigate = useNavigate();



  // Expresiones regulares individuales para verificar cada criterio en tiempo real
  const hasMinLength = passwordRegister.length >= 8;
  const hasUppercase = /[A-Z]/.test(passwordRegister);
  const hasLowercase = /[a-z]/.test(passwordRegister);
  const hasNumber = /\d/.test(passwordRegister);
  //

  // La contraseña es totalmente válida si cumple todos los requisitos
  const isPasswordValid = hasMinLength && hasUppercase && hasLowercase && hasNumber; //&& hasSpecialChar;

  // Compara si la contraseña principal y la de confirmación son idénticas
  const doPasswordsMatch = passwordRegister === confirmPasswordRegister;

  // Muestra la coincidencia solo si ambos campos tienen caracteres escritos
  const showMatchValidation = passwordRegister.length > 0 && confirmPasswordRegister.length > 0;


  const handleLoginEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (error: any) {
      setLoginError(error.message)
    }
  }

  const handleRecuperarContrasenaEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSendingRecovery(true);
      setRecoveryError('');
      setRecoveryMessage('');
      const res = await AuthService.forgotPassword(recoveryEmail);
      setRecoveryMessage(res.message);
    } catch (error: any) {
      setRecoveryError(error.message);
    } finally {
      setIsSendingRecovery(false);
    }
  }

  const handleValidateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessCode.trim()) {
      setCodeError('El código no puede estar vacío');
      return;
    }
    try {
      //const res = await AuthService.validarCodigoAcc(accessCode);
      const res = true;
      console.log(res);
      if (res) {
        setCodeError('');
        setRegisterStep('form');
      }
    } catch (error: any) {
      setCodeError(error.message);
    }
  };

  const handleRegisterEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreUsuario.trim()) {
      setCodeError('Debes ingresar tu nombre');
      return;
    }
    if (!apellidoUsuario.trim()) {
      setCodeError('Debes ingresar tu apellido');
      return;
    }
    if (!emailRegister.trim()) {
      setCodeError('Debe ingresar un correo electrónico para crear el usuario administrador, dueño de la empresa');
      return;
    }
    if (!passwordRegister.trim()) {
      setCodeError('Debe ingresar una contraseña para crear el usuario administrador, dueño de la empresa');
      return;
    }
    if (!isPasswordValid) {
      setCodeError('La contraseña no cumple con todos los requisitos de seguridad');
      return;
    }
    if (!doPasswordsMatch) {
      setCodeError('Las contraseñas no coinciden');
      return;
    }

    // Redirigir al onboarding de empresa
    navigate('/onboarding', {
      state: {
        codigo_acceso: accessCode,
        usuario: {
          nombre: nombreUsuario,
          apellido: apellidoUsuario,
          telefono: telefonoUsuario || undefined,
          email: emailRegister,
          password: passwordRegister,
        }
      }
    });
  };

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) {
      console.error('Error al iniciar sesión con Google:', error);
    }
  };

  return (
    <div className="bg-gray-50 flex justify-center items-center min-h-screen p-4 sm:p-6 font-sans">
      <div
        className="bg-white rounded-3xl md:rounded-[2.5rem] border border-gray-100 shadow-xl relative overflow-hidden w-full max-w-[900px] md:min-h-[600px] animate-in fade-in duration-500"
      >
        {/* Sign Up Container */}
        <div
          className={`relative md:absolute md:top-0 md:h-full transition-all duration-700 ease-in-out md:left-0 w-full md:w-1/2 ${isRightPanelActive
            ? 'block md:translate-x-[100%] md:opacity-100 md:z-50'
            : 'hidden md:block md:translate-x-0 md:opacity-0 md:z-10'
            }`}
        >
          {registerStep === 'code' ? (
            <form
              onSubmit={handleValidateCode}
              className="bg-white flex items-center justify-center flex-col px-5 py-8 sm:px-8 md:px-12 md:py-0 min-h-[560px] md:h-full text-center"
            >
              <h1 className="font-black text-gray-800 mb-2 text-2xl sm:text-3xl">Acceso Autorizado</h1>
              <span className="text-sm text-gray-500 mb-8 font-medium">Ingresa tu código de acceso para continuar con el registro de tu empresa</span>

              <div className="relative w-full my-2">
                <i className="fas fa-ticket-alt absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  placeholder="Código de acceso"
                  required
                  value={accessCode}
                  onChange={(e) => {
                    setAccessCode(e.target.value);
                    setCodeError('');
                  }}
                  className="bg-gray-50 border border-gray-100 rounded-xl py-3.5 pr-4 pl-12 w-full text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>

              {codeError && (
                <p className="text-red-500 text-xs font-semibold mt-2">
                  <i className="fas fa-exclamation-circle mr-1"></i>
                  {codeError}
                </p>
              )}

              <button
                type="submit"
                className="mt-8 w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold py-3.5 px-8 transition-colors shadow-lg shadow-emerald-600/20 active:scale-[0.98]"
              >
                VALIDAR CÓDIGO
              </button>
              <button
                type="button"
                onClick={() => setIsRightPanelActive(false)}
                className="md:hidden mt-5 text-emerald-700 hover:text-emerald-800 text-sm font-bold transition-colors"
              >
                Ya tengo cuenta
              </button>
            </form>
          ) : (
            <form
              onSubmit={handleRegisterEvent}
              className="bg-white flex items-center justify-center flex-col px-5 py-8 sm:px-8 md:px-12 md:py-0 min-h-[620px] md:min-h-0 md:h-full text-center"
            >
              <h1 className="font-black text-gray-800 mb-2 text-2xl sm:text-3xl">Crear Cuenta</h1>
              <span className="text-sm text-gray-500 mb-8 font-medium">Registra el administrador de tu empresa</span>

              <div className="flex gap-3 w-full">
                <div className="relative flex-1 my-2">
                  <i className="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"></i>
                  <input
                    type="text"
                    value={nombreUsuario}
                    onChange={(e) => setNombreUsuario(e.target.value)}
                    maxLength={100}
                    placeholder="Tu nombre"
                    required
                    className="bg-gray-100 border border-gray-300 rounded-xl py-3.5 pr-4 pl-12 w-full text-sm font-medium text-gray-800 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
                <div className="relative flex-1 my-2">
                  <i className="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"></i>
                  <input
                    type="text"
                    value={apellidoUsuario}
                    onChange={(e) => setApellidoUsuario(e.target.value)}
                    maxLength={100}
                    placeholder="Tu apellido"
                    required
                    className="bg-gray-100 border border-gray-300 rounded-xl py-3.5 pr-4 pl-12 w-full text-sm font-medium text-gray-800 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              <div className="relative w-full my-2">
                <i className="fas fa-phone absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"></i>
                <input
                  type="tel"
                  value={telefonoUsuario}
                  onChange={(e) => setTelefonoUsuario(e.target.value.replace(/\D/g, ''))}
                  maxLength={10}
                  placeholder="Teléfono (opcional)"
                  className="bg-gray-100 border border-gray-300 rounded-xl py-3.5 pr-4 pl-12 w-full text-sm font-medium text-gray-800 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
              <div className="relative w-full my-2">
                <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"></i>
                <input
                  type="email"
                  value={emailRegister}
                  onChange={(e) => setEmailRegister(e.target.value.toLowerCase().trim())}
                  placeholder="Correo electrónico"
                  required
                  className="bg-gray-100 border border-gray-300 rounded-xl py-3.5 pr-4 pl-12 w-full text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
              <div className="relative w-full my-2">
                <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"></i>
                <input
                  type={showRegisterPassword ? "text" : "password"}
                  value={passwordRegister}
                  onChange={(e) => {
                    setPasswordRegister(e.target.value);
                    setCodeError('');
                  }}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  placeholder="Contraseña segura"
                  required
                  autoComplete="new-password"
                  className="bg-gray-100 border border-gray-300 rounded-xl py-3.5 pr-12 pl-12 w-full text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />

                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-600 transition-colors"
                >
                  <i className={`fas ${showRegisterPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>

              {/* Lista dinámica de requisitos */}
              {passwordRegister.length > 0 && isPasswordFocused && (
                <div className="w-full text-left px-2 py-1.5 mb-2 space-y-1 text-xs transition-all duration-300 animate-in fade-in">
                  <p className="font-bold text-gray-500 mb-1">La contraseña debe tener:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1 text-[11px]">

                    <div className={`flex items-center gap-1.5 transition-colors duration-200 ${hasUppercase ? 'text-emerald-600 font-semibold' : 'text-gray-400'}`}>
                      <i className={`fas ${hasUppercase ? 'fa-check-circle text-emerald-500' : 'fa-circle text-[6px] opacity-60'} transition-all`}></i>
                      <span>Una letra mayúscula</span>
                    </div>

                    <div className={`flex items-center gap-1.5 transition-colors duration-200 ${hasMinLength ? 'text-emerald-600 font-semibold' : 'text-gray-400'}`}>
                      <i className={`fas ${hasMinLength ? 'fa-check-circle text-emerald-500' : 'fa-circle text-[6px] opacity-60'} transition-all`}></i>
                      <span>Mínimo 8 caracteres</span>
                    </div>


                    <div className={`flex items-center gap-1.5 transition-colors duration-200 ${hasNumber ? 'text-emerald-600 font-semibold' : 'text-gray-400'}`}>
                      <i className={`fas ${hasNumber ? 'fa-check-circle text-emerald-500' : 'fa-circle text-[6px] opacity-60'} transition-all`}></i>
                      <span>Un número</span>
                    </div>

                  </div>
                </div>
              )}

              {/* Confirmar Contraseña */}
              <div className="relative w-full my-2">
                <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"></i>
                <input
                  type={showConfirmPasswordRegister ? "text" : "password"}
                  value={confirmPasswordRegister}
                  onChange={(e) => {
                    setConfirmPasswordRegister(e.target.value);
                    setCodeError('');
                  }}
                  placeholder="Confirmar contraseña"
                  required
                  autoComplete="new-password"
                  className="bg-gray-100 border border-gray-300 rounded-xl py-3.5 pr-12 pl-12 w-full text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />

                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setShowConfirmPasswordRegister(!showConfirmPasswordRegister)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-600 transition-colors"
                >
                  <i className={`fas ${showConfirmPasswordRegister ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>

              {/* Validación de coincidencia de contraseñas */}
              {showMatchValidation && (
                <div className="w-full text-left px-2 mb-2">
                  <p className={`text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 ${doPasswordsMatch ? 'text-emerald-600' : 'text-red-500'}`}>
                    <i className={`fas ${doPasswordsMatch ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
                    {doPasswordsMatch ? 'Contraseña coincide' : 'Las contraseñas no coinciden'}
                  </p>
                </div>
              )}

              {/* Contenedor dinámico para mostrar otros errores del formulario */}
              {codeError && (
                <div className="w-full text-left px-2 mb-2">
                  <p className="text-red-500 text-xs font-semibold flex items-center gap-1.5">
                    <i className="fas fa-exclamation-circle"></i>
                    {codeError}
                  </p>
                </div>
              )}
              <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between w-full mt-6 gap-4">
                <button
                  type="button"
                  onClick={() => setRegisterStep('code')}
                  className="text-gray-400 hover:text-gray-600 text-sm font-semibold transition-colors"
                >
                  <i className="fas fa-arrow-left mr-1"></i> Atrás
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold py-3.5 px-8 transition-colors shadow-lg shadow-emerald-600/20 active:scale-[0.98]"
                >
                  SIGUIENTE
                </button>
              </div>
              <button
                type="button"
                onClick={() => setIsRightPanelActive(false)}
                className="md:hidden mt-5 text-emerald-700 hover:text-emerald-800 text-sm font-bold transition-colors"
              >
                Ya tengo cuenta
              </button>
            </form>
          )}
        </div>

        {/* Sign In Container */}
        <div
          className={`relative md:absolute md:top-0 md:h-full transition-all duration-700 ease-in-out md:left-0 w-full md:w-1/2 ${isRightPanelActive ? 'hidden md:block md:translate-x-[100%] md:opacity-0 md:z-10' : 'block md:translate-x-0 md:opacity-100 md:z-20'
            }`}
        >
          <form
            onSubmit={isRecoveringPassword ? handleRecuperarContrasenaEvent : handleLoginEvent}
            className="bg-white flex items-center justify-center flex-col px-5 py-8 sm:px-8 md:px-12 md:py-0 min-h-[560px] md:h-full text-center"
          >
            <div className={isRecoveringPassword ? 'w-full contents' : 'hidden'}>
              {recoveryMessage ? (
                <div className="w-full flex flex-col items-center">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl mb-4">
                    <i className="fas fa-envelope-open-text"></i>
                  </div>
                  <h1 className="font-black text-gray-800 mb-2 text-2xl sm:text-3xl">Correo enviado</h1>
                  <span className="text-sm text-gray-500 mb-6 font-medium">
                    Hemos enviado un enlace de recuperación a tu correo.
                  </span>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setIsRecoveringPassword(false);
                      setRecoveryError('');
                      setRecoveryMessage('');
                      setRecoveryEmail('');
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold py-3.5 px-8 transition-colors shadow-lg shadow-emerald-600/20 active:scale-[0.98]"
                  >
                    VOLVER AL LOGIN
                  </button>
                </div>
              ) : (
                <>
                  <h1 className="font-black text-gray-800 mb-2 text-2xl sm:text-3xl">Recuperar contraseña</h1>
                  <span className="text-sm text-gray-500 mb-8 font-medium">
                    Ingresa tu correo y te enviaremos un enlace para crear una nueva contraseña.
                  </span>

                  <div className="relative w-full my-2">
                    <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    <input
                      type="email"
                      placeholder="Correo electrónico"
                      required={isRecoveringPassword && !recoveryMessage}
                      value={recoveryEmail}
                      onChange={(e) => {
                        setRecoveryEmail(e.target.value);
                        setRecoveryError('');
                        setRecoveryMessage('');
                      }}
                      className="bg-gray-50 border border-gray-300 rounded-xl py-3.5 pr-4 pl-12 w-full text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>

                  {recoveryError && (
                    <p className="w-full text-left text-red-500 text-xs font-semibold mt-2">
                      <i className="fas fa-exclamation-circle mr-1"></i>
                      {recoveryError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSendingRecovery}
                    className="mt-8 w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:shadow-none text-white rounded-xl font-bold py-3.5 px-8 transition-colors shadow-lg shadow-emerald-600/20 active:scale-[0.98]"
                  >
                    {isSendingRecovery ? 'ENVIANDO...' : 'ENVIAR ENLACE'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsRecoveringPassword(false);
                      setRecoveryError('');
                      setRecoveryMessage('');
                    }}
                    className="mt-5 text-emerald-700 hover:text-emerald-800 text-sm font-bold transition-colors"
                  >
                    Volver al login
                  </button>
                </>
              )}
            </div>

            <div className={isRecoveringPassword ? 'hidden' : 'contents'}>
              <h1 className="font-black text-gray-800 mb-2 text-2xl sm:text-3xl">Bienvenido</h1>
              <span className="text-sm text-gray-500 mb-8 font-medium">Ingresa al panel de administración</span>

              <div className="relative w-full my-2">
                <i className="fas fa-user-circle absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  placeholder="Correo electrónico"
                  required={!isRecoveringPassword}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-50 border border-gray-300 rounded-xl py-3.5 pr-4 pl-12 w-full text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />

              </div>
              <div className="relative w-full my-2">
                <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña"
                  required={!isRecoveringPassword}
                  autoComplete="current-password"
                  className="bg-gray-50 border border-gray-300 rounded-xl py-3.5 pr-12 pl-12 w-full text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />

                {/*--visualizar contraseña*/}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-600 transition-colors">
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>

              {loginError && (
                <p className="w-full text-left text-red-500 text-xs font-semibold mt-2">
                  <i className="fas fa-exclamation-circle mr-1"></i>
                  {loginError}
                </p>
              )}

              <button
                type="button"
                onClick={() => {
                  setIsRecoveringPassword(true);
                  setRecoveryEmail(email);
                  setLoginError('');
                }}
                className="text-emerald-600 hover:text-emerald-700 text-sm font-semibold my-4 transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </button>
              <button
                type="submit"
                className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold py-3.5 px-8 transition-colors shadow-lg shadow-emerald-600/20 active:scale-[0.98]"
              >
                Iniciar Sesión
              </button>
              <button
                type="button"
                disabled={true}
                onClick={loginWithGoogle}
                className="mt-4 w-full bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-800 rounded-xl font-bold py-3.5 px-8 transition-colors shadow-lg shadow-gray-600/20 active:scale-[0.98]"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  className="w-5 h-5 mr-4 inline-block"
                  alt="Google"
                />
                Continuar con Google
              </button>
              <button
                type="button"
                onClick={() => setIsRightPanelActive(true)}
                className="md:hidden mt-5 text-emerald-700 hover:text-emerald-800 text-sm font-bold transition-colors"
              >
                Registrar empresa
              </button>
            </div>
          </form>
        </div>

        {/* Overlay Container */}
        <div
          className={`hidden md:block absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-700 ease-in-out z-[100] ${isRightPanelActive ? '-translate-x-[100%]' : 'translate-x-0'
            }`}
        >
          <div
            className={`bg-gradient-to-br from-emerald-600 to-emerald-800 text-white relative -left-[100%] h-full w-[200%] transition-transform duration-700 ease-in-out ${isRightPanelActive ? 'translate-x-[50%]' : 'translate-x-0'
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
