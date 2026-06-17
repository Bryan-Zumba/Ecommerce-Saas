import { prisma } from "../../../../core/database/prisma";
import { DBClient } from "@/core/database/DBClient";
import { IRepositoryEmpresa } from "../../domain/IRepositoryEmpresa";

export class PrismaRepositoryEmpresa implements IRepositoryEmpresa {
    async crearEmpresa(datosEmpresa: any, client: DBClient = prisma) {
        const data = await client.empresa.create({
            data: datosEmpresa
        });
        return data;
    }

    async obtenerEmpresaPorId(id_empresa: number, client: DBClient = prisma) {
        const data = await client.empresa.findUnique({
            where: { id_empresa }
        });
        return data;
    }
}