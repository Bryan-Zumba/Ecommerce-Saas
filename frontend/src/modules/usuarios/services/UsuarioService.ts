import { apiClient } from "@/core/apiClient";
import { UsuariosResponse, UsuarioRequest } from "../types/UsuariosTypes";

export const UsuarioService = {
  obtenerUsuariosEmpresa(id_empresa: number): Promise<UsuariosResponse> {
    return apiClient.get<UsuariosResponse>(`/api/usuario/obtener-usuarios-empresa/${id_empresa}`);
  },

  crearUsuario(datos: UsuarioRequest): Promise<any> {
    return apiClient.post("/api/usuario/crear-usuario", datos);
  },

  actualizarInformacionUsuario(id_usuario: number, datos: Partial<UsuarioRequest>): Promise<any> {
    return apiClient.put(`/api/usuario/actualizar-informacion-usuario/${id_usuario}`, datos);
  },

  actualizarRolUsuario(id_usuario: number, id_rol: number): Promise<any> {
    return apiClient.put(`/api/usuario/actualizar-rol-usuario/${id_usuario}`, { id_rol });
  },

  activarUsuario(id_usuario: number): Promise<any> {
    return apiClient.put(`/api/usuario/activar-usuario/${id_usuario}`, {});
  },

  desactivarUsuario(id_usuario: number): Promise<any> {
    return apiClient.put(`/api/usuario/desactivar-usuario/${id_usuario}`, {});
  }
};