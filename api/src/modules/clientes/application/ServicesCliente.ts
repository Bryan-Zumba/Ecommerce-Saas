import { Cliente } from "../domain/Cliente";
import { RepositoryCliente } from "../domain/RepositoryCliente";

export class ServiceCliente {
    private repository: RepositoryCliente;

    constructor(repository: RepositoryCliente) {
        this.repository = repository;
    }

    async obtenerTodos(): Promise<Cliente[]> {
        const clientes = await this.repository.obtenerTodos();
        return clientes;
    }
}