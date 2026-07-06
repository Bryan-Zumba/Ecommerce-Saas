import React, { useState, useEffect } from 'react';
import { ProveedorLocal, ProveedorRequest } from '../types/ProveedorTypes';

interface FormularioProveedorProps {
  isOpen: boolean;
  onClose: () => void;
  proveedorActual: ProveedorLocal | null;
  onGuardar: (datos: ProveedorRequest) => void;
  procesando: boolean;
}

const INICIAL: ProveedorRequest = {
  nombre: '',
  descripcion: '',
  direccion: '',
  telefono: '',
  email: '',
};

export const FormularioProveedor: React.FC<FormularioProveedorProps> = ({
  isOpen,
  onClose,
  proveedorActual,
  onGuardar,
  procesando,
}) => {
  const [form, setForm] = useState<ProveedorRequest>(INICIAL);
  const [errorGeneral, setErrorGeneral] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (proveedorActual) {
        setForm({
          nombre: proveedorActual.nombre,
          descripcion: proveedorActual.descripcion || '',
          direccion: proveedorActual.direccion || '',
          telefono: proveedorActual.telefono || '',
          email: proveedorActual.email || '',
        });
      } else {
        setForm(INICIAL);
      }
      setErrorGeneral('');
    }
  }, [isOpen, proveedorActual]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorGeneral('');

    if (!form.nombre.trim()) {
      setErrorGeneral('El nombre es obligatorio.');
      return;
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setErrorGeneral('El email no tiene un formato válido.');
      return;
    }

    onGuardar({
      nombre: form.nombre.trim(),
      descripcion: form.descripcion?.trim() || null,
      direccion: form.direccion?.trim() || null,
      telefono: form.telefono?.trim() || null,
      email: form.email?.trim() || null,
    });
  };

  const inputClass = "block w-full px-4 py-2.5 border border-gray-100 rounded-xl bg-gray-50/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-sm font-semibold text-gray-800 transition-all";
  const labelClass = "text-xs font-extrabold text-gray-500 uppercase tracking-wider";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-50 bg-gradient-to-r from-emerald-50 to-white flex items-center justify-between">
          <div>
            <h3 className="text-xl font-extrabold text-gray-900">
              {proveedorActual ? '✏️ Editar Proveedor' : '🚚 Registrar Proveedor'}
            </h3>
            <p className="text-xs text-gray-400 font-semibold mt-1">
              {proveedorActual ? 'Actualiza los datos del proveedor.' : 'Completa los campos para registrar el proveedor.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-400 font-bold transition-colors flex items-center justify-center text-sm"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">

            {errorGeneral && (
              <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">
                {errorGeneral}
              </div>
            )}

            {/* Nombre */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className={labelClass}>Nombre / Razón Social *</label>
                <span className={`text-[10px] font-bold ${(form.nombre || '').length > 90 ? 'text-red-500' : 'text-gray-400'}`}>
                  {(form.nombre || '').length}/100
                </span>
              </div>
              <input
                type="text"
                name="nombre"
                required
                maxLength={100}
                value={form.nombre}
                onChange={handleChange}
                disabled={procesando}
                placeholder="Ej. Importadora XYZ S.A."
                className={inputClass}
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className={labelClass}>Email de contacto</label>
              <input
                type="email"
                name="email"
                maxLength={255}
                value={form.email || ''}
                onChange={handleChange}
                disabled={procesando}
                placeholder="contacto@empresa.com"
                className={inputClass}
              />
            </div>

            {/* Teléfono */}
            <div className="space-y-1">
              <label className={labelClass}>Teléfono</label>
              <input
                type="tel"
                name="telefono"
                maxLength={20}
                value={form.telefono || ''}
                onChange={handleChange}
                disabled={procesando}
                placeholder="0999 999 999"
                className={inputClass}
              />
            </div>

            {/* Dirección */}
            <div className="space-y-1">
              <label className={labelClass}>Dirección</label>
              <input
                type="text"
                name="direccion"
                maxLength={300}
                value={form.direccion || ''}
                onChange={handleChange}
                disabled={procesando}
                placeholder="Calle principal y transversal..."
                className={inputClass}
              />
            </div>

            {/* Descripción */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className={labelClass}>Descripción (Opcional)</label>
                <span className={`text-[10px] font-bold ${(form.descripcion || '').length > 480 ? 'text-red-500' : 'text-gray-400'}`}>
                  {(form.descripcion || '').length}/500
                </span>
              </div>
              <textarea
                name="descripcion"
                maxLength={500}
                rows={3}
                value={form.descripcion || ''}
                onChange={handleChange}
                disabled={procesando}
                placeholder="Proveedor de tecnología, insumos de oficina..."
                className={`${inputClass} resize-none`}
              />
            </div>

          </div>

          {/* Footer */}
          <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={procesando}
              className="bg-white border border-gray-100 hover:bg-gray-100 text-gray-700 px-5 py-3 rounded-2xl font-extrabold text-xs uppercase tracking-widest transition-all active:scale-95 shadow-sm disabled:opacity-60"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={procesando}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-md shadow-emerald-600/10 disabled:opacity-60"
            >
              {procesando ? 'Guardando...' : proveedorActual ? 'Actualizar' : 'Registrar'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
