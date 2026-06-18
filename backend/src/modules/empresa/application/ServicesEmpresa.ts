import { DBClient } from "../../../core/database/DBClient";
import { EmpresaInputDTO } from "../domain/EmpresaInputDTO";
import { IRepositoryEmpresa } from "../domain/IRepositoryEmpresa";

export class ServicesEmpresa {
    private repository: IRepositoryEmpresa;

    constructor(repository: IRepositoryEmpresa) {
        this.repository = repository;
    }

    async crearEmpresa(datosEmpresa: EmpresaInputDTO, client?: DBClient) {
        //Validciones de campos obligatorios y de formato
        if (!datosEmpresa.nombre?.trim()) {
            throw new Error("Nombre de la empresa es requerido");
        }
        if (datosEmpresa.email?.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(datosEmpresa.email)) {
                throw new Error("Correo electronico de la empresa no valido");
            }
        }

        //Validaciones de longitud de campos
        if (datosEmpresa.nombre.length > 150) {
            throw new Error("El nombre de la empresa excede los 150 caracteres")
        }
        if (datosEmpresa.descripcion && datosEmpresa.descripcion.length > 500) {
            throw new Error("La descripcion de la empresa excede los 500 caracteres")
        }
        if (datosEmpresa.ruc && datosEmpresa.ruc.length > 20) {
            throw new Error("La descripcion de la empresa excede los 20 caracteres")
        }
        if (datosEmpresa.direccion && datosEmpresa.direccion.length > 300) {
            throw new Error("La descripcion de la empresa excede los 300 caracteres")
        }
        if (datosEmpresa.telefono && datosEmpresa.telefono.length > 20) {
            throw new Error("La descripcion de la empresa excede los 20 caracteres")
        }
        if (datosEmpresa.email && datosEmpresa.email.length > 255) {
            throw new Error("La descripcion de la empresa excede los 255 caracteres")
        }

        const data = await this.repository.crearEmpresa(datosEmpresa, client);
        return data;
    }

    async obtenerEmpresaPorId(id_empresa: number, client?: DBClient) {
        if (!id_empresa || id_empresa <= 0) {
            throw new Error("El ID de la empresa es invalido");
        }
        const data = await this.repository.obtenerEmpresaPorId(id_empresa, client);
        if (!data) {
            throw new Error("Empresa no encontrada");
        }
        return data;
    }
}