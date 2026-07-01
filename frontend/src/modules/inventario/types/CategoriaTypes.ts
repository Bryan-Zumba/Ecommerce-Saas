export interface Categoria {
  id_categoria: number;
  id_empresa: number;
  nombre: string;
  descripcion: string;
  estado: boolean;
  fecha_registro: string;
}

export interface CategoriaRequest {
  id_empresa: number;
  nombre: string;
  descripcion?: string;
}

export interface CategoriaUpdate {
  nombre?: string;
  descripcion?: string;
}

export interface CategoriaResponse {
  success: boolean;
  message?: string;
  categoria: Categoria;
}

export interface CategoriasResponse {
  success: boolean;
  message?: string;
  categorias: Categoria[];
}
