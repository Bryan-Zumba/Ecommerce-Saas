import { Producto } from './Producto';

export interface ProductoRepository {
  obtenerTodos(): Promise<Producto[]>;
  crear(producto: Omit<Producto, 'id_productos'>): Promise<Producto>;
  actualizar(id: number, producto: Partial<Omit<Producto, 'id_productos'>>): Promise<Producto>;
  eliminar(id: number): Promise<void>;
  toggleEstado(id: number): Promise<Producto>;
  restaurarDemo?(): Promise<Producto[]>;
}
