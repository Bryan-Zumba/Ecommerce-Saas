import { PrismaClient } from "@prisma/client";
import { IRepositoryAccessCode } from "../../domain/repositories/IRepositoryAccessCode";

const prisma = new PrismaClient();

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
}