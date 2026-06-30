import { useState, useEffect, useCallback } from 'react';
import { UsuarioService } from '../services/UsuarioService';
import { Usuario, UsuarioRequest } from '../types/UsuariosTypes';

export const useUsuarios = (id_empresa: number) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const cargarUsuarios = useCallback(async () => {
    if (!id_empresa) return;
    setCargando(true);
    setError(null);
    try {
      const response = await UsuarioService.obtenerUsuariosEmpresa(id_empresa);
      console.log("Response", response);
      if (Array.isArray(response)) {
        setUsuarios(response);
      } else if (response && response.usuarios) {
        setUsuarios(response.usuarios);
      } else {
        setUsuarios(response as any);
      }
    } catch (err: any) {
      setError(err.message || 'Error al obtener los usuarios');
    } finally {
      setCargando(false);
    }
  }, [id_empresa]);

  const agregarUsuario = async (datos: UsuarioRequest) => {
    try {
      await UsuarioService.crearUsuario(datos);
      await cargarUsuarios();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Error al crear usuario' };
    }
  };

  const editarUsuario = async (id_usuario: number, datosInfo: Partial<UsuarioRequest>, id_rol?: number) => {
    try {
      if (Object.keys(datosInfo).length > 0) {
        await UsuarioService.actualizarInformacionUsuario(id_usuario, datosInfo);
      }
      if (id_rol) {
        await UsuarioService.actualizarRolUsuario(id_usuario, id_rol);
      }
      await cargarUsuarios();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Error al editar usuario' };
    }
  };

  const cambiarEstado = async (id_usuario: number, estadoActual: boolean) => {
    try {
      if (estadoActual) {
        await UsuarioService.desactivarUsuario(id_usuario);
      } else {
        await UsuarioService.activarUsuario(id_usuario);
      }
      await cargarUsuarios();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Error al cambiar estado' };
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, [cargarUsuarios]);

  return {
    usuarios,
    cargando,
    error,
    refrescar: cargarUsuarios,
    agregarUsuario,
    editarUsuario,
    cambiarEstado
  };
};
