import React, { useState, useEffect } from 'react';
import { Item, TipoItem } from '../../domain/Item';
import { CATEGORIAS } from '../../domain/Item';

interface FormularioItemProps {
  isOpen: boolean;
  onClose: () => void;
  itemAEditar: Item | null;
  onGuardar: (datos: {
    nombre: string;
    descripción: string;
    id_categoria: number;
    precio: number;
    tipo_item: TipoItem;
    estado: boolean;
    imagen: string;
  }) => void;
}

export const FormularioItem: React.FC<FormularioItemProps> = ({
  isOpen,
  onClose,
  itemAEditar,
  onGuardar,
}) => {
  const [formNombre, setFormNombre] = useState('');
  const [formDescripcion, setFormDescripcion] = useState('');
  const [formCategoria, setFormCategoria] = useState(1);
  const [formPrecio, setFormPrecio] = useState('');
  const [formTipoItem, setFormTipoItem] = useState<TipoItem>('Producto');
  const [formEstado, setFormEstado] = useState(true);
  const [formImagen, setFormImagen] = useState('');
  const [formImagenNombre, setFormImagenNombre] = useState('');
  const [errorImagen, setErrorImagen] = useState('');

  useEffect(() => {
    if (itemAEditar) {
      setFormNombre(itemAEditar.nombre);
      setFormDescripcion(itemAEditar.descripción);
      setFormCategoria(itemAEditar.id_categoria);
      setFormPrecio(itemAEditar.precio.toString());
      setFormTipoItem(itemAEditar.tipo_item);
      setFormEstado(itemAEditar.estado);
      setFormImagen(itemAEditar.imagen || '');
      setFormImagenNombre(itemAEditar.imagen ? 'Imagen actual' : '');
      setErrorImagen('');
    } else {
      setFormNombre('');
      setFormDescripcion('');
      setFormCategoria(1);
      setFormPrecio('');
      setFormTipoItem('Producto');
      setFormEstado(true); // Active by default according to US
      setFormImagen('');
      setFormImagenNombre('');
      setErrorImagen('');
    }
  }, [itemAEditar, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGuardar({
      nombre: formNombre.trim(),
      descripción: formDescripcion.trim(),
      id_categoria: Number(formCategoria),
      precio: parseFloat(formPrecio) || 0,
      tipo_item: formTipoItem,
      estado: formEstado,
      imagen: formImagen.trim() || '/assets/coca_cola_sin_azu_300ml.png',
    });
  };

  const handleSeleccionImagen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;

    if (!archivo.type.startsWith('image/')) {
      setErrorImagen('Selecciona un archivo de imagen valido.');
      e.target.value = '';
      return;
    }

    const maximoBytes = 2 * 1024 * 1024;
    if (archivo.size > maximoBytes) {
      setErrorImagen('La imagen no debe superar los 2 MB.');
      e.target.value = '';
      return;
    }

    const lector = new FileReader();
    lector.onload = () => {
      setFormImagen(String(lector.result));
      setFormImagenNombre(archivo.name);
      setErrorImagen('');
    };
    lector.onerror = () => {
      setErrorImagen('No se pudo leer la imagen seleccionada.');
    };
    lector.readAsDataURL(archivo);
  };

  const quitarImagen = () => {
    setFormImagen('');
    setFormImagenNombre('');
    setErrorImagen('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-50 bg-gradient-to-r from-emerald-50 to-white flex items-center justify-between">
          <div>
            <h3 className="text-xl font-extrabold text-gray-900">
              {itemAEditar ? "✏️ Editar Ítem" : "📦 Registrar Nuevo Ítem"}
            </h3>
            <p className="text-xs text-gray-400 font-semibold mt-1">
              Completa los campos para actualizar el catálogo.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-400 font-bold transition-colors flex items-center justify-center text-sm"
          >
            ✕
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            
            {/* Tipo de Item (Radio buttons) */}
            <div className="space-y-2 mb-2">
              <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Tipo de Ítem *</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="tipo_item"
                    value="Producto"
                    checked={formTipoItem === 'Producto'}
                    onChange={() => setFormTipoItem('Producto')}
                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm font-semibold text-gray-700">Producto</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="tipo_item"
                    value="Servicio"
                    checked={formTipoItem === 'Servicio'}
                    onChange={() => setFormTipoItem('Servicio')}
                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm font-semibold text-gray-700">Servicio</span>
                </label>
              </div>
            </div>

            {/* Nombre (Máx 30) */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Nombre del Ítem *</label>
                <span className={`text-[10px] font-bold ${formNombre.length > 30 ? 'text-red-500' : 'text-gray-400'}`}>
                  {formNombre.length}/30 caract.
                </span>
              </div>
              <input
                type="text"
                required
                maxLength={30}
                value={formNombre}
                onChange={(e) => setFormNombre(e.target.value)}
                className="block w-full px-4 py-2.5 border border-gray-100 rounded-xl bg-gray-50/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-sm font-semibold text-gray-800 transition-all"
                placeholder={formTipoItem === 'Producto' ? "Ej. Coca Cola 300ml" : "Ej. Mantenimiento de A/C"}
              />
            </div>

            {/* Descripción (Máx 30) */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Descripción corta *</label>
                <span className={`text-[10px] font-bold ${formDescripcion.length > 30 ? 'text-red-500' : 'text-gray-400'}`}>
                  {formDescripcion.length}/30 caract.
                </span>
              </div>
              <input
                type="text"
                required
                maxLength={30}
                value={formDescripcion}
                onChange={(e) => setFormDescripcion(e.target.value)}
                className="block w-full px-4 py-2.5 border border-gray-100 rounded-xl bg-gray-50/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-sm font-semibold text-gray-800 transition-all"
                placeholder="Breve detalle del ítem..."
              />
            </div>

            {/* Categoría Dropdown */}
            <div className="space-y-1">
              <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Categoría *</label>
              <select
                value={formCategoria}
                onChange={(e) => setFormCategoria(Number(e.target.value))}
                className="block w-full px-4 py-2.5 border border-gray-100 rounded-xl bg-gray-50/50 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              >
                {CATEGORIAS.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Precio (Float) */}
            <div className="space-y-1">
              <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Precio ($) *</label>
              <input
                type="number"
                required
                step="0.01"
                min="0"
                value={formPrecio}
                onChange={(e) => setFormPrecio(e.target.value)}
                className="block w-full px-4 py-2.5 border border-gray-100 rounded-xl bg-gray-50/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-sm font-semibold text-gray-800 transition-all"
                placeholder="Ej. 1.50"
              />
            </div>

            {/* Imagen (Opcional, archivo) */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Imagen del Item (Opcional)</label>
              <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3">
                <img
                  src={formImagen || '/assets/coca_cola_sin_azu_300ml.png'}
                  alt="Vista previa"
                  className="h-16 w-16 rounded-xl border border-gray-100 object-cover bg-white"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/coca_cola_sin_azu_300ml.png';
                  }}
                />
                <div className="min-w-0 flex-1">
                  <label className="inline-flex cursor-pointer items-center rounded-xl bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-widest text-gray-700 shadow-sm border border-gray-100 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">
                    Adjuntar imagen
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSeleccionImagen}
                      className="sr-only"
                    />
                  </label>
                  <p className="mt-2 truncate text-xs font-semibold text-gray-400">
                    {formImagenNombre || 'PNG, JPG o WEBP hasta 2 MB.'}
                  </p>
                </div>
                {formImagen && (
                  <button
                    type="button"
                    onClick={quitarImagen}
                    className="h-9 rounded-xl border border-gray-100 bg-white px-3 text-xs font-extrabold text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    Quitar
                  </button>
                )}
              </div>
              {errorImagen && (
                <p className="text-xs font-bold text-red-500">{errorImagen}</p>
              )}
            </div>

            {/* Estado Toggle */}
            <div className="space-y-1 pt-2 flex flex-col">
              <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">Estado Activo</label>
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formEstado}
                    onChange={(e) => setFormEstado(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
                <span className="text-sm font-bold text-gray-700">
                  {formEstado ? "Disponible en Tienda 🟢" : "Oculto en Tienda 🔴"}
                </span>
              </div>
            </div>

          </div>

          {/* Pie de Formulario */}
          <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-white border border-gray-100 hover:bg-gray-100 text-gray-700 px-5 py-3 rounded-2xl font-extrabold text-xs uppercase tracking-widest transition-all active:scale-95 shadow-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-md shadow-emerald-600/10"
            >
              {itemAEditar ? "Actualizar" : "Registrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
