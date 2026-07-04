import { ServicesEmpresa } from "../../empresa/application/ServicesEmpresa";
import { CompraCreateDTO } from "../domain/CompraInputDTO";
import { IRepositoryCompra } from "../domain/IRepositoryCompra";
import { normalizerDecimal } from "../../../shared/normalizerDecimal";
import { CloudinaryService } from "../../../core/cloudinary/CloudinaryServices";
import { DBClient } from "../../../core/database/DBClient";
import { Prisma } from "@prisma/client";
import { prisma } from "../../../core/database/prisma";
import { ServicesDetalleCompra } from "./ServicesDetalleCompra";
import { SolicitudCompraDTO } from "../domain/SolicitudCompraDTO";
import { ServiceProveedor } from "@/modules/proveedor/application/ServiceProveedor";

export class ServicesCompra{
    private repository: IRepositoryCompra;
    private serviceDetalleCompra: ServicesDetalleCompra;
    private serviceEmpresa: ServicesEmpresa;
    private serviceProveedor: ServiceProveedor;
    private cloudinaryService: CloudinaryService;

    constructor(repository: IRepositoryCompra, serviceDetalleCompra: ServicesDetalleCompra, serviceEmpresa: ServicesEmpresa, serviceProveedor: ServiceProveedor, cloudinaryService: CloudinaryService){
        this.repository = repository;
        this.serviceDetalleCompra = serviceDetalleCompra;
        this.serviceEmpresa = serviceEmpresa;
        this.serviceProveedor = serviceProveedor;
        this.cloudinaryService = cloudinaryService;
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
                
                for (const detalle of solicitudCompra.detalles){
                    const subtotal = normalizerDecimal(detalle.costo_unitario, "Costo unitario").mul(detalle.cantidad);
                    total = total.add(subtotal);
                }

                //Crear la compra
                const compraCreada = await this.crearCompra({
                    ...data,
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

                    await this.serviceDetalleCompra.crearDetalleCompra({
                        ...detalle, 
                        id_compra: compraCreada.id_compra
                    }, tx);
                }

                return compraCreada;
            });

        } catch (error) {
            if (imagen_public_id) {
                await this.cloudinaryService.borrarImagen(imagen_public_id);
            }
            throw error;
        }
    }

    private async crearCompra(compra: CompraCreateDTO, client?: DBClient){

        await this.serviceProveedor.obtenerProveedorPorId(compra.id_proveedor)
        await this.serviceEmpresa.obtenerEmpresaPorId(compra.id_empresa);
        console.log(typeof compra.id_periodo_contable);
        console.log(compra.id_periodo_contable)
        //validar aqui api de periodo contable
        if(!compra.id_periodo_contable){
            //console.log(typeof compra.id_periodo_contable);
            //console.log(compra.id_periodo_contable)
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
        console.log("Envia a crear compra")
        const compraCreada = await this.repository.crearCompra({
            ...compra
        }, client);
        return compraCreada;
    }
}