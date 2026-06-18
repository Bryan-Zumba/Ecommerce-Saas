import { Usuario } from "./Usuario";
import { DBClient } from "@/core/database/DBClient";

export interface IRepositoryUsuario{
    crearUsuario(usuario: Usuario, client?: DBClient): Promise<Usuario>;
    obtenerUsuarioEmail(email: string, client?: DBClient): Promise<Usuario|null>;
    //actualizarUsuario(usuario: Usuario): Promise<Usuario>;
    //eliminarUsuario(id_usuario: number): Promise<Usuario>;
    obtenerUsuarioId(id_usuario: number): Promise<Usuario|null>;
    //obtenerUsuarios(): Promise<Usuario[]>;
}