import { ServicesEmpresa } from "../../empresa/application/ServicesEmpresa";
import { CompraCreateDTO } from "../domain/CompraInputDTO";
import { IRepositoryCompra } from "../domain/IRepositoryCompra";
import { normalizerDecimal } from "../../../shared/normalizerDecimal";
import { CloudinaryService } from "../../../core/cloudinary/CloudinaryServices";
import { DBClient } from "../../../core/database/DBClient";
import { Estado_compra, Prisma, Tipo_movimiento_inventario, Tipo_Movimiento_caja } from "@prisma/client";
import { prisma } from "../../../core/database/prisma";
import { ServicesDetalleCompra } from "./ServicesDetalleCompra";
import { SolicitudCompraDTO } from "../domain/SolicitudCompraDTO";
import { ServiceProveedor } from "@/modules/proveedor/application/ServiceProveedor";
import { ServicesInventario } from "../../inventario/application/ServicesInventario";
import { ServicesMovimiento_Inventario } from "../../inventario/application/ServicesMovimiento_Inventario";
import { ServicesMovimientoCaja } from "../../caja/application/ServicesMovimientoCaja";

export class ServicesCompra{
    private repository: IRepositoryCompra;
    private serviceDetalleCompra: ServicesDetalleCompra;
    private serviceEmpresa: ServicesEmpresa;
    private serviceProveedor: ServiceProveedor;
    private cloudinaryService: CloudinaryService;
    private serviceInventario: ServicesInventario;
    private serviceMovimientoInventario: ServicesMovimiento_Inventario;
    private serviceMovimientoCaja: ServicesMovimientoCaja;

    constructor(
        repository: IRepositoryCompra,
        serviceDetalleCompra: ServicesDetalleCompra,
        serviceEmpresa: ServicesEmpresa,
        serviceProveedor: ServiceProveedor,
        cloudinaryService: CloudinaryService,
        serviceInventario: ServicesInventario,
        serviceMovimientoInventario: ServicesMovimiento_Inventario,
        serviceMovimientoCaja: ServicesMovimientoCaja
    ){
        this.repository = repository;
        this.serviceDetalleCompra = serviceDetalleCompra;
        this.serviceEmpresa = serviceEmpresa;
        this.serviceProveedor = serviceProveedor;
        this.cloudinaryService = cloudinaryService;
        this.serviceInventario = serviceInventario;
        this.serviceMovimientoInventario = serviceMovimientoInventario;
        this.serviceMovimientoCaja = serviceMovimientoCaja;
    }

    //HU crear solicitud de ingreso de stock o compra de stock
    async crearSolicitudCompra(solicitudCompra: SolicitudCompraDTO){
        
        let imagen_url: string;
        let imagen_public_id: string="";
        let total = new Prisma.Decimal(0);

        try {

            if(!solicitudCompra.file){
                throw new Error("Se requiere adjuntar la imagen de la factura");
            }
            const resultCloudinary = await this.cloudinaryService.subirImagen(
                solicitudCompra.file,
                `empresa_${solicitudCompra.id_empresa}/compras_facturas`
            )
            imagen_url= resultCloudinary.secure_url;
            imagen_public_id= resultCloudinary.public_id;
            
            const {file, detalles,...data}= solicitudCompra;
            
            return await prisma.$transaction(async(tx: Prisma.TransactionClient)=>{
                
                for (const detalle of detalles){
                    const subtotal = normalizerDecimal(detalle.costo_unitario, "Costo unitario").mul(detalle.cantidad);
                    total = total.add(subtotal);
                }
                
                const id_periodo_contable = 3;

                //Crear la compra
                const compraCreada = await this.crearCompra({
                    ...data,
                    id_periodo_contable,
                    imagen_url,
                    imagen_public_id,
                    total
                }, tx);

                //Validar que existan detalles
                if(detalles.length<=0){
                    throw new Error("La compra debe tener al menos un detalle");
                }

                //Crear los detalles de la compra
                for (const detalle of detalles) {
                    console.log("Detalle: ",detalle);
                    await this.serviceDetalleCompra.crearDetalleCompra({
                        ...detalle, 
                        id_compra: compraCreada.id_compra
                    }, compraCreada.id_empresa,tx);
                }

                return compraCreada;
            },{
                timeout: 20000,
            });

        } catch (error) {
            if (imagen_public_id) {
                await this.cloudinaryService.borrarImagen(imagen_public_id);
            }
            throw error;
        }
    }

