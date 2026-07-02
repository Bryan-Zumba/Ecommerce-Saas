import { Compra } from "../domain/Compra";
import { CompraInputDTO } from "../domain/CompraInputDTO";
import { IRepositoryCompra } from "../domain/IRepositoryCompra";

export class ServicesCompra{
    private repository: IRepositoryCompra;

    constructor(repository: IRepositoryCompra){
        this.repository = repository;
    }

    async crearSolicitudCompra(compra: CompraInputDTO): Promise<Compra> {
    try {
        const compraCreada = await this.repository.crearSolicitudCompra(compra);
        return compraCreada;
    } catch (error: any) {
        throw error;
    }
}
}