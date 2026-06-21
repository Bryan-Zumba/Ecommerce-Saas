export interface Sesion{
    id_sesion: number;
    id_usuario: number;
    token: string;
    ip?: string | null;
    user_agent?: string | null;
    fecha_inicio: Date;
    fecha_expiracion: Date;
    estado: boolean;
    revoked_at?: Date | null;
}