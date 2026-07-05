import { Item } from "./Item";
import { ItemInputDTO } from "./ItemInputDTO";
import { ItemUpdateDTO } from "./ItemUpdateDTO";
import { DBClient } from "../../../core/database/DBClient";

export interface IRepositoryItem {
    obtenerItems(id_empresa: number, client?: DBClient): Promise<Item[]>;
    obtenerItemsPorCategoria(id_categoria: number): Promise<Item[]>;
    obtenerItemPorId(id_item: number, client?: DBClient): Promise<Item | null>;
    obtenerItemEmpresa(id_item: number,id_empresa: number, client?: DBClient): Promise<Item | null>;
    crearItem(item: ItemInputDTO, client?: DBClient): Promise<Item>;
    actualizarItem(id_item: number, item: ItemUpdateDTO): Promise<Item>;
    activarItem(id_item: number): Promise<Item>;
    desactivarItem(id_item: number): Promise<Item>;
    existeItemPorNombre(nombre: string, id_empresa: number, id_item?: number): Promise<boolean>;
}