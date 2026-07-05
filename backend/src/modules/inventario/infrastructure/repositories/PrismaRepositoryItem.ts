import { DBClient } from "../../../../core/database/DBClient";
import { prisma } from "../../../../core/database/prisma";
import { IRepositoryItem } from "../../domain/IRepositoryItem";
import { Item } from "../../domain/Item";
import { ItemInputDTO } from "../../domain/ItemInputDTO";
import { ItemUpdateDTO } from "../../domain/ItemUpdateDTO";

export class PrismaRepositoryItem implements IRepositoryItem {
    async obtenerItems(id_empresa: number, client: DBClient = prisma): Promise<Item[]> {
        const items = await client.item.findMany({
            where: {
                id_empresa: id_empresa,
            },
        });
        return items;

    }

    async obtenerItemsPorCategoria(id_categoria: number): Promise<Item[]> {
        const items = await prisma.item.findMany({
            where: {
                id_categoria: id_categoria,
            },
        });
        return items;
    }

    async obtenerItemPorId(id_item: number, client: DBClient = prisma): Promise<Item | null> {
        const item = await client.item.findUnique({
            where: {
                id_item: id_item,
            },
        });
        return item;
    }

    async obtenerItemEmpresa(id_item: number, id_empresa: number, client: DBClient = prisma): Promise<Item | null> {
        const item = await client.item.findFirst({
            where: {
                id_item: id_item,
                id_empresa: id_empresa,
            },
        });
        return item;
    }

    async crearItem(item: ItemInputDTO): Promise<Item> {
        const newItem = await prisma.item.create({
            data: item
        });
        return newItem;
    }

    //VERIFICAR SI ES IMPORTANTE
    async existeItemPorNombre(nombre: string, id_empresa: number, id_item?: number): Promise<boolean> {
        const item = await prisma.item.findFirst({
            where: {
                nombre: {
                    equals: nombre.trim(),
                    mode: "insensitive"
                },
                id_empresa,
                ...(id_item ? { id_item: { not: id_item } } : {})
            }
        });

        return !!item;
    }

    async actualizarItem(id_item: number, item: ItemUpdateDTO): Promise<Item> {
        const itemActualizado = await prisma.item.update({
            where: {
                id_item: id_item,
            },
            data: {
                id_categoria: item.id_categoria,
                nombre: item.nombre,
                descripcion: item.descripcion,
                costo: item.costo,
                precio: item.precio,
                tipo_item: item.tipo_item,
                imagen_url: item.imagen_url,
                imagen_public_id: item.imagen_public_id,
            }
        });
        return itemActualizado
    }

    async activarItem(id_item: number): Promise<Item> {
        const itemActivado = await prisma.item.update({
            where: {
                id_item: id_item,
            },
            data: {
                estado: true,
            },
        });
        return itemActivado;
    }

    async desactivarItem(id_item: number): Promise<Item> {
        const itemDesactivado = await prisma.item.update({
            where: {
                id_item: id_item,
            },
            data: {
                estado: false,
            },
        });
        return itemDesactivado;
    }
}
