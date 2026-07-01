import { apiClient } from "@/core/apiClient";
import { CategoriaRequest, CategoriaResponse, CategoriasResponse, CategoriaUpdate } from "../types/CategoriaTypes";

export const CategoriaService = {
  obtenerCategorias(): Promise<CategoriasResponse> {
    return apiClient.get<CategoriasResponse>("/api/categoria/obtener-categorias");
  },

  obtenerCategoriaId(id_categoria: number): Promise<CategoriaResponse> {
    return apiClient.get<CategoriaResponse>(`/api/categoria/obtener-categoria/${id_categoria}`);
  },

  crearCategoria(datos: CategoriaRequest): Promise<any> {
    return apiClient.post("/api/categoria/crear-categoria", datos);
  },

  actualizarCategoria(id_categoria: number, datos: CategoriaUpdate): Promise<any> {
    return apiClient.put(`/api/categoria/actualizar-categoria/${id_categoria}`, datos);
  },

  desactivarCategoria(id_categoria: number): Promise<any> {
    return apiClient.put(`/api/categoria/desactivar-categoria/${id_categoria}`, {});
  },

  activarCategoria(id_categoria: number): Promise<any> {
    return apiClient.put(`/api/categoria/activar-categoria/${id_categoria}`, {});
  }
};