    //HU Aprobar compra
    async aprobarCompra(id_compra: number, id_empresa: number) {
        return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            const compra = await this.obtenerCompraPorId(id_compra, tx);

            if (compra.id_empresa !== id_empresa) {
                throw new Error("La compra no pertenece a esta empresa");
            }

            if (compra.estado_compra === Estado_compra.Completada) {
                throw new Error("La compra ya se encuentra completada");
            }

            if (compra.estado_compra === Estado_compra.Cancelada) {
                throw new Error("La compra se encuentra cancelada");
            }

            const detallesCompra = await this.serviceDetalleCompra.obtenerDetalleCompraPorIdCompra(id_compra, id_empresa, tx);

            if (detallesCompra.length <= 0) {
                throw new Error("La compra seleccionada no tiene detalles registrados");
            }

            for (const detalle of detallesCompra) {
                // Intentar buscar el inventario del producto en la bodega
                const inventarioItem = await this.serviceInventario.obtenerInventarioItem(detalle.id_item, detalle.id_bodega, id_empresa, tx);
                let stockAnterior = 0;

                if (!inventarioItem) {
                    // Si el inventario no está inicializado para el item + bodega, lo creamos con stock inicial 0
                    await this.serviceInventario.crearInventario({
                        id_item: detalle.id_item,
                        id_bodega: detalle.id_bodega
                    }, id_empresa, tx);
                    stockAnterior = 0;
                } else {
                    stockAnterior = inventarioItem.stock_actual;
                }

                const stockNuevo = stockAnterior + detalle.cantidad;

                // 1. Ingresar físicamente el stock
                await this.serviceInventario.ingresarStock(detalle.id_item, detalle.id_bodega, detalle.cantidad, id_empresa, tx);

                // 2. Registrar el movimiento de inventario de tipo Compra
                await this.serviceMovimientoInventario.crearMovimientoInventario({
                    id_item: detalle.id_item,
                    id_bodega: detalle.id_bodega,
                    id_compra: id_compra,
                    tipo_movimiento: Tipo_movimiento_inventario.Compra,
                    cantidad: detalle.cantidad,
                    stock_anterior: stockAnterior,
                    stock_nuevo: stockNuevo
                }, id_empresa, tx);
            }

            // 3. Registrar el egreso en caja (id_turno_caja = 1 de forma temporal)
            const id_turno_caja = 5;

            await this.serviceMovimientoCaja.crearMovimiento_caja({
                id_turno_caja,
                id_venta: null,
                id_compra: id_compra,
                id_empresa,
                tipo_movimiento: Tipo_Movimiento_caja.Egreso,
                monto: compra.total,
                referencia: `Factura: ${compra.codigo_factura}`
            }, tx);

            // 4. Cambiar el estado de la compra a Completada
            return await this.actualizarEstadoCompraCompletada(id_compra, tx);
        }, {
            timeout: 60000,
        });
    }

    //HU Rechazar compra
    async rechazarCompra(id_compra: number, id_empresa: number) {
        return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            const compra = await this.obtenerCompraPorId(id_compra, tx);

            if (compra.id_empresa !== id_empresa) {
                throw new Error("La compra no pertenece a esta empresa");
            }

            if (compra.estado_compra === Estado_compra.Completada) {
                throw new Error("No se puede rechazar una compra completada");
            }

            if (compra.estado_compra === Estado_compra.Cancelada) {
                throw new Error("La compra ya se encuentra cancelada");
            }

            return await this.actualizarEstadoCompraCancelada(id_compra, tx);
        }, {
            timeout: 60000,
        });
    }

    private async crearCompra(compra: CompraCreateDTO, client?: DBClient){
        await this.serviceProveedor.obtenerProveedorPorId(compra.id_proveedor, client)
        await this.serviceEmpresa.obtenerEmpresaPorId(compra.id_empresa, client);
        
        if(!compra.id_periodo_contable){
            throw new Error("El id del periodo contable es requerido");
        }

        if(!compra.codigo_factura){
            throw new Error("El codigo de factura es requerido");
        }

        if (!compra.imagen_url || !compra.imagen_public_id) {
            throw new Error("No se pudo registrar la imagen de la factura.");
        }
        if (compra.imagen_url && compra.imagen_url.length > 500){
            throw new Error ("Imagen url no puede tener mas de 500 caracteres");
        }
        if(compra.imagen_public_id && compra.imagen_public_id.length > 500){
            throw new Error ("Imagen public id no puede tener mas de 500 caracteres");
        }


        //validacion longitud campos
        if(compra.codigo_factura.length > 50){
            throw new Error("El codigo de factura no puede tener mas de 50 caracteres");
        }

        if(compra.observacion && compra.observacion.length >500){
            throw new Error("La observacion no puede tener mas de 500 caracteres");
        }
        //console.log("Envia a crear compra")
        const compraCreada = await this.repository.crearCompra({
            ...compra
        }, client);
        return compraCreada;
    }

    async obtenerCompraPorId(id_compra: number, client?: DBClient){
        //Validar que la compra exista
        const compra = await this.repository.obtenerCompraPorId(id_compra, client);
        if(!compra){
            throw new Error("No se encontro la compra");
        }
        return compra;
    }

    async obtenerCompraEmpresa(id_empresa: number, client?: DBClient){
        await this.serviceEmpresa.obtenerEmpresaPorId(id_empresa);
        const compras = await this.repository.obtenerComprasPorEmpresa(id_empresa, client);
        if(!compras){
            throw new Error("No se encontro la compra");
        }
        return compras;
    }


    async actualizarEstadoCompraCompletada(id_compra: number, client?: DBClient) {
        const compra = await this.obtenerCompraPorId(id_compra, client);

        if(compra.estado_compra == Estado_compra.Completada){
            throw new Error("La compra ya se encuentra completada");
        }
        
        if(compra.estado_compra == Estado_compra.Cancelada){
            throw new Error("La compra se encuentra cancelada");
        }
        
        return await this.repository.actualizarEstadoCompra(id_compra, Estado_compra.Completada, client);
    }

    async actualizarEstadoCompraCancelada(id_compra: number, client?: DBClient) {
        const compra = await this.obtenerCompraPorId(id_compra, client);

        if(compra.estado_compra == Estado_compra.Completada){
            throw new Error("La compra no se puede cancelar porque ya se encuentra completada");
        }
        
        if(compra.estado_compra == Estado_compra.Cancelada){
            throw new Error("La compra ya se encuentra cancelada");
        }
        
        return await this.repository.actualizarEstadoCompra(id_compra, Estado_compra.Cancelada, client);
    }
}