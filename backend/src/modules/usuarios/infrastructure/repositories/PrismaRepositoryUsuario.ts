import { prisma } from "../../../../core/database/prisma";
import { IRepositoryUsuario } from "../../domain/IRepositoryUsuario";
import { DBClient } from "../../../../core/database/DBClient";
import { UsuarioCreateDTO } from "../../domain/UsuarioCreateDB";

export class PrismaRepositoryUsuario implements IRepositoryUsuario{
    async crearUsuario(usuario: UsuarioCreateDTO, client: DBClient = prisma) {
        const data = await client.usuario.create({
            data: usuario
        })
        return data;
    }

    async obtenerUsuarioEmail(email: any, client: DBClient = prisma) {
        const data = await client.usuario.findUnique({
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

    async actualizarPassword(id_usuario: number, password_hash: string): Promise<void> {
        await prisma.usuario.update({
            where: {
                id_usuario: id_usuario
            },
            data: {
                password_hash: password_hash
            }
        })
    }
}