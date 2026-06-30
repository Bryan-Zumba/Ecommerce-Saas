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
            email: string;
        }
    }
}