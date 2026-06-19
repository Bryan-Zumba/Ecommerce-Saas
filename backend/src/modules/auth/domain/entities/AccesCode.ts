export interface Acceso_Autorizado {
    id_acceso_autorizado: number;
    id_empresa?: number | null;
    email: string;
    codigo_acceso: string;
    nombre: string;
    intentos: number;
    usado: boolean;
    fecha_uso: Date | null;
    estado: boolean;
    fecha_creacion: Date;
}