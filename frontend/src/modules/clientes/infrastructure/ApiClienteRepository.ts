import { Cliente } from '../domain/Cliente';
import { ClienteRepository } from '../domain/ClienteRepository';
import { apiClient } from '@/core/apiClient';

export class ApiClienteRepository implements ClienteRepository {
  async obtenerTodos(id_empresa: number): Promise<Cliente[]> {
    return apiClient.get<Cliente[]>('/api/cliente/obtener-clientes/' + id_empresa);
  }

  async crear(cliente: Omit<Cliente, 'id_cliente' | 'created_at'>): Promise<Cliente> {
    return apiClient.post<Cliente>('/api/cliente/crear-cliente', cliente);
  }

}