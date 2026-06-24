import React from 'react';

export interface DatosFormularioEmpresa {
  nombre: string; // Obligatorio
  logoPreview: string | null;
  ruc: string; // Opcional
  email: string; // Opcional
  telefono: string; // Opcional
  descripcionEmpresa: string; // Opcional
  direccionEmpresa: string; // Opcional
}

interface FormularioEmpresaProps {
  valoresIniciales: DatosFormularioEmpresa;
  onSiguiente: (datos: DatosFormularioEmpresa) => void;
  onCancelar: () => void;
}

export const FormularioEmpresa: React.FC<FormularioEmpresaProps> = ({
  valoresIniciales,
  onSiguiente,
  onCancelar,
}) => {
  const [datosEmpresa, setDatosEmpresa] = React.useState<DatosFormularioEmpresa>(valoresIniciales);

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

  const handleCambiarEmpresa = (cambios: Partial<DatosFormularioEmpresa>) => {
    setDatosEmpresa((actual) => ({
      ...actual,
      ...cambios,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSiguiente(datosEmpresa);
  };

  return (
    <form onSubmit={handleSubmit} className="px-5 py-8 sm:px-8 md:px-12 md:py-10">
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
          <label htmlFor="empresa-nombre" className="text-sm text-gray-500 mb-1 font-medium cursor-default">Nombre de la empresa</label> <span className="text-red-500">*</span>
          <div className="relative mt-1.5">
            <i className="fas fa-building absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="empresa-nombre"
              type="text"
              value={datosEmpresa.nombre}
              onChange={(e) => handleCambiarEmpresa({ nombre: e.target.value })}
              maxLength={150}
              placeholder="Nombre de la empresa"
              required
              className="bg-gray-50 border border-gray-300 rounded-xl py-3.5 pl-12 pr-4 w-full text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="empresa-descripcion" className="text-sm text-gray-500 mb-1 font-medium cursor-default">Descripción (Opcional)</label>
          <textarea
            id="empresa-descripcion"
            value={datosEmpresa.descripcionEmpresa}
            onChange={(e) => handleCambiarEmpresa({ descripcionEmpresa: e.target.value })}
            rows={3}
            maxLength={500}
            placeholder="Descripción de la empresa"
            className="bg-gray-50 border border-gray-300 rounded-xl py-3.5 px-4 w-full text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none mt-1.5"
          />
        </div>

        <div>
          <label htmlFor="empresa-ruc" className="text-sm text-gray-500 mb-1 font-medium cursor-default">RUC (Opcional)</label>
          <div className="relative mt-1.5">
            <i className="fas fa-id-card absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="empresa-ruc"
              type="text"
              value={datosEmpresa.ruc}
              onChange={(e) => handleCambiarEmpresa({ ruc: e.target.value.replace(/\D/g, '') })}
              maxLength={13}
              placeholder="RUC"
              className="bg-gray-50 border border-gray-300 rounded-xl py-3.5 pl-12 pr-4 w-full text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        <div>
          <label htmlFor="empresa-telefono" className="text-sm text-gray-500 mb-1 font-medium cursor-default">Teléfono (Opcional)</label>
          <div className="relative mt-1.5">
            <i className="fas fa-phone absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="empresa-telefono"
              type="tel"
              value={datosEmpresa.telefono}
              onChange={(e) => handleCambiarEmpresa({ telefono: e.target.value.replace(/\D/g, '') })}
              maxLength={10}
              placeholder="Teléfono"
              className="bg-gray-50 border border-gray-300 rounded-xl py-3.5 pl-12 pr-4 w-full text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="empresa-email" className="text-sm text-gray-500 mb-1 font-medium cursor-default">Correo de la empresa (Opcional)</label>
          <div className="relative mt-1.5">
            <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="empresa-email"
              type="email"
              value={datosEmpresa.email}
              onChange={(e) => handleCambiarEmpresa({ email: e.target.value })}
              maxLength={255}
              placeholder="correo@empresa.com"
              className="bg-gray-50 border border-gray-300 rounded-xl py-3.5 pl-12 pr-4 w-full text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>
        

        <div className="md:col-span-2">
          <label htmlFor="empresa-direccion" className="text-sm text-gray-500 mb-1 font-medium cursor-default">Dirección (Opcional)</label>
          <div className="relative mt-1.5">
            <i className="fas fa-map-marker-alt absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="empresa-direccion"
              type="text"
              value={datosEmpresa.direccionEmpresa}
              onChange={(e) => handleCambiarEmpresa({ direccionEmpresa: e.target.value })}
              maxLength={300}
              placeholder="Dirección de la empresa"
              className="bg-gray-50 border border-gray-300 rounded-xl py-3.5 pl-12 pr-4 w-full text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between mt-10 gap-4">
        <button
          type="button"
          onClick={onCancelar}
          className="text-gray-400 hover:text-gray-600 text-sm font-semibold transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold py-3.5 px-10 transition-colors shadow-lg shadow-emerald-600/20 active:scale-[0.98] flex items-center justify-center gap-2"
        >
          SIGUIENTE
        </button>
      </div>
    </form>
  );
};
