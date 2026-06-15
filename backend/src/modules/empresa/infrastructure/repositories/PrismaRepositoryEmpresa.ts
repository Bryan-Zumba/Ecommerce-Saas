import { PrismaClient } from "@prisma/client";
import { IRepositoryEmpresa } from "../../domain/IRepositoryEmpresa";

const prisma = new PrismaClient();

export class PrismaRepositoryEmpresa implements IRepositoryEmpresa {
    async crearEmpresa(datosEmpresa:any) {
        const data = await prisma.empresa.create({
            data: datosEmpresa
        });
        return data;
    }

    async obtenerEmpresaPorId(id_empresa: number) {
        const data = await prisma.empresa.findUnique({
            where: { id_empresa }
        });
        return data;
    }
}