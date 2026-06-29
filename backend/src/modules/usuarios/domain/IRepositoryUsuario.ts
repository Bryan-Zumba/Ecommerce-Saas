import { Usuario } from "./Usuario";
import { DBClient } from "../../../core/database/DBClient";
import { UsuarioCreateDTO } from "./UsuarioCreateDB";
import { UsuarioUpdateDTO } from "./UsuarioUpdateDTO";

export interface IRepositoryUsuario{
    crearUsuario(usuario: UsuarioCreateDTO, client?: DBClient): Promise<Usuario>;
    actualizarInformacionUsuario(id_usuario: number, usuario: UsuarioUpdateDTO): Promise<Usuario>;
    obtenerUsuarioEmail(email: string, client?: DBClient): Promise<Usuario|null>;
    //eliminarUsuario(id_usuario: number): Promise<Usuario>;
    obtenerUsuarioId(id_usuario: number): Promise<Usuario|null>;
    actualizarPassword(id_usuario: number, password_hash: string): Promise<void>;
    //obtenerUsuarios(): Promise<Usuario[]>;
    actualizarUltimoAcceso(id_usuario: number): Promise<void>;
}