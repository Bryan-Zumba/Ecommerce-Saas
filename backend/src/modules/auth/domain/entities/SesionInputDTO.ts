export type SesionInputDTO = {
    id_usuario: number;
    token: string;
    ip?: string | null;
    user_agent?: string | null;
    fecha_expiracion: Date;
}