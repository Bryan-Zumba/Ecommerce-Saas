import { DBClient } from "../../../core/database/DBClient";
import { DetalleCompraInputDTO } from "../domain/DetalleCompraInputDTO";
import { IRepositoryDetalleCompra } from "../domain/IRepositoryDetalleCompra";
import { ServicesBodega } from "../../inventario/application/ServicesBodega";
import { ServiceItem } from "../../inventario/application/ServiceItem";
import { normalizerDecimal } from "@/shared/normalizerDecimal";

export class ServicesDetalleCompra{
    private repository: IRepositoryDetalleCompra;
    private servicesBodega: ServicesBodega;
    private servicesItem: ServiceItem;

    constructor(repository: IRepositoryDetalleCompra, servicesBodega: ServicesBodega, servicesItem: ServiceItem){
        this.repository = repository;
        this.servicesBodega = servicesBodega;
        this.servicesItem = servicesItem;
    }

    async crearDetalleCompra(detalleCompra: DetalleCompraInputDTO, client?: DBClient){
        //poner api compra obtenerid
        if(!detalleCompra.id_compra){
            throw new Error("El id de la compra es requerido");
        }
        await this.servicesBodega.obtenerBodegaId(detalleCompra.id_bodega, client)
        await this.servicesItem.obtenerItemPorId(detalleCompra.id_item, client)

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
}