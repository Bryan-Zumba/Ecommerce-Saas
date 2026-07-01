export interface Bodega {
  id_bodega: number;
  id_empresa: number;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  estado: boolean;
  fecha_registro: string;
}

export interface BodegaRequest {
  id_empresa: number;
  nombre: string;
  descripcion?: string;
  ubicacion?: string;
}

export interface BodegaUpdate {
  nombre?: string;
  descripcion?: string;
  ubicacion?: string;
}

export interface BodegaResponse {
  success: boolean;
  message?: string;
  bodega: Bodega;
}
