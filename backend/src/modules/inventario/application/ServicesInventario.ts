import { ServicesEmpresa } from "@/modules/empresa/application/ServicesEmpresa";
import { IRepositoryInventario } from "../domain/IRepositoryInventario";
import { ServicesBodega } from "./ServicesBodega";

export class ServicesInventario{
    private repository: IRepositoryInventario;
    private serviceEmpresa: ServicesEmpresa;
    private serviceBodega: ServicesBodega

    constructor(repository: IRepositoryInventario,serviceEmpresa: ServicesEmpresa,serviceBodega: ServicesBodega){
        this.repository= repository;
        this.serviceEmpresa= serviceEmpresa;
        this.serviceBodega= serviceBodega;
    }

    async obtenerInventarioBodega(id_empresa:number){
        await this.serviceEmpresa.obtenerEmpresaPorId(id_empresa);
        
        const bodega= await this.serviceBodega.obtenerBodegaEmpresa(id_empresa);
        
        const data=await this.repository.obtenerInventarioBodega(bodega.id_bodega);

        if(data.length==0){
            throw new Error("No se encontro inventario registrado para la bodega seleccionada")
        }

        return data;
    }
}