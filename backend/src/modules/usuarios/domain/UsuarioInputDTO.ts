export type UsuarioInputDTO = {
    id_empresa: number;
    id_rol: number;
    nombre: string;
    apellido: string;
    telefono?: string | null;
    email: string;
    password: string;
}