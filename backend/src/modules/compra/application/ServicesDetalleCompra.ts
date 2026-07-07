import { DBClient } from "../../../core/database/DBClient";
import { DetalleCompraInputDTO } from "../domain/DetalleCompraInputDTO";
import { IRepositoryDetalleCompra } from "../domain/IRepositoryDetalleCompra";
import { ServicesBodega } from "../../inventario/application/ServicesBodega";
import { ServiceItem } from "../../inventario/application/ServiceItem";
import { normalizerDecimal } from "../../../shared/normalizerDecimal";
import { Tipo_Item } from "@prisma/client";
import { DetalleCompra } from "../domain/DetalleCompra";
import { IRepositoryCompra } from "../domain/IRepositoryCompra";

export class ServicesDetalleCompra{
    private repository: IRepositoryDetalleCompra;
    private servicesBodega: ServicesBodega;
    private servicesItem: ServiceItem;
    private repositoryCompra: IRepositoryCompra;

    constructor(repository: IRepositoryDetalleCompra, servicesBodega: ServicesBodega, servicesItem: ServiceItem, repositoryCompra: IRepositoryCompra){
        this.repository = repository;
        this.servicesBodega = servicesBodega;
        this.servicesItem = servicesItem;
        this.repositoryCompra = repositoryCompra;
    }

    async crearDetalleCompra(detalleCompra: DetalleCompraInputDTO, id_empresa: number, client?: DBClient){
        //poner api compra obtenerid
        if(!detalleCompra.id_compra){
            throw new Error("El id de la compra es requerido");
        }
        
        const bodegaEmpresa= await this.servicesBodega.obtenerBodegaEmpresa(id_empresa, client);
        if(detalleCompra.id_bodega !== bodegaEmpresa.id_bodega){
            throw new Error("La bodega seleccionada no existe para esta empresa");
        }
        
        await this.servicesItem.obtenerItemEmpresa(detalleCompra.id_item, id_empresa, client);

        const item= await this.servicesItem.obtenerItemPorId(detalleCompra.id_item, client);
        if(item.tipo_item === Tipo_Item.Servicio){
           throw new Error("El item seleccionado es un servicio, no se puede agregar a una solicitud de compra"); 
        }

        if(!detalleCompra.cantidad){
            throw new Error("La cantidad del item es requerida");
        }
        if(detalleCompra.cantidad <= 0){
            throw new Error("La cantidad del item debe ser mayor a 0");
        }
        const costo_unitarioDecimal = normalizerDecimal(detalleCompra.costo_unitario, "Costo unitario");
        if(costo_unitarioDecimal.lte(0)){
            throw new Error("Costo del item debe ser mayor a 0");
        }

        const subtotalDecimal = costo_unitarioDecimal.mul(detalleCompra.cantidad);

        const detalleCompraCreado = await this.repository.crearDetalleCompra({
            ...detalleCompra, 
            costo_unitario: costo_unitarioDecimal,
            subtotal: subtotalDecimal
        }, client);
        return detalleCompraCreado;
    }

    async obtenerDetalleCompraPorIdCompra(id_compra: number, id_empresa: number, client?: DBClient): Promise<DetalleCompra[]> {
        if(!id_compra){
            throw new Error("El id de la compra es requerido");
        }
        const compra = await this.repositoryCompra.obtenerCompraPorId(id_compra, client);
        if(!compra){
            throw new Error("No se encontro la compra");
        }
        if(compra.id_empresa !== id_empresa){
            throw new Error("La compra seleccionada no pertenece a su empresa");
        }

        const detalleCompra = await this.repository.obtenerDetalleCompraPorIdCompra(id_compra, client);
        return detalleCompra;
    }
}