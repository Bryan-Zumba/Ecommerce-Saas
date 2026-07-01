import { apiClient } from "@/core/apiClient";
import { BodegaRequest, BodegaResponse, BodegaUpdate } from "../types/BodegaTypes";

export const BodegaService = {
  obtenerBodegaEmpresa(): Promise<BodegaResponse> {
    // El id_empresa se maneja con el token en el backend
    return apiClient.get<BodegaResponse>("/api/bodega/obtener-bodega-empresa");
  },

  crearBodega(datos: BodegaRequest): Promise<any> {
    return apiClient.post("/api/bodega/crear-bodega", datos);
  },

  actualizarInformacionBodega(id_bodega: number, datos: BodegaUpdate): Promise<any> {
    return apiClient.put(`/api/bodega/actualizar-bodega/${id_bodega}`, datos);
  }
};
