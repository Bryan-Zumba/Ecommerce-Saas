import { DBClient } from "@/core/database/DBClient";
import { IRepositoryBodega } from "../domain/IRepositoryBodega";
import { ServicesEmpresa } from "@/modules/empresa/application/ServicesEmpresa";

export class ServicesBodega{
    private repository: IRepositoryBodega
    private serviceEmpresa: ServicesEmpresa;

    constructor(repository: IRepositoryBodega, serviceEmpresa: ServicesEmpresa){
        this.repository= repository,
        this.serviceEmpresa= serviceEmpresa
    }

    async crearBodega(bodega: any, client?: DBClient){

        if(!bodega.id_empresa || (bodega.id_empresa) <=0){
            throw new Error("El ID de la empresa es requerida y/o un numero valido")
        }
    
        await this.serviceEmpresa.obtenerEmpresaPorId(bodega.id_empresa);
    
        if(!bodega.nombre?.trim()){
            throw new Error("El nombre de la bodega es requerida")
        }
        const data= await this.repository.crearBodega(bodega, client)
        return data;
    }
}