export type UsuarioInputDTO = {
    id_empresa: number;
    id_rol: number;
    nombres: string;
    apellidos: string;
    telefono?: string | null;
    email: string;
    password: string;
}