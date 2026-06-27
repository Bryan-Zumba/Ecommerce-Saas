import { prisma } from "../../../../core/database/prisma";
import { Categoria } from "../../domain/Categoria";
import { RepositoryCategoria } from "../../domain/RepositoryCategoria";
import { CategoriaInputDTO } from "../../domain/CategoriaInputDTO";
import { CategoriaUpdateDTO } from "../../domain/CategoriaUpdateDTO";


export class PrismaRepositoryCategoria implements RepositoryCategoria {
    async obtenerCategorias(id_empresa: number): Promise<Categoria[]> {
        const categorias = await prisma.categoria.findMany({
            where: {
                id_empresa: id_empresa
            }
        });
        return categorias;

    } 

   async obtenerCategoriaId(id_categoria: number): Promise<Categoria | null> {
        const categoria = await prisma.categoria.findUnique({
            where: {
                id_categoria: id_categoria
            },
        });
        return categoria;
    }

    async crearCategoria(categoria: CategoriaInputDTO): Promise<Categoria> {
        const nuevaCategoria = await prisma.categoria.create({
            data: categoria
        });
        return nuevaCategoria;
    }

    async actualizarCategoria(id_categoria: number, categoria: CategoriaUpdateDTO): Promise<Categoria> {
        const categoriaActualizada = await prisma.categoria.update({
            where: {
                id_categoria: id_categoria,
            },
            data:{
                nombre:categoria.nombre,
                descripcion:categoria.descripcion,
                estado:categoria.estado
            },
        });
        return categoriaActualizada;
    }

    async desactivarCategoria(id_categoria: number): Promise<Categoria> {
        const categoriaDesactivada = await prisma.categoria.update({
            where: {
                id_categoria: id_categoria,
            },
            data: {
                estado: false,
            },
        });
        return categoriaDesactivada;
    }

    async activarCategoria(id_categoria: number): Promise<Categoria> {
        const categoriaActivada = await prisma.categoria.update({
            where: {
                id_categoria: id_categoria,
            },
            data: {
                estado: true,
            },
        });
        return categoriaActivada;
    }
}
