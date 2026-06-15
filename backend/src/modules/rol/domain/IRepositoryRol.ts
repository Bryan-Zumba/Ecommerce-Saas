import { Rol } from "./Rol";

export interface IRepositoryRol{
    obtenerRoles(): Promise<Rol[]>;
    obtenerRolPorId(id_rol: number): Promise<Rol|null>;
    obtenerRolPorNombre(nombre: string): Promise<Rol|null>;
}