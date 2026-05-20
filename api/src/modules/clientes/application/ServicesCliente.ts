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

     async crear(datosCliente: Omit<Cliente, "id" | "created_at">): Promise<Cliente> {
        const nuevoCliente = await this.repository.crear(datosCliente);
        return nuevoCliente;
    }
}