import { Item } from './Item';

export interface ItemRepository {
  obtenerTodos(): Promise<Item[]>;
  crear(item: Omit<Item, 'id_item'>): Promise<Item>;
  actualizar(id: number, item: Partial<Omit<Item, 'id_item'>>): Promise<Item>;
  eliminar(id: number): Promise<void>;
  toggleEstado(id: number): Promise<Item>;
  restaurarDemo?(): Promise<Item[]>;
}
