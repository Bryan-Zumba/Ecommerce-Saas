export interface LoginResponse {
    data: {
        token: string;
        user: {
            id_usuario: number;
            nombre: string;
            email: string;
        }
    }
}