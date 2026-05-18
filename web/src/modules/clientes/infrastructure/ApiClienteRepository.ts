import { Cliente } from '../domain/Cliente';
import { ClienteRepository } from '../domain/ClienteRepository';
import { apiClient } from '@/core/apiClient';

export class ApiClienteRepository implements ClienteRepository {
  async obtenerTodos(): Promise<Cliente[]> {
    return apiClient.get<Cliente[]>('/api/clientes');
  }
}
