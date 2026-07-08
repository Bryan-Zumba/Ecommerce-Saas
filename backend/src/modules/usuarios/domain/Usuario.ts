export interface Usuario {
    id_usuario: number;
    id_empresa: number;
    id_rol: number;
    nombres: string;
    apellidos: string;
    telefono?: string | null;
    email: string;
    password_hash: string;
    must_change_password: boolean;
    estado: boolean;
    ultimo_acceso?: Date | null;
    fecha_creacion: Date;
    rol?: {
        nombre: string;
    };
    empresa?: {
        id_empresa: number;
        nombre: string;
        descripcion?: string | null;
        ruc?: string | null;
        direccion?: string | null;
        telefono?: string | null;
        email?: string | null;
        logo_url?: string | null;
    };
}