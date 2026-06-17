import { prisma } from "../../../../core/database/prisma";
import { DBClient } from "../../../../core/database/DBClient";
import { IRepositoryAccessCode } from "../../domain/repositories/IRepositoryAccessCode";

export class PrismaRepositoryAccessCode implements IRepositoryAccessCode {
    async findByCode(code: string) {
        const data = await prisma.acceso_Autorizado.findUnique({
            where: {
                codigo_acceso: code
            }
        });
        if (!data) return null;
        return {
            id_acceso_autorizado: data.id_acceso_autorizado,
            email: data.email,
            codigo_acceso: data.codigo_acceso,
            nombre: data.nombre,
            intentos: data.intentos,
            usado: data.usado,
            fecha_uso: data.fecha_uso || null,
            estado: data.estado,
            fecha_creacion: data.fecha_creacion
        };
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

    async registrarUsoCodigo(id_acceso: number, client: DBClient = prisma) {
        const data = await client.acceso_Autorizado.updateMany({
            where: {
                id_acceso_autorizado: id_acceso
            },
            data: {
                usado: true,
                fecha_uso: new Date()
            }
        });
        return data;
    }
}