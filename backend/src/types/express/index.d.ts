declare namespace Express {
    export interface Request {
        user?:{
            id_usuario: number;
            id_empresa: number;
            id_rol: number;
        };
    }
}