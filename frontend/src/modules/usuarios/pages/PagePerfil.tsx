import React, { useState, useEffect } from 'react';
import { useAuth } from '@/shared/context/auth/AuthContext';
import { UsuarioService } from '../services/UsuarioService';
import Swal from 'sweetalert2';

export const PagePerfil: React.FC = () => {
  const { usuario, recargarUsuario } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);

  const [nombres, setNombres] = useState(usuario?.nombres || '');
  const [apellidos, setApellidos] = useState(usuario?.apellidos || '');
  const [telefono, setTelefono] = useState(usuario?.telefono || '');
  const [email, setEmail] = useState(usuario?.email || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (usuario && !isEditing) {
      setNombres(usuario.nombres || '');
      setApellidos(usuario.apellidos || '');
      setTelefono(usuario.telefono || '');
      setEmail(usuario.email || '');
    }
  }, [usuario, isEditing]);

  const formatFecha = (isoString?: string | null) => {
    if (!isoString) return 'Nunca';
    return new Date(isoString).toLocaleString('es-ES', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const handleGuardar = async () => {
    if(!usuario?.id_usuario) return;
    try {
      setIsSaving(true);
      await UsuarioService.actualizarInformacionUsuario(usuario.id_usuario, {
        nombres, apellidos, telefono, email
      });
      await recargarUsuario();
      Swal.fire({
        icon: 'success',
        title: 'Perfil actualizado',
        toast: true,
        position: 'top-end',
        timer: 3000,
        showConfirmButton: false
      });
      setIsEditing(false);
    } catch(err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelar = () => {
    setNombres(usuario?.nombres || '');
    setApellidos(usuario?.apellidos || '');
    setTelefono(usuario?.telefono || '');
    setEmail(usuario?.email || '');
    setIsEditing(false);
  };

  const iniciales = isEditing 
    ? `${nombres.charAt(0) || ''}${apellidos.charAt(0) || ''}`.toUpperCase()
    : `${usuario?.nombres?.charAt(0) || ''}${usuario?.apellidos?.charAt(0) || ''}`.toUpperCase();

  return (
    <div className="p-6 md:p-8 animate-in fade-in duration-500 flex flex-col items-center">
      <header className="mb-6 w-full max-w-4xl text-left">
        <h1 className="text-[16px] font-bold text-gray-900 mb-1">
          {isEditing ? 'Editar Información' : 'Mi Perfil'}
        </h1>
        <p className="text-[12px] text-gray-500">
          {isEditing ? 'Actualiza tus datos personales.' : 'Consulta tu información y configuraciones de cuenta.'}
        </p>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 w-full max-w-4xl transition-all">
        
        {!isEditing ? (
          /* SECCIÓN 1: VISTA DE CONSULTA (MI PERFIL) */
          <div className="flex flex-col md:flex-row gap-8 animate-in fade-in duration-300">
            {/* Columna Izquierda: Perfil y Sistema */}
            <div className="md:w-1/3 flex flex-col items-center md:items-start md:border-r md:border-gray-100 md:pr-8 gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-2xl shadow-md">
                {iniciales}
              </div>
              <div className="text-center md:text-left w-full">
                <p className="text-[14px] font-bold text-gray-900 leading-tight">
                  {usuario?.nombres} {usuario?.apellidos}
                </p>
                <div className="mt-2 inline-flex items-center px-2.5 py-1 rounded-md bg-emerald-50 text-[12px] font-bold text-emerald-700">
                  {usuario?.rol || 'Administrador'}
                </div>
              </div>
              <div className="mt-auto pt-4 w-full text-center md:text-left">
                <p className="text-[12px] text-gray-400 font-medium">Último acceso</p>
                <p className="text-[12px] font-semibold text-gray-700">{formatFecha(usuario?.ultimo_acceso)}</p>
              </div>
            </div>

            {/* Columna Derecha: Datos Personales */}
            <div className="md:w-2/3 flex flex-col justify-between">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                <div>
                  <p className="text-[12px] font-bold text-gray-400 mb-1">Nombres</p>
                  <p className="text-[14px] font-medium text-gray-800">{usuario?.nombres}</p>
                </div>
                <div>
                  <p className="text-[12px] font-bold text-gray-400 mb-1">Apellidos</p>
                  <p className="text-[14px] font-medium text-gray-800">{usuario?.apellidos}</p>
                </div>
                <div>
                  <p className="text-[12px] font-bold text-gray-400 mb-1">Teléfono</p>
                  <p className="text-[14px] font-medium text-gray-800">{usuario?.telefono || 'No registrado'}</p>
                </div>
                <div>
                  <p className="text-[12px] font-bold text-gray-400 mb-1">Correo electrónico</p>
                  <p className="text-[14px] font-medium text-gray-800">{usuario?.email}</p>
                </div>
              </div>
              <div className="pt-6 mt-4 flex justify-end">
                <button 
                  onClick={() => setIsEditing(true)}
                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[14px] px-5 py-2 rounded-lg transition-colors"
                >
                  Editar perfil
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* SECCIÓN 2: FORMULARIO DE EDICIÓN */
          <div className="w-full flex flex-col items-center gap-6 animate-in slide-in-from-bottom-2 duration-300">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-2xl shadow-md transition-all duration-300">
              {iniciales}
            </div>
            
            <div className="w-full space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[12px] font-bold text-gray-600 mb-1.5">Nombres</label>
                  <input 
                    type="text"
                    value={nombres}
                    onChange={(e)=>setNombres(e.target.value)}
                    className="w-full bg-white border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none rounded-lg px-4 py-2 text-[12px] text-gray-800 transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-[12px] font-bold text-gray-600 mb-1.5">Apellidos</label>
                  <input 
                    type="text"
                    value={apellidos}
                    onChange={(e)=>setApellidos(e.target.value)}
                    className="w-full bg-white border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none rounded-lg px-4 py-2 text-[12px] text-gray-800 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-gray-600 mb-1.5">Teléfono</label>
                  <input 
                    type="text"
                    value={telefono}
                    onChange={(e)=>setTelefono(e.target.value)}
                    className="w-full bg-white border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none rounded-lg px-4 py-2 text-[12px] text-gray-800 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-gray-600 mb-1.5">Correo electrónico</label>
                  <input 
                    type="email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    className="w-full bg-white border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none rounded-lg px-4 py-2 text-[12px] text-gray-800 transition-all"
                  />
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-gray-100 flex flex-col-reverse sm:flex-row justify-end gap-3">
                <button 
                  onClick={handleCancelar}
                  disabled={isSaving}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-5 py-2 rounded-lg text-[14px] font-bold transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleGuardar}
                  disabled={isSaving}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white px-5 py-2 rounded-lg text-[14px] font-bold transition-colors shadow-sm"
                >
                  {isSaving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
