import React, { useState } from 'react';
import { mockRoles } from '@/modules/roles/infrastructure/data/mockRoles';
import { Usuario } from '../../domain/UsuariosTypes';
import { FormularioUsuario } from '../components/FormularioUsuario';
import { mockUsuarios } from '../data/mockUsuarios';

type DatosUsuarioFormulario = {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  id_rol: number;
};

export const PageGestionUsuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>(mockUsuarios);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);
  const [toastMessage, setToastMessage] = useState('');

  const filteredUsuarios = usuarios.filter((usuario) => {
    const busqueda = searchTerm.toLowerCase();
    return (
      usuario.nombre.toLowerCase().includes(busqueda) ||
      usuario.apellido.toLowerCase().includes(busqueda) ||
      usuario.email.toLowerCase().includes(busqueda)
    );
  });

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleOpenModal = (usuario?: Usuario) => {
    setEditingUsuario(usuario ?? null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUsuario(null);
  };

  const handleGuardarUsuario = (datos: DatosUsuarioFormulario) => {
    const rolSeleccionado = mockRoles.find((rol) => rol.id_rol === datos.id_rol);
    const rol_nombre = rolSeleccionado?.nombre ?? '';

    if (editingUsuario) {
      setUsuarios((prev) =>
        prev.map((usuario) =>
          usuario.id_usuario === editingUsuario.id_usuario
            ? { ...usuario, ...datos, rol_nombre }
            : usuario
        )
      );
      showToast('Usuario actualizado exitosamente');
    } else {
      const newId = Math.max(...usuarios.map((usuario) => usuario.id_usuario), 0) + 1;
      const nuevoUsuario: Usuario = {
        ...datos,
        id_usuario: newId,
        estado: true,
        rol_nombre,
      };

      setUsuarios((prev) => [...prev, nuevoUsuario]);
      showToast('Usuario creado exitosamente');
    }

    handleCloseModal();
  };

  const toggleEstado = (id: number) => {
    setUsuarios((prev) =>
      prev.map((usuario) =>
        usuario.id_usuario === id ? { ...usuario, estado: !usuario.estado } : usuario
      )
    );
    showToast('Estado de usuario actualizado');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto relative">
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in-up">
          <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {toastMessage}
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Gestion de Usuarios</h1>
          <p className="text-gray-500 mt-1">Administra los accesos, roles e informacion de los usuarios.</p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm shadow-sm"
              placeholder="Buscar usuario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Agregar Usuario
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Rol Asignado
                </th>
                <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsuarios.map((usuario) => (
                <tr key={usuario.id_usuario} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-lg">
                        {usuario.nombre.charAt(0)}
                        {usuario.apellido.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-bold text-gray-900">
                          {usuario.nombre} {usuario.apellido}
                        </div>
                        <div className="text-xs text-gray-500">ID: {usuario.id_usuario}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{usuario.email}</div>
                    <div className="text-xs text-gray-500">{usuario.telefono}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                      <svg className="mr-1.5 h-3 w-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                      {usuario.rol_nombre}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => toggleEstado(usuario.id_usuario)}
                      className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 ${
                        usuario.estado ? 'bg-emerald-500' : 'bg-gray-300'
                      }`}
                    >
                      <span className="sr-only">Cambiar estado</span>
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                          usuario.estado ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                    <div className={`text-[10px] mt-1 font-semibold uppercase ${usuario.estado ? 'text-emerald-600' : 'text-gray-500'}`}>
                      {usuario.estado ? 'Activo' : 'Inactivo'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleOpenModal(usuario)}
                      className="text-emerald-600 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 p-2 rounded-lg transition-colors inline-flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                      Editar
                    </button>
                  </td>
                </tr>
              ))}

              {filteredUsuarios.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <p className="text-lg font-medium text-gray-900">No hay usuarios</p>
                    <p className="text-sm mt-1">No se encontraron coincidencias con tu busqueda.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <FormularioUsuario
        isOpen={isModalOpen}
        usuarioAEditar={editingUsuario}
        onClose={handleCloseModal}
        onGuardar={handleGuardarUsuario}
      />
    </div>
  );
};
