import { Usuario } from "./Usuario";

export interface IRepositoryUsuario{
    crearUsuario(usuario: Usuario): Promise<Usuario>;
    //actualizarUsuario(usuario: Usuario): Promise<Usuario>;
    //eliminarUsuario(id_usuario: number): Promise<Usuario>;
    //obtenerUsuarioPorId(id_usuario: number): Promise<Usuario>;
    //obtenerUsuarios(): Promise<Usuario[]>;
}