import { IRepositoryAccessCode } from "../../domain/repositories/IRepositoryAccessCode";

export class ServicesAccessCode {
    private repository: IRepositoryAccessCode;

    constructor(repository: IRepositoryAccessCode) {
        this.repository = repository;
    }

    async buscarCodigo(code: string) {
        if (!code?.trim()) {
            throw new Error('Codigo de acceso es requerido');
        }
        if (code.length <= 8){
            throw new Error('Codigo de acceso debe tener al menos 8 caracteres')
        }
        const accessCode = await this.repository.findByCode(code);
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
}