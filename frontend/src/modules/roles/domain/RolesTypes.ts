export interface Permiso {
  modulo: string;
  acciones: string[];
}

export interface Rol {
  id_rol: number;
  nombre: string;
  descripcion: string;
  estado: boolean;
  permisos: Permiso[];
}
