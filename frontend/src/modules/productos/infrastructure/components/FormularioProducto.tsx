import React, { useState, useEffect } from 'react';
import { Producto, CATEGORIAS } from '../../domain/Producto';

interface FormularioProductoProps {
  isOpen: boolean;
  onClose: () => void;
  productoAEditar: Producto | null;
  onGuardar: (datos: {
    nombre: string;
    descripción: string;
    id_categoria: number;
    precio: number;
    stock: number;
    estado: boolean;
    imagen: string;
  }) => void;
}

export const FormularioProducto: React.FC<FormularioProductoProps> = ({
  isOpen,
  onClose,
  productoAEditar,
  onGuardar,
}) => {
  const [formNombre, setFormNombre] = useState('');
  const [formDescripcion, setFormDescripcion] = useState('');
  const [formCategoria, setFormCategoria] = useState(1);
  const [formPrecio, setFormPrecio] = useState('');
  const [formStock, setFormStock] = useState('');
  const [formEstado, setFormEstado] = useState(true);
  const [formImagen, setFormImagen] = useState('');

  useEffect(() => {
    if (productoAEditar) {
      setFormNombre(productoAEditar.nombre);
      setFormDescripcion(productoAEditar.descripción);
      setFormCategoria(productoAEditar.id_categoria);
      setFormPrecio(productoAEditar.precio.toString());
      setFormStock(productoAEditar.stock.toString());
      setFormEstado(productoAEditar.estado);
      setFormImagen(productoAEditar.imagen || '');
    } else {
      setFormNombre('');
      setFormDescripcion('');
      setFormCategoria(1);
      setFormPrecio('');
      setFormStock('');
      setFormEstado(true);
      setFormImagen('');
    }
  }, [productoAEditar, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGuardar({
      nombre: formNombre.trim(),
      descripción: formDescripcion.trim(),
      id_categoria: Number(formCategoria),
      precio: parseFloat(formPrecio) || 0,
      stock: parseInt(formStock) || 0,
      estado: formEstado,
      imagen: formImagen.trim() || '/assets/coca_cola_sin_azu_300ml.png',
    });
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
              {productoAEditar ? "✏️ Editar Producto" : "📦 Registrar Nuevo Producto"}
            </h3>
            <p className="text-xs text-gray-400 font-semibold mt-1">
              Completa los campos respetando las restricciones de la base de datos.
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
            
            {/* Nombre (Máx 30) */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Nombre del Producto *</label>
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
                placeholder="Ej. Coca Cola 300ml"
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
                placeholder="Ej. Bebida original sin azúcar"
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

            {/* Precio (Float) & Stock (Integer) */}
            <div className="grid grid-cols-2 gap-4">
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

              <div className="space-y-1">
                <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Stock inicial *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formStock}
                  onChange={(e) => setFormStock(e.target.value)}
                  className="block w-full px-4 py-2.5 border border-gray-100 rounded-xl bg-gray-50/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-sm font-semibold text-gray-800 transition-all"
                  placeholder="Ej. 10"
                />
              </div>
            </div>

            {/* Imagen (Opcional, texto) */}
            <div className="space-y-1">
              <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">URL de Imagen (Opcional)</label>
              <input
                type="text"
                value={formImagen}
                onChange={(e) => setFormImagen(e.target.value)}
                className="block w-full px-4 py-2.5 border border-gray-100 rounded-xl bg-gray-50/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-sm font-semibold text-gray-800 transition-all"
                placeholder="Ej. /assets/coca_cola_sin_azu_300ml.png"
              />
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
              {productoAEditar ? "Actualizar" : "Registrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
