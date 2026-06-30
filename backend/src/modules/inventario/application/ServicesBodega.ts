import { DBClient } from "@/core/database/DBClient";
import { IRepositoryBodega } from "../domain/IRepositoryBodega";
import { BodegaInputDTO } from "../domain/BodegaInputDTO";
import { ServicesEmpresa } from "@/modules/empresa/application/ServicesEmpresa";
import { BodegaUpdateDTO } from "../domain/BodegaUpdateDTO";

export class ServicesBodega{
    private repository: IRepositoryBodega;
    private serviceEmpresa: ServicesEmpresa;

    constructor(repository: IRepositoryBodega, serviceEmpresa: ServicesEmpresa){
        this.repository= repository;
        this.serviceEmpresa= serviceEmpresa;
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

    async obtenerBodegaEmpresa(id_empresa: number, client?: DBClient){
        await this.serviceEmpresa.obtenerEmpresaPorId(id_empresa, client);

        const bodega= await this.repository.obtenerBodegaEmpresa(id_empresa, client);

        if(!bodega){
            throw new Error("No se encontro bodega registrada para la empresa seleccionada")
        }
        return bodega;
    }

    async obtenerBodegaId(id_bodega: number, client?: DBClient){
        if(!id_bodega || id_bodega<=0){
            throw new Error("El ID de la bodega es requerido y/o un numero valido")
        }

        const bodega= await this.repository.obtenerBodegaId(id_bodega, client);

        if(!bodega){
            throw new Error("No se encontro bodega registrada con el ID proporcionado")
        }
        return bodega;
    }

    async obtenerBodegaNombre(nombre:string, id_empresa:number, client?: DBClient){
        if(!nombre?.trim()){
            throw new Error("El nombre de la bodega es requerido")
        }
        await this.serviceEmpresa.obtenerEmpresaPorId(id_empresa, client);

        const bodega= await this.repository.obtenerBodegaNombre(nombre, id_empresa, client);

        if(!bodega){
            throw new Error("No se encontro bodega registrada con el nombre proporcionado")
        }
        return bodega;
    }

    async actualizarInformacionBodega(id_bodega: number, bodega: BodegaUpdateDTO, client?: DBClient){
        const bodegaExistente = await this.obtenerBodegaId(id_bodega, client);

        if(bodega.nombre && bodega.nombre.length>150){
            throw new Error("El nombre de la bodega excede los 150 caracteres")
        }

        if(bodega.nombre && bodegaExistente.nombre.trim() != bodega.nombre.trim()){
            const existente = await this.obtenerBodegaNombre(bodega.nombre.trim(), bodegaExistente.id_empresa, client);
            if(existente){
                throw new Error("Ya existe una bodega con el nombre proporcionado para esta empresa")
            }
        }

        if(bodega.descripcion && bodega.descripcion.length>500){
            throw new Error("La descripcion de la bodega excede los 500 caracteres")
        }
        if(bodega.ubicacion && bodega.ubicacion.length>300){
            throw new Error("La ubicacion de la bodega excede los 300 caracteres")
        }

        const data= await this.repository.actualizarInformacionBodega(id_bodega, bodega, client);
        return data;
    }
}