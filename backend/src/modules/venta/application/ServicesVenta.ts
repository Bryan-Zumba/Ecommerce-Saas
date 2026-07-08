import { prisma } from "../../../core/database/prisma";
import { Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { DBClient } from "../../../core/database/DBClient";
import { IRepositoryVenta } from "../domain/IRepositoryVenta";
import { SolicitudVentaDTO, VentaCreateDTO } from "../domain/VentaInputDTO";
import { Venta } from "../domain/Venta";
import { ServicesDetalleVenta } from "./ServicesDetalleVenta";
import { ServicesEmpresa } from "../../empresa/application/ServicesEmpresa";
import { ServiceCliente } from "../../clientes/application/ServicesCliente";
import { ServicesInventario } from "../../inventario/application/ServicesInventario";
import { ServicesBodega } from "../../inventario/application/ServicesBodega";
import { ServicesMovimiento_Inventario } from "../../inventario/application/ServicesMovimiento_Inventario";
import { ServicesMovimientoCaja } from "../../caja/application/ServicesMovimientoCaja";
import { ServiceItem } from "../../inventario/application/ServiceItem";
import { Estado_venta, Tipo_movimiento_inventario, Tipo_Movimiento_caja, Tipo_Item } from "@prisma/client";
import { InventarioDetalleDTO } from "../../inventario/domain/InventarioDetalleDTO";
import { Item } from "../../inventario/domain/Item";
import { CatalogoVentaDTO } from "../domain/CatalogoVentaDTO";

export class ServicesVenta {
    private repository: IRepositoryVenta;
    private serviceDetalleVenta: ServicesDetalleVenta;
    private serviceEmpresa: ServicesEmpresa;
    private serviceCliente: ServiceCliente;
    private serviceItem: ServiceItem;
    private serviceBodega: ServicesBodega;
    private serviceInventario: ServicesInventario;
    private serviceMovimientoInventario: ServicesMovimiento_Inventario;
    private serviceMovimientoCaja: ServicesMovimientoCaja;

    constructor(
        repository: IRepositoryVenta, 
        serviceDetalleVenta: ServicesDetalleVenta, 
        serviceEmpresa: ServicesEmpresa, 
        serviceCliente: ServiceCliente,
        serviceItem: ServiceItem, 
        serviceBodega: ServicesBodega,
        serviceInventario: ServicesInventario, 
        serviceMovimientoInventario: ServicesMovimiento_Inventario,
        serviceMovimientoCaja: ServicesMovimientoCaja
    ) {
        this.repository = repository;
        this.serviceDetalleVenta = serviceDetalleVenta;
        this.serviceEmpresa = serviceEmpresa;
        this.serviceCliente = serviceCliente;
        this.serviceItem = serviceItem;
        this.serviceBodega = serviceBodega;
        this.serviceInventario = serviceInventario;
        this.serviceMovimientoInventario = serviceMovimientoInventario;
        this.serviceMovimientoCaja = serviceMovimientoCaja;
    }

    async obtenerCatalogoVenta(id_empresa: number): Promise<CatalogoVentaDTO[]> {
        await this.serviceEmpresa.obtenerEmpresaPorId(id_empresa);
        const bodega = await this.serviceBodega.obtenerBodegaEmpresa(id_empresa);
        const itemsRaw = await this.repository.obtenerCatalogoVenta(id_empresa, bodega.id_bodega);

        return itemsRaw.map(item => {
            const inv = item.inventarios[0];
            return {
                id_bodega: bodega.id_bodega,
                stock_disponible: inv ? Number(inv.stock_disponible) : 0,
                item: {
                    id_item: item.id_item,
                    nombre: item.nombre,
                    descripcion: item.descripcion,
                    costo: Number(item.costo),
                    precio: Number(item.precio),
                    tipo_item: item.tipo_item,
                    imagen_url: item.imagen_url,
                    estado: item.estado,
                    categoria: {
                        id_categoria: item.categoria.id_categoria,
                        nombre: item.categoria.nombre,
                        estado: item.categoria.estado
                    }
                }
            };
        });
    }

    async crearSolicitudVenta(solicitud: SolicitudVentaDTO): Promise<Venta> {
        if (!solicitud.detalles || solicitud.detalles.length === 0) {
            throw new Error("La venta debe tener al menos un detalle de producto");
        }

        const { id_usuario, id_empresa } = solicitud;

        return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            // 1. Validar que la empresa exista
            await this.serviceEmpresa.obtenerEmpresaPorId(id_empresa, tx);

            // 2. Validar que el cliente exista
            await this.serviceCliente.obtenerClienteId(solicitud.id_cliente, tx);

            let total = new Decimal(0);

            // Validar de antemano el stock y la existencia de todos los items
            type ItemProcesado = {
                detalle: SolicitudVentaDTO["detalles"][number];
                item: Item;
                inventarioItem: InventarioDetalleDTO | null;
            };

            const itemsProcesados: ItemProcesado[] = [];
            for (const detalle of solicitud.detalles) {
                const item = await this.serviceItem.obtenerItemEmpresa(detalle.id_item, id_empresa, tx);
                let inventarioItem = null;

                // Si es de tipo Producto, verificar stock disponible
                if (item.tipo_item === Tipo_Item.Producto) {
                    inventarioItem = await this.serviceInventario.obtenerInventarioItem(detalle.id_item, detalle.id_bodega, id_empresa, tx);
                    
                    if (inventarioItem.stock_disponible < detalle.cantidad) {
                        throw new Error(`Stock insuficiente para el producto ${item.nombre}. Stock disponible: ${inventarioItem.stock_disponible}, solicitado: ${detalle.cantidad}`);
                    }
                }

                itemsProcesados.push({ detalle, item, inventarioItem });

                const subtotal = new Decimal(detalle.precio_unitario).mul(detalle.cantidad);
                total = total.add(subtotal);
            }

            // Usar id_turno_caja = 5 e id_periodo_contable = 3 de forma temporal
            const id_turno_caja = 5;
            const id_periodo_contable = 3;

            // 3. Crear cabecera de la venta a través del servicio interno
            const ventaCreada = await this.crearVenta({
                id_turno_caja,
                id_cliente: solicitud.id_cliente,
                id_usuario,
                id_empresa,
                id_periodo_contable,
                total,
                observacion: solicitud.observacion,
                estado_venta: Estado_venta.Completada
            }, tx);

            // 4. Crear los detalles de venta y descontar stock
            for (const procesado of itemsProcesados) {
                const { detalle, item, inventarioItem } = procesado;

                // Guardar detalle en la base de datos a través del servicio de detalles
                await this.serviceDetalleVenta.crearDetalleVenta({
                    ...detalle,
                    id_venta: ventaCreada.id_venta
                }, id_empresa, tx);

                // Si es de tipo Producto, descontar de inventario y registrar movimiento
                if (item.tipo_item === Tipo_Item.Producto && inventarioItem) {
                    const stockAnterior = inventarioItem.stock_actual;
                    const stockNuevo = stockAnterior - detalle.cantidad;

                    // Retirar stock del inventario físicamente
                    await this.serviceInventario.retirarStock(inventarioItem.id_inventario, detalle.cantidad, tx);

                    // Registrar movimiento de inventario de venta
                    await this.serviceMovimientoInventario.crearMovimientoInventario({
                        id_item: detalle.id_item,
                        id_bodega: detalle.id_bodega,
                        id_venta: ventaCreada.id_venta,
                        tipo_movimiento: Tipo_movimiento_inventario.Venta,
                        cantidad: detalle.cantidad,
                        stock_anterior: stockAnterior,
                        stock_nuevo: stockNuevo
                    }, id_empresa, tx);
                }
            }

            // 5. Registrar el ingreso en flujo de caja
            await this.serviceMovimientoCaja.crearMovimiento_caja({
                id_turno_caja,
                id_venta: ventaCreada.id_venta,
                id_compra: null,
                id_empresa,
                tipo_movimiento: Tipo_Movimiento_caja.Ingreso,
                monto: total,
                referencia: `Venta registrada: #${ventaCreada.id_venta}`
            }, tx);

            return ventaCreada;
        }, {
            timeout: 60000
        });
    }

    async obtenerVentaPorId(id_venta: number, id_empresa: number, client?: DBClient): Promise<Venta> {
        if (!id_venta) {
            throw new Error("El id de la venta es requerido");
        }
        const venta = await this.repository.obtenerVentaPorId(id_venta, client);
        if (!venta) {
            throw new Error("Venta no encontrada");
        }
        if (venta.id_empresa !== id_empresa) {
            throw new Error("La venta no pertenece a su empresa");
        }
        return venta;
    }

    async obtenerVentasEmpresa(id_empresa: number): Promise<Venta[]> {
        return await this.repository.obtenerVentasPorEmpresa(id_empresa);
    }

    async cancelarVenta(id_venta: number, id_empresa: number): Promise<Venta> {
        return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            const venta = await this.obtenerVentaPorId(id_venta, id_empresa, tx);

            if (venta.estado_venta === Estado_venta.Cancelada) {
                throw new Error("La venta ya se encuentra cancelada");
            }

            // Recuperar detalles para devolver el stock
            const detallesVenta = await this.serviceDetalleVenta.obtenerDetalleVentaPorIdVenta(id_venta, id_empresa, tx);

            for (const detalle of detallesVenta) {
                const item = await this.serviceItem.obtenerItemEmpresa(detalle.id_item, id_empresa, tx);

                if (item?.tipo_item === Tipo_Item.Producto && detalle.id_bodega) {
                    
                    const inventarioItem = await this.serviceInventario.obtenerInventarioItem(detalle.id_item, detalle.id_bodega, id_empresa, tx);
                    const stockAnterior = inventarioItem ? inventarioItem.stock_actual : 0;
                    const stockNuevo = stockAnterior + detalle.cantidad;

                    // Si no tiene inventario (caso raro pero posible), lo creamos e ingresamos
                    if (!inventarioItem) {
                        await this.serviceInventario.crearInventario({
                            id_item: detalle.id_item,
                            id_bodega: detalle.id_bodega
                        }, id_empresa, tx);
                    }

                    // Ingresar stock físicamente de vuelta
                    await this.serviceInventario.ingresarStock(detalle.id_item, detalle.id_bodega, detalle.cantidad, id_empresa, tx);

                    // Registrar movimiento de devolución en inventario
                    await this.serviceMovimientoInventario.crearMovimientoInventario({
                        id_item: detalle.id_item,
                        id_bodega: detalle.id_bodega,
                        id_venta: id_venta,
                        tipo_movimiento: Tipo_movimiento_inventario.Devolucion,
                        cantidad: detalle.cantidad,
                        stock_anterior: stockAnterior,
                        stock_nuevo: stockNuevo
                    }, id_empresa, tx);
                }
            }

            // Registrar movimiento de egreso en caja por devolución de dinero de venta
            const id_turno_caja = 5;
            await this.serviceMovimientoCaja.crearMovimiento_caja({
                id_turno_caja,
                id_venta: id_venta,
                id_compra: null,
                id_empresa,
                tipo_movimiento: Tipo_Movimiento_caja.Egreso,
                monto: venta.total,
                referencia: `Devolución de dinero: Venta #${id_venta} cancelada`
            }, tx);

            // Cambiar estado a Cancelada
            return await this.repository.actualizarEstadoVenta(id_venta, Estado_venta.Cancelada, tx);
        }, {
            timeout: 60000
        });
    }

    private async crearVenta(venta: VentaCreateDTO, client?: DBClient) {
        if (!venta.id_turno_caja) {
            throw new Error("El id del turno de caja es requerido");
        }
        if (!venta.id_periodo_contable) {
            throw new Error("El id del periodo contable es requerido");
        }

        return await this.repository.crearVenta(venta, client);
    }
}