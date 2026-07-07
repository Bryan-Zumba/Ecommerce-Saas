import { DBClient } from "../../../core/database/DBClient";
import { Movimiento_Caja } from "../domain/Movimiento_caja";
import { Movimiento_cajaInputDTO } from "../domain/Movimiento_cajaInputDTO";
import { IRepositoryMovimiento_caja } from "../domain/IRepositoryMovimiento_caja";
import { Tipo_Movimiento_caja } from "@prisma/client";

export class ServicesMovimientoCaja{
    private repository : IRepositoryMovimiento_caja;

    constructor(repository: IRepositoryMovimiento_caja){
        this.repository = repository;
    }

    async crearMovimiento_caja(movimiento_caja: Movimiento_cajaInputDTO, client?: DBClient): Promise<Movimiento_Caja> {
        
        if(!movimiento_caja.id_turno_caja){
            throw new Error("El id_turno_caja es obligatorio");
        }
        
        if(!movimiento_caja.id_empresa){
            throw new Error("El id_empresa es obligatorio");
        }

        if(!movimiento_caja.tipo_movimiento){
            throw new Error("El tipo_movimiento es obligatorio");
        }
        const tiposValidos = [
            Tipo_Movimiento_caja.Ingreso,
            Tipo_Movimiento_caja.Egreso,
            Tipo_Movimiento_caja.Apertura,
            Tipo_Movimiento_caja.Cierre
        ];

        if (!tiposValidos.includes(movimiento_caja.tipo_movimiento)) {
            throw new Error("El tipo_movimiento no es valido");
        }
        if(!movimiento_caja.id_venta && !movimiento_caja.id_compra){
            throw new Error("El id_venta o el id_compra es obligatorio");
        }
        if(movimiento_caja.id_venta){
            if(movimiento_caja.tipo_movimiento !== Tipo_Movimiento_caja.Ingreso){
                throw new Error("El tipo de movimiento no es valido para una venta");
            }
        }
        if(movimiento_caja.id_compra){
            if(movimiento_caja.tipo_movimiento !== Tipo_Movimiento_caja.Egreso){
                throw new Error("El tipo de movimiento no es valido para una compra");
            }
        }

        if(!movimiento_caja.monto){
            throw new Error("El monto es obligatorio");
        }
        if(movimiento_caja.monto.lt(0)){
            throw new Error("El monto debe ser mayor a 0");
        }

        if(!movimiento_caja.referencia){
            throw new Error("La referencia es obligatoria de la venta o compra");
        }
        if(movimiento_caja.referencia.length > 500){
            throw new Error("La referencia no puede exceder los 500 caracteres (codigo factura) o id venta");
        }

        if(movimiento_caja.id_venta && movimiento_caja.id_compra){
            throw new Error("Un movimiento de caja no puede ser venta y compra a la vez");
        }
        
        const movimiento_cajaCreado = await this.repository.crearMovimiento_caja(movimiento_caja, client);
        return movimiento_cajaCreado;
    }

    async obtenerMovimientos_cajaPorEmpresa(id_empresa: number, client?: DBClient): Promise<Movimiento_Caja[]> {
        if(!id_empresa){
            throw new Error("El id_empresa es obligatorio");
        }
        const data = await this.repository.obtenerMovimientos_cajaPorEmpresa(id_empresa, client);
        return data;
    }

    async obtenerMovimientos_cajaPorVenta(id_venta: number, client?: DBClient): Promise<Movimiento_Caja[]> {
        if(!id_venta){
            throw new Error("El id_venta es obligatorio");
        }
        const data = await this.repository.obtenerMovimientos_cajaPorVenta(id_venta, client);
        return data;
    }

    async obtenerMovimientos_cajaPorCompra(id_compra: number, client?: DBClient): Promise<Movimiento_Caja[]> {
        if(!id_compra){
            throw new Error("El id_compra es obligatorio");
        }
        const data = await this.repository.obtenerMovimientos_cajaPorCompra(id_compra, client);
        return data;
    }

    async obtenerMovimientos_cajaPorId(id_movimiento_caja: number, client?: DBClient): Promise<Movimiento_Caja | null> {
        if(!id_movimiento_caja){
            throw new Error("El id_movimiento_caja es obligatorio");
        }
        const data = await this.repository.obtenerMovimientos_cajaPorId(id_movimiento_caja, client);
        return data;
    }
}