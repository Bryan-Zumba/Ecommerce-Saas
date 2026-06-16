import { Usuario } from "./Usuario";

export interface IRepositoryUsuario{
    crearUsuario(usuario: Usuario): Promise<Usuario>;
    obtenerUsuarioEmail(email: string): Promise<Usuario|null>;
    //actualizarUsuario(usuario: Usuario): Promise<Usuario>;
    //eliminarUsuario(id_usuario: number): Promise<Usuario>;
    obtenerUsuarioId(id_usuario: number): Promise<Usuario|null>;
    //obtenerUsuarios(): Promise<Usuario[]>;
}