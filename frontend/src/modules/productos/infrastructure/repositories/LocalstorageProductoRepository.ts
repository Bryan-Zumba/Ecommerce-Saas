import { Producto } from '../../domain/Producto';
import { ProductoRepository } from '../../domain/ProductoRepository';

const DATOS_SEMILLA: Producto[] = [
  {
    id_productos: 1,
    id_categoria: 1, // Bebidas
    id_empresa: 1,
    nombre: "Coca Cola 300ml",
    descripción: "Coca cola original sin azúcar.",
    precio: 1.5,
    stock: 10,
    estado: true,
    imagen: "/assets/coca_cola_sin_azu_300ml.png"
  },
  {
    id_productos: 2,
    id_categoria: 2, // Comida
    id_empresa: 1,
    nombre: "Hamburguesa Súper",
    descripción: "Deliciosa hamburguesa con queso.",
    precio: 3.5,
    stock: 5,
    estado: true,
    imagen: "/assets/hamburguer.jpg"
  },
  {
    id_productos: 3,
    id_categoria: 1, // Bebidas
    id_empresa: 1,
    nombre: "Coca Cola Familiar",
    descripción: "Bebida refrescante familiar.",
    precio: 2.5,
    stock: 15,
    estado: true,
    imagen: "/assets/coca_cola_sin_azu_300ml.png"
  }
];

export class LocalstorageProductoRepository implements ProductoRepository {
  private key = 'saas_productos';

  private obtenerColeccion(): Producto[] {
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

  private guardarColeccion(productos: Producto[]): void {
    localStorage.setItem(this.key, JSON.stringify(productos));
  }

  async obtenerTodos(): Promise<Producto[]> {
    return this.obtenerColeccion();
  }

  async crear(producto: Omit<Producto, 'id_productos'>): Promise<Producto> {
    const productos = this.obtenerColeccion();
    const nuevoId = productos.length > 0 ? Math.max(...productos.map(p => p.id_productos)) + 1 : 1;
    const nuevoProducto: Producto = {
      ...producto,
      id_productos: nuevoId,
    };
    productos.unshift(nuevoProducto);
    this.guardarColeccion(productos);
    return nuevoProducto;
  }

  async actualizar(id: number, datosActualizados: Partial<Omit<Producto, 'id_productos'>>): Promise<Producto> {
    const productos = this.obtenerColeccion();
    const indice = productos.findIndex(p => p.id_productos === id);
    if (indice === -1) throw new Error('Producto no encontrado');

    const productoActualizado = { ...productos[indice], ...datosActualizados };
    productos[indice] = productoActualizado;
    this.guardarColeccion(productos);
    return productoActualizado;
  }

  async eliminar(id: number): Promise<void> {
    const productos = this.obtenerColeccion();
    const filtrados = productos.filter(p => p.id_productos !== id);
    this.guardarColeccion(filtrados);
  }

  async toggleEstado(id: number): Promise<Producto> {
    const productos = this.obtenerColeccion();
    const indice = productos.findIndex(p => p.id_productos === id);
    if (indice === -1) throw new Error('Producto no encontrado');

    productos[indice].estado = !productos[indice].estado;
    this.guardarColeccion(productos);
    return productos[indice];
  }

  async restaurarDemo(): Promise<Producto[]> {
    this.guardarColeccion(DATOS_SEMILLA);
    return DATOS_SEMILLA;
  }
}
