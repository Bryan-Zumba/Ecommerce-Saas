import { Item } from "./Item";
import { ItemInputDTO } from "./ItemInputDTO";
import { ItemUpdateDTO } from "./ItemUpdateDTO";


export interface RepositoryItem {
    obtenerItems(id_empresa: number): Promise<Item[]>;
    obtenerItemsPorCategoria(id_categoria: number): Promise<Item[]>;
    obtenerItemPorId(id_item: number): Promise<Item | null>;
    crearItem(item: ItemInputDTO): Promise<Item>;
    actualizarItem(id_item: number, item: ItemUpdateDTO): Promise<Item>;
    activarItem(id_item: number): Promise<Item>;
    desactivarItem(id_item: number): Promise<Item>;
}


