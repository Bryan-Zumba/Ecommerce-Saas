import { DBClient } from "../../../../core/database/DBClient";
import { IRepositoryAccessCode } from "../../domain/repositories/IRepositoryAccessCode";

export class ServicesAccessCode {
    private repository: IRepositoryAccessCode;

    constructor(repository: IRepositoryAccessCode) {
        this.repository = repository;
    }

    async buscarCodigo(code: string, client?: DBClient) {
        if (!code?.trim()) {
            throw new Error('Codigo de acceso es requerido');
        }
        if (code.length < 8){
            throw new Error('Codigo de acceso debe tener al menos 8 caracteres')
        }
        const accessCode = await this.repository.findByCode(code,client);
        if (!accessCode) {
            throw new Error('Codigo de acceso no valido');
        }
        if (accessCode.usado === true) {
            throw new Error('Codigo de acceso ya usado');
        }
        if (accessCode.estado === false) {
            throw new Error('Codigo de acceso inactivo');
        }
        if (accessCode.intentos >= 3) {
            throw new Error('Número de intentos superado');
        }
        return accessCode.id_acceso_autorizado
    }

    async incrementarIntentoAcceso(id_acceso: number) {
        if (typeof id_acceso !== 'number' || isNaN(id_acceso)) {
            throw new Error('El ID de acceso debe ser un numero');
        }
        if (id_acceso <= 0) {
            throw new Error('El ID de acceso es invalido');
        }
        
        const result = await this.repository.incrementarContador(id_acceso);
        if (result.count === 0) {
            throw new Error('Codigo de acceso no encontrado');
        }
        return result;
    }

    async registrarUsoCodigo(id_acceso: number, id_empresa: number, client?: DBClient) {
        if (typeof id_acceso !== 'number' || isNaN(id_acceso)) {
            throw new Error('El ID de acceso debe ser un numero');
        }
        if (id_acceso <= 0) {
            throw new Error('El ID de acceso es invalido');
        }
        if (!id_empresa || id_empresa <= 0) {
            throw new Error('El ID de la empresa es inválido para registrar el uso del código');
        }
        
        const result = await this.repository.registrarUsoCodigo(id_acceso, id_empresa, client);
        if (result.count === 0) {
            throw new Error('Codigo de acceso no encontrado');
        }
        return result;
    }
}