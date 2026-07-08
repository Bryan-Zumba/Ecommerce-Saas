export interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        must_change_password: boolean;
        usuario: {
            id_usuario: number;
            id_empresa: number;
            id_rol: number;
            nombres: string;
            apellidos: string;
            telefono?: string | null;
            email: string;
            ultimo_acceso?: string | null;
            rol?: string;
            empresa?: {
                id_empresa: number;
                nombre: string;
                descripcion: string | null;
                ruc: string | null;
                direccion: string | null;
                telefono: string | null;
                email: string | null;
                logo_url: string | null;
            }
        }
    }
}