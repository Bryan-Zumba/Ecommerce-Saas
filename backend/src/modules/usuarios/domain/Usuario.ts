export interface Usuario {
    id_usuario: number;
    id_empresa: number;
    id_rol: number;
    nombre: string;
    apellido: string;
    telefono: string;
    email: string;
    password_hash: string;
    must_change_password: boolean;
    estado: boolean;
    ultimo_acceso: Date;
    fecha_creacion: Date;
}