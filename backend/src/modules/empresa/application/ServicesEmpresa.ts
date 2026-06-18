import { DBClient } from "@/core/database/DBClient";
import { IRepositoryEmpresa } from "../domain/IRepositoryEmpresa";

export class ServicesEmpresa {
    private repository: IRepositoryEmpresa;

    constructor(repository: IRepositoryEmpresa) {
        this.repository = repository;
    }

    async crearEmpresa(datosEmpresa: any, client?: DBClient) {
        if (!datosEmpresa.nombre?.trim()) {
            throw new Error("Nombre de la empresa es requerido");
        }
        if(datosEmpresa.email?.trim()){
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(!emailRegex.test(datosEmpresa.email)){
                throw new Error("Correo electronico de la empresa no valido");
            }
        }
        const data = await this.repository.crearEmpresa(datosEmpresa, client);
        return data;
    }

    async obtenerEmpresaPorId(id_empresa: number, client?: DBClient) {
        if (!id_empresa || id_empresa <= 0) {
            throw new Error("El ID de la empresa es invalido");
        }
        const data = await this.repository.obtenerEmpresaPorId(id_empresa,client);
        if (!data) {
            throw new Error("Empresa no encontrada");
        }
        return data;
    }
}