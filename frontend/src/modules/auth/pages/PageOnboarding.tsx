import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FormularioBodega, DatosFormularioBodega } from '../../inventario/components/FormularioBodega';
import { FormularioEmpresa, DatosFormularioEmpresa } from '../../empresa/components/FormularioEmpresa';
import { AuthService } from '../services/AuthService';
import type { RegisterTiendaRequest } from '../types/RegisterTienda';

const empresaInicial: DatosFormularioEmpresa = {
  nombre: '',
  logoPreview: null,
  ruc: '',
  telefono: '',
  email: '',
  descripcionEmpresa: '',
  direccionEmpresa: '',
};

const bodegaInicial: DatosFormularioBodega = {
  nombre: '',
  ubicacion: '',
  descripcion: '',
};

export const PageOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extraemos los datos iniciales de auth
  const authState = location.state as {
    codigo_acceso: string;
    usuario: {
      nombre: string;
      apellido: string;
      telefono?: string;
      email: string;
      password: string;
    };
  } | null;

  const [pasoActivo, setPasoActivo] = useState<1 | 2>(1);
  const [datosEmpresa, setDatosEmpresa] = useState<DatosFormularioEmpresa>(empresaInicial);
  const [datosBodega, setDatosBodega] = useState<DatosFormularioBodega>(bodegaInicial);
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorRegistro, setErrorRegistro] = useState<string>('');

  useEffect(() => {
    if (!authState) {
      navigate('/auth');
    }
  }, [authState, navigate]);

  if (!authState) return null;

  const handleCompletarEmpresa = (datos: DatosFormularioEmpresa) => {
    setDatosEmpresa(datos);
    setPasoActivo(2);
  };

  const handleCancelar = () => {
    navigate('/auth');
  };

  const handleCompletarConfiguracion = async (datosBod: DatosFormularioBodega) => {
    const confirm = await Swal.fire({
      title: '¿Confirmar registro?',
      text: 'Se creará tu empresa, tu usuario administrador y la bodega principal. ¿Deseas continuar?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#059669',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Sí, crear mi tienda',
      cancelButtonText: 'Cancelar'
    });

    if (!confirm.isConfirmed) return;

    setDatosBodega(datosBod);
    setErrorRegistro('');
    setIsRegistering(true);

    try {
      const payload: RegisterTiendaRequest = {
        codigo_acceso: authState.codigo_acceso,
        empresa: {
          nombre: datosEmpresa.nombre,
          descripcion: datosEmpresa.descripcionEmpresa || undefined,
          ruc: datosEmpresa.ruc,
          direccion: datosEmpresa.direccionEmpresa || undefined,
          telefono: datosEmpresa.telefono || undefined,
          email: datosEmpresa.email || undefined,
          logo_url: datosEmpresa.logoPreview || undefined,
        },
        bodega: {
          nombre: datosBod.nombre,
          ubicacion: datosBod.ubicacion || undefined,
          descripcion: datosBod.descripcion || undefined,
        },
        usuario: {
          nombre: authState.usuario.nombre,
          apellido: authState.usuario.apellido,
          telefono: datosEmpresa.telefono,
          email: authState.usuario.email,
          password: authState.usuario.password,
        }
      };

      await AuthService.registerTienda(payload);

      Swal.fire({
        icon: 'success',
        title: '¡Tienda Registrada!',
        text: 'Tu empresa y usuario administrador han sido configurados con éxito.',
        confirmButtonColor: '#059669'
      });

      // Registro exitoso, iniciamos sesión y redirigimos
      await AuthService.login(authState.usuario.email, authState.usuario.password);
      navigate('/');
    } catch (err: any) {
      console.error('Error al registrar la tienda:', err);
      const msg = err.message || 'Error al procesar el registro.';
      setErrorRegistro(msg);
      Swal.fire({
        icon: 'error',
        title: 'Error de Registro',
        text: msg,
        confirmButtonColor: '#059669'
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const indicadorPasos = (
    <div className="flex items-center justify-center gap-3 mb-8">
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${pasoActivo === 1
          ? 'bg-white text-emerald-700 shadow-md'
          : 'bg-emerald-500/40 text-white'
          }`}>
          {pasoActivo > 1 ? <i className="fas fa-check" /> : '1'}
        </div>
        <span className="text-xs font-bold text-white/80 hidden sm:inline">Empresa</span>
      </div>

      <div className="w-8 h-px bg-white/30" />

      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${pasoActivo === 2
          ? 'bg-white text-emerald-700 shadow-md'
          : 'bg-emerald-500/20 text-white/50'
          }`}>
          2
        </div>
        <span className={`text-xs font-bold hidden sm:inline ${pasoActivo === 2 ? 'text-white/80' : 'text-white/40'}`}>
          Bodega
        </span>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 flex justify-center items-center min-h-screen p-4 sm:p-6 font-sans">
      <div className="bg-white rounded-3xl md:rounded-[2.5rem] border border-gray-100 shadow-xl w-full max-w-[720px] overflow-hidden animate-in fade-in duration-500">
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 px-5 py-8 sm:px-8 md:px-12 md:py-10 text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/20 rounded-full" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-emerald-400/10 rounded-full" />

          <div className="relative z-10">
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">
              {pasoActivo === 1 ? 'Configura tu Empresa' : 'Configura tu Bodega'}
            </h1>
            <p className="text-emerald-50/80 font-medium text-sm">
              {pasoActivo === 1
                ? 'Completa los datos de tu negocio para personalizar tu experiencia'
                : 'Ingresa la informacion de la bodega donde se almacenara y controlara el inventario'}
            </p>

            <div className="mt-6">{indicadorPasos}</div>
          </div>
        </div>

        {errorRegistro && (
          <div className="bg-red-50 text-red-600 p-4 mx-5 mt-5 rounded-xl text-sm font-semibold text-center border border-red-100">
            <i className="fas fa-exclamation-circle mr-2"></i>
            {errorRegistro}
          </div>
        )}

        {pasoActivo === 1 ? (
          <FormularioEmpresa
            valoresIniciales={datosEmpresa}
            onSiguiente={handleCompletarEmpresa}
            onCancelar={handleCancelar}
          />
        ) : (
          <div className="px-5 py-8 sm:px-8 md:px-12 md:py-10">
            {isRegistering ? (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 font-semibold">Configurando tu tienda...</p>
              </div>
            ) : (
              <FormularioBodega
                valoresIniciales={datosBodega}
                onGuardar={handleCompletarConfiguracion}
                onCancelar={() => setPasoActivo(1)}
                modo="registro"
                variante="simple"
                textoGuardar="FINALIZAR"
                textoCancelar="Volver"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageOnboarding;
