import { Bodega } from './Bodega';

export interface BodegaRepository {
  obtenerTodos(): Promise<Bodega[]>;
  crear(bodega: Omit<Bodega, 'id_bodega' | 'fecha_registro'>): Promise<Bodega>;
  actualizar(id: number, bodega: Partial<Omit<Bodega, 'id_bodega'>>): Promise<Bodega>;
  eliminar(id: number): Promise<void>;
  toggleEstado(id: number): Promise<Bodega>;
  restaurarDemo?(): Promise<Bodega[]>;
}
