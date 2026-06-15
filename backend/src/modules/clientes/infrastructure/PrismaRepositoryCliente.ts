import { prisma } from "../../../core/database/prisma";
import { Cliente } from "../domain/Cliente";
import { RepositoryCliente } from "../domain/IRepositoryCliente";

export class RepositoryPrismaCliente implements RepositoryCliente {

    async obtenerTodos(): Promise<Cliente[]> {
        const clientes = await prisma.cliente.findMany();
        return clientes;
    }

    async crear(cliente: Omit<Cliente, "id" | "created_at">): Promise<Cliente> {
        const nuevoCliente = await prisma.cliente.create({
            data: {
                cedula: cliente.cedula,
                nombres: cliente.nombres,
                apellidos: cliente.apellidos,
                email: cliente.email,
                telefono: cliente.telefono,
            }
        });
        return nuevoCliente;
    }

}