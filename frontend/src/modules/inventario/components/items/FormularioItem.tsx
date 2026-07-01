import React, { useState, useEffect } from 'react';
import { Item, Tipo_Item } from '../../types/ItemTypes';
import { Categoria } from '../../types/CategoriaTypes';

interface FormularioItemProps {
  isOpen: boolean;
  onClose: () => void;
  itemAEditar: Item | null;
  categorias: Categoria[];
  onGuardar: (datos: any) => void;
}

export const FormularioItem: React.FC<FormularioItemProps> = ({
  isOpen,
  onClose,
  itemAEditar,
  categorias,
  onGuardar,
}) => {
  const [formNombre, setFormNombre] = useState('');
  const [formDescripcion, setFormDescripcion] = useState('');
  const [formCategoria, setFormCategoria] = useState<number>(0);
  const [formCosto, setFormCosto] = useState('');
  const [formPrecio, setFormPrecio] = useState('');
  const [formTipoItem, setFormTipoItem] = useState<Tipo_Item>(Tipo_Item.Producto);
  const [formImagenPreview, setFormImagenPreview] = useState('');
  const [formImagenNombre, setFormImagenNombre] = useState('');
  const [formFile, setFormFile] = useState<File | null>(null);
  const [errorImagen, setErrorImagen] = useState('');
  const [errorGeneral, setErrorGeneral] = useState('');

  useEffect(() => {
    if (itemAEditar) {
      setFormNombre(itemAEditar.nombre);
      setFormDescripcion(itemAEditar.descripcion || '');
      setFormCategoria(itemAEditar.id_categoria);
      setFormCosto(itemAEditar.costo.toString());
      setFormPrecio(itemAEditar.precio.toString());
      setFormTipoItem(itemAEditar.tipo_item);
      setFormImagenPreview(itemAEditar.imagen_url || '');
      setFormImagenNombre(itemAEditar.imagen_url ? 'Imagen actual' : '');
      setFormFile(null);
      setErrorImagen('');
      setErrorGeneral('');
    } else {
      setFormNombre('');
      setFormDescripcion('');
      setFormCategoria(categorias.length > 0 ? categorias[0].id_categoria : 0);
      setFormCosto('');
      setFormPrecio('');
      setFormTipoItem(Tipo_Item.Producto);
      setFormImagenPreview('');
      setFormImagenNombre('');
      setFormFile(null);
      setErrorImagen('');
      setErrorGeneral('');
    }
  }, [itemAEditar, isOpen, categorias]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorGeneral('');

    const costoNum = parseFloat(formCosto) || 0;
    const precioNum = parseFloat(formPrecio) || 0;

    if (costoNum <= 0) {
      setErrorGeneral('El costo debe ser mayor a 0');
      return;
    }
    if (precioNum <= 0) {
      setErrorGeneral('El precio debe ser mayor a 0');
      return;
    }
    if (precioNum < costoNum) {
      setErrorGeneral('El precio debe ser mayor o igual al costo');
      return;
    }

    onGuardar({
      nombre: formNombre.trim(),
      descripcion: formDescripcion.trim() || null,
      id_categoria: Number(formCategoria),
      costo: costoNum,
      precio: precioNum,
      tipo_item: formTipoItem,
      file: formFile
    });
  };

  const handleSeleccionImagen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;

    if (!archivo.type.startsWith('image/')) {
      setErrorImagen('Selecciona un archivo de imagen válido.');
      e.target.value = '';
      return;
    }

    const maximoBytes = 5 * 1024 * 1024;
    if (archivo.size > maximoBytes) {
      setErrorImagen('La imagen no debe superar los 5 MB.');
      e.target.value = '';
      return;
    }

    const lector = new FileReader();
    lector.onload = () => {
      setFormImagenPreview(String(lector.result));
      setFormImagenNombre(archivo.name);
      setFormFile(archivo);
      setErrorImagen('');
    };
    lector.onerror = () => {
      setErrorImagen('No se pudo leer la imagen seleccionada.');
    };
    lector.readAsDataURL(archivo);
  };

  const quitarImagen = () => {
    setFormImagenPreview('');
    setFormImagenNombre('');
    setFormFile(null);
    setErrorImagen('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300 text-left"
        onClick={(e) => e.stopPropagation()}
      >
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

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            
            {errorGeneral && (
              <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">
                {errorGeneral}
              </div>
            )}

            <div className="space-y-2 mb-2">
              <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Tipo de Ítem *</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="tipo_item"
                    value={Tipo_Item.Producto}
                    checked={formTipoItem === Tipo_Item.Producto}
                    onChange={() => setFormTipoItem(Tipo_Item.Producto)}
                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm font-semibold text-gray-700">Producto</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="tipo_item"
                    value={Tipo_Item.Servicio}
                    checked={formTipoItem === Tipo_Item.Servicio}
                    onChange={() => setFormTipoItem(Tipo_Item.Servicio)}
                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm font-semibold text-gray-700">Servicio</span>
                </label>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Nombre del Ítem *</label>
                <span className={`text-[10px] font-bold ${formNombre.length > 100 ? 'text-red-500' : 'text-gray-400'}`}>
                  {formNombre.length}/100
                </span>
              </div>
              <input
                type="text"
                required
                maxLength={100}
                value={formNombre}
                onChange={(e) => setFormNombre(e.target.value)}
                className="block w-full px-4 py-2.5 border border-gray-100 rounded-xl bg-gray-50/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-sm font-semibold text-gray-800 transition-all"
                placeholder="Ej. Coca Cola 300ml"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Descripción (Opcional)</label>
                <span className={`text-[10px] font-bold ${formDescripcion.length > 500 ? 'text-red-500' : 'text-gray-400'}`}>
                  {formDescripcion.length}/500
                </span>
              </div>
              <textarea
                maxLength={500}
                value={formDescripcion}
                onChange={(e) => setFormDescripcion(e.target.value)}
                className="block w-full px-4 py-2.5 border border-gray-100 rounded-xl bg-gray-50/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-sm font-semibold text-gray-800 transition-all resize-none"
                placeholder="Breve detalle del ítem..."
                rows={2}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Categoría *</label>
              <select
                required
                value={formCategoria}
                onChange={(e) => setFormCategoria(Number(e.target.value))}
                className="block w-full px-4 py-2.5 border border-gray-100 rounded-xl bg-gray-50/50 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              >
                <option value={0} disabled>Seleccione una categoría</option>
                {categorias.map((cat) => (
                  <option key={cat.id_categoria} value={cat.id_categoria}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Costo ($) *</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0.01"
                  value={formCosto}
                  onChange={(e) => setFormCosto(e.target.value)}
                  className="block w-full px-4 py-2.5 border border-gray-100 rounded-xl bg-gray-50/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-sm font-semibold text-gray-800 transition-all"
                  placeholder="Ej. 1.00"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Precio ($) *</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0.01"
                  value={formPrecio}
                  onChange={(e) => setFormPrecio(e.target.value)}
                  className="block w-full px-4 py-2.5 border border-gray-100 rounded-xl bg-gray-50/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-sm font-semibold text-gray-800 transition-all"
                  placeholder="Ej. 1.50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Imagen (Opcional)</label>
              <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3">
                <img
                  src={formImagenPreview || '/assets/coca_cola_sin_azu_300ml.png'}
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
                    {formImagenNombre || 'PNG, JPG o WEBP hasta 5 MB.'}
                  </p>
                </div>
                {(formImagenPreview || formFile) && (
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

          </div>

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
