export type UsuarioCreateDTO = {
    id_empresa: number;
    id_rol: number;
    nombres: string;
    apellidos: string;
    telefono?: string | null;
    email: string;
    password_hash: string;// <-- Ya encriptado
    must_change_password: boolean; // <-- Manejado por el service que lo llama
}