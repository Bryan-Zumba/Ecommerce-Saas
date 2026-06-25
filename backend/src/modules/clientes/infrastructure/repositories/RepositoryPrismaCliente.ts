import { prisma } from "../../../../core/database/prisma";
import { Cliente } from "../../domain/entities/Cliente";
import { RepositoryCliente } from "../../domain/repositories/IRepositoryCliente";

export class RepositoryPrismaCliente implements RepositoryCliente {
    
    async obtenerTodos(id_empresa: number): Promise<Cliente[]> {
        return await prisma.cliente.findMany({
            where: {
                id_empresa: id_empresa
            },
        });
    }

    async crearCliente(cliente: Omit<Cliente, 'id_cliente' | 'created_at' | 'estado'> & { id_empresa: number, estado?: boolean }): Promise<Cliente> {
        const nuevoCliente = await prisma.cliente.create({
            data: cliente
        });
        return nuevoCliente;
    }

    async actualizarCliente(id: number, cliente: Omit<Cliente, 'id_cliente' | 'created_at' | 'estado'> & { id_empresa: number, estado?: boolean }): Promise<Cliente> {
        const clienteActualizado = await prisma.cliente.update({
            where: {
                id_cliente: id
            },
            data: cliente
        });
        return clienteActualizado;
    }

    async eliminarCliente(id: number): Promise<Cliente> {
        const clienteEliminado = await prisma.cliente.delete({
            where: {
                id_cliente: id
            }
        });
        return clienteEliminado;
    }
}
   