import { prisma } from "../../../../core/database/prisma";
import { IRepositoryProveedor } from "../../domain/IRepositoryProveedor";
import { Proveedor } from "../../domain/Proveedor";
import { ProveedorInputDTO } from "../../domain/ProveedorInputDTO";
import { ProveedorUpdateDTO } from "../../domain/ProveedorUpdateDTO";

export class PrismaRepositoryProveedor implements IRepositoryProveedor {
    async obtenerProveedores(id_empresa: number): Promise<Proveedor[]> {
        const proveedores = await prisma.proveedor.findMany({
            where: {
                id_empresa: id_empresa,
            },
        });
        return proveedores;
    }

    async obtenerProveedorPorId(id_proveedor: number): Promise<Proveedor | null> {
        const proveedor = await prisma.proveedor.findUnique({
            where: {
                id_proveedor: id_proveedor,
            },
        });
        return proveedor;
    }

    async crearProveedor(proveedor: ProveedorInputDTO): Promise<Proveedor> {
        const nuevoProveedor = await prisma.proveedor.create({
            data: proveedor

        });
        return nuevoProveedor;
    }

    async actualizarProveedor(id_proveedor: number, proveedor: ProveedorUpdateDTO): Promise<Proveedor> {
        const proveedorActualizado = await prisma.proveedor.update({
            where: {
                id_proveedor: id_proveedor,
            },
            data: {
                nombre: proveedor.nombre,
                direccion: proveedor.direccion,
                descripcion: proveedor.descripcion,
                telefono: proveedor.telefono,
                email: proveedor.email,
            }
        });
        return proveedorActualizado;
    }

    async activarProveedor(id_proveedor: number): Promise<Proveedor> {
        const proveedorActivado = await prisma.proveedor.update({
            where: {
                id_proveedor: id_proveedor,
            },
            data: {
                estado: true,
            }
        });
        return proveedorActivado;
    }

    async desactivarProveedor(id_proveedor: number): Promise<Proveedor> {
        const proveedorDesactivado = await prisma.proveedor.update({
            where: {
                id_proveedor: id_proveedor,
            },
            data: {
                estado: false,
            }
        });
        return proveedorDesactivado;
    }

    async existeProveedorPorNombre(nombre: string, id_empresa: number, id_proveedor?: number): Promise<boolean> {
        const proveedor = await prisma.proveedor.findFirst({
            where: {
                nombre: {
                    equals: nombre.trim(),
                    mode: 'insensitive'
                },
                id_empresa,
                ...(id_proveedor ? { id_proveedor: { not: id_proveedor } } : {})
            },
        });
        return proveedor !== null;
    }
}