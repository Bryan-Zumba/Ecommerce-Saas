import React, { useEffect, useState } from 'react';
import { Bodega } from '../../domain/Bodega';

export interface DatosFormularioBodega {
  nombre: string;
  descripcion: string;
  ubicacion: string;
}

interface FormularioBodegaProps {
  bodegaAEditar?: Bodega | null;
  valoresIniciales?: DatosFormularioBodega;
  onGuardar: (datos: DatosFormularioBodega) => void;
  onCancelar?: () => void;
  modo: 'registro' | 'edicion';
  variante?: 'tarjeta' | 'simple';
  titulo?: string;
  descripcion?: string;
  textoGuardar?: string;
  textoCancelar?: string;
}

const valoresVacios: DatosFormularioBodega = {
  nombre: '',
  descripcion: '',
  ubicacion: '',
};

export const FormularioBodega: React.FC<FormularioBodegaProps> = ({
  bodegaAEditar,
  valoresIniciales = valoresVacios,
  onGuardar,
  onCancelar,
  modo,
  variante = 'tarjeta',
  titulo,
  descripcion,
  textoGuardar,
  textoCancelar = 'Cancelar',
}) => {
  const [formNombre, setFormNombre] = useState('');
  const [formDescripcion, setFormDescripcion] = useState('');
  const [formUbicacion, setFormUbicacion] = useState('');

  const esRegistro = modo === 'registro';
  const esTarjeta = variante === 'tarjeta';

  useEffect(() => {
    if (bodegaAEditar && modo === 'edicion') {
      setFormNombre(bodegaAEditar.nombre);
      setFormDescripcion(bodegaAEditar.descripcion);
      setFormUbicacion(bodegaAEditar.ubicacion);
      return;
    }

    setFormNombre(valoresIniciales.nombre);
    setFormDescripcion(valoresIniciales.descripcion);
    setFormUbicacion(valoresIniciales.ubicacion);
  }, [bodegaAEditar, modo, valoresIniciales.descripcion, valoresIniciales.nombre, valoresIniciales.ubicacion]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGuardar({
      nombre: formNombre.trim(),
      descripcion: formDescripcion.trim(),
      ubicacion: formUbicacion.trim(),
    });
  };

  const contenidoFormulario = (
    <form onSubmit={handleSubmit}>
      <div className={esTarjeta ? 'p-6 lg:p-8 space-y-5' : 'space-y-5'}>
        {!esTarjeta && (
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 rounded-[1.5rem] bg-emerald-50 flex items-center justify-center mb-3">
              <i className="fas fa-warehouse text-3xl text-emerald-600" />
            </div>
            <p className="text-xs text-gray-400 font-medium text-center max-w-sm">
              Identifica el lugar donde se almacenara y controlara el inventario de tu empresa.
            </p>
          </div>
        )}

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Nombre de la Bodega *
            </label>
            {esTarjeta && (
              <span className={`text-[10px] font-bold ${formNombre.length > 30 ? 'text-red-500' : 'text-gray-400'}`}>
                {formNombre.length}/30 caract.
              </span>
            )}
          </div>
          <div className="relative">
            {!esTarjeta && (
              <i className="fas fa-warehouse absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            )}
            <input
              type="text"
              required
              maxLength={esTarjeta ? 30 : 150}
              value={formNombre}
              onChange={(e) => setFormNombre(e.target.value)}
              placeholder={esTarjeta ? 'Ej. Bodega Central' : undefined}
              className={`w-full text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all ${
                esTarjeta
                  ? 'block px-4 py-3 border border-gray-100 rounded-xl bg-gray-50/50 placeholder-gray-400 focus:bg-white font-semibold text-gray-800'
                  : 'bg-gray-50 border border-gray-300 rounded-xl py-3.5 pr-4 pl-12'
              }`}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Ubicacion Fisica *
            </label>
            {esTarjeta && (
              <span className={`text-[10px] font-bold ${formUbicacion.length > 30 ? 'text-red-500' : 'text-gray-400'}`}>
                {formUbicacion.length}/30 caract.
              </span>
            )}
          </div>
          <div className="relative">
            {!esTarjeta && (
              <i className="fas fa-map-marker-alt absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            )}
            <input
              type="text"
              required
              maxLength={esTarjeta ? 30 : 300}
              value={formUbicacion}
              onChange={(e) => setFormUbicacion(e.target.value)}
              placeholder={esTarjeta ? 'Ej. Av. De la Republica N-45' : undefined}
              className={`w-full text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all ${
                esTarjeta
                  ? 'block px-4 py-3 border border-gray-100 rounded-xl bg-gray-50/50 placeholder-gray-400 focus:bg-white font-semibold text-gray-800'
                  : 'bg-gray-50 border border-gray-300 rounded-xl py-3.5 pr-4 pl-12'
              }`}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Descripcion <span className="text-gray-300 normal-case font-medium">(opcional)</span>
            </label>
            {esTarjeta && (
              <span className={`text-[10px] font-bold ${formDescripcion.length > 50 ? 'text-red-500' : 'text-gray-400'}`}>
                {formDescripcion.length}/50 caract.
              </span>
            )}
          </div>
          <textarea
            maxLength={esTarjeta ? 50 : 300}
            value={formDescripcion}
            onChange={(e) => setFormDescripcion(e.target.value)}
            rows={3}
            placeholder={esTarjeta ? 'Escribe detalles breves sobre el almacenamiento...' : undefined}
            className={`w-full text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none ${
              esTarjeta
                ? 'block px-4 py-3 border border-gray-100 rounded-xl bg-gray-50/50 placeholder-gray-400 focus:bg-white font-semibold text-gray-800'
                : 'bg-gray-50 border border-gray-300 rounded-xl py-3.5 px-4'
            }`}
          />
        </div>
      </div>

      <div
        className={
          esTarjeta
            ? 'p-6 lg:p-8 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3'
            : 'flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between mt-10 gap-4'
        }
      >
        {onCancelar && (
          <button
            type="button"
            onClick={onCancelar}
            className={
              esTarjeta
                ? 'bg-white border border-gray-100 hover:bg-gray-100 text-gray-700 px-5 py-3 rounded-2xl font-extrabold text-xs uppercase tracking-widest transition-all active:scale-95 shadow-sm'
                : 'text-gray-400 hover:text-gray-600 text-sm font-semibold transition-colors flex items-center justify-center gap-1'
            }
          >
            {textoCancelar}
          </button>
        )}
        <button
          type="submit"
          className={
            esTarjeta
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-md shadow-emerald-600/10'
              : 'w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold py-3.5 px-10 transition-colors shadow-lg shadow-emerald-600/20 active:scale-[0.98]'
          }
        >
          {textoGuardar || (esRegistro ? 'Registrar Bodega' : 'Guardar Cambios')}
        </button>
      </div>
    </form>
  );

  if (!esTarjeta) {
    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-400">
        {contenidoFormulario}
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-400">
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className={`p-6 lg:p-8 border-b border-gray-50 ${esRegistro ? 'bg-gradient-to-r from-emerald-50 to-teal-50' : 'bg-gradient-to-r from-amber-50 to-orange-50'}`}>
          <div className="flex items-center gap-3">
            <i className={`fas ${esRegistro ? 'fa-warehouse text-emerald-600' : 'fa-pen text-amber-600'} text-2xl`} />
            <div>
              <h3 className="text-xl font-extrabold text-gray-900">
                {titulo || (esRegistro ? 'Registrar Informacion de Bodega' : 'Editar Informacion de Bodega')}
              </h3>
              <p className="text-xs text-gray-400 font-semibold mt-1">
                {descripcion || (esRegistro
                  ? 'Ingresa los datos de la bodega donde se almacenara y controlara el inventario.'
                  : 'Modifica la informacion de la bodega para corregir o actualizar sus datos.')}
              </p>
            </div>
          </div>
        </div>

        {contenidoFormulario}
      </div>
    </div>
  );
};
