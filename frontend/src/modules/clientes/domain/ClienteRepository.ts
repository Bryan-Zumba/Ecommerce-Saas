import { Cliente } from './Cliente';

export interface ClienteRepository {
  obtenerTodos(): Promise<Cliente[]>;
  crear(cliente: Omit<Cliente, 'id' | 'created_at'>): Promise<Cliente>;

}
