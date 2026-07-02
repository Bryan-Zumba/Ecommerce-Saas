import { DBClient } from "../../../core/database/DBClient";
import { Inventario } from "./Inventario";

export interface IRepositoryInventario {
    obtenerInventarioBodega(id_bodega: number, client?: DBClient): Promise<Inventario[]>;
}