import React, { useState, useEffect } from 'react';
import { Usuario } from '../../domain/UsuariosTypes';
import { mockRoles } from '@/modules/roles/infrastructure/data/mockRoles';

interface FormularioUsuarioProps {
  isOpen: boolean;
  onClose: () => void;
  usuarioAEditar: Usuario | null;
  onGuardar: (datos: {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    id_rol: number;
  }) => void;
}

export const FormularioUsuario: React.FC<FormularioUsuarioProps> = ({
  isOpen,
  onClose,
  usuarioAEditar,
  onGuardar,
}) => {
  const [formNombre, setFormNombre] = useState('');
  const [formApellido, setFormApellido] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formTelefono, setFormTelefono] = useState('');
  const [formIdRol, setFormIdRol] = useState(3);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (usuarioAEditar) {
      setFormNombre(usuarioAEditar.nombre);
      setFormApellido(usuarioAEditar.apellido);
      setFormEmail(usuarioAEditar.email);
      setFormTelefono(usuarioAEditar.telefono);
      setFormIdRol(usuarioAEditar.id_rol);
    } else {
      setFormNombre('');
      setFormApellido('');
      setFormEmail('');
      setFormTelefono('');
      setFormIdRol(3);
    }
    setErrors({});
  }, [usuarioAEditar, isOpen]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formNombre.trim()) newErrors.nombre = 'El nombre es obligatorio.';
    if (!formApellido.trim()) newErrors.apellido = 'El apellido es obligatorio.';

    if (!formEmail.trim()) {
      newErrors.email = 'El correo es obligatorio.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formEmail)) {
      newErrors.email = 'Ingresa un correo electrónico válido.';
    }

    if (!formTelefono.trim()) {
      newErrors.telefono = 'El teléfono es obligatorio.';
    } else if (!/^\d{7,15}$/.test(formTelefono.replace(/\s/g, ''))) {
      newErrors.telefono = 'Ingresa un número de teléfono válido (7-15 dígitos).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onGuardar({
      nombre: formNombre.trim(),
      apellido: formApellido.trim(),
      email: formEmail.trim(),
      telefono: formTelefono.trim(),
      id_rol: formIdRol,
    });
  };

  const rolSeleccionado = mockRoles.find(r => r.id_rol === formIdRol);

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
              {usuarioAEditar ? '✏️ Editar Usuario' : '🧑‍💻 Registrar Nuevo Usuario'}
            </h3>
            <p className="text-xs text-gray-400 font-semibold mt-1">
              {usuarioAEditar
                ? 'Modifica los datos del usuario y su rol asignado.'
                : 'Completa los campos para registrar un nuevo usuario.'}
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

            {/* Nombre */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Nombre *</label>
                <span className={`text-[10px] font-bold ${formNombre.length > 30 ? 'text-red-500' : 'text-gray-400'}`}>
                  {formNombre.length}/30 caract.
                </span>
              </div>
              <input
                type="text"
                maxLength={30}
                value={formNombre}
                onChange={(e) => setFormNombre(e.target.value)}
                className={`block w-full px-4 py-2.5 border rounded-xl bg-gray-50/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-sm font-semibold text-gray-800 transition-all ${
                  errors.nombre ? 'border-red-300' : 'border-gray-100'
                }`}
                placeholder="Ej. Juan"
              />
              {errors.nombre && <p className="text-xs font-bold text-red-500">{errors.nombre}</p>}
            </div>

            {/* Apellido */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Apellido *</label>
                <span className={`text-[10px] font-bold ${formApellido.length > 30 ? 'text-red-500' : 'text-gray-400'}`}>
                  {formApellido.length}/30 caract.
                </span>
              </div>
              <input
                type="text"
                maxLength={30}
                value={formApellido}
                onChange={(e) => setFormApellido(e.target.value)}
                className={`block w-full px-4 py-2.5 border rounded-xl bg-gray-50/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-sm font-semibold text-gray-800 transition-all ${
                  errors.apellido ? 'border-red-300' : 'border-gray-100'
                }`}
                placeholder="Ej. Pérez"
              />
              {errors.apellido && <p className="text-xs font-bold text-red-500">{errors.apellido}</p>}
            </div>

            {/* Correo Electrónico */}
            <div className="space-y-1">
              <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Correo Electrónico *</label>
              <input
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                className={`block w-full px-4 py-2.5 border rounded-xl bg-gray-50/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-sm font-semibold text-gray-800 transition-all ${
                  errors.email ? 'border-red-300' : 'border-gray-100'
                }`}
                placeholder="usuario@empresa.com"
              />
              {errors.email && <p className="text-xs font-bold text-red-500">{errors.email}</p>}
            </div>

            {/* Teléfono */}
            <div className="space-y-1">
              <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Teléfono *</label>
              <input
                type="tel"
                value={formTelefono}
                onChange={(e) => setFormTelefono(e.target.value)}
                className={`block w-full px-4 py-2.5 border rounded-xl bg-gray-50/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-sm font-semibold text-gray-800 transition-all ${
                  errors.telefono ? 'border-red-300' : 'border-gray-100'
                }`}
                placeholder="0991234567"
              />
              {errors.telefono && <p className="text-xs font-bold text-red-500">{errors.telefono}</p>}
            </div>

            {/* Asignación de Rol */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Asignación de Rol *</label>
              <select
                value={formIdRol}
                onChange={(e) => setFormIdRol(Number(e.target.value))}
                className="block w-full px-4 py-2.5 border border-gray-100 rounded-xl bg-gray-50/50 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              >
                {mockRoles.map(rol => (
                  <option key={rol.id_rol} value={rol.id_rol}>{rol.nombre}</option>
                ))}
              </select>
              {rolSeleccionado && (
                <div className="flex items-start gap-2 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                  <svg className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs text-emerald-700 font-medium">
                    <span className="font-bold">{rolSeleccionado.nombre}:</span> {rolSeleccionado.descripcion}
                  </p>
                </div>
              )}
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
              {usuarioAEditar ? 'Actualizar' : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
