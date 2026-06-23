import { Usuario } from "./Usuario";
import { DBClient } from "../../../core/database/DBClient";
import { UsuarioCreateDTO } from "./UsuarioCreateDB";

export interface IRepositoryUsuario{
    crearUsuario(usuario: UsuarioCreateDTO, client?: DBClient): Promise<Usuario>;
    obtenerUsuarioEmail(email: string, client?: DBClient): Promise<Usuario|null>;
    //actualizarUsuario(usuario: Usuario): Promise<Usuario>;
    //eliminarUsuario(id_usuario: number): Promise<Usuario>;
    obtenerUsuarioId(id_usuario: number): Promise<Usuario|null>;
    actualizarPassword(id_usuario: number, password_hash: string): Promise<void>;
    //obtenerUsuarios(): Promise<Usuario[]>;
}