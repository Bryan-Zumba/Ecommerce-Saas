import { DBClient } from "../../../core/database/DBClient";
import { InventarioDetalleDTO } from "./InventarioDetalleDTO";

export interface IRepositoryInventario {
    obtenerInventarioBodega(id_bodega: number, client?: DBClient): Promise<InventarioDetalleDTO[]>;
}