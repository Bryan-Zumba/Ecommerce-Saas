export interface Usuario {
  id_usuario: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  estado: boolean;
  id_rol: number;
  rol_nombre?: string; // Optional helper field
}
