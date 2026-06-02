import { Item } from '../../domain/Item';
import { ItemRepository } from '../../domain/ItemRepository';

const DATOS_SEMILLA: Item[] = [
  {
    id_item: 1,
    id_categoria: 1, // Bebidas
    id_empresa: 1,
    nombre: "Coca Cola 300ml",
    descripción: "Coca cola original sin azúcar.",
    precio: 1.5,
    tipo_item: 'Producto',
    estado: true,
    imagen: "/assets/coca_cola_sin_azu_300ml.png"
  },
  {
    id_item: 2,
    id_categoria: 2, // Comida
    id_empresa: 1,
    nombre: "Hamburguesa Súper",
    descripción: "Deliciosa hamburguesa con queso.",
    precio: 3.5,
    tipo_item: 'Producto',
    estado: true,
    imagen: "/assets/hamburguer.jpg"
  },
  {
    id_item: 3,
    id_categoria: 1, // Bebidas
    id_empresa: 1,
    nombre: "Coca Cola Familiar",
    descripción: "Bebida refrescante familiar.",
    precio: 2.5,
    tipo_item: 'Producto',
    estado: true,
    imagen: "/assets/coca_cola_sin_azu_300ml.png"
  }
];

export class LocalstorageItemRepository implements ItemRepository {
  private key = 'saas_items';

  private obtenerColeccion(): Item[] {
    const guardado = localStorage.getItem(this.key);
    if (!guardado) {
      localStorage.setItem(this.key, JSON.stringify(DATOS_SEMILLA));
      return DATOS_SEMILLA;
    }
    try {
      return JSON.parse(guardado);
    } catch {
      return DATOS_SEMILLA;
    }
  }

  private guardarColeccion(items: Item[]): void {
    localStorage.setItem(this.key, JSON.stringify(items));
  }

  async obtenerTodos(): Promise<Item[]> {
    return this.obtenerColeccion();
  }

  async crear(item: Omit<Item, 'id_item'>): Promise<Item> {
    const items = this.obtenerColeccion();
    const nuevoId = items.length > 0 ? Math.max(...items.map(p => p.id_item)) + 1 : 1;
    const nuevoItem: Item = {
      ...item,
      id_item: nuevoId,
    };
    items.unshift(nuevoItem);
    this.guardarColeccion(items);
    return nuevoItem;
  }

  async actualizar(id: number, datosActualizados: Partial<Omit<Item, 'id_item'>>): Promise<Item> {
    const items = this.obtenerColeccion();
    const indice = items.findIndex(p => p.id_item === id);
    if (indice === -1) throw new Error('Ítem no encontrado');

    const itemActualizado = { ...items[indice], ...datosActualizados };
    items[indice] = itemActualizado;
    this.guardarColeccion(items);
    return itemActualizado;
  }

  async eliminar(id: number): Promise<void> {
    const items = this.obtenerColeccion();
    const filtrados = items.filter(p => p.id_item !== id);
    this.guardarColeccion(filtrados);
  }

  async toggleEstado(id: number): Promise<Item> {
    const items = this.obtenerColeccion();
    const indice = items.findIndex(p => p.id_item === id);
    if (indice === -1) throw new Error('Ítem no encontrado');

    items[indice].estado = !items[indice].estado;
    this.guardarColeccion(items);
    return items[indice];
  }

  async restaurarDemo(): Promise<Item[]> {
    this.guardarColeccion(DATOS_SEMILLA);
    return DATOS_SEMILLA;
  }
}
