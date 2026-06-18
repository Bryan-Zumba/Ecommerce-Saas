import { ServicesRol } from "@/modules/rol/application/ServicesRol";
import { ServicesEmpresa } from "../../../empresa/application/ServicesEmpresa";
import { ServicesAccessCode } from "./ServicesAccessCode";
import { ServicesUsuarios } from "@/modules/usuarios/application/ServicesUsuarios";
import { Prisma } from "@prisma/client";
import { prisma } from "../../../../core/database/prisma";
import { ServicesBodega } from "../../../bodega/application/ServicesBodega";

export class ServicesRegister{
    private serviceAccessCode: ServicesAccessCode;
    private serviceEmpresa : ServicesEmpresa;
    private serviceBodega: ServicesBodega;
    private serviceRol : ServicesRol;
    private serviceUsuario: ServicesUsuarios;

    constructor(serviceAccessCode: ServicesAccessCode, serviceEmpresa: ServicesEmpresa, serviceBodega: ServicesBodega, serviceRol: ServicesRol, serviceUsuario:ServicesUsuarios){
        this.serviceAccessCode=serviceAccessCode;
        this.serviceEmpresa= serviceEmpresa;
        this.serviceBodega= serviceBodega;
        this.serviceRol= serviceRol;
        this.serviceUsuario=serviceUsuario;
    }

    async registrarTienda(data:any){
        
        return await prisma.$transaction(async(tx: Prisma.TransactionClient)=>{
            //Validar codigo
            const idCodeAcc = await this.serviceAccessCode.buscarCodigo(data.codigo_acceso);

            //Crear empresa
            const empresa = await this.serviceEmpresa.crearEmpresa(data.empresa,tx);

            //Crear bodega
            const bodega = await this.serviceBodega.crearBodega({ ...data.bodega, id_empresa: empresa.id_empresa }, tx);

            //Obtener ID de Rol Adminsitrador para asignarle al creador de la empresa
            const idRolAdmin = await this.serviceRol.obtenerRolPorNombre('Administrador');

            //Crear usuario Administrador
            const usuarioCreador = await this.serviceUsuario.crearUsuario({
                ...data.usuario,
                id_empresa:empresa.id_empresa,
                id_rol: idRolAdmin.id_rol
            },tx);
            
            //Registrar que el codigo de acceso ya fue usado
            await this.serviceAccessCode.registrarUsoCodigo(idCodeAcc, tx);

            return {
                empresa,
                usuario: usuarioCreador
            };
        })
    }
}