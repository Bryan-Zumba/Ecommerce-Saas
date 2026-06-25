import { Cliente } from "../domain/entities/Cliente";
import { RepositoryCliente } from "../domain/repositories/IRepositoryCliente";

export class ServiceCliente {
    private repository: RepositoryCliente;

    constructor(repository: RepositoryCliente) {
        this.repository = repository;
    }

    async obtenerTodos(id_empresa: number): Promise<Cliente[]> {
        const clientes = await this.repository.obtenerTodos(id_empresa);
        return clientes;
    }

    async crearCliente(datosCliente: Omit<Cliente, 'id_cliente' | 'created_at' | 'estado'> & { id_empresa: number, estado?: boolean }): Promise<Cliente> {
        return this.repository.crearCliente(datosCliente);
    }

    async actualizarCliente(id: number, cliente: Omit<Cliente, 'id_cliente' | 'created_at' | 'estado'> & { id_empresa: number, estado?: boolean }): Promise<Cliente> {
        const clienteActualizado = await this.repository.actualizarCliente(id, cliente);
        return clienteActualizado;
    }

    async eliminarCliente(id: number): Promise<Cliente> {
        return this.repository.eliminarCliente(id);
    }
}