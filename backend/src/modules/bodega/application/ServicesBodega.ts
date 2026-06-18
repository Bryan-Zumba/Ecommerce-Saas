import { DBClient } from "@/core/database/DBClient";
import { IRepositoryBodega } from "../domain/IRepositoryBodega";

export class ServicesBodega{
    private repository: IRepositoryBodega

    constructor(repository: IRepositoryBodega){
        this.repository= repository
    }

    async crearBodega(bodega: any, client?: DBClient){

        if(!bodega.id_empresa || (bodega.id_empresa) <=0){
            throw new Error("El ID de la empresa es requerida y/o un numero valido")
        }    
        if(!bodega.nombre?.trim()){
            throw new Error("El nombre de la bodega es requerida")
        }
        const data= await this.repository.crearBodega(bodega, client)
        return data;
    }
}