import { Rol } from "./Rol";
import { DBClient } from "../../../core/database/DBClient";

export interface IRepositoryRol{
    obtenerRoles(): Promise<Rol[]>;
    obtenerRolPorId(id_rol: number, client?: DBClient): Promise<Rol|null>;
    obtenerRolPorNombre(nombre: string, client?: DBClient): Promise<Rol|null>;
}