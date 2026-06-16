import { PrismaClient } from "@prisma/client";
import { IRepositoryUsuario } from "../../domain/IRepositoryUsuario";

const prisma = new PrismaClient();

export class PrismaRepositoryUsuario implements IRepositoryUsuario{
    async crearUsuario(usuario: any) {
        const data = await prisma.usuario.create({
            data: usuario
        })
        return data;
    }

    async obtenerUsuarioEmail(email: any) {
        const data = await prisma.usuario.findUnique({
            where: {
                email: email
            }
        })
        return data;
    }

    async obtenerUsuarioId(id_usuario: number) {
        const data = await prisma.usuario.findUnique({
            where: {
                id_usuario: id_usuario
            }
        })
        return data;
    }
}