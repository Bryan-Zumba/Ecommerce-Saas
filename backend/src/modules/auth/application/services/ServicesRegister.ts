import { ServicesRol } from "@/modules/rol/application/ServicesRol";
import { ServicesEmpresa } from "../../../empresa/application/ServicesEmpresa";
import { ServicesAccessCode } from "./ServicesAccessCode";
import { ServicesUsuarios } from "@/modules/usuarios/application/ServicesUsuarios";
import { Prisma } from "@prisma/client";

export class ServicesRegister{
    private serviceAccessCode: ServicesAccessCode;
    private serviceEmpresa : ServicesEmpresa;
    private serviceRol : ServicesRol;
    private serviceUsuario: ServicesUsuarios;

    constructor(serviceAccessCode: ServicesAccessCode, serviceEmpresa: ServicesEmpresa, serviceRol: ServicesRol, serviceUsuario:ServicesUsuarios){
        this.serviceAccessCode=serviceAccessCode;
        this.serviceEmpresa= serviceEmpresa;
        this.serviceRol= serviceRol;
        this.serviceUsuario=serviceUsuario;
    }

    async registrarEmpresa(data:any){
        
        return await prisma.$transaction(async(tx?: Prisma.TransactionClient)=>{
            //Validar codigo
            const code = await this.serviceAccessCode.buscarCodigo(data.code);

            //Crear empresa
            const empresa = await this.serviceEmpresa.crearEmpresa(data.empresa,tx);

            //Obtener Rol Adminsitrador para el creador de la empresa
            const rolAdmin = await this.serviceRol.obtenerRolPorNombre('Administrador');

            //Crear usuario Administrador
            const usuarioCreador = await this.serviceUsuario.crearUsuario({
                ...data.usuario,
                id_empresa:empresa.id_empresa,
                id_rol: rolAdmin.id_rol
            });
            return {
                empresa,
                usuario: usuarioCreador
            };
        })

    }

}