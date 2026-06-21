import { prisma } from "../../../../core/database/prisma";
import { DBClient } from "../../../../core/database/DBClient";
import { IRepositoryAccessCode } from "../../domain/repositories/IRepositoryAccessCode";

export class PrismaRepositoryAccessCode implements IRepositoryAccessCode {
    async findByCode(code: string, client: DBClient = prisma) {
        const data = await client.acceso_Autorizado.findUnique({
            where: {
                codigo_acceso: code
            }
        });
        return data;
    }

    async incrementarContador(id_acceso: number) {
        const data = await prisma.acceso_Autorizado.updateMany({
            where: {
                id_acceso_autorizado: id_acceso
            },
            data: {
                intentos: {
                    increment: 1
                }
            }
        });
        return data;
    }

    async registrarUsoCodigo(id_acceso: number, id_empresa: number, client: DBClient = prisma) {
        const data = await client.acceso_Autorizado.updateMany({
            where: {
                id_acceso_autorizado: id_acceso
            },
            data: {
                usado: true,
                fecha_uso: new Date(),
                id_empresa: id_empresa
            }
        });
        return data;
    }
}