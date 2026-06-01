import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const PageOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simular guardado de empresa
    navigate('/');
  };

  return (
    <div className="bg-gray-50 flex justify-center items-center min-h-screen p-6 font-sans">
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl w-[720px] max-w-full overflow-hidden animate-in fade-in duration-500">

        {/* Header con gradiente */}
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 px-12 py-10 text-center relative overflow-hidden">
          {/* Círculos decorativos */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/20 rounded-full" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-emerald-400/10 rounded-full" />

          <div className="relative z-10">
            <h1 className="text-3xl font-black text-white mb-2">Configura tu Empresa</h1>
            <p className="text-emerald-50/80 font-medium text-sm">
              Completa los datos de tu negocio para personalizar tu experiencia
            </p>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="px-12 py-10">

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
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold py-3.5 px-10 transition-colors shadow-lg shadow-emerald-600/20 active:scale-[0.98]"
            >
              COMPLETAR CONFIGURACIÓN
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PageOnboarding;
