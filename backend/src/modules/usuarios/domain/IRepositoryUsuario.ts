import { Usuario } from "./Usuario";
import { DBClient } from "../../../core/database/DBClient";
import { UsuarioCreateDTO } from "./UsuarioCreateDB";
import { UsuarioUpdateDTO } from "./UsuarioUpdateDTO";

export interface IRepositoryUsuario{
    crearUsuario(usuario: UsuarioCreateDTO, client?: DBClient): Promise<Usuario>;
    actualizarInformacionUsuario(id_usuario: number, usuario: UsuarioUpdateDTO): Promise<Usuario>;
    desactivarUsuario(id_usuario: number): Promise<void>;
    activarUsuario(id_usuario: number): Promise<void>;
    obtenerUsuariosEmpresa(id_empresa: number, client?: DBClient): Promise<Usuario[]>;
    obtenerUsuarioEmail(email: string, client?: DBClient): Promise<Usuario|null>;
    obtenerUsuarioId(id_usuario: number): Promise<Usuario|null>;
    actualizarRolUsuario(id_usuario: number, id_rol: number): Promise<void>;
    actualizarPassword(id_usuario: number, password_hash: string): Promise<void>;
    actualizarUltimoAcceso(id_usuario: number): Promise<void>;
}