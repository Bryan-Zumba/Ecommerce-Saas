export interface Usuario {
  id_usuario: number;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  estado: boolean;
  id_rol: number;
  rol?: {
    nombre: string;
  };
  fecha_creacion: Date;
}

export interface UsuariosResponse {
  usuarios: Usuario[];
}

export interface UsuarioRequest {
  nombres: string;
  apellidos: string;
  email: string;
  telefono?: string;
  id_rol: number;
  id_empresa: number;
  password?: string;
}
