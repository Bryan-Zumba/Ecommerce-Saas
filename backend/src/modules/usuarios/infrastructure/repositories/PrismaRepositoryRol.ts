import { DBClient } from "../../../../core/database/DBClient";
import { PrismaClient } from "@prisma/client";
import { IRepositoryRol } from "../../domain/IRepositoryRol";

const prisma = new PrismaClient();

export class PrismaRepositoryRol implements IRepositoryRol{
    async obtenerRoles(){
        const data = await prisma.rol.findMany();
        return data;
    }
    
    async obtenerRolPorId(id_rol: number, client: DBClient = prisma) {
        const data = await client.rol.findUnique({
            where: { id_rol }
        });
        return data;
    }

    async obtenerRolPorNombre(nombre: string, client: DBClient = prisma) {
        const data = await client.rol.findUnique({
            where: { nombre }
        });
        return data;
    }
}