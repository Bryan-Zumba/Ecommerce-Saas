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
}