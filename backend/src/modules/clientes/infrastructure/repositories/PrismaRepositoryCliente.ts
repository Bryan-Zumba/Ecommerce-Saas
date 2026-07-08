import { DBClient } from "../../../../core/database/DBClient";
import { prisma } from "../../../../core/database/prisma";
import { Cliente } from "../../domain/Cliente";
import { ClienteInputDTO } from "../../domain/ClienteInputDTO";
import { ClienteUpdateDTO } from "../../domain/ClienteUpdateDTO";
import { RepositoryCliente } from "../../domain/IRepositoryCliente";

export class PrismaRepositoryCliente implements RepositoryCliente {
    async obtenerTodos(id_empresa: number): Promise<Cliente[]> {
        const clientes = await prisma.cliente.findMany({
            where: {
                id_empresa: id_empresa
            },
        });
        return clientes;
    }

    async obtenerClienteId(id_cliente: number, client: DBClient = prisma) {
        const cliente = await client.cliente.findUnique({
            where: {
                id_cliente: id_cliente,
            }
        });
        return cliente;
    }

    async obtenerClienteCedula(id_empresa: number, cedula: string){
        const cliente = await prisma.cliente.findUnique({
            where: {
                cedula_id_empresa: {
                    id_empresa: id_empresa,
                    cedula: cedula
                }
            }
        });
        return cliente;
    }

    async crearCliente(cliente: ClienteInputDTO): Promise<Cliente> {
        const nuevoCliente = await prisma.cliente.create({
            data: cliente
        });
        return nuevoCliente;
    }

    async actualizarInformacionCliente(id_cliente: number, cliente: ClienteUpdateDTO): Promise<Cliente> {
        const clienteActualizado = await prisma.cliente.update({
            where: {
                id_cliente: id_cliente
            },
            data: {
                nombres: cliente.nombres,
                apellidos: cliente.apellidos,
                email: cliente.email,
                telefono: cliente.telefono,
                direccion: cliente.direccion,
            }
        });
        return clienteActualizado;
    }

    async desactivarCliente(id_cliente: number): Promise<Cliente> {
        const clienteEliminado = await prisma.cliente.update({
            where: {
                id_cliente: id_cliente
            },
            data: {
                estado: false
            }
        });
        return clienteEliminado;
    }

    async activarCliente(id_cliente: number): Promise<Cliente> {
        const clienteActivado = await prisma.cliente.update({
            where: {
                id_cliente: id_cliente
            },
            data: {
                estado: true
            }
        });
        return clienteActivado;
    }
}
