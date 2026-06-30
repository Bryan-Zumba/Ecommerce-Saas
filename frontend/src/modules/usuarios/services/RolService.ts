import { apiClient } from "@/core/apiClient";
import { RolesResponse } from "../types/RolesTypes";

export const RolService = {
  obtenerRoles(): Promise<RolesResponse> {
    return apiClient.get<RolesResponse>("/api/rol/obtener-roles");
  },

  obtenerRolId(id_rol: number): Promise<any> {
    return apiClient.get<any>(`/api/rol/obtener-rol-id/${id_rol}`);
  },

  obtenerPermisosRol(nombre: string): Promise<any> {
    return apiClient.get<any>(`/api/rol/obtener-permisos-rol/${nombre}`);
  }
};