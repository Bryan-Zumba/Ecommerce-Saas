import { IRepositoryMovimiento_Inventario } from "../domain/IRepositoryMovimiento_Inventario";
import { Movimiento_InventarioInputDTO } from "../domain/Movimiento_InventarioInputDTO";
import { ServiceItem } from "./ServiceItem";
import { ServicesBodega } from "./ServicesBodega";
import { DBClient } from "../../../core/database/DBClient";
import { Tipo_movimiento_inventario } from "@prisma/client";

export class ServicesMovimiento_Inventario {
    private repository: IRepositoryMovimiento_Inventario;
    private serviceItem: ServiceItem;
    private serviceBodega: ServicesBodega;
    
    constructor(repository: IRepositoryMovimiento_Inventario, serviceItem: ServiceItem, serviceBodega: ServicesBodega) {
        this.repository = repository;
        this.serviceItem = serviceItem;
        this.serviceBodega = serviceBodega;
    }

    async crearMovimientoInventario(movimiento: Movimiento_InventarioInputDTO, id_empresa:number, client?: DBClient) {
        const bodega= await this.serviceBodega.obtenerBodegaEmpresa(id_empresa, client);

        if(bodega?.id_bodega !== movimiento.id_bodega){
            throw new Error("La bodega no pertenece a la empresa");
        }

        await this.serviceItem.obtenerItemEmpresa(movimiento.id_item, id_empresa, client);

        if(movimiento.tipo_movimiento !== Tipo_movimiento_inventario.Compra && movimiento.tipo_movimiento !== Tipo_movimiento_inventario.Venta && movimiento.tipo_movimiento !== Tipo_movimiento_inventario.Devolucion){
            throw new Error("Tipo de movimiento no valido");
        }

        if(!movimiento.cantidad || movimiento.cantidad <=0){
            throw new Error("Cantidad de movimiento no valida");
        }
        if(movimiento.tipo_movimiento == Tipo_movimiento_inventario.Compra){
            if(!movimiento.id_compra){
                throw new Error("Id de compra no valido");
            }
        }

        if(movimiento.tipo_movimiento == Tipo_movimiento_inventario.Venta){
            if(!movimiento.id_venta){
                throw new Error("Id de venta no valido");
            }
        }

        const movimientoInventario=await this.repository.crearMovimientoInventario(movimiento,client);
        return movimientoInventario;
    }

    async obtenerMovimientosInventarioPorBodega(id_bodega: number, id_empresa:number, client?: DBClient) {
        const bodegaEmpresa = await this.serviceBodega.obtenerBodegaEmpresa(id_empresa, client);
        if(bodegaEmpresa.id_bodega !== id_bodega){
            throw new Error("La bodega no pertenece a la empresa");
        }
        const movimientosInventario=await this.repository.obtenerMovimientosInventarioPorBodega(id_bodega,client);
        return movimientosInventario;
    }

    async obtenerMovimientoInventarioPorId(id_movimiento_inventario: number,id_empresa:number, client?: DBClient) {
        if(!id_movimiento_inventario || id_movimiento_inventario <=0){
            throw new Error("Id de movimiento de inventario no valido");
        }
        const movimientoInventario=await this.repository.obtenerMovimientoInventarioPorId(id_movimiento_inventario,client);
        if(!movimientoInventario){
            throw new Error("Movimiento de inventario no encontrado");
        }
        const bodegaEmpresa = await this.serviceBodega.obtenerBodegaEmpresa(id_empresa, client);
        if(bodegaEmpresa.id_bodega !== movimientoInventario.id_bodega){
            throw new Error("La bodega no pertenece a la empresa");
        }
        return movimientoInventario;
    }

    async obtenerMovimientosInventarioPorItem(id_item: number, id_empresa:number, client?: DBClient) {
        const itemEmpresa=await this.serviceItem.obtenerItemEmpresa(id_item,id_empresa,client);
        if(itemEmpresa.id_item !== id_item){
            throw new Error("El item no pertenece a la empresa");
        }
        const movimientosInventarioItem=await this.repository.obtenerMovimientosInventarioPorItem(id_item,client);
        return movimientosInventarioItem;
    }

    async obtenerMovimientosInventarioPorVenta(id_venta: number, client?: DBClient) {
        return await this.repository.obtenerMovimientosInventarioPorVenta(id_venta,client);
    }

    async obtenerMovimientosInventarioPorCompra(id_compra: number, client?: DBClient) {
        return await this.repository.obtenerMovimientosInventarioPorCompra(id_compra,client);
    }    
}