import { IRepositoryInventario } from "../domain/IRepositoryInventario";
import { ServicesBodega } from "./ServicesBodega";
import { InventarioDetalleDTO } from "../domain/InventarioDetalleDTO";
import { DBClient } from "../../../core/database/DBClient";
import { InventarioInputDTO, InventarioUpdateDTO } from "../domain/InventarioInputDTO";
import { Inventario } from "../domain/Inventario";
import { IRepositoryItem } from "../domain/IRepositoryItem";
import { ServicesEmpresa } from "../../empresa/application/ServicesEmpresa";

export class ServicesInventario {
    private repository: IRepositoryInventario;
    private repositoryItem: IRepositoryItem;
    private serviceBodega: ServicesBodega;
    private serviceEmpresa: ServicesEmpresa;

    constructor(repository: IRepositoryInventario, serviceBodega: ServicesBodega,repositoryItem:IRepositoryItem,serviceEmpresa:ServicesEmpresa) {
        this.repository = repository;
        this.repositoryItem = repositoryItem;
        this.serviceBodega = serviceBodega;
        this.serviceEmpresa = serviceEmpresa;
    }

    async obtenerInventarioBodega(id_empresa: number): Promise<InventarioDetalleDTO[]> {

        const bodega = await this.serviceBodega.obtenerBodegaEmpresa(id_empresa);

        const data = await this.repository.obtenerInventarioBodega(bodega.id_bodega);

        if (data.length == 0) {
            throw new Error("No se encontro inventario registrado para la bodega seleccionada")
        }

        return data;
    }

    async obtenerInventarioItem(id_item: number, id_bodega: number, id_empresa: number, client?: DBClient): Promise<InventarioDetalleDTO > {
        
        if(!id_item || id_item <=0) {
            throw new Error("Id de item inválido");
        }
        await this.serviceEmpresa.obtenerEmpresaPorId(id_empresa);

        const item = await this.repositoryItem.obtenerItemEmpresa(id_item, id_empresa, client);
        if (!item) {
            throw new Error("El item no existe en esta empresa");
        }
        const data = await this.repository.obtenerInventarioItem(id_item, id_bodega, client);

        if (data === null) {
            throw new Error("No se encontro inventario registrado para el item seleccionado")
        }
        return data;
    }

    async crearInventario(inventario: InventarioInputDTO, id_empresa: number, client?: DBClient): Promise<Inventario> {
        if(!inventario.id_item || inventario.id_item <=0) {
            throw new Error("Id de item inválido");
        }
        await this.serviceEmpresa.obtenerEmpresaPorId(id_empresa);

        const item = await this.repositoryItem.obtenerItemEmpresa(inventario.id_item, id_empresa, client);
        if (!item) {
            throw new Error("El item no existe en esta empresa");
        }
        
        const bodega = await this.serviceBodega.obtenerBodegaEmpresa(id_empresa, client);
        
        if (bodega.id_bodega !== inventario.id_bodega) {
            throw new Error("La bodega seleccionada no pertenece a la empresa")
        }
        const data = await this.repository.crearInventario(inventario, client);
        return data;
    }

    async actualizarInventario(id_inventario:number,inventario:InventarioUpdateDTO, client?:DBClient):Promise<Inventario>{
        
        if(inventario.stock_actual !== undefined && inventario.stock_actual < 0){
            throw new Error("El stock actual no puede ser negativo")
        }

        if(inventario.stock_disponible !== undefined && inventario.stock_disponible < 0){
            throw new Error("El stock disponible no puede ser negativo")
        }

        if(inventario.stock_reservado !== undefined && inventario.stock_reservado < 0){
            throw new Error("El stock reservado no puede ser negativo")
        }
        const data = await this.repository.actualizarInventario(id_inventario, inventario, client);
        return data;
    }

    async ingresarStock(id_item:number,id_bodega:number,cantidad:number,id_empresa:number,client?:DBClient):Promise<Inventario>{
        const inventarioActual = await this.obtenerInventarioItem(id_item,id_bodega,id_empresa,client);
        const inventario:InventarioUpdateDTO = {
            stock_actual:inventarioActual.stock_actual + cantidad,
            stock_disponible:inventarioActual.stock_disponible + cantidad,
            stock_reservado:inventarioActual.stock_reservado
        }
        const data = await this.actualizarInventario(inventarioActual.id_inventario,inventario, client);
        return data;
    }

    async retirarStock(id_item:number,id_bodega:number,cantidad:number,id_empresa:number,client?:DBClient):Promise<Inventario>{
        const inventarioActual = await this.obtenerInventarioItem(id_item,id_bodega,id_empresa,client);
        const inventario:InventarioUpdateDTO = {
            stock_actual:inventarioActual.stock_actual - cantidad,
            stock_disponible:inventarioActual.stock_disponible - cantidad,
            stock_reservado:inventarioActual.stock_reservado
        }
        const data = await this.actualizarInventario(inventarioActual.id_inventario,inventario, client);
        return data;
    }
}