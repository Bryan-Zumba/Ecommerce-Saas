import { prisma } from "../../../../core/database/prisma";
import { RepositoryItem } from "../../domain/RepositoryItem";
import { Item } from "../../domain/Item";
import { ItemInputDTO } from "../../domain/ItemInputDTO";
import { ItemUpdateDTO } from "../../domain/ItemUpdateDTO";




export class PrismaRepositoryItem implements RepositoryItem {
    async obtenerItems(id_empresa: number): Promise<Item[]> {
        const items = await prisma.item.findMany({
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

    async obtenerItemPorId(id_item: number): Promise<Item | null> {
        const item = await prisma.item.findUnique({
            where: {
                id_item: id_item,
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
    async actualizarItem(id_item: number, item: ItemUpdateDTO): Promise<Item> {
        const itemActualizado = await prisma.item.update({
            where: {
                id_item: id_item,
            },
            data: {
                nombre: item.nombre,
                descripcion: item.descripcion,
                costo: item.costo,
                precio: item.precio,
                tipo_item: item.tipo_item,
                imagen_url: item.imagen_url,
                estado: item.estado
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
