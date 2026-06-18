import { DBClient } from "@/core/database/DBClient";
import { IRepositoryBodega } from "../domain/IRepositoryBodega";
import { BodegaInputDTO } from "../domain/BodegaInputDTO";

export class ServicesBodega{
    private repository: IRepositoryBodega

    constructor(repository: IRepositoryBodega){
        this.repository= repository
    }

    async crearBodega(bodega: BodegaInputDTO, client?: DBClient){
        //Validciones de campos obligatorios y de formato
        if(!bodega.id_empresa || (bodega.id_empresa) <=0){
            throw new Error("El ID de la empresa es requerida y/o un numero valido")
        }
        if(!bodega.nombre?.trim()){
            throw new Error("El nombre de la bodega es requerida")
        }

        //Validaciones de longitud de campos
        if(bodega.nombre.length>150){
            throw new Error("El nombre de la bodega excede los 150 caracteres")
        }
        if(bodega.descripcion && bodega.descripcion.length>500){
            throw new Error("La descripcion de la bodega excede los 500 caracteres")
        }
        if(bodega.ubicacion && bodega.ubicacion.length>300){
            throw new Error("La ubicacion de la bodega excede los 300 caracteres")
        }

        const data= await this.repository.crearBodega(bodega, client)
        return data;
    }
}