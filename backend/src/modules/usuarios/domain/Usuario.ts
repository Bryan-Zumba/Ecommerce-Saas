export interface Usuario {
    id_usuario: number;
    id_empresa: number;
    id_rol: number;
    nombre: string;
    apellido: string;
    telefono?: string | null;
    email: string;
    password_hash: string;
    must_change_password: boolean;
    estado: boolean;
    ultimo_acceso?: Date | null;
    fecha_creacion: Date;
}