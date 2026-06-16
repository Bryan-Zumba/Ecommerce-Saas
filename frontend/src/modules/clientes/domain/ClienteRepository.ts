import { Cliente } from './Cliente';

export interface ClienteRepository {
  obtenerTodos(id_empresa:number): Promise<Cliente[]>;
  crear(cliente: Omit<Cliente, 'id_cliente' | 'created_at'>): Promise<Cliente>;

}
