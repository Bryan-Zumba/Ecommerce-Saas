import { prisma } from "../../../core/database/prisma";
import { Cliente } from "../domain/Cliente";
import { RepositoryCliente } from "../domain/RepositoryCliente";

export class RepositoryPrismaCliente implements RepositoryCliente {
    
    async obtenerTodos(): Promise<Cliente[]> {
        const clientes = await prisma.cliente.findMany();
        return clientes;
    }
}