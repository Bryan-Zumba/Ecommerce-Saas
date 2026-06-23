import { DBClient } from "../../../../core/database/DBClient";
import { SesionInputDTO } from "../../domain/entities/SesionInputDTO";
import { IRepositorySesion } from "../../domain/repositories/IRepositorySesion";
import { prisma } from "../../../../core/database/prisma";

export class PrismaRepositorySesion implements IRepositorySesion {
    async crearSesion(sesion: SesionInputDTO, client: DBClient = prisma) {
        const newSesion = await client.sesion.create({
            data: sesion
        });
        return newSesion;

    }

    async obtenerSesionToken(token: string, client: DBClient = prisma) {
        const sesion = await client.sesion.findUnique({
            where: { token }
        });
        return sesion;

    }

    async desactivarSesion(id_sesion: number, client: DBClient = prisma) {
        await client.sesion.update({
            where: { id_sesion },
            data: { estado: false, revoked_at: new Date() }
        });
    }
}