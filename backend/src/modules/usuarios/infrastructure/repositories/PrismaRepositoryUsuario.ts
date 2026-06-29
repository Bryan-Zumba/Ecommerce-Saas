import { prisma } from "../../../../core/database/prisma";
import { IRepositoryUsuario } from "../../domain/IRepositoryUsuario";
import { DBClient } from "../../../../core/database/DBClient";
import { UsuarioCreateDTO } from "../../domain/UsuarioCreateDB";
import { UsuarioUpdateDTO } from "../../domain/UsuarioUpdateDTO";
import { Usuario } from "../../domain/Usuario";

export class PrismaRepositoryUsuario implements IRepositoryUsuario{
    async crearUsuario(usuario: UsuarioCreateDTO, client: DBClient = prisma) {
        const data = await client.usuario.create({
            data: usuario
        })
        return data;
    }

    async actualizarInformacionUsuario(id_usuario: number, usuario: UsuarioUpdateDTO) {
        const data = await prisma.usuario.update({
            where: {
                id_usuario: id_usuario
            },
            data: usuario
        })
        return data;
    }

    async actualizarRolUsuario(id_usuario: number, id_rol: number): Promise<void> {
        await prisma.usuario.update({
            where: {
                id_usuario: id_usuario
            },
            data: {
                id_rol: id_rol
            }
        })
    }

    async desactivarUsuario(id_usuario: number): Promise<void> {
        await prisma.usuario.update({
            where: {
                id_usuario: id_usuario
            },
            data: {
                estado: false
            }
        })
    }

    async activarUsuario(id_usuario: number): Promise<void> {
        await prisma.usuario.update({
            where: {
                id_usuario: id_usuario
            },
            data: {
                estado: true
            }
        })
    }

    async obtenerUsuariosEmpresa(id_empresa: number, client: DBClient = prisma): Promise<any[]> {
        const data = await client.usuario.findMany({
            where: {
                id_empresa: id_empresa
            },
            select:{
                id_usuario: true,
                nombres: true,
                apellidos: true,
                telefono: true,
                email: true,
                estado: true,
                ultimo_acceso: true,
                fecha_creacion: true,
                rol: {
                    select: {
                        nombre: true
                    }
                }
            }
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

    async actualizarUltimoAcceso(id_usuario: number): Promise<void> {
        await prisma.usuario.update({
            where: { id_usuario },
            data: { ultimo_acceso: new Date() }
        });
    }
}