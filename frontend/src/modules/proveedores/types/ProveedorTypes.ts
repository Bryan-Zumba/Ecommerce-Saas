export interface ProveedorResponse {
  success: boolean;
  proveedores: ProveedorLocal[];
  proveedor?: ProveedorLocal;
  message?: string;
}

export interface ProveedorLocal {
  id_proveedor: number;
  id_empresa: number;
  nombre: string;
  descripcion: string | null;
  direccion: string | null;
  telefono: string | null;
  email: string | null;
  estado: boolean;
  fecha_registro: string;
}

export interface ProveedorRequest {
  nombre: string;
  descripcion?: string | null;
  direccion?: string | null;
  telefono?: string | null;
  email?: string | null;
}

// Para actualizar: todos los campos son opcionales (solo se envían los que cambiaron)
export interface ProveedorUpdateDTO {
  nombre?: string;
  descripcion?: string | null;
  direccion?: string | null;
  telefono?: string | null;
  email?: string | null;
}
