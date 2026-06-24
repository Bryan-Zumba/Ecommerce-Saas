import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormularioBodega, DatosFormularioBodega } from '../../../bodegas/infrastructure/components/FormularioBodega';
import { LocalstorageBodegaRepository } from '../../../bodegas/infrastructure/repositories/LocalstorageBodegaRepository';

const bodegaRepository = new LocalstorageBodegaRepository();

// ID de empresa por defecto (se integrara con autenticacion mas adelante)
const ID_EMPRESA = 1;

interface DatosEmpresaOnboarding {
  logoPreview: string | null;
  ruc: string;
  telefono: string;
  descripcionEmpresa: string;
  direccionEmpresa: string;
}

const empresaInicial: DatosEmpresaOnboarding = {
  logoPreview: null,
  ruc: '',
  telefono: '',
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
  const [pasoActivo, setPasoActivo] = useState<1 | 2>(1);
  const [datosEmpresa, setDatosEmpresa] = useState<DatosEmpresaOnboarding>(empresaInicial);
  const [datosBodega, setDatosBodega] = useState<DatosFormularioBodega>(bodegaInicial);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setDatosEmpresa((actual) => ({
        ...actual,
        logoPreview: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleCambiarEmpresa = (cambios: Partial<DatosEmpresaOnboarding>) => {
    setDatosEmpresa((actual) => ({
      ...actual,
      ...cambios,
    }));
  };

  const handleSiguiente = (e: React.FormEvent) => {
    e.preventDefault();
    setPasoActivo(2);
  };

  const handleCompletarConfiguracion = async (datosFormulario: DatosFormularioBodega) => {
    const datosLimpios = {
      nombre: datosFormulario.nombre.trim(),
      descripcion: datosFormulario.descripcion.trim(),
      ubicacion: datosFormulario.ubicacion.trim(),
    };

    setDatosBodega(datosLimpios);

    try {
      await bodegaRepository.registrar({
        id_empresa: ID_EMPRESA,
        nombre: datosLimpios.nombre,
        descripcion: datosLimpios.descripcion,
        ubicacion: datosLimpios.ubicacion,
        estado: true,
      });
    } catch (err) {
      console.warn('Bodega ya registrada o error al registrar:', err);
    }

    navigate('/');
  };

  const indicadorPasos = (
    <div className="flex items-center justify-center gap-3 mb-8">
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
          pasoActivo === 1
            ? 'bg-white text-emerald-700 shadow-md'
            : 'bg-emerald-500/40 text-white'
        }`}>
          {pasoActivo > 1 ? <i className="fas fa-check" /> : '1'}
        </div>
        <span className="text-xs font-bold text-white/80 hidden sm:inline">Empresa</span>
      </div>

      <div className="w-8 h-px bg-white/30" />

      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
          pasoActivo === 2
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

        {pasoActivo === 1 ? (
          <form onSubmit={handleSiguiente} className="px-5 py-8 sm:px-8 md:px-12 md:py-10">
            <div className="flex flex-col items-center mb-10">
              <label htmlFor="logo-upload" className="group cursor-pointer flex flex-col items-center">
                <div className="w-28 h-28 rounded-[1.5rem] border-2 border-dashed border-gray-200 group-hover:border-emerald-500 transition-colors flex items-center justify-center overflow-hidden bg-gray-50">
                  {datosEmpresa.logoPreview ? (
                    <img src={datosEmpresa.logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <i className="fas fa-cloud-upload-alt text-2xl text-gray-300 group-hover:text-emerald-500 transition-colors" />
                      <p className="text-[10px] text-gray-400 mt-1 font-semibold">SUBIR LOGO</p>
                    </div>
                  )}
                </div>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
                <span className="text-xs text-gray-400 mt-2 font-medium">
                  PNG, JPG hasta 2MB
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Descripcion de la Empresa
                </label>
                <textarea
                  value={datosEmpresa.descripcionEmpresa}
                  onChange={(e) => handleCambiarEmpresa({ descripcionEmpresa: e.target.value })}
                  rows={3}
                  maxLength={500}
                  className="bg-gray-50 border border-gray-300 rounded-xl py-3.5 px-4 w-full text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                  RUC
                </label>
                <div className="relative">
                  <i className="fas fa-id-card absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={datosEmpresa.ruc}
                    onChange={(e) => handleCambiarEmpresa({ ruc: e.target.value.replace(/\D/g, '') })}
                    maxLength={13}
                    className="bg-gray-50 border border-gray-300 rounded-xl py-3.5 pr-4 pl-12 w-full text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Telefono
                </label>
                <div className="relative">
                  <i className="fas fa-phone absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    value={datosEmpresa.telefono}
                    onChange={(e) => handleCambiarEmpresa({ telefono: e.target.value.replace(/\D/g, '') })}
                    maxLength={10}
                    required
                    className="bg-gray-50 border border-gray-300 rounded-xl py-3.5 pr-4 pl-12 w-full text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Direccion
                </label>
                <div className="relative">
                  <i className="fas fa-map-marker-alt absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={datosEmpresa.direccionEmpresa}
                    onChange={(e) => handleCambiarEmpresa({ direccionEmpresa: e.target.value })}
                    required
                    maxLength={300}
                    className="bg-gray-50 border border-gray-300 rounded-xl py-3.5 pr-4 pl-12 w-full text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between mt-10 gap-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-gray-400 hover:text-gray-600 text-sm font-semibold transition-colors"
              >
                Omitir por ahora
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold py-3.5 px-10 transition-colors shadow-lg shadow-emerald-600/20 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                SIGUIENTE
              </button>
            </div>
          </form>
        ) : (
          <div className="px-5 py-8 sm:px-8 md:px-12 md:py-10">
            <FormularioBodega
              valoresIniciales={datosBodega}
              onGuardar={handleCompletarConfiguracion}
              onCancelar={() => setPasoActivo(1)}
              modo="registro"
              variante="simple"
              textoGuardar="FINALIZAR"
              textoCancelar="Volver"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PageOnboarding;
