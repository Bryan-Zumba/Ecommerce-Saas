import { Cliente } from "../domain/Cliente";
import { RepositoryCliente } from "../domain/IRepositoryCliente";

export class ServiceCliente {
    private repository: RepositoryCliente;

    constructor(repository: RepositoryCliente) {
        this.repository = repository;
    }

    async obtenerTodos(id_empresa:number): Promise<Cliente[]> {
        const clientes = await this.repository.obtenerTodos(id_empresa);
        return clientes;
    }

    async crearCliente(datosCliente: any): Promise<Cliente> {
        const nuevoCliente = await this.repository.crearCliente(datosCliente);
        return nuevoCliente;
    }
}