import { IRepositoryEmpresa } from "../domain/IRepositoryEmpresa";

export class ServicesEmpresa{
    private repository: IRepositoryEmpresa;

    constructor(repository: IRepositoryEmpresa) {
        this.repository = repository;
    }

    async crearEmpresa(datosEmpresa: any) {
        if (!datosEmpresa.nombre?.trim()) {
            throw new Error("Nombre de la empresa es requerido");
        }
        const data = await this.repository.crearEmpresa(datosEmpresa);
        return data;
    }

    async obtenerEmpresaPorId(id_empresa: number) {
        if (!id_empresa || id_empresa <= 0) {
            throw new Error("El ID de la empresa es invalido");
        }
        const data = await this.repository.obtenerEmpresaPorId(id_empresa);
        if(!data){
            throw new Error("Empresa no encontrada");
        }
        return data;
    }
}