import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LocalstorageBodegaRepository } from '../../../bodegas/infrastructure/repositories/LocalstorageBodegaRepository';

const bodegaRepository = new LocalstorageBodegaRepository();

// ID de empresa por defecto (se integrará con autenticación más adelante)
const ID_EMPRESA = 1;

export const PageOnboarding: React.FC = () => {
  const navigate = useNavigate();

  // Paso activo: 1 = Empresa, 2 = Bodega
  const [pasoActivo, setPasoActivo] = useState<1 | 2>(1);

  // Estado paso 1 — Empresa
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Estado paso 2 — Bodega
  const [bodegaNombre, setBodegaNombre] = useState('');
  const [bodegaUbicacion, setBodegaUbicacion] = useState('');
  const [bodegaDescripcion, setBodegaDescripcion] = useState('');

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Avanzar al paso 2
  const handleSiguiente = (e: React.FormEvent) => {
    e.preventDefault();
    setPasoActivo(2);
  };

  // Completar configuración (guardar bodega y navegar)
  const handleCompletarConfiguracion = async (e: React.FormEvent) => {
    e.preventDefault();

    // Registrar la bodega en localStorage
    try {
      await bodegaRepository.registrar({
        id_empresa: ID_EMPRESA,
        nombre: bodegaNombre.trim(),
        descripcion: bodegaDescripcion.trim(),
        ubicacion: bodegaUbicacion.trim(),
        estado: true,
      });
    } catch (err) {
      // Si ya existe, no es un error crítico en onboarding
      console.warn('Bodega ya registrada o error al registrar:', err);
    }

    navigate('/');
  };

  // Indicador de pasos
  const indicadorPasos = (
    <div className="flex items-center justify-center gap-3 mb-8">
      {/* Paso 1 */}
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
          pasoActivo === 1
            ? 'bg-white text-emerald-700 shadow-md'
            : 'bg-emerald-500/40 text-white'
        }`}>
          {pasoActivo > 1 ? '✓' : '1'}
        </div>
        <span className="text-xs font-bold text-white/80 hidden sm:inline">Empresa</span>
      </div>

      <div className="w-8 h-px bg-white/30" />

      {/* Paso 2 */}
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
          pasoActivo === 2
            ? 'bg-white text-emerald-700 shadow-md'
            : 'bg-emerald-500/20 text-white/50'
        }`}>
          2
        </div>
        <span className={`text-xs font-bold hidden sm:inline ${pasoActivo === 2 ? 'text-white/80' : 'text-white/40'}`}>Bodega</span>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 flex justify-center items-center min-h-screen p-6 font-sans">
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl w-[720px] max-w-full overflow-hidden animate-in fade-in duration-500">

        {/* Header con gradiente */}
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 px-12 py-10 text-center relative overflow-hidden">
          {/* Círculos decorativos */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/20 rounded-full" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-emerald-400/10 rounded-full" />

          <div className="relative z-10">
            <h1 className="text-3xl font-black text-white mb-2">
              {pasoActivo === 1 ? 'Configura tu Empresa' : 'Configura tu Bodega'}
            </h1>
            <p className="text-emerald-50/80 font-medium text-sm">
              {pasoActivo === 1
                ? 'Completa los datos de tu negocio para personalizar tu experiencia'
                : 'Ingresa la información de la bodega donde se almacenará y controlará el inventario'}
            </p>

            {/* Indicador de pasos */}
            <div className="mt-6">
              {indicadorPasos}
            </div>
          </div>
        </div>

        {/* ===== PASO 1: EMPRESA ===== */}
        {pasoActivo === 1 && (
          <form onSubmit={handleSiguiente} className="px-12 py-10">

            {/* Logo Upload */}
            <div className="flex flex-col items-center mb-10">
              <label
                htmlFor="logo-upload"
                className="group cursor-pointer flex flex-col items-center"
              >
                <div className="w-28 h-28 rounded-[1.5rem] border-2 border-dashed border-gray-200 group-hover:border-emerald-500 transition-colors flex items-center justify-center overflow-hidden bg-gray-50">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
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

            {/* Grid de campos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">

              {/* Descripción - full width */}
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Descripción de la Empresa
                </label>
                <textarea
                  placeholder="Ej: Tienda de abarrotes y productos al por mayor ubicada en el centro de la ciudad..."
                  rows={3}
                  className="bg-gray-50 border border-gray-100 rounded-xl py-3.5 px-4 w-full text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                />
              </div>

              {/* RUC */}
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                  RUC <span className="text-gray-300 normal-case font-medium">(opcional)</span>
                </label>
                <div className="relative">
                  <i className="fas fa-id-card absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Ej: 0912345678001"
                    className="bg-gray-50 border border-gray-100 rounded-xl py-3.5 pr-4 pl-12 w-full text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Teléfono
                </label>
                <div className="relative">
                  <i className="fas fa-phone absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    placeholder="Ej: 0999123456"
                    required
                    className="bg-gray-50 border border-gray-100 rounded-xl py-3.5 pr-4 pl-12 w-full text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              {/* Dirección - full width */}
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Dirección
                </label>
                <div className="relative">
                  <i className="fas fa-map-marker-alt absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Ej: Av. Principal y Calle Secundaria, Local 3"
                    required
                    className="bg-gray-50 border border-gray-100 rounded-xl py-3.5 pr-4 pl-12 w-full text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex items-center justify-between mt-10 gap-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-gray-400 hover:text-gray-600 text-sm font-semibold transition-colors"
              >
                Omitir por ahora
              </button>
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold py-3.5 px-10 transition-colors shadow-lg shadow-emerald-600/20 active:scale-[0.98] flex items-center gap-2"
              >
                SIGUIENTE <span>→</span>
              </button>
            </div>
          </form>
        )}

        {/* ===== PASO 2: BODEGA ===== */}
        {pasoActivo === 2 && (
          <form onSubmit={handleCompletarConfiguracion} className="px-12 py-10 animate-in fade-in slide-in-from-right-4 duration-400">

            <div className="flex flex-col items-center mb-8">
              <div className="w-20 h-20 rounded-[1.5rem] bg-emerald-50 flex items-center justify-center mb-3">
                <span className="text-4xl">🏬</span>
              </div>
              <p className="text-xs text-gray-400 font-medium text-center max-w-sm">
                Identifica el lugar donde se almacenará y controlará el inventario de tu empresa.
              </p>
            </div>

            <div className="space-y-5">

              {/* Nombre de la Bodega */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                    Nombre de la Bodega *
                  </label>
                  <span className={`text-[10px] font-bold ${bodegaNombre.length > 30 ? 'text-red-500' : 'text-gray-400'}`}>
                    {bodegaNombre.length}/30
                  </span>
                </div>
                <div className="relative">
                  <i className="fas fa-warehouse absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    maxLength={30}
                    value={bodegaNombre}
                    onChange={(e) => setBodegaNombre(e.target.value)}
                    placeholder="Ej. Bodega Central"
                    className="bg-gray-50 border border-gray-100 rounded-xl py-3.5 pr-4 pl-12 w-full text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              {/* Ubicación */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                    Ubicación Física *
                  </label>
                  <span className={`text-[10px] font-bold ${bodegaUbicacion.length > 30 ? 'text-red-500' : 'text-gray-400'}`}>
                    {bodegaUbicacion.length}/30
                  </span>
                </div>
                <div className="relative">
                  <i className="fas fa-map-marker-alt absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    maxLength={30}
                    value={bodegaUbicacion}
                    onChange={(e) => setBodegaUbicacion(e.target.value)}
                    placeholder="Ej. Av. De la República N-45"
                    className="bg-gray-50 border border-gray-100 rounded-xl py-3.5 pr-4 pl-12 w-full text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              {/* Descripción */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                    Descripción <span className="text-gray-300 normal-case font-medium">(opcional)</span>
                  </label>
                  <span className={`text-[10px] font-bold ${bodegaDescripcion.length > 50 ? 'text-red-500' : 'text-gray-400'}`}>
                    {bodegaDescripcion.length}/50
                  </span>
                </div>
                <textarea
                  maxLength={50}
                  value={bodegaDescripcion}
                  onChange={(e) => setBodegaDescripcion(e.target.value)}
                  rows={3}
                  placeholder="Escribe detalles breves sobre el almacenamiento..."
                  className="bg-gray-50 border border-gray-100 rounded-xl py-3.5 px-4 w-full text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                />
              </div>
            </div>

            {/* Botones */}
            <div className="flex items-center justify-between mt-10 gap-4">
              <button
                type="button"
                onClick={() => setPasoActivo(1)}
                className="text-gray-400 hover:text-gray-600 text-sm font-semibold transition-colors flex items-center gap-1"
              >
                <span>←</span> Volver
              </button>
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold py-3.5 px-10 transition-colors shadow-lg shadow-emerald-600/20 active:scale-[0.98]"
              >
                COMPLETAR CONFIGURACIÓN
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PageOnboarding;
