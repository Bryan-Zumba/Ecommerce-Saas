import { PrismaClient } from "@prisma/client";
import { RepositoryCliente } from "../../domain/IRepositoryCliente";

const prisma = new PrismaClient();

export class RepositoryPrismaCliente implements RepositoryCliente {
    async obtenerTodos(id_empresa: number) {
        const clientes = await prisma.cliente.findMany({
            where: {
                id_empresa: id_empresa
            }
        });
        return clientes;
    }

    async crearCliente(cliente:any){
        const nuevoCliente = await prisma.cliente.create({
            data: cliente
        });
        return nuevoCliente;
    }
}