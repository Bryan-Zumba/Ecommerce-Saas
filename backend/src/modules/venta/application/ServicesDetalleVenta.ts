import { DBClient } from "../../../core/database/DBClient";
import { IRepositoryDetalleVenta } from "../domain/IRepositoryDetalleVenta";
import { IRepositoryVenta } from "../domain/IRepositoryVenta";
import { DetalleVenta } from "../domain/DetalleVenta";
import { DetalleVentaInputDTO } from "../domain/DetalleVentaInputDTO";
import { ServicesBodega } from "../../inventario/application/ServicesBodega";
import { ServiceItem } from "../../inventario/application/ServiceItem";
import { normalizerDecimal } from "../../../shared/normalizerDecimal";

export class ServicesDetalleVenta {
    private repository: IRepositoryDetalleVenta;
    private repositoryVenta: IRepositoryVenta;
    private servicesBodega: ServicesBodega;
    private servicesItem: ServiceItem;

    constructor(repository: IRepositoryDetalleVenta, repositoryVenta: IRepositoryVenta, servicesBodega: ServicesBodega, servicesItem: ServiceItem) {
        this.repository = repository;
        this.repositoryVenta = repositoryVenta;
        this.servicesBodega = servicesBodega;
        this.servicesItem = servicesItem;
    }

    async crearDetalleVenta(detalleVenta: DetalleVentaInputDTO, id_empresa: number, client?: DBClient) {
        if (!detalleVenta.id_item) {
            throw new Error("El id del item es requerido");
        }

        const bodegaEmpresa = await this.servicesBodega.obtenerBodegaEmpresa(id_empresa, client);
        if (detalleVenta.id_bodega !== bodegaEmpresa.id_bodega) {
            throw new Error("La bodega seleccionada no existe para esta empresa");
        }

        await this.servicesItem.obtenerItemEmpresa(detalleVenta.id_item, id_empresa, client);

        if (!detalleVenta.cantidad) {
            throw new Error("La cantidad del item es requerida");
        }
        if (detalleVenta.cantidad <= 0) {
            throw new Error("La cantidad del item debe ser mayor a 0");
        }

        const precio_unitarioDecimal = normalizerDecimal(detalleVenta.precio_unitario, "Precio unitario");
        if (precio_unitarioDecimal.lte(0)) {
            throw new Error("El precio unitario del item debe ser mayor a 0");
        }

        const subtotalDecimal = precio_unitarioDecimal.mul(detalleVenta.cantidad);

        if (!detalleVenta.id_venta) {
            throw new Error("El id de la venta es requerido para registrar el detalle");
        }

        return await this.repository.crearDetalleVenta({
            id_venta: detalleVenta.id_venta,
            id_item: detalleVenta.id_item,
            id_bodega: detalleVenta.id_bodega,
            cantidad: detalleVenta.cantidad,
            precio_unitario: precio_unitarioDecimal,
            subtotal: subtotalDecimal
        }, client);
    }

    async obtenerDetalleVentaPorIdVenta(id_venta: number, id_empresa: number, client?: DBClient): Promise<DetalleVenta[]> {
        if (!id_venta) {
            throw new Error("El id de la venta es requerido");
        }
        const venta = await this.repositoryVenta.obtenerVentaPorId(id_venta, client);
        if (!venta) {
            throw new Error("No se encontro la venta");
        }
        if (venta.id_empresa !== id_empresa) {
            throw new Error("La venta seleccionada no pertenece a su empresa");
        }

        const detalleVenta = await this.repository.obtenerDetalleVentaPorIdVenta(id_venta, client);
        return detalleVenta;
    }
}
