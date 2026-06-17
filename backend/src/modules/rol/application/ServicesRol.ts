import { DBClient } from "@/core/database/DBClient";
import { IRepositoryRol } from "../domain/IRepositoryRol";

export class ServicesRol{
    private repository: IRepositoryRol;

    constructor(repository: IRepositoryRol) {
        this.repository = repository;
    }

    async obtenerRoles(){
        const data = await this.repository.obtenerRoles();
        if(data.length === 0){
            throw new Error("No se encontraron registros");
        }
        return data;
    }

    async obtenerRolPorId(id_rol: number, client?: DBClient) {
        if(!id_rol || id_rol <= 0){
            throw new Error("El ID del rol es invalido");
        }
        const data = await this.repository.obtenerRolPorId(id_rol,client);
        if(!data){
            throw new Error("Rol no encontrado");
        }
        return data;
    }

    async obtenerRolPorNombre(nombre: string) {
        if(!nombre?.trim()){
            throw new Error("El nombre del rol es requerido");
        }
        const data = await this.repository.obtenerRolPorNombre(nombre);
        if(!data){
            throw new Error("Rol no encontrado");
        }
        return data;
    }
}