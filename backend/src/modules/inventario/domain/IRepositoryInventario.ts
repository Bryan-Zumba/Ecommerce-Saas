import { DBClient } from "../../../core/database/DBClient";
import { Inventario } from "./Inventario";
import { InventarioDetalleDTO } from "./InventarioDetalleDTO";
import { InventarioInputDTO, InventarioUpdateDTO } from "./InventarioInputDTO";

export interface IRepositoryInventario {
    obtenerInventarioBodega(id_bodega: number, client?: DBClient): Promise<InventarioDetalleDTO[]>;
    obtenerInventarioItem(id_item: number, id_bodega: number, client?: DBClient): Promise<InventarioDetalleDTO | null>;
    obtenerInventarioId(id_inventario:number,client?:DBClient):Promise<Inventario | null>;
    crearInventario(inventario: InventarioInputDTO, client?: DBClient): Promise<Inventario>;
    actualizarInventario(id_inventario: number, inventario: InventarioUpdateDTO, client?: DBClient): Promise<Inventario>;
    retirarStock(id_inventario: number, cantidad: number, client?: DBClient): Promise<{ count: number }>;
}