import { Categoria } from '../domain/Categoria';

export interface CategoriaRepository {
  obtenerTodas(): Promise<Categoria[]>;
  crear(categoria: Omit<Categoria, 'id'>): Promise<Categoria>;
  actualizar(id: number, cambios: Partial<Omit<Categoria, 'id'>>): Promise<Categoria>;
  eliminar(id: number): Promise<void>;
}
