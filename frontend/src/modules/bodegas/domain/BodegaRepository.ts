import { Bodega } from './Bodega';

export interface BodegaRepository {
  obtener(id_empresa: number): Promise<Bodega | null>;
  registrar(bodega: Omit<Bodega, 'id_bodega' | 'fecha_registro'>): Promise<Bodega>;
  actualizar(id_empresa: number, datos: Partial<Omit<Bodega, 'id_bodega' | 'id_empresa'>>): Promise<Bodega>;
}
