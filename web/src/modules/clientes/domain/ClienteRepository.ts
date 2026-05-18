import { Cliente } from './Cliente';

export interface ClienteRepository {
  obtenerTodos(): Promise<Cliente[]>;
}
